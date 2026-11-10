import Link from 'next/link';
import {Icon} from './Icon';
import styles from './ResourceArticleHero.module.css';

export default function ResourceArticleHero({category,title,intro,readMinutes}:{category:string,title:string,intro:string,readMinutes:number}) {
  return <section className={styles.hero}>
    <div className={styles.inner}>
      <div className={styles.copy}>
        <Link className={styles.backLink} href="/resources/"><Icon kind="arrow"/>All resources</Link>
        <p className={styles.eyebrow}>{category}</p>
        <h1>{title}</h1>
        <p className={styles.intro}>{intro}</p>
        <div className={styles.meta}>
          <span>{readMinutes} min read</span>
          <a href="#article-content">Start reading <Icon kind="arrow"/></a>
        </div>
      </div>
    </div>
  </section>;
}
