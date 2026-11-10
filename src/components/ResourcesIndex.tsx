import Link from 'next/link';
import ResponsiveImage from './ResponsiveImage';
import {Icon} from './Icon';
import {articles} from '../lib/catalog';
import {resourcePages} from '../lib/resource-pages';
import styles from './ResourcesIndex.module.css';

export default function ResourcesIndex() {
  return <div className={styles.library}>
    <section className={styles.group} aria-labelledby="resource-formats-heading">
      <div className={styles.groupHeader}>
        <div><p className="eyebrow">FIND THE RIGHT FORMAT</p><h2 id="resource-formats-heading">Browse the resource library</h2></div>
        <p>Start with a guide, application example or practical tool for your next material and packaging decision.</p>
      </div>
      <div className={styles.formatGrid}>
        {resourcePages.map((resource,index)=><Link className={styles.formatCard} key={resource.slug} href={`/resources/${resource.slug}/`}>
          <div className={styles.formatMeta}><span>{String(index+1).padStart(2,'0')}</span><Icon kind="layers"/></div>
          <h3>{resource.title}</h3>
          <p>{resource.intro}</p>
          <span className={styles.cardAction}>Explore resource <Icon kind="arrow"/></span>
        </Link>)}
      </div>
    </section>

    <section className={styles.group} aria-labelledby="article-guides-heading">
      <div className={styles.groupHeader}>
        <div><p className="eyebrow">PRACTICAL GUIDES & INSIGHTS</p><h2 id="article-guides-heading">Read, compare and plan</h2></div>
        <p>Clear answers to common questions about EPP materials, packaging design and manufacturing.</p>
      </div>
      <div className={styles.articleGrid}>
        {articles.map(article=><Link className={styles.articleCard} key={article.slug} href={`/resources/${article.slug}/`}>
          <div className={styles.articleImage}>
            <ResponsiveImage src={article.heroImage} alt="" sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"/>
          </div>
          <div className={styles.articleContent}>
            <div className={styles.articleMeta}><span>{article.category}</span><span>{'readMinutes' in article?article.readMinutes:3} MIN READ</span></div>
            <h3>{article.title}</h3>
            <p>{article.intro}</p>
            <span className={styles.readLink}>Read guide <Icon kind="arrow"/></span>
          </div>
        </Link>)}
      </div>
    </section>
  </div>;
}
