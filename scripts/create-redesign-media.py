from pathlib import Path
import re,subprocess
from PIL import Image
import imageio_ffmpeg
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,PageBreak,Image as PDFImage
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
root=Path(__file__).resolve().parents[1]
out=root/'public/downloads';out.mkdir(exist_ok=True)
styles=getSampleStyleSheet();styles['Title'].textColor=colors.HexColor('#08639b');styles['Heading2'].textColor=colors.HexColor('#08639b');styles['BodyText'].leading=16
rows=re.search(r'const rows=`(.*?)`;', (root/'src/lib/content.ts').read_text(encoding='utf-8'),re.S)
if not rows: rows=re.search(r'const rows\s*=\s*`(.*?)`', (root/'src/lib/content.ts').read_text(encoding='utf-8'),re.S)
items=rows.group(1).strip().splitlines()
story=[PDFImage(str(root/'public/images/park-nonwoven-logo.png'),width=260,height=43),Spacer(1,60),Paragraph('EPP & engineered materials',styles['Title']),Paragraph('Product-family catalogue',styles['Heading1']),Spacer(1,25),Paragraph('77 product families across 13 industry applications. Original descriptions and practical priorities for your next packaging or component project.',styles['BodyText']),Spacer(1,40),Paragraph('PARK Nonwoven | sales@parknonwoven.com',styles['BodyText']),PageBreak()]
for row in items:
 name,summary,focus=row.split('|')
 story.extend([Paragraph(name.replace('&','&amp;'),styles['Heading2']),Paragraph(summary,styles['BodyText']),Spacer(1,8),Paragraph('<b>Design priorities:</b> '+focus.replace(';',' · '),styles['BodyText']),Spacer(1,20)])
story.extend([PageBreak(),Paragraph('Your project brief',styles['Heading1']),Paragraph('Include the application, drawing, dimensions, planned quantities, operating conditions, assembly interfaces and validation criteria. Final geometry, grade and suitability should be agreed for the specific application.',styles['BodyText']),Spacer(1,20),Paragraph('Email your brief and drawings to sales@parknonwoven.com.',styles['BodyText'])])
def foot(canvas,doc):
 canvas.setFont('Helvetica',8);canvas.setFillColor(colors.HexColor('#63747e'));canvas.drawString(45,25,'PARK Nonwoven · EPP & engineered materials');canvas.drawRightString(550,25,str(doc.page))
SimpleDocTemplate(str(out/'park-nonwoven-epp-catalogue.pdf'),title='PARK EPP & engineered materials catalogue',author='PARK Nonwoven',topMargin=45,bottomMargin=45).build(story,onFirstPage=foot,onLaterPages=foot)
brief=[Paragraph('Material selection & project brief',styles['Title']),Paragraph('A practical checklist for packaging and component development.',styles['BodyText'])]
for title,text in [('Application & function','What must the part protect, support, insulate or contain? Describe the complete assembly and intended service life.'),('Geometry & interfaces','Record dimensions, contact areas, clearance, fastening, closure and servicing access. Attach the drawing revision.'),('Exposure & loading','State temperatures, repeated loads, impact directions, moisture, cleaning and handling conditions.'),('Material & process','Compare candidate grades with the same requirements. Review moulding, forming, cutting and assembly options.'),('Packaging journey','Document payload, stacking, loading, storage, route and unloading. Define return arrangements for reusable formats.'),('Validation & documentation','Agree representative samples, test methods, acceptance criteria and any required grade-specific documentation.'),('Next life & recovery','Record reuse cycles, inspection, separation and the local recovery routes available.'),('Commercial brief','Include expected quantities, timing, sample needs and technical contact. Email your brief to sales@parknonwoven.com.')]:
 brief.extend([Spacer(1,20),Paragraph(title,styles['Heading2']),Paragraph(text,styles['BodyText']),Spacer(1,10),Paragraph('Notes: ______________________________________________________________<br/><br/>____________________________________________________________________',styles['BodyText'])])
SimpleDocTemplate(str(out/'material-selection-brief.pdf'),title='PARK material selection brief',author='PARK Nonwoven').build(brief,onFirstPage=foot,onLaterPages=foot)
ffmpeg=imageio_ffmpeg.get_ffmpeg_exe();dest=root/'public/videos/park-materials-hero.mp4'
subprocess.run([ffmpeg,'-y','-loop','1','-i',str(root/'public/images/markets/forest.webp'),'-vf',"scale=1600:900,zoompan=z='min(zoom+0.0003,1.1)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=288:s=1280x720:fps=24",'-t','12','-an','-c:v','libx264','-preset','fast','-crf','25','-pix_fmt','yuv420p','-movflags','+faststart',str(dest)],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
print(f'Created 2 original PDF downloads and forest film; catalogue covers {len(items)} product families.')
