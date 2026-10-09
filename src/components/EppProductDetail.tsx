import ResponsiveImage from './ResponsiveImage';
import Link from 'next/link';
import {marketSourceSlugs,products,publicMarketFor} from '../lib/catalog';
import {productVisual,productVisualAlt,productCopy,type Product} from '../lib/content';
import salesCopy from '../lib/product-sales-copy.json';
import {Icon} from './ui';
import ProductImage from './ProductImage';
import ProductQuoteForm from './ProductQuoteForm';
import styles from './EppProductDetail.module.css';

export default function EppProductDetail({product}:{product:Product}) {
 const marketSlug=publicMarketFor(product.marketSlug)?.slug || product.marketSlug;
 const copy=salesCopy[product.slug as keyof typeof salesCopy];
 const related=products.filter(item=>marketSourceSlugs(marketSlug).includes(item.marketSlug)&&item.slug!==product.slug).slice(0,3);
 return <article className={styles.page}>
  <section className={styles.hero} aria-labelledby="product-title">
   <div className={styles.visual}><ProductImage product={product}/></div>
   <div className={styles.productCopy}>
    <Link className={styles.eyebrow} href={`/markets/${marketSlug}/`}>{product.market}</Link>
    <h1 id="product-title">{product.name}</h1>
    <span className={styles.material}>EPP · Expanded Polypropylene</span>
    <p>{copy?.summary || product.summary}</p>
    <ul className={styles.features}>{(copy?.benefits || ['Lightweight construction','Moulded product fit','Resilient foam structure']).map(item=><li key={item}><Icon kind="check"/>{item}</li>)}</ul>
    <div className={styles.actions}><a className={styles.button} href="#enquire">Get a quote <Icon kind="arrow"/></a><a className={styles.email} href={`mailto:sales@parknonwoven.com?subject=${encodeURIComponent(product.name+' enquiry')}`}>Email our team</a></div>
    {copy && <p className={styles.uses}><strong>Ideal for</strong> {copy.uses}.</p>}
   </div>
  </section>
  <section className={styles.details} aria-labelledby="product-details-heading">
   <div><p className={styles.eyebrow}>A CLOSER LOOK</p><h2 id="product-details-heading">Why choose this product?</h2><p>{copy?.detail}</p></div>
   <div className={styles.detailsCard}><h3>Product details</h3><dl>
    <div><dt>Material</dt><dd>Expanded Polypropylene (EPP)</dd></div>
    <div><dt>Design features</dt><dd>{(productCopy[product.name]?.focus || ['Moulded fit','Lightweight structure']).join(' · ')}</dd></div>
    <div><dt>Your requirement</dt><dd>Share the size, quantity and intended use for a product-specific quote.</dd></div>
   </dl></div>
  </section>
  <section id="enquire" className={styles.enquiry} aria-labelledby="product-enquiry-heading">
   <div><p className={styles.eyebrow}>LET’S TALK</p><h2 id="product-enquiry-heading">Get your quote.</h2><p>Share your quantity and size requirements.</p></div>
   <ProductQuoteForm product={product.name}/>
  </section>
  {related.length>0 && <section className={styles.related} aria-labelledby="related-products-heading">
   <div className={styles.relatedHeading}><h2 id="related-products-heading">You may also need</h2><Link className={styles.email} href="/products/">All products <Icon kind="arrow"/></Link></div>
   <div className={styles.relatedGrid}>{related.map(item=><Link key={item.slug} href={`/products/${item.slug}/`} className={styles.relatedCard}><ResponsiveImage src={productVisual(item)} alt={productVisualAlt(item)} width={480} height={320} loading="lazy"/><span>{item.name}<Icon kind="arrow"/></span></Link>)}</div>
  </section>}
 </article>;
}
