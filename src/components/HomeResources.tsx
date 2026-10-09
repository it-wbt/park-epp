'use client';
import Link from 'next/link';
import {useEffect, useRef, useState, type KeyboardEvent, type MouseEvent} from 'react';
import {articles} from '../lib/catalog';
import {Icon} from './ui';
import styles from './HomeResources.module.css';

const featuredGuides = ['epp-grade-selection', 'design-for-reuse']
  .map(slug => articles.find(article => article.slug === slug))
  .filter((article): article is typeof articles[number] => Boolean(article));

const guideLabels = ['Material selection', 'Design for reuse'];
const guidePreviews = [
  'Explore EPP grade selection around the component’s job, handling cycle and operating conditions.',
  'Plan the return journey, cleaning and inspection alongside the first delivery.',
];
export default function HomeResources() {
  const [selected, setSelected] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const guideTabs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => { setEnhanced(true); }, []);
  function selectGuide(event: MouseEvent<HTMLAnchorElement>, index: number) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setSelected(index);
  }

  function navigateGuides(event: KeyboardEvent<HTMLAnchorElement>, index: number) {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % featuredGuides.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + featuredGuides.length) % featuredGuides.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = featuredGuides.length - 1;
    else if (event.key === ' ') { event.preventDefault(); setSelected(index); return; }
    else return;
    event.preventDefault();
    setSelected(next);
    guideTabs.current[next]?.focus();
  }

  return <section className={styles.section} aria-labelledby="home-resources-heading">
    <div className={styles.layout}>
      <div className={styles.heading}>
        <p className={styles.eyebrow}>INSIGHTS & RESOURCES</p>
        <h2 id="home-resources-heading">Practical guidance.</h2>
        <Link className={styles.allResources} href="/resources/">All resources <Icon kind="arrow"/></Link>
      </div>
      <div className={styles.guides}>
        <div className={styles.tabs} role={enhanced ? 'tablist' : undefined} aria-label="Choose a guide">
          {featuredGuides.map((article, index) => <Link
            key={article.slug} ref={element => { guideTabs.current[index] = element; }}
            id={`home-guide-tab-${index}`} className={styles.tab} href={`/resources/${article.slug}/`}
            role={enhanced ? 'tab' : undefined} aria-selected={enhanced ? selected === index : undefined}
            aria-controls={enhanced ? `home-guide-panel-${index}` : undefined}
            tabIndex={enhanced ? selected === index ? 0 : -1 : undefined} data-active={selected === index}
            onClick={event => selectGuide(event, index)} onKeyDown={event => navigateGuides(event, index)}>
            {guideLabels[index]}
          </Link>)}
        </div>
        <div className={styles.preview}>
          {featuredGuides.map((article, index) => <div
            key={article.slug} id={`home-guide-panel-${index}`} className={styles.guidePanel}
            role={enhanced ? 'tabpanel' : undefined} aria-labelledby={`home-guide-tab-${index}`}
            hidden={selected !== index} tabIndex={enhanced ? 0 : undefined}>
            <h3>{article.title}</h3>
            <p>{guidePreviews[index]}</p>
            <Link className={styles.readGuide} href={`/resources/${article.slug}/`}>Read guide <Icon kind="arrow"/></Link>
          </div>)}
        </div>
      </div>
    </div>
  </section>;
}
