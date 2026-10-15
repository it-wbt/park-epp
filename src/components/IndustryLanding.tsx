import Link from 'next/link';
import ResponsiveImage from './ResponsiveImage';
import EppApplicationSelector from './EppApplicationSelector';
import {markets,activeProducts,marketSourceSlugs} from '../lib/catalog';
import {productVisual,productVisualAlt} from '../lib/content';
import type {IndustryStory} from '../lib/industry-stories';
import {Icon} from './ui';
import styles from './IndustryLanding.module.css';

export default function IndustryLanding({story}:{story:IndustryStory}){
 const market=markets.find(item=>item.slug===story.slug)!;
 const catalogue=activeProducts.filter(product=>marketSourceSlugs(story.slug).includes(product.marketSlug));
 const applications=story.applications.filter(application=>catalogue.some(product=>product.slug===application.productSlug));
 return <article className={styles.page}>
  <section className={styles.hero}><div><nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span aria-current="page">{market.name}</span></nav><p className={styles.eyebrow}>PARK INDUSTRY SOLUTIONS</p><h1>{market.name}<br/><span>EPP solutions</span></h1><p className={styles.lead}>{story.intro}</p><Link href="/#contact" className={styles.button}>Discuss your requirement<Icon kind="arrow"/></Link></div><ResponsiveImage src={story.heroImage} alt={story.heroAlt} width={720} height={540} sizes="(max-width:760px) 90vw, 45vw" fetchPriority="high"/></section>
  <section className={styles.section} aria-labelledby="application-title"><p className={styles.eyebrow}>FIND YOUR APPLICATION</p><h2 id="application-title">EPP for your application</h2><EppApplicationSelector key={market.slug} names={applications.map(application=>application.title)} panels={applications.map(application=>{
   const product=catalogue.find(item=>item.slug===application.productSlug)!;
   return <section className={styles.application} key={application.productSlug}><ResponsiveImage src={productVisual(product)} alt={productVisualAlt(product)} width={720} height={480} sizes="(max-width:760px) 90vw, 40vw" loading="lazy"/><div><h3>{application.title}</h3><p>{application.text}</p><ul><li><Link href={`/products/${product.slug}/`}>{product.name}<Icon kind="arrow"/></Link></li></ul><Link className={styles.textLink} href="/#contact">Request a quote<Icon kind="arrow"/></Link></div></section>;
  })}/><p className={styles.note}>Share your application, dimensions and quantity with PARK to discuss the right product fit.</p></section>
  <section className={styles.section} aria-labelledby="range-title"><p className={styles.eyebrow}>EXPLORE THE RANGE</p><h2 id="range-title">Products for {market.name.toLowerCase()}</h2><div className={styles.products}>{catalogue.map(product=><Link className={styles.product} key={product.slug} href={`/products/${product.slug}/`}><div className={styles.productImage}><ResponsiveImage src={productVisual(product)} alt={productVisualAlt(product)} width={480} height={360} sizes="(max-width:640px) 90vw, (max-width:1000px) 45vw, 30vw" loading="lazy"/><span><Icon kind="arrow"/></span></div><h3>{product.name}</h3><p>{product.summary}</p></Link>)}</div></section>
  <section className={`${styles.section} ${styles.next}`}><h2>Discuss your EPP requirements.</h2><p>Share your application, dimensions and expected quantity. Our team will help with product selection and custom components.</p><div><Link href="/#contact">Request a quotation<Icon kind="arrow"/></Link><Link href="/products/">Explore all products<Icon kind="arrow"/></Link></div></section>
 </article>;
}
