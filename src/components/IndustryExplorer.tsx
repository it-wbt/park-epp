import Link from 'next/link';
import {Icon} from './ui';
import styles from './IndustryExplorer.module.css';

const industries = [
  {
    name: 'Sports, Leisure & Early Childhood',
    slug: 'sports-leisure',
    image: 'sports',
    alt: 'Moulded EPP exercise box, roller and shaped sports components',
    description: 'Lightweight moulded forms for exercise equipment, leisure products and play components.',
  },
  {
    name: 'Logistics & Material Handling',
    slug: 'logistics-handling',
    image: 'logistics',
    alt: 'Moulded foam transport containers and fitted protective inserts',
    description: 'Fitted dunnage, reusable containers and protective inserts designed for repeated handling.',
  },
  {
    name: 'HVAC',
    slug: 'hvac',
    image: 'hvac',
    alt: 'Moulded EPP insulation housing around an HVAC assembly',
    description: 'Insulation housings and air ducts that bring thermal insulation and assembly fit together.',
  },
  {
    name: 'Automotive',
    slug: 'mobility',
    image: 'mobility',
    alt: 'Shaped foam components alongside a vehicle interior assembly',
    description: 'Lightweight interior supports and shaped inserts developed around vehicle assemblies.',
  },
];

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
                <img src={`/images/generated/${industry.image}.webp`} alt={industry.alt} loading="lazy" width={800} height={450}/>
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