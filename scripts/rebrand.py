from pathlib import Path
root=Path(__file__).resolve().parents[1]
files=list((root/'src').rglob('*.tsx'))+list((root/'src').rglob('*.ts'))+list((root/'scripts').glob('*.mjs'))+[root/'scripts/create-film.py',root/'public/videos/material-story.vtt',root/'README.md',root/'package.json',root/'package-lock.json',root/'research/catalogue-mapping.json']
for p in files:
    s=p.read_text(encoding='utf-8')
    s=s.replace('AERON Industries','Parknonwoven EPP').replace('ABOUT AERON','ABOUT PARKNONWOVEN EPP').replace('AERON','Parknonwoven EPP')
    s=s.replace('aeron-project-enquiry.txt','parknonwoven-epp-project-enquiry.txt').replace('"name": "aeron-industries"','"name": "parknonwoven-epp"')
    s=s.replace('<span className="logo-mark">a</span><span>Parknonwoven EPP<small>INDUSTRIES</small></span>','<span className="logo-mark">p</span><span>PARKNONWOVEN<small>EPP SOLUTIONS</small></span>')
    s=s.replace('Parknonwoven EPP is a concept brand.','This website presents illustrative product families.')
    s=s.replace('Parknonwoven EPP is a temporary concept brand.','The website uses the Parknonwoven EPP name supplied by the owner.')
    s=s.replace('Parknonwoven EPP is a demonstration brand, created to present an original industrial catalogue experience.','This Parknonwoven EPP website presents an original industrial catalogue experience.')
    s=s.replace('Parknonwoven EPP is a concept industrial brand exploring','Explore')
    s=s.replace('Parknonwoven EPP is a placeholder concept brand.','Parknonwoven EPP is the name supplied by the website owner.')
    s=s.replace('Parknonwoven EPP is a temporary concept brand.','Parknonwoven EPP is the name supplied by the website owner.')
    p.write_text(s,encoding='utf-8')
print('Updated Parknonwoven EPP branding, metadata, video captions and package names.')
