"""Build the public catalogue from current site data: python scripts/create-epp-catalogue.py.

Requires the repository's Node dependencies and Python reportlab / pymupdf.
Only writes the requested catalogue PDF; the legacy media generator is not used.
"""
from __future__ import annotations

from functools import partial
from html import escape
import json
from pathlib import Path
import re
import subprocess
from urllib.parse import urlparse

import fitz
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import (
    HRFlowable, Image, KeepTogether, PageBreak, Paragraph, SimpleDocTemplate,
    Spacer, Table, TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
DESTINATION = ROOT / 'public/downloads/park-nonwoven-epp-catalogue.pdf'

# Evaluate the real TS modules, including local JSON dependencies, without emitting JS.
NODE_LOADER = r"""
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const base = path.resolve('src/lib'), ts = require('typescript'), cache = new Map();
function compile(text, filename) {
  if (typeof ts.transpileModule === 'function') return ts.transpileModule(text, {
    fileName: filename,
    compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022}
  }).outputText;
  return require('next/dist/compiled/babel/core').transformSync(text, {
    filename, babelrc: false, configFile: false,
    presets: [require('next/dist/compiled/babel/preset-typescript')],
    plugins: [require('next/dist/compiled/babel/plugin-transform-modules-commonjs')]
  }).code;
}
function load(filename) {
  const absolute = path.resolve(filename), relative = path.relative(base, absolute);
  if (relative.startsWith('..') || path.isAbsolute(relative)) throw Error('Unexpected dependency: ' + absolute);
  if (cache.has(absolute)) return cache.get(absolute).exports;
  const text = fs.readFileSync(absolute, 'utf8');
  if (path.extname(absolute) === '.json') return JSON.parse(text);
  const module = {exports: {}}; cache.set(absolute, module);
  const localRequire = request => {
    if (!request.startsWith('.')) throw Error('Unexpected external dependency: ' + request);
    let dependency = path.resolve(path.dirname(absolute), request);
    if (!path.extname(dependency)) dependency += '.ts';
    return load(dependency);
  };
  vm.runInNewContext(compile(text, absolute), {
    module, exports: module.exports, require: localRequire,
    process: {env: {NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL}}
  }, {filename: absolute, timeout: 5000});
  return module.exports;
}
const catalog = load(path.join(base, 'catalog.ts'));
const education = load(path.join(base, 'epp-education.ts'));
const copy = load(path.join(base, 'content.ts')).productCopy;
const markets = catalog.markets.map(market => ({...market,
  products: catalog.activeProducts.filter(product => market.sourceSlugs.includes(product.marketSlug))
    .map(product => ({...product, focus: copy[product.name]?.focus || []}))
}));
console.log(JSON.stringify({brand: catalog.brand, origin: catalog.origin,
  total: catalog.activeProducts.length, markets, education}));
"""


def read_site_data() -> dict:
    result = subprocess.run(['node', '-e', NODE_LOADER], cwd=ROOT, check=True,
                            capture_output=True, encoding='utf-8')
    data = json.loads(result.stdout)
    if len(data['markets']) != 4:
        raise ValueError('Expected the four current public industries.')
    slugs = [item['slug'] for market in data['markets'] for item in market['products']]
    if len(slugs) != data['total'] or len(set(slugs)) != data['total']:
        raise ValueError('Current public products must appear exactly once.')
    return data


def fonts() -> tuple[str, str]:
    candidates = [
        (Path('C:/Windows/Fonts/arial.ttf'), Path('C:/Windows/Fonts/arialbd.ttf')),
        (Path('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'),
         Path('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf')),
    ]
    for regular, bold in candidates:
        if regular.exists() and bold.exists():
            pdfmetrics.registerFont(TTFont('ParkBody', str(regular)))
            pdfmetrics.registerFont(TTFont('ParkBold', str(bold)))
            pdfmetrics.registerFontFamily('ParkBody', normal='ParkBody', bold='ParkBold')
            return 'ParkBody', 'ParkBold'
    return 'Helvetica', 'Helvetica-Bold'


def build(data: dict) -> None:
    body_font, bold_font = fonts()
    ink, navy = colors.HexColor('#233a45'), colors.HexColor('#113246')
    teal, mint = colors.HexColor('#087d78'), colors.HexColor('#eef7f1')
    muted, line = colors.HexColor('#536a73'), colors.HexColor('#d3e2dd')
    width, height = A4
    margin, usable = 44, width - 88
    styles = {
        'body': ParagraphStyle('Body', fontName=body_font, fontSize=10.7, leading=15.3, textColor=ink, spaceAfter=8),
        'small': ParagraphStyle('Small', fontName=body_font, fontSize=9.3, leading=13.2, textColor=muted, spaceAfter=5),
        'label': ParagraphStyle('Label', fontName=bold_font, fontSize=9, leading=13, textColor=teal, spaceAfter=10),
        'title': ParagraphStyle('Title', fontName=bold_font, fontSize=29, leading=34, textColor=navy, spaceAfter=18),
        'h1': ParagraphStyle('HeadingOne', fontName=bold_font, fontSize=21, leading=26, textColor=navy, spaceAfter=10),
        'h2': ParagraphStyle('HeadingTwo', fontName=bold_font, fontSize=12, leading=16, textColor=navy, spaceAfter=5),
        'product': ParagraphStyle('Product', fontName=bold_font, fontSize=11.3, leading=14.2, textColor=navy, spaceAfter=2),
        'productBody': ParagraphStyle('ProductBody', fontName=body_font, fontSize=10.7, leading=14.4, textColor=ink, spaceAfter=2),
        'productMeta': ParagraphStyle('ProductMeta', fontName=body_font, fontSize=9.5, leading=12.8, textColor=muted, spaceAfter=0),
        'cell': ParagraphStyle('Cell', fontName=body_font, fontSize=10.1, leading=14, textColor=ink),
    }
    edu = data['education']
    story = []

    def text(value: str, style: str = 'body', raw: bool = False):
        return Paragraph(value if raw else escape(value), styles[style])

    def section(label: str, title: str, intro: str | None = None):
        story.extend([text(label.upper(), 'label'), text(title, 'h1')])
        if intro:
            story.append(text(intro))
        story.append(Spacer(1, 10))

    def entry(title: str, body: str, style: str = 'h2'):
        story.append(KeepTogether([text(title, style),
                     text(body), Spacer(1, 5)]))

    def footer(canvas, doc):
        canvas.saveState()
        canvas.setFillColor(muted)
        canvas.setFont(body_font, 8.2)
        canvas.drawString(margin, 25, 'PARK Nonwoven  |  EPP & engineered materials')
        canvas.drawRightString(width - margin, 25, str(doc.page))
        canvas.setStrokeColor(line)
        canvas.line(margin, 39, width - margin, 39)
        if doc.page > 1:
            canvas.setFont(bold_font, 8)
            canvas.drawString(margin, height - 27, 'PRODUCT-FAMILY CATALOGUE')
            canvas.drawRightString(width - margin, height - 27,
                                   f"{len(data['markets'])} industries  /  {data['total']} product families")
        canvas.restoreState()

    # Cover: current scope and counts are generated from the same records as the site.
    logo = ROOT / 'public/images/park-nonwoven-logo.png'
    if logo.exists():
        story.extend([Image(str(logo), width=252, height=41.34, hAlign='LEFT'), Spacer(1, 49)])
    section('PARK Nonwoven', 'Future of light weight.', 'EPP product families and application guide')
    story.extend([Spacer(1, 14), text(f"{len(data['markets'])} industries. {data['total']} product families.", 'h1')])
    story.append(text('Explore PARK\u2019s application range and plan your next component with a practical understanding of EPP. Use this guide to connect the shape, material and working conditions before preparing a project enquiry.'))
    story.append(Spacer(1, 25))
    for market in data['markets']:
        story.append(text(f"{market['number']}  {market['name']}", 'h2'))
        story.append(text(f"{len(market['products'])} product families", 'small'))
        story.append(Spacer(1, 10))
    story.extend([Spacer(1, 20), HRFlowable(width=usable, thickness=1, color=line), Spacer(1, 15),
                  text('The range includes EPP, EPS and related polymers as indicated. Select the material and validate the finished part for its intended application.'),
                  text('sales@parknonwoven.com', 'h2'), PageBreak()])

    section('Material guide', 'What EPP makes possible', edu['eppOverview']['summary'])
    story.append(text(edu['eppOverview']['detail']))
    story.append(Spacer(1, 10))
    for prop in edu['eppProperties']:
        entry(prop['title'], prop['benefit'] + ' ' + prop['consideration'])
    story.append(PageBreak())

    section('Process & specification', 'From beads to a useful part')
    for index, step in enumerate(edu['eppManufacturingSteps'], 1):
        entry(f"0{index}  {step['title']}", step['description'])
    story.append(Spacer(1, 9))
    story.append(text('Build the application brief', 'h1'))
    checklist = []
    for item in edu['eppSelectionChecklist']:
        checklist.append([text(item['title'], 'h2'), text(item['detail'])])
    table = Table(checklist, colWidths=[usable * .32, usable * .68], hAlign='LEFT')
    table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10), ('TOPPADDING', (0, 0), (-1, -1), 7),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5), ('ROWBACKGROUNDS', (0, 0), (-1, -1), [mint, colors.white]),
    ]))
    story.extend([table, PageBreak()])

    # Each product is sourced from activeProducts; legacy records never enter these pages.
    for market in data['markets']:
        items = market['products']
        per_page = 9 if len(items) > 10 else 10
        for offset in range(0, len(items), per_page):
            part = items[offset:offset + per_page]
            # Ten-entry pages retain all copy and type sizes; trim only row whitespace
            # so a longer current industry introduction cannot orphan the final entry.
            product_gap = 6 if len(part) == 10 else 8
            continuation = ' — continued' if offset else ''
            section(f"Industry {market['number']}  |  {len(items)} product families",
                    market['name'] + continuation,
                    market['intro'] if not offset else None)
            if not offset:
                story.append(text('Specification focus: ' + market['need'], 'small'))
                story.append(Spacer(1, 6))
            for product in part:
                href = data['origin'].rstrip('/') + '/products/' + product['slug'] + '/'
                linked_title = f'<link href="{escape(href, quote=True)}" color="#113246">{escape(product["name"])}</link>'
                story.append(KeepTogether([
                    text(linked_title, 'product', raw=True),
                    text(product['summary'], 'productBody'),
                    text('Material options: ' + product['material'], 'productMeta'),
                    Spacer(1, product_gap),
                ]))
            story.append(PageBreak())

    section('Material decisions', 'EPP and EPS: compare the application')
    rows = [[text('Consideration', 'h2'), text('EPP', 'h2'), text('EPS', 'h2')]]
    for item in edu['eppComparison']:
        rows.append([text(item['topic'], 'cell'),
                     text(item['epp'], 'cell'), text(item['eps'], 'cell')])
    comparison = Table(rows, colWidths=[usable * .27, usable * .365, usable * .365], hAlign='LEFT')
    comparison.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'), ('BACKGROUND', (0, 0), (-1, 0), mint),
        ('LINEBELOW', (0, 0), (-1, 0), 1, teal), ('LINEBELOW', (0, 1), (-1, -1), .5, line),
        ('LEFTPADDING', (0, 0), (-1, -1), 9), ('RIGHTPADDING', (0, 0), (-1, -1), 9),
        ('TOPPADDING', (0, 0), (-1, -1), 9), ('BOTTOMPADDING', (0, 0), (-1, -1), 9),
    ]))
    story.extend([comparison, Spacer(1, 22), text('Common specification questions', 'h1')])
    for faq in edu['eppFaqs'][:4]:
        entry(faq['question'], faq['answer'])
    story.append(PageBreak())

    section('Qualifications & service life', 'Ask for the evidence that matters')
    for faq in edu['eppFaqs'][4:]:
        entry(faq['question'], faq['answer'])
    story.extend([Spacer(1, 8), text('Start a project conversation', 'h1'),
                  text('Send the drawing revision, target quantities, operating conditions and acceptance criteria to sales@parknonwoven.com. Confirm the final material, geometry and validation plan for the specific application.'), PageBreak()])

    section('Your project with PARK', 'From an idea to a clear brief.',
            'A useful enquiry explains the job the part needs to do. Bring the following information together so that material and design options can be discussed around your application.')
    for title, body in [
        ('01  Application and users', 'Describe what the part supports, protects or insulates, who handles it, and where it fits into the complete product or delivery process.'),
        ('02  Drawings and interfaces', 'Include the current drawing revision, dimensions and any surfaces that must locate, seal, clip or clear another component. Mark the dimensions that matter most.'),
        ('03  Conditions in use', 'Set out loading, handling frequency, temperature exposure, moisture and cleaning. For packaging, include the payload and the storage, transport and return routes.'),
        ('04  Quantity and timing', 'Share the expected sample quantity, production volumes and project milestones. Identify any changes that may be needed between prototype and production.'),
        ('05  Acceptance and next life', 'Define how samples will be checked in the finished assembly. Include requirements for reuse, inspection, separation and collection at the end of service.'),
    ]:
        entry(title, body)
    contact_href = data['origin'].rstrip('/') + '/contact/'
    story.extend([Spacer(1, 8),
                  text('<link href="mailto:sales@parknonwoven.com" color="#087d78">sales@parknonwoven.com</link>', 'h2', raw=True),
                  text(f'<link href="{escape(contact_href, quote=True)}" color="#087d78">Discuss your application with PARK</link>', raw=True)])
    story.extend([Spacer(1, 10), HRFlowable(width=usable, thickness=1, color=line), Spacer(1, 16),
                  text('Use current grade documentation and representative component tests when making a specification. Performance, approvals and available recycling routes depend on the selected material and finished design.'),
                  text('This edition follows the current online catalogue: ' + str(data['total']) + ' product families in ' + str(len(data['markets'])) + ' industries.', 'small')])

    DESTINATION.parent.mkdir(parents=True, exist_ok=True)
    document = SimpleDocTemplate(str(DESTINATION), pagesize=A4,
        title='PARK EPP & engineered materials catalogue', author='PARK Nonwoven',
        subject=f"PARK application guide: {len(data['markets'])} industries and {data['total']} current product families",
        leftMargin=margin, rightMargin=margin, topMargin=58, bottomMargin=51,
        allowSplitting=True)
    document.build(story, onFirstPage=footer, onLaterPages=footer,
                   canvasmaker=partial(Canvas, invariant=1))


def verify(data: dict) -> dict:
    with fitz.open(DESTINATION) as pdf:
        raw = '\n'.join(page.get_text() for page in pdf)
        compact = ' '.join(raw.split())
        public_text = compact + ' ' + json.dumps(pdf.metadata)
        excluded_brands = r'\b(?:Knauf|BEWI|JSP|ARPRO|Neopolen|NEOPS|CELOOPS|EOPS|Kaneka|Busterbak|Drainbox|E-Food-Box)\b'
        if re.search(excluded_brands, public_text, re.IGNORECASE):
            raise AssertionError('Manufacturer-branded reference content must not appear in the public catalogue.')
        if re.search(r'\[\d+(?:\s*,\s*\d+)*\]', compact):
            raise AssertionError('Reference citation numbers must not appear in the public catalogue.')
        allowed_origin = urlparse(data['origin']).netloc.lower()
        links = [link for page in pdf for link in page.get_links()]
        for link in links:
            uri = link.get('uri', '')
            if not uri:
                continue
            parsed = urlparse(uri)
            site_link = parsed.scheme in ('https', 'http') and parsed.netloc.lower() == allowed_origin
            email_link = uri == 'mailto:sales@parknonwoven.com'
            if not site_link and not email_link:
                raise AssertionError('Unexpected external catalogue link: ' + uri)
        if not 6 <= len(pdf) <= 12:
            raise AssertionError(f'Catalogue must remain readable within 6–12 pages; got {len(pdf)}.')
        for market in data['markets']:
            if market['name'] not in compact:
                raise AssertionError('Missing public industry: ' + market['name'])
            for product in market['products']:
                if product['name'] not in compact:
                    raise AssertionError('Missing product family: ' + product['name'])
        for retired in ['13 industry', '13 market', '77 product', 'Aviation', 'Agrifood',
                        'Domestic appliances', 'Swimming pools & filtration', 'Pharma & health',
                        'Insulation & waterproofing', 'Furniture']:
            if retired.lower() in compact.lower():
                raise AssertionError('Retired public catalogue content: ' + retired)
        return {'pages': len(pdf), 'industries': len(data['markets']), 'products': data['total'],
                'links': len(links), 'external_manufacturer_links': 0,
                'bytes': DESTINATION.stat().st_size, 'output': str(DESTINATION)}


if __name__ == '__main__':
    site_data = read_site_data()
    build(site_data)
    print(json.dumps(verify(site_data), indent=2))
