import Link from 'next/link';
import {articles} from '../lib/catalog';
import {eppComparison} from '../lib/epp-education';
import EppApplicationFocus from './EppApplicationFocus';
import {Icon} from './ui';
import styles from './EppVsEpsGuide.module.css';

const guide = articles.find(article => article.slug === 'epp-or-eps')!;

export default function EppVsEpsGuide() {
  return <article className={styles.article}>
    <section className={styles.hero} aria-labelledby="material-selection-heading">
      <div className={styles.heroInner}>
        <div className={styles.heroCopy} data-reveal>
          <p className={styles.eyebrow}>PARK MATERIAL SELECTION GUIDE</p>
          <h1 id="material-selection-heading">EPP or EPS?<br/><span>Start with the application.</span></h1>
          <p className={styles.intro}>{guide.intro}</p>
          <a className={styles.primary} href="#material-comparison">Compare the materials <Icon kind="arrow"/></a>
        </div>
        <div className={styles.materials} aria-label="EPP and EPS material examples">
          <figure className={styles.material}>
            <div className={styles.materialImage}><img src="/images/generated/epp-material-closeup.webp" alt="Illustrative moulded EPP component with a textured bead surface and loose expanded beads" width={1100} height={1100} fetchPriority="high"/></div>
            <figcaption><strong>EPP</strong><span>Expanded polypropylene</span></figcaption>
          </figure>
          <figure className={styles.material}>
            <div className={styles.materialImage}><img src="/images/products/corners.webp" alt="Illustrative white EPS protective corners with a visible cellular bead texture" width={1400} height={1050}/></div>
            <figcaption><strong>EPS</strong><span>Expanded polystyrene</span></figcaption>
          </figure>
        </div>
      </div>
    </section>

    <nav className={styles.contents} aria-label="Material selection guide sections">
      <div><span>IN THIS GUIDE</span><a href="#material-comparison">01 <span>The comparison</span></a><a href="#application-focus">02 <span>Your application</span></a><a href="#selection-steps">03 <span>Your next step</span></a></div>
    </nav>

    <section id="material-comparison" className={styles.comparison} aria-labelledby="material-comparison-heading">
      <div className={styles.sectionHeading} data-reveal>
        <div><p className={styles.eyebrow}>AT A GLANCE</p><h2 id="material-comparison-heading">Two materials.<br/><span>Different starting points.</span></h2></div>
        <p>Look at the finished component: its geometry, grade and working conditions shape the result.</p>
      </div>
      <table className={styles.table}>
        <caption className={styles.srOnly}>EPP and EPS material selection considerations</caption>
        <thead><tr><th scope="col">What matters</th><th scope="col"><strong>EPP</strong><span>Expanded polypropylene</span></th><th scope="col"><strong>EPS</strong><span>Expanded polystyrene</span></th></tr></thead>
        <tbody>{eppComparison.filter(row => row.topic !== 'Base material').map(row => <tr key={row.topic}>
          <th scope="row">{row.topic}</th>
          <td><span className={styles.mobileLabel} aria-hidden="true">EPP</span>{row.epp}</td>
          <td><span className={styles.mobileLabel} aria-hidden="true">EPS</span>{row.eps}</td>
        </tr>)}</tbody>
      </table>
      <div className={styles.materialLinks}><Link href="/materials/expanded-polypropylene/">Explore EPP in detail <Icon kind="arrow"/></Link><Link href="/materials/expanded-polystyrene/">Explore EPS in detail <Icon kind="arrow"/></Link></div>
    </section>

    <EppApplicationFocus/>

    <section id="selection-steps" className={styles.stepsSection} aria-labelledby="selection-steps-heading">
      <div className={styles.sectionHeading} data-reveal><div><p className={styles.eyebrow}>FROM COMPARISON TO A CLEAR BRIEF</p><h2 id="selection-steps-heading">Make the next decision useful.</h2></div></div>
      <ol className={styles.steps}>{guide.sections.map(([title, text], index) => <li key={title} data-reveal>
        <span className={styles.stepNumber}>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div>
      </li>)}</ol>
    </section>

    <section className={styles.enquiry} aria-labelledby="selection-enquiry-heading">
      <div><p className={styles.eyebrow}>LET’S LOOK AT YOUR APPLICATION</p><h2 id="selection-enquiry-heading">Bring the brief.<br/>We’ll explore the material.</h2><p>Share your drawing, expected loads, operating conditions and quantities with PARK.</p></div>
      <div className={styles.enquiryActions}><Link className={styles.primary} href="/contact/">Discuss your application <Icon kind="arrow"/></Link><a href="/downloads/material-selection-brief.pdf" download>Download the selection checklist <Icon kind="download"/></a></div>
    </section>
    <div className={styles.more}><Link href="/resources/"><Icon kind="arrow"/>All resources</Link><Link href="/resources/design-for-reuse/">Next guide: designing for reuse <Icon kind="arrow"/></Link></div>
  </article>;
}
