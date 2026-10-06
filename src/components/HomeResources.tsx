import Link from 'next/link';
import {articles} from '../lib/catalog';
import {Icon} from './ui';
import styles from './HomeResources.module.css';

const featuredGuides = ['epp-or-eps', 'design-for-reuse']
  .map(slug => articles.find(article => article.slug === slug))
  .filter((article): article is typeof articles[number] => Boolean(article));

export default function HomeResources() {
  return <section className={styles.section} aria-labelledby="home-resources-heading">
    <div className={styles.layout}>
      <div className={styles.heading}>
        <p className={styles.eyebrow}>INSIGHTS & RESOURCES</p>
        <h2 id="home-resources-heading">Practical guidance.</h2>
        <Link className={styles.allResources} href="/resources/">All resources <Icon kind="arrow"/></Link>
      </div>
      <ul className={styles.guides}>
        {featuredGuides.map(article => <li key={article.slug}>
          <Link className={styles.guide} href={`/resources/${article.slug}/`}>
            <span><span className={styles.category}>{article.category}</span><span className={styles.title}>{article.title}</span></span>
            <Icon kind="arrow"/>
          </Link>
        </li>)}
      </ul>
      <a className={styles.catalogue} href="/downloads/park-nonwoven-epp-catalogue.pdf" download>
        <span className={styles.downloadIcon}><Icon kind="download"/></span>
        <span className={styles.catalogueCopy}><span className={styles.category}>PRODUCT CATALOGUE · PDF</span><span className={styles.catalogueTitle}>Take a closer look.</span><span className={styles.downloadLabel}>Download catalogue <Icon kind="arrow"/></span></span>
      </a>
    </div>
  </section>;
}
