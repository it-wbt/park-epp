import Link from 'next/link';
import ResponsiveImage from './ResponsiveImage';
import EppApplicationSelector from './EppApplicationSelector';
import {markets,activeProducts,marketSourceSlugs} from '../lib/catalog';
import {productVisual,productVisualAlt} from '../lib/content';
import type {IndustryStory} from '../lib/industry-stories';
import {Icon} from './ui';
import styles from './IndustryLanding.module.css';

const logisticsBuyerFaqs = [
 {question:'Why choose molded EPP trays over EPS (Thermocol) or corrugated boxes for industrial logistics?',answer:'Unlike single-use EPS or cardboard that crack or absorb moisture, EPP trays recover after repeated impacts and last 100+ returnable trips, lowering total packaging cost per shipment.'},
 {question:'Can Park Nonwoven customize EPP dunnage to fit existing VDA KLT, Galia, or plastic crates?',answer:'Yes, we design custom 3D-molded EPP inserts and dividers tailored to your exact outer container dimensions and part CAD drawings.'},
 {question:'Are EPP logistics boxes washable and resistant to shop-floor oils?',answer:'Yes, closed-cell EPP resists water, coolants, and industrial oils, and can be pressure-washed or steam-cleaned between trips.'},
];

export default function IndustryLanding({story}:{story:IndustryStory}){
 const market=markets.find(item=>item.slug===story.slug)!;
 const isLogistics=story.slug==='logistics-handling';
 const catalogue=activeProducts.filter(product=>marketSourceSlugs(story.slug).includes(product.marketSlug));
 const applications=story.applications.filter(application=>catalogue.some(product=>product.slug===application.productSlug));
 return <article className={styles.page}>
  <section className={styles.hero}><div><nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span aria-current="page">{market.name}</span></nav><p className={styles.eyebrow}>PARK INDUSTRY SOLUTIONS</p><h1>{isLogistics?<>Custom EPP trays<br/><span>for logistics &amp; material handling</span></>:<>{market.name}<br/><span>EPP solutions</span></>}</h1><p className={styles.lead}>{story.intro}</p><Link href="/#contact" className={styles.button}>Discuss your requirement<Icon kind="arrow"/></Link></div><ResponsiveImage src={story.heroImage} alt={story.heroAlt} width={720} height={540} sizes="(max-width:760px) 90vw, 45vw" fetchPriority="high"/></section>
  <section className={styles.section} aria-labelledby="application-title"><p className={styles.eyebrow}>FIND YOUR APPLICATION</p><h2 id="application-title">EPP for your application</h2><EppApplicationSelector key={market.slug} names={applications.map(application=>application.title)} panels={applications.map(application=>{
   const product=catalogue.find(item=>item.slug===application.productSlug)!;
   return <section className={styles.application} key={application.productSlug}><ResponsiveImage src={productVisual(product)} alt={productVisualAlt(product)} width={720} height={480} sizes="(max-width:760px) 90vw, 40vw" loading="lazy"/><div><h3>{application.title}</h3><p>{application.text}</p><ul><li><Link href={`/products/${product.slug}/`}>{product.name}<Icon kind="arrow"/></Link></li></ul><Link className={styles.textLink} href="/#contact">Request a quote<Icon kind="arrow"/></Link></div></section>;
  })}/><p className={styles.note}>Share your application, dimensions and quantity with PARK to discuss the right product fit.</p></section>
  <section className={styles.section} aria-labelledby="range-title"><p className={styles.eyebrow}>EXPLORE THE RANGE</p><h2 id="range-title">Products for {market.name.toLowerCase()}</h2><div className={styles.products}>{catalogue.map(product=><Link className={styles.product} key={product.slug} href={`/products/${product.slug}/`}><div className={styles.productImage}><ResponsiveImage src={productVisual(product)} alt={productVisualAlt(product)} width={480} height={360} sizes="(max-width:640px) 90vw, (max-width:1000px) 45vw, 30vw" loading="lazy"/><span><Icon kind="arrow"/></span></div><h3>{product.name}</h3><p>{product.summary}</p></Link>)}</div></section>
  {isLogistics&&<>
   <section className={`${styles.section} ${styles.logisticsSection}`} aria-labelledby="logistics-applications-title"><p className={styles.eyebrow}>PACKAGING FORMATS</p><h2 id="logistics-applications-title">EPP Trays, Returnable Dunnage &amp; Industrial Applications</h2><ul className={styles.logisticsApplications}>
    <li><strong>Returnable EPP Trays &amp; KLT/Galia Inserts</strong> for automotive and precision parts.</li>
    <li><Link href="/products/stackable-delivery-boxes/">Stackable Delivery Boxes</Link> and foldable thermal delivery boxes for cold chain and catering.</li>
    <li>Sensitive electronics and <Link href="/products/hard-disks-packaging/">Hard Disks Packaging</Link> trays with anti-static and shock-absorbing design options.</li>
    <li><Link href="/products/lithium-ion-cell-epp-trays/">Lithium-Ion Cell EPP Trays</Link> and battery module transit trays.</li>
    <li><strong>Reusable EPP Pallets, Crates &amp; Corner Protectors</strong> for returnable handling systems.</li>
   </ul></section>
   <section className={`${styles.section} ${styles.logisticsSection}`} aria-labelledby="logistics-capabilities-title"><p className={styles.eyebrow}>SPECIFY THE PACK</p><h2 id="logistics-capabilities-title">Technical Capabilities &amp; Packaging Benefits</h2><div className={styles.logisticsTableWrap} role="region" aria-label="EPP logistics packaging specifications" tabIndex={0}><table className={styles.logisticsTable}><tbody>
    <tr><th scope="row">Material</th><td>Closed-cell Expanded Polypropylene (EPP, Resin Code 5 — 100% recyclable)</td></tr>
    <tr><th scope="row">Density Options</th><td>20–200 g/L (standard returnable dunnage: 30–60 g/L)</td></tr>
    <tr><th scope="row">Operating Temperature</th><td>-40°C to +110°C</td></tr>
    <tr><th scope="row">Key Properties</th><td>Multi-impact elastic recovery, waterproof, oil/chemical resistant, and washable</td></tr>
    <tr><th scope="row">Reusability</th><td>Engineered for 100+ supply chain trips to cut per-trip cost vs single-use EPS/corrugated</td></tr>
   </tbody></table></div><p className={styles.logisticsRelatedGuides}>For material and cost comparisons, see the <Link href="/materials/epp-grade-selection/">EPP Grade Selection Guide</Link> and <Link href="/resources/epp-vs-eps-durability-cost-reusability/">EPP vs EPS Cost &amp; Reusability</Link>.</p></section>
   <section className={`${styles.section} ${styles.logisticsFaqs}`} aria-labelledby="logistics-faq-title"><p className={styles.eyebrow}>BUYER FAQs</p><h2 id="logistics-faq-title">Industrial EPP Logistics Packaging FAQs</h2>{logisticsBuyerFaqs.map(({question,answer})=><details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</section>
   <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'FAQPage',mainEntity:logisticsBuyerFaqs.map(({question,answer})=>({'@type':'Question',name:question,acceptedAnswer:{'@type':'Answer',text:answer}}))}).replace(/</g,'\\u003c')}}/>
  </>}
  <section className={`${styles.section} ${styles.next}`}><h2>Discuss your EPP requirements.</h2><p>Share your application, dimensions and expected quantity. Our team will help with product selection and custom components.</p><div><Link href="/#contact">Request a quotation<Icon kind="arrow"/></Link><Link href="/products/">Explore all products<Icon kind="arrow"/></Link></div></section>
 </article>;
}
