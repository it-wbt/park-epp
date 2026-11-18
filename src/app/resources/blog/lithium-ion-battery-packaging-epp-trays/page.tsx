import type {Metadata} from 'next';
import {Breadcrumb} from '../../../../components/shared';
import styles from './LithiumBatteryArticleHeader.module.css';
import LithiumIonBatteryPackagingBlog,{lithiumBatteryFaqs} from '../../../../components/LithiumIonBatteryPackagingBlog';
import {origin,blogArticles} from '../../../../lib/catalog';

const canonical='/resources/blog/lithium-ion-battery-packaging-epp-trays/';
const siteOrigin=origin.replace(/\/$/,'');
const article=blogArticles[0];
const title=article.title;
const description='Complete guide to lithium-ion battery packaging requirements. Learn where molded EPP trays fit in shipment protection and what to verify for transport under UN rules.';

export const metadata:Metadata={
  title:{absolute:title},
  description,
  alternates:{canonical},
  openGraph:{title,description,url:canonical,type:'article',images:[{url:'/images/lithium-ion-battery-returnable-epp-packaging.webp',alt:'Molded EPP dunnage trays for lithium-ion battery handling'}]},
};

const faqSchema={'@context':'https://schema.org','@type':'FAQPage',mainEntity:lithiumBatteryFaqs.map(({question,answer})=>({'@type':'Question',name:question,acceptedAnswer:{'@type':'Answer',text:answer}}))};
const breadcrumbSchema={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[
  {'@type':'ListItem',position:1,name:'Home',item:siteOrigin},
  {'@type':'ListItem',position:2,name:'Resources',item:`${siteOrigin}/resources/`},
  {'@type':'ListItem',position:3,name:'Lithium-Ion Battery Packaging: How to Package Cells & Modules Safely with Molded EPP Trays',item:`${siteOrigin}${canonical}`},
]};

export default function LithiumBatteryPackagingArticle(){
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqSchema)}}/>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumbSchema)}}/>
    <div className="container"><Breadcrumb items={[{name:'Resources',href:'/resources/'},{name:'Buying guide'}]}/></div>
    <section className={styles.header}>
      <p className={styles.eyebrow}>{article.category} / {article.readMinutes} min read</p>
      <h1>Lithium-Ion Battery Packaging: How to Package Cells &amp; Modules Safely with Molded EPP Trays</h1>
      <p className={styles.lead}>{article.bodyIntro}</p>
    </section>
    <LithiumIonBatteryPackagingBlog/>
  </>;
}
