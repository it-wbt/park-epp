import Link from 'next/link';
import technicalGuides from '../lib/technical-guides.json';
import {eppSelectionChecklist} from '../lib/epp-education';
import {Icon} from './ui';
import styles from './EppGradeSelectionGuide.module.css';

const technicalGuide = technicalGuides.find(item => item.slug === 'epp-grade-selection' && item.section === 'materials')!;
const briefItems = eppSelectionChecklist.slice(0, 4);

export const eppGradeSelectionGuideSections = [
 {id:'grade-steps',label:'Selection process'},
 {id:'grade-evidence',label:'Compare grade evidence'},
 {id:'grade-brief',label:'Your project brief'},
];

export const eppGradeSelectionTakeaways = [
 'Start with the component’s job, loads and operating conditions.',
 'Compare finished components; density alone does not predict performance.',
 'Agree on evidence and acceptance criteria before approving a grade.',
];

export default function EppGradeSelectionGuide({consider}:{consider:string}) {
 return <article className={styles.article}>
  <section className={styles.steps} id="grade-steps" aria-labelledby="grade-steps-heading">
   <span className={styles.sectionIndex}>01</span>
   <div className={styles.sectionHeading} data-reveal>
    <div><p className={styles.eyebrow}>A CLEARER SELECTION PROCESS</p><h2 id="grade-steps-heading">Choose around the finished component.</h2></div>
    <p>{consider}</p>
   </div>
   <ol>{technicalGuide.sections.map(({heading,text}, index) => <li key={heading} data-reveal><span className={styles.number}>{String(index + 1).padStart(2, '0')}</span><h3>{heading}</h3><p>{text}</p></li>)}</ol>
   <div className={styles.buyerQuestions}>
    <h3>Questions to bring to the conversation</h3>
    <ul><li>What is the application, and which requirements are essential?</li><li>How will the finished component be manufactured and assembled?</li><li>Which conditions should be represented in testing?</li><li>What happens at the end of the useful service life?</li></ul>
    <p>Any performance, food-contact or environmental claim needs evidence for the specific grade and application. Agree the validation and documentation requirements before selecting a final design.</p>
   </div>
  </section>

  <section className={styles.evidence} id="grade-evidence" aria-labelledby="grade-evidence-heading">
   <span className={styles.sectionIndex}>02</span>
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
   <span className={styles.sectionIndex}>03</span>
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

  <div className={styles.more}><Link href="/resources/"><Icon kind="arrow"/>All resources</Link><Link href="/materials/expanded-polypropylene/">Understand EPP material <Icon kind="arrow"/></Link><Link href="/products/">Browse EPP products <Icon kind="arrow"/></Link><Link href="/markets/">Explore industries <Icon kind="arrow"/></Link></div>
 </article>;
}
