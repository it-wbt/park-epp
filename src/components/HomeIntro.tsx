import Link from 'next/link';
import {eppOverview, eppProperties} from '../lib/epp-education';
import {Icon} from './ui';
import styles from './HomeIntro.module.css';

const benefits = eppProperties.filter(property => ['weight', 'impact', 'thermal'].includes(property.id));

export default function HomeIntro() {
  return <section id="discover" className={styles.section} aria-labelledby="epp-intro-heading">
    <div className={styles.inner}>
      <div className={styles.heading} data-reveal>
        <div>
          <p className="eyebrow">MEET EXPANDED POLYPROPYLENE</p>
          <h2 id="epp-intro-heading">What is EPP?<br/><span>A lighter way to make.</span></h2>
        </div>
        <div className={styles.overview}>
          <p>{eppOverview.summary} Grade, density and geometry determine performance.</p>
          <Link className={styles.guide} href="/materials/expanded-polypropylene/">Explore the EPP guide <Icon kind="arrow"/></Link>
        </div>
      </div>
      <ul className={styles.benefits} aria-label="Key EPP properties" data-reveal>
        {benefits.map((benefit, index) => <li key={benefit.id}>
          <span className={styles.number} aria-hidden="true">0{index + 1}</span>
          <div><h3>{benefit.title}</h3><p>{benefit.benefit}</p></div>
        </li>)}
      </ul>
      <p className={styles.reuse}>
        <Icon kind="leaf"/>
        <span>Plan for reuse, cleaning and a suitable local recovery route. <Link href="/materials/expanded-polypropylene/#epp-faq">More on EPP reuse &amp; recovery <span aria-hidden="true">↗</span></Link></span>
      </p>
    </div>
  </section>;
}
