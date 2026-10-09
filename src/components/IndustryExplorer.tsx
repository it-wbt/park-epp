'use client';
import ResponsiveImage from './ResponsiveImage';

import Link from 'next/link';
import {useState, type MouseEvent} from 'react';
import {markets} from '../lib/catalog';
import {industryStories} from '../lib/industry-stories';
import {Icon} from './ui';
import styles from './IndustryExplorer.module.css';

const industries = markets.map(market => {
  const story = industryStories[market.slug];
  return {name: market.name, slug: market.slug, image: story.heroImage, alt: story.heroAlt, description: story.homeSummary};
});

export default function IndustryExplorer() {
  const [selected, setSelected] = useState(0);
  const industry = industries[selected];

  function chooseIndustry(event: MouseEvent<HTMLAnchorElement>, index: number) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setSelected(index);
  }

  return <section className={styles.section} aria-labelledby="industry-heading">
    <div className={styles.inner}>
      <div className={styles.heading} data-reveal>
        <div>
          <p className="eyebrow">BUILT AROUND YOUR INDUSTRY</p>
          <h2 id="industry-heading">EPP across<br/>four industries.</h2>
        </div>
        <p>Protection, insulation and lightweight design. Explore where EPP can make a difference.</p>
      </div>
      <div className={styles.layout}>
        <nav className={styles.choices} aria-label="Choose an industry">
          {industries.map((item, index) => <Link key={item.slug} href={`/markets/${item.slug}/`}
            aria-current={selected === index ? 'true' : undefined} aria-controls="industry-preview"
            onClick={event => chooseIndustry(event, index)} onFocus={() => setSelected(index)}
            onMouseEnter={() => { if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) setSelected(index); }}>
            <span className={styles.number}>0{index + 1}</span><span>{item.name}</span><Icon kind="arrow"/>
          </Link>)}
        </nav>
        <div id="industry-preview" className={styles.visual}>
          {industries.map((item, index) => <ResponsiveImage key={item.slug} src={item.image} alt={item.alt}
            className={styles.image} data-active={selected === index} aria-hidden={selected !== index}
            loading="lazy" width={800} height={450}/>)}
          <div className={styles.overlay}>
            <span className={styles.counter}>0{selected + 1} / 04</span>
            <h3 aria-live="polite" aria-atomic="true">{industry.name}</h3>
            <p>{industry.description}</p>
            <Link className={styles.explore} href={`/markets/${industry.slug}/`}>Explore industry <Icon kind="arrow"/></Link>
          </div>
        </div>
      </div>
    </div>
  </section>;
}
