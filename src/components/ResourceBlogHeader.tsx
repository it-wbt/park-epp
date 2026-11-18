import styles from './ResourceBlogHeader.module.css';

export default function ResourceBlogHeader({category,title,intro,readMinutes}:{category:string,title:string,intro:string,readMinutes:number}){
  return <section className={styles.header}>
    <p className={styles.eyebrow}><span>{category}</span> / {readMinutes} min read</p>
    <h1>{title}</h1>
    <p className={styles.lead}>{intro}</p>
  </section>;
}
