import Link from 'next/link';
import {expertise} from '../lib/catalog';
import {Icon} from './ui';
import styles from './HomeExpertise.module.css';

const stages = ['co-development', 'foam-moulding', 'testing-validation', 'industrialisation']
  .map(slug => expertise.find(item => item.slug === slug)!);

export default function HomeExpertise() {
  return <section id="home-expertise" className={styles.section} aria-labelledby="home-expertise-heading">
    <div className={styles.heading}>
      <div className={styles.copy} data-reveal>
        <p className="eyebrow">OUR EXPERTISE</p>
        <h2 id="home-expertise-heading">From your drawing.<br/>To a considered component.</h2>
        <p className={styles.intro}>Connect material, geometry, tooling and validation—from the first drawing to production.</p>
        <Link className={styles.allExpertise} href="/expertise/">Explore all expertise <Icon kind="arrow"/></Link>
      </div>
      <figure className={styles.factory} data-reveal>
        <img src="/images/generated/factory-foam-finishing.webp" alt="AI factory illustration of shaped foam components at a finishing and inspection workstation" width={1440} height={960} loading="lazy"/>
        <figcaption>PRECISION MEETS POSSIBILITY</figcaption>
      </figure>
    </div>
    <ol className={styles.journey} aria-label="From application brief to production" data-reveal>
      {stages.map((stage, index) => <li className={styles.stage} key={stage.slug}>
        <Link href={`/expertise/${stage.slug}/`} aria-labelledby={`expertise-stage-${stage.slug}`}>
          <span className={styles.number}>0{index + 1}</span>
          <h3 id={`expertise-stage-${stage.slug}`}>{stage.name}</h3>
          <p>{stage.text}</p>
          <Icon kind="arrow"/>
        </Link>
      </li>)}
    </ol>
  </section>;
}