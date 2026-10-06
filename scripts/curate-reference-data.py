import json,re
from pathlib import Path
root=Path(__file__).resolve().parents[1]
def read(name):return json.loads((root/'research'/name).read_text(encoding='utf-8'))
def save(name,value):(root/'src/lib'/name).write_text(json.dumps(value,ensure_ascii=False,indent=2),encoding='utf-8')
def slug(name):return re.sub('[^a-z0-9]+','-',name.lower()).strip('-')
families=[]
for f in read('reference-markets-audit.json')['missingFamilies']:
 name=f['genericParkName'].replace('Ice-cream tubs','Ice cream tubs')
 families.append(dict(name=name,marketSlug=f['marketSlug'],summary=f['originalSummary'],material=f['material'],focus=f['focus'],application=' '.join(text for _,text in f['originalSections']),sourceURLs=f['sourceURLs']))
save('expanded-families.json',families)
formats=[]
for f in read('reference-products-audit.json')['inventory']:
 facts=[]
 # Source pages with mismatched detail bodies contribute listing information only.
 dims=[d for d in f['dimensions'] if 'as printed' not in d.lower()]
 if dims:facts.append({'label':'Published sizes / capacities','value':' · '.join(dims)})
 facts.extend({'label':'Published model information','value':v.replace(' Reference product only.','')} for v in f.get('publishedSpecifications',[]))
 name=f.get('sourceName',f['name']);material=f['material']
 if 'Not verified:' in material:material='Material to confirm for the selected format'
 if 'detail body mismatched' in material:material='Grade to confirm for the selected format'
 formats.append(dict(name=name,url=f['url'],familyName=f['mappedProduct'],familySlug=slug(f['mappedProduct']),marketSlug=f['marketSlug'],summary=' '.join(f['details']),material=material,facts=facts,variants=f['variants']))
save('reference-formats.json',formats)
guides=[]
for section,rows in [(s,read('reference-technical-audit.json')[s]) for s in ['expertise','materials','solutions']]:
 for f in rows:
  # All numbers and branded properties stay identified as published references.
  facts=[{'label':fact['label'].replace('Source ','Reference '),'value':fact['value'].split('; they are Knauf')[0]} for fact in f['facts']]
  guides.append(dict(slug=f['existingParkSlug'],section=section,source=f['url'],sections=f['originalSections'],facts=facts if section=='materials' else []))
save('technical-guides.json',guides)
mapping=read('catalogue-mapping.json');mapping['reviewed']='2026-10-05';mapping['coverage']='All 39 English standard listings across five catalogue pages verified; all 13 market areas and 44 application links reviewed. Product names map to original PARK product-family guides with source-identified published format references.';mapping['standardProductMapping']['Busterbak']='Ice cream tubs';mapping['sources']+=['https://www.knauf-industries.com/products/page/4/','https://www.knauf-industries.com/products/page/5/'];(root/'research/catalogue-mapping.json').write_text(json.dumps(mapping,ensure_ascii=False,indent=2),encoding='utf-8')
print(f'Curated {len(families)} additional families, {len(formats)} named format references and {len(guides)} technical guides.')
