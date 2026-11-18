import type {ReactNode} from 'react';
import Link from 'next/link';
import styles from './ResourceBlogLayout.module.css';

export type ResourceBlogSectionLink={id:string,label:string};

export default function ResourceBlogLayout({sections,takeaways,children}:{sections:readonly ResourceBlogSectionLink[],takeaways:readonly string[],children:ReactNode}){
  return <div className={styles.layout} id="article-content">
    <div className={styles.main}>
      <div className={styles.takeaways}>
        <span className={styles.eyebrow}>What to keep in mind</span>
        {takeaways.map(item=><p key={item}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4 10 4 4 8-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>{item}</p>)}
      </div>
      {children}
    </div>
    <aside className={styles.sidebar}>
      <span className={styles.eyebrow}>In this guide</span>
      <nav aria-label="Guide contents">
        {sections.map((section,index)=><a key={section.id} href={`#${section.id}`}><span>{String(index+1).padStart(2,'0')}</span>{section.label}</a>)}
      </nav>
      <div className={styles.sidebarEnquiry}>
        <h3>Move from a question to a specification.</h3>
        <p>Share your application details and discuss a solution designed around your requirements.</p>
        <Link href="/contact/">Discuss your requirement <span aria-hidden="true">↗</span></Link>
      </div>
    </aside>
  </div>;
}
