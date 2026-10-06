import Link from 'next/link';
import {expertise} from '../lib/catalog';
import {Icon} from './ui';
import styles from './HomeExpertise.module.css';

const stages = ['co-development', 'foam-moulding', 'testing-validation', 'industrialisation']
  .map(slug => expertise.find(item => item.slug === slug)!);

export default function HomeExpertise() {
  return <section id="home-expertise" className={styles.section} aria-labelledby="home-expertise-heading">
    <div className={styles.inner}>
      <div className={styles.heading} data-reveal>
        <div>
          <p className="eyebrow">OUR EXPERTISE</p>
          <h2 id="home-expertise-heading">From your drawing.<br/><span>To a considered component.</span></h2>
        </div>
        <div className={styles.intro}>
          <p>Develop an EPP component around its geometry, moulded density and working environment. Connect the material choice with tooling, samples and a clear validation plan.</p>
          <Link className={styles.allExpertise} href="/expertise/">All manufacturing &amp; development expertise <Icon kind="arrow"/></Link>
        </div>
      </div>

      <figure className={styles.factory} data-reveal>
        <img src="/images/generated/factory-foam-finishing.webp" alt="AI factory illustration of shaped foam components at a finishing and inspection workstation" width={1440} height={960} loading="lazy"/>
        <figcaption>
          <div><span>PRECISION MEETS POSSIBILITY</span><p>More than a material. Part of your design.</p></div>
        </figcaption>
      </figure>

      <ol className={styles.journey} aria-label="From application brief to production">
        {stages.map((stage, index) => <li className={styles.stage} key={stage.slug} data-reveal>
          <Link href={`/expertise/${stage.slug}/`} aria-labelledby={`expertise-stage-${stage.slug}`}>
            <div className={styles.stepTop}><span className={styles.number}>0{index + 1}</span><Icon kind="arrow"/></div>
            <h3 id={`expertise-stage-${stage.slug}`}>{stage.name}</h3>
            <p>{stage.text}</p>
          </Link>
        </li>)}
      </ol>
    </div>
  </section>;
}
