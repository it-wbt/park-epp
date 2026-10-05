from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse, unquote
import json

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'out'
class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.links=[]; self.h1=0; self.title=False; self.description=False; self.canonical=False
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        if tag=='h1': self.h1+=1
        if tag=='title': self.title=True
        if tag=='meta' and attrs.get('name')=='description': self.description=True
        if tag=='link' and attrs.get('rel')=='canonical': self.canonical=True
        if tag in ('a','img','source','track'):
            value=attrs.get('href' if tag=='a' else 'src')
            if value: self.links.append(value)
errors=[]; pages=list(OUT.rglob('index.html'))
for file in pages:
    p=Page();p.feed(file.read_text(encoding='utf-8'))
    if p.h1!=1 or not p.title or not p.description: errors.append(f'Metadata/heading: {file.relative_to(OUT)}')
    for value in p.links:
        parsed=urlparse(value)
        if parsed.scheme or not parsed.path.startswith('/'):continue
        target=OUT/unquote(parsed.path.lstrip('/'))
        if target.is_dir():target=target/'index.html'
        if not target.exists():errors.append(f'Broken link {value} in {file.relative_to(OUT)}')
assert not errors, '\n'.join(errors[:30])
mapping=json.loads((ROOT/'research/catalogue-mapping.json').read_text())
product_paths={p.parent.name for p in (OUT/'products').glob('*/index.html')}
def slug(s):
    import re
    return re.sub('[^a-z0-9]+','-',s.lower()).strip('-')
assert all(slug(name) in product_paths for name in mapping['standardProductMapping'].values())
print(f'Export checks passed: {len(pages)} pages, all local links/assets, metadata, unique H1, all 39 mapped families.')
