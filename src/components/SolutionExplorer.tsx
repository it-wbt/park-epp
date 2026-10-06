'use client';

import Link from 'next/link';
import {useState} from 'react';
import {solutions} from '../lib/catalog';
import {Icon} from './ui';
import styles from './SolutionExplorer.module.css';

const visuals = [
  {image: 'mobility', icon: 'layers', alt: 'Lightweight moulded foam parts for a vehicle assembly'},
  {image: 'logistics', icon: 'leaf', alt: 'Returnable foam containers and protective packaging'},
  {image: 'furniture', icon: 'waves', alt: 'Shaped foam forms and fitted furniture protection'},
  {image: 'agrifood', icon: 'box', alt: 'Fitted packaging for fresh food and prepared meals'},
  {image: 'pharma', icon: 'snow', alt: 'Insulated shipping container with coolant and fitted compartments'},
  {image: 'appliances', icon: 'shield', alt: 'Fitted protective packaging around a domestic appliance'},
  {image: 'agrifood', icon: 'food', alt: 'Food trays and containers designed around product presentation'},
];

export default function SolutionExplorer() {
  const [selected, setSelected] = useState(0);
  const solution = solutions[selected];
  const visual = visuals[selected];

  return (
    <section className={styles.section} aria-labelledby="solutions-heading">
      <div className={styles.surface}>
        <div className={styles.heading} data-reveal>
          <div>
            <p className={styles.eyebrow}>START WITH THE CHALLENGE</p>
            <h2 id="solutions-heading">What should your product<br/><span>make possible?</span></h2>
          </div>
          <Link className={styles.allSolutions} href="/solutions/">Explore solutions<span><Icon kind="arrow"/></span></Link>
        </div>

        <div className={styles.explorer}>
          <div className={styles.options} role="group" aria-label="Choose a product challenge" data-reveal>
            {solutions.map((item, index) => (
              <button key={item.slug} type="button" aria-pressed={selected === index} aria-controls="solution-detail" onClick={() => setSelected(index)}>
                <Icon kind={visuals[index].icon}/><span>{item.name}</span><Icon kind="arrow" className={styles.optionArrow}/>
              </button>
            ))}
          </div>

          <article className={styles.feature} id="solution-detail" aria-labelledby="selected-solution-heading" data-reveal>
            <div className={styles.image}>
              <img key={visual.image} src={`/images/generated/${visual.image}.webp`} alt={visual.alt} width={900} height={900} loading="lazy"/>
              <span className={styles.imageTag}><Icon kind={visual.icon}/>Material possibilities</span>
            </div>
            <div className={styles.copy}>
              <div className={styles.detailMeta}><span>Your design priority</span><span>{String(selected + 1).padStart(2, '0')} / 07</span></div>
              <h3 id="selected-solution-heading" aria-live="polite">{solution.name}</h3>
              <p>{solution.text}</p>
              <Link className={styles.explore} href={`/solutions/${solution.slug}/`}>Explore the approach<Icon kind="arrow"/></Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
