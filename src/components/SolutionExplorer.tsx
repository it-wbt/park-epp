'use client';

import Link from 'next/link';
import {useState} from 'react';
import {solutions} from '../lib/catalog';
import {factoryMedia} from '../lib/factory-media';
import {Icon} from './ui';
import styles from './SolutionExplorer.module.css';

const visuals = [
  factoryMedia.automotive,
  factoryMedia.logistics,
  factoryMedia.finishing,
  factoryMedia.logistics,
  factoryMedia.hvac,
  factoryMedia.logistics,
  factoryMedia.inspection,
];

export default function SolutionExplorer() {
  const [selected, setSelected] = useState(0);
  const solution = solutions[selected];

  return <section id="product-challenges" className={styles.section} aria-labelledby="solutions-heading">
    <div className={styles.heading} data-reveal>
      <div>
        <p className={styles.eyebrow}>START WITH THE CHALLENGE</p>
        <h2 id="solutions-heading">What should your product <span>make possible?</span></h2>
      </div>
      <Link className={styles.allSolutions} href="/solutions/">Explore solutions<Icon kind="arrow"/></Link>
    </div>

    <div className={styles.stage} id="solution-detail" aria-labelledby="selected-solution-heading" data-reveal>
      <div className={styles.copy}>
        <div className={styles.priority}><span>DESIGN PRIORITY</span><span>0{selected + 1} / 07</span></div>
        <h3 id="selected-solution-heading" aria-live="polite"><span className={styles.titleWords} key={solution.slug}>{solution.name}</span></h3>
        <p>{solution.text}</p>
        <Link className={styles.explore} href={`/solutions/${solution.slug}/`}>Explore the approach<Icon kind="arrow"/></Link>
      </div>
      <div className={styles.artwork}>
        <div className={styles.window}>
          {visuals.map((visual, index) => <div className={styles.scene} data-active={selected === index} aria-hidden={selected !== index} key={solutions[index].slug}>
            <img src={visual.src} alt={visual.alt} width={1440} height={960} loading="lazy"/>
          </div>)}
        </div>
      </div>
    </div>

    <nav className={styles.choices} aria-label="Choose a product challenge">
      {solutions.map((item, index) => <Link key={item.slug} href={`/solutions/${item.slug}/`}
        aria-current={selected === index ? 'true' : undefined} aria-controls="solution-detail"
        onClick={event => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          setSelected(index);
        }}>
        <span className={styles.number}>0{index + 1}</span>
        <span>{item.name}</span>
      </Link>)}
    </nav>
  </section>;
}
