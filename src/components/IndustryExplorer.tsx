import Link from 'next/link';
import {markets} from '../lib/catalog';
import {industryStories} from '../lib/industry-stories';
import {Icon} from './ui';
import styles from './IndustryExplorer.module.css';

const industries = markets.map(market => {
  const story = industryStories[market.slug];
  return {
    name: market.name,
    slug: market.slug,
    image: story.heroImage,
    alt: story.heroAlt,
    description: story.homeSummary,
  };
});

export default function IndustryExplorer() {
  return (
    <section className={styles.section} aria-labelledby="industry-heading">
      <div className={styles.inner}>
        <div className={styles.heading} data-reveal>
          <div>
            <p className="eyebrow">BUILT AROUND YOUR INDUSTRY</p>
            <h2 id="industry-heading">EPP across <span>four industries.</span></h2>
          </div>
          <p>Protection, insulation and lightweight design. Explore where EPP can make a difference.</p>
        </div>
        <div className={styles.cards}>
          {industries.map((industry, index) => (
            <Link className={styles.card} href={`/markets/${industry.slug}/`} key={industry.slug} data-reveal>
              <div className={styles.image}>
                <img src={industry.image} alt={industry.alt} loading="lazy" width={800} height={450}/>
                <span className={styles.number}>0{index + 1}</span>
              </div>
              <div className={styles.copy}>
                <h3>{industry.name}</h3>
                <p>{industry.description}</p>
                <span className={styles.explore}>Explore industry <span><Icon kind="arrow"/></span></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
