"""Build the public catalogue from current site data: python scripts/create-epp-catalogue.py.

Requires the repository's Node dependencies and Python reportlab / pymupdf.
Only writes the requested catalogue PDF; the legacy media generator is not used.
"""
from __future__ import annotations

from functools import partial
from html import escape
import json
from pathlib import Path
import subprocess

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
    source_numbers = {source['id']: index + 1 for index, source in enumerate(edu['eppSources'])}
    story = []

    def text(value: str, style: str = 'body', raw: bool = False):
        return Paragraph(value if raw else escape(value), styles[style])

    def cite(row: dict) -> str:
        return ' <font size="8" color="#536a73">[' + ', '.join(
            str(source_numbers[key]) for key in row.get('sourceIds', [])
        ) + ']</font>' if row.get('sourceIds') else ''

    def section(label: str, title: str, intro: str | None = None):
        story.extend([text(label.upper(), 'label'), text(title, 'h1')])
        if intro:
            story.append(text(intro))
        story.append(Spacer(1, 10))

    def entry(title: str, body: str, row: dict, style: str = 'h2'):
        story.append(KeepTogether([text(title, style),
                     text(escape(body) + cite(row), raw=True), Spacer(1, 5)]))

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
    section('Material possibilities', 'EPP & engineered materials', 'Product-family catalogue and practical material guide')
    story.extend([Spacer(1, 14), text(f"{len(data['markets'])} industries. {data['total']} product families.", 'h1')])
    story.append(text('Explore the current product range, understand EPP behaviour and prepare a clearer specification for your next component or packaging project.'))
    story.append(Spacer(1, 25))
    for market in data['markets']:
        story.append(text(f"{market['number']}  {market['name']}", 'h2'))
        story.append(text(f"{len(market['products'])} product families", 'small'))
        story.append(Spacer(1, 10))
    story.extend([Spacer(1, 20), HRFlowable(width=usable, thickness=1, color=line), Spacer(1, 15),
                  text('The range includes EPP, EPS and related polymers as indicated. Select the material and validate the finished part for its intended application.'),
                  text('sales@parknonwoven.com', 'h2'), PageBreak()])

    section('Material guide', 'What EPP makes possible', edu['eppOverview']['summary'])
    story.append(text(escape(edu['eppOverview']['detail']) + cite(edu['eppOverview']), raw=True))
    story.append(Spacer(1, 10))
    for prop in edu['eppProperties']:
        entry(prop['title'], prop['benefit'] + ' ' + prop['consideration'], prop)
    story.append(PageBreak())

    section('Process & specification', 'From beads to a useful part')
    for index, step in enumerate(edu['eppManufacturingSteps'], 1):
        entry(f"0{index}  {step['title']}", step['description'], step)
    story.append(Spacer(1, 9))
    story.append(text('Build the application brief', 'h1'))
    checklist = []
    for item in edu['eppSelectionChecklist']:
        checklist.append([text(item['title'], 'h2'), text(escape(item['detail']) + cite(item), raw=True)])
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
                    Spacer(1, 8),
                ]))
            story.append(PageBreak())

    section('Material decisions', 'EPP and EPS: compare the application')
    rows = [[text('Consideration', 'h2'), text('EPP', 'h2'), text('EPS', 'h2')]]
    for item in edu['eppComparison']:
        rows.append([text(escape(item['topic']) + cite(item), 'cell', raw=True),
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
        entry(faq['question'], faq['answer'], faq)
    story.append(PageBreak())

    section('Qualifications & service life', 'Ask for the evidence that matters')
    for faq in edu['eppFaqs'][4:]:
        entry(faq['question'], faq['answer'], faq)
    story.extend([Spacer(1, 8), text('Start a project conversation', 'h1'),
                  text('Send the drawing revision, target quantities, operating conditions and acceptance criteria to sales@parknonwoven.com. Confirm the final material, geometry and validation plan for the specific application.'), PageBreak()])

    section('Primary references', 'Material and design sources',
            'Numbered references identify the producer guidance behind the material guide. These sources describe material behaviour and selection considerations; they do not certify a PARK product or assembly.')
    for index, source in enumerate(edu['eppSources'], 1):
        story.append(text(f"[{index}] {source['organisation']}", 'h2'))
        story.append(text(source['title']))
        story.append(text(f'<link href="{escape(source["url"], quote=True)}" color="#087d78">Open primary source</link>', raw=True))
        story.append(Spacer(1, 15))
    story.extend([Spacer(1, 10), HRFlowable(width=usable, thickness=1, color=line), Spacer(1, 16),
                  text('Use current grade documentation and representative component tests when making a specification. Performance, approvals and available recycling routes depend on the selected material and finished design.'),
                  text('This edition follows the current online catalogue: ' + str(data['total']) + ' product families in ' + str(len(data['markets'])) + ' industries.', 'small')])

    DESTINATION.parent.mkdir(parents=True, exist_ok=True)
    document = SimpleDocTemplate(str(DESTINATION), pagesize=A4,
        title='PARK EPP & engineered materials catalogue', author='PARK Nonwoven',
        subject=f"{len(data['markets'])} industries and {data['total']} current product families",
        leftMargin=margin, rightMargin=margin, topMargin=58, bottomMargin=51,
        allowSplitting=True)
    document.build(story, onFirstPage=footer, onLaterPages=footer,
                   canvasmaker=partial(Canvas, invariant=1))


def verify(data: dict) -> dict:
    with fitz.open(DESTINATION) as pdf:
        raw = '\n'.join(page.get_text() for page in pdf)
        compact = ' '.join(raw.split())
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
                'links': sum(len(page.get_links()) for page in pdf),
                'bytes': DESTINATION.stat().st_size, 'output': str(DESTINATION)}


if __name__ == '__main__':
    site_data = read_site_data()
    build(site_data)
    print(json.dumps(verify(site_data), indent=2))
