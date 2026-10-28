import Link from 'next/link';
import ResponsiveImage from './ResponsiveImage';
import {articles} from '../lib/catalog';
import technicalGuides from '../lib/technical-guides.json';
import {eppSelectionChecklist} from '../lib/epp-education';
import {Icon} from './ui';
import styles from './EppGradeSelectionGuide.module.css';

const article = articles.find(item => item.slug === 'epp-grade-selection')!;
const technicalGuide = technicalGuides.find(item => item.slug === 'epp-grade-selection' && item.section === 'materials')!;
const briefItems = eppSelectionChecklist.slice(0, 4);

export default function EppGradeSelectionGuide() {
 return <article className={styles.article}>
  <section className={styles.hero} aria-labelledby="grade-guide-heading">
   <div className={styles.heroInner}>
    <div className={styles.heroCopy} data-reveal>
     <p className={styles.eyebrow}>PARK GUIDE / MATERIAL SELECTION</p>
     <h1 id="grade-guide-heading">Choose the right EPP grade <span>for your application.</span></h1>
     <p className={styles.intro}>{article.intro}</p>
     <a className={styles.primary} href="#grade-steps">Build your selection brief <Icon kind="arrow"/></a>
    </div>
    <figure className={styles.heroVisual}>
     <ResponsiveImage src="/images/generated/epp-material-closeup.webp" alt="Close view of a moulded charcoal EPP component and expanded beads" width={1100} height={1100} fetchPriority="high"/>
     <figcaption><Icon kind="layers"/><span>Grade, density and geometry work together.</span></figcaption>
    </figure>
   </div>
  </section>

  <nav className={styles.contents} aria-label="EPP grade selection guide sections">
   <div><span>IN THIS GUIDE</span><a href="#grade-steps">01 <span>Selection steps</span></a><a href="#grade-evidence">02 <span>Compare evidence</span></a><a href="#grade-brief">03 <span>Your project brief</span></a></div>
  </nav>

  <section className={styles.steps} id="grade-steps" aria-labelledby="grade-steps-heading">
   <div className={styles.sectionHeading} data-reveal>
    <div><p className={styles.eyebrow}>A CLEARER SELECTION PROCESS</p><h2 id="grade-steps-heading">Choose around the finished component.</h2></div>
    <p>Density is one input, not the complete answer. Start with the part&apos;s job, then compare the material and geometry under representative conditions.</p>
   </div>
   <ol>{article.sections.map(([title, text], index) => <li key={title} data-reveal><span className={styles.number}>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{text}</p></li>)}</ol>
  </section>

  <section className={styles.evidence} id="grade-evidence" aria-labelledby="grade-evidence-heading">
   <div className={styles.evidenceInner}>
    <div className={styles.evidenceHeading} data-reveal>
     <p className={styles.eyebrow}>COMPARE THE RIGHT EVIDENCE</p>
     <h2 id="grade-evidence-heading">Ask for data that matches the brief.</h2>
     <p>Current material data and representative parts help turn a grade discussion into a practical selection decision.</p>
    </div>
    <div className={styles.evidenceGrid}>
     <dl>{technicalGuide.facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
     <aside className={styles.note} data-reveal>
      <Icon kind="check"/>
      <h3>Keep the decision specific.</h3>
      <p>Material data describe stated test conditions. Confirm the selected grade and finished component with the actual geometry, assembly and operating environment before release.</p>
      <Link href="/materials/expanded-polypropylene/">Explore expanded polypropylene <Icon kind="arrow"/></Link>
     </aside>
    </div>
   </div>
  </section>

  <section className={styles.brief} id="grade-brief" aria-labelledby="grade-brief-heading">
   <div className={styles.briefInner}>
    <div>
     <p className={styles.eyebrow}>START WITH YOUR REQUIREMENTS</p>
     <h2 id="grade-brief-heading">Bring the drawing.<br/>Define the conditions.</h2>
     <p className={styles.briefIntro}>A useful brief makes it easier to compare candidate EPP grades, moulded densities and component designs.</p>
    </div>
    <div className={styles.briefDetails}>
     <dl>{briefItems.map(item => <div key={item.title}><dt>{item.title}</dt><dd>{item.detail}</dd></div>)}</dl>
     <div className={styles.actions}><Link className={styles.primary} href="/contact/">Discuss your EPP component <Icon kind="arrow"/></Link><Link href="/products/">Explore EPP products <Icon kind="arrow"/></Link></div>
    </div>
   </div>
  </section>

  <div className={styles.more}><Link href="/resources/"><Icon kind="arrow"/>All resources</Link><Link href="/materials/expanded-polypropylene/">Understand EPP material <Icon kind="arrow"/></Link></div>
 </article>;
}
