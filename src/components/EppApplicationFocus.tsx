import Link from 'next/link';
import styles from './EppApplicationFocus.module.css';

const applications = [
  {
    title: 'Returnable packaging',
    comparison: 'Compare the complete handling cycle, including the return journey.',
    questions: [
      'What payload, stacking loads and repeated handling will the pack see?',
      'How will it be cleaned, inspected and returned?',
      'What damage or deformation would make a pack unfit for reuse?',
    ],
    href: '/resources/design-for-reuse/',
    link: 'Plan a returnable pack',
  },
  {
    title: 'Temperature control',
    comparison: 'Compare the whole insulated assembly, with its joints and available thickness.',
    questions: [
      'Which temperatures and exposure durations belong in the brief?',
      'Where could joints, closures or openings affect insulation?',
      'How will representative assemblies be tested under the same conditions?',
    ],
    href: '/solutions/manage-temperature/',
    link: 'Explore thermal design',
  },
  {
    title: 'Protective inserts',
    comparison: 'Compare the finished insert around the product it needs to protect.',
    questions: [
      'Which contact surfaces, clearances and load paths matter?',
      'What impact, vibration and compression should the test plan cover?',
      'How will you check product condition after representative handling?',
    ],
    href: '/solutions/protect-in-transit/',
    link: 'Explore transit protection',
  },
];

export default function EppApplicationFocus() {
  return (
    <section id="application-focus" className={styles.section} aria-labelledby="application-focus-heading">
      <div className={styles.layout}>
        <div className={styles.heading}>
          <p className={styles.eyebrow}>START WITH THE APPLICATION</p>
          <h2 id="application-focus-heading">What does your part need to do?</h2>
          <p className={styles.intro}>Choose an application to see what belongs in your brief.</p>
        </div>
        <div className={styles.applications}>
          {applications.map((application, index) => (
            <details className={styles.application} name="material-application" open={index === 0} key={application.title}>
              <summary>
                <span className={styles.number} aria-hidden="true">0{index + 1}</span>
                <h3>{application.title}</h3>
                <span className={styles.indicator} aria-hidden="true"/>
              </summary>
              <div className={styles.body}>
                <p className={styles.comparison}><strong>What to compare</strong>{application.comparison}</p>
                <ul>{application.questions.map(question => <li key={question}>{question}</li>)}</ul>
                <Link className={styles.link} href={application.href}>
                  {application.link}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>
                </Link>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
