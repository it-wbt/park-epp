import Link from 'next/link';
import {articles} from '../lib/catalog';
import {Icon} from './ui';
import ReturnLoopExplorer from './ReturnLoopExplorer';
import styles from './ReuseGuide.module.css';

const guide = articles.find(article => article.slug === 'design-for-reuse')!;
const briefItems = [
  ['The product', 'Dimensions, weight and the surfaces that need protection.'],
  ['The route', 'Delivery points, return ownership and storage between trips.'],
  ['The routine', 'Handling, cleaning and checks before the next use.'],
];

export default function ReuseGuide() {
  return <article className={styles.article}>
    <section className={styles.hero} aria-labelledby="reuse-guide-heading">
      <div className={styles.heroInner}>
        <div className={styles.heroCopy} data-reveal>
          <p className={styles.eyebrow}>PARK GUIDE / DESIGN FOR REUSE</p>
          <h1 id="reuse-guide-heading">Designing returnable packaging <span>for real journeys</span></h1>
          <p className={styles.intro}>{guide.intro}</p>
          <a className={styles.primary} href="#return-loop">Explore the return journey <Icon kind="arrow"/></a>
        </div>
        <figure className={styles.heroVisual}>
          <img src="/images/generated/industry-logistics.webp" alt="Moulded foam trays holding industrial components beside stacked transport boxes on a warehouse pallet" width={1440} height={960} fetchPriority="high"/>
          <figcaption><Icon kind="box"/><span>Fitted protection. A planned return.</span></figcaption>
        </figure>
      </div>
    </section>

    <nav className={styles.contents} aria-label="Returnable packaging guide sections">
      <div><span>IN THIS GUIDE</span><a href="#return-loop">01 <span>The return journey</span></a><a href="#reuse-principles">02 <span>Design priorities</span></a><a href="#reuse-brief">03 <span>Your project brief</span></a></div>
    </nav>

    <ReturnLoopExplorer/>

    <section className={styles.principles} id="reuse-principles" aria-labelledby="reuse-principles-heading">
      <div className={styles.sectionHeading} data-reveal><p className={styles.eyebrow}>DESIGNED AROUND REPEATED USE</p><h2 id="reuse-principles-heading">Think beyond the first delivery.</h2></div>
      <ol>{guide.sections.map(([title, text], index) => <li key={title} data-reveal><span className={styles.number}>0{index + 1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol>
      <Link className={styles.textLink} href="/markets/logistics-handling/">Explore logistics & material handling <Icon kind="arrow"/></Link>
    </section>

    <section className={styles.brief} id="reuse-brief" aria-labelledby="reuse-brief-heading">
      <div className={styles.briefInner}>
        <div><p className={styles.eyebrow}>START WITH YOUR ROUTE</p><h2 id="reuse-brief-heading">Bring the product.<br/>Map the journey.</h2><p className={styles.briefIntro}>Give PARK a clear picture of what the pack will carry and how it will come back.</p></div>
        <div className={styles.briefDetails}>
          <dl>{briefItems.map(([title, text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}</dl>
          <div className={styles.actions}><Link className={styles.primary} href="/contact/">Discuss your packaging <Icon kind="arrow"/></Link><a href="/downloads/material-selection-brief.pdf" download>Download the project checklist <Icon kind="download"/></a></div>
        </div>
      </div>
    </section>
    <div className={styles.more}><Link href="/resources/"><Icon kind="arrow"/>All resources</Link><Link href="/resources/epp-or-eps/">Compare EPP and EPS <Icon kind="arrow"/></Link></div>
  </article>;
}
