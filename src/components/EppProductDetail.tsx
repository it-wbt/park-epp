import Link from 'next/link';
import {marketSourceSlugs, products, publicMarketFor} from '../lib/catalog';
import {marketGuides, productCopy, type Product} from '../lib/content';
import {Enquiry, Icon, ProductCard} from './ui';
import ProductFaq from './ProductFaq';
import ProductImage from './ProductImage';
import styles from './EppProductDetail.module.css';

const specificationItems = [
  'Dimensions, interfaces and available space in the complete assembly.',
  'Operating temperatures, handling conditions and anticipated loading.',
  'Expected quantities, reuse cycle and recovery arrangements.',
  'Relevant acceptance criteria and the evidence needed for approval.',
];

export default function EppProductDetail({product}: {product: Product}) {
  const marketSlug = publicMarketFor(product.marketSlug)?.slug || product.marketSlug;
  const guide = marketGuides[product.marketSlug];
  const focus = productCopy[product.name]?.focus || ['Geometry and fit', 'Material and processing', 'Validation criteria'];
  const related = products.filter(item => marketSourceSlugs(marketSlug).includes(item.marketSlug) && item.slug !== product.slug).slice(0, 3);

  return <article className={styles.page}>
    <section className={styles.introduction} aria-labelledby="product-title">
      <Link className={styles.eyebrow} href={`/markets/${marketSlug}/`}>{product.market} <span aria-hidden="true">↗</span></Link>
      <h1 id="product-title">{product.name}</h1>
      <p>{product.summary}</p>
      <a className={styles.button} href="#enquire">Discuss your requirement <Icon kind="arrow"/></a>
    </section>

    <nav className={styles.navigation} aria-label="Product page sections">
      <a href="#understand-product">The solution</a>
      <a href="#product-range">Product overview</a>
      <a href="#technical-options">Technical options</a>
      <a href="#product-applications">Applications</a>
      <a href="#enquire">Contact our team</a>
    </nav>

    <section className={styles.explanation} id="understand-product" aria-labelledby="product-explanation-heading">
      <div>
        <h2 id="product-explanation-heading">Designed around the application.</h2>
        <p>{product.application}</p>
      </div>
      <div>
        <h2>From a family to a finished product.</h2>
        <p>This page introduces a product family. Final geometry, grade and processing route should be developed around the application. Request samples and a validation plan before making performance or suitability claims.</p>
      </div>
    </section>

    <section className={styles.range} id="product-range" aria-labelledby="product-range-heading">
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>EXPLORE THE PARK RANGE</p>
        <h2 id="product-range-heading">Material shaped around your needs.</h2>
        <p>Take a closer look at the product family, then discuss the format and specification for your application.</p>
      </div>
      <div className={styles.overview}>
        <div className={styles.visual}><ProductImage product={product}/></div>
        <div className={styles.overviewCopy}>
          <p className={styles.eyebrow}>PARK EPP & ENGINEERED MATERIALS</p>
          <h3>{product.name}</h3>
          <Link className={styles.industry} href={`/markets/${marketSlug}/`}>{product.market} <Icon kind="arrow"/></Link>
          <h4>Material options</h4>
          <p>{product.material}</p>
          <h4>Design priorities</h4>
          <ul className={styles.features}>{focus.map(item => <li key={item}><Icon kind="check"/>{item}</li>)}</ul>
          <a className={styles.button} href="#enquire">Discuss this product <Icon kind="arrow"/></a>
          <p className={styles.note}>Material grades, dimensions, availability and compliance are subject to supplier confirmation.</p>
        </div>
      </div>
    </section>

    <section className={styles.technical} id="technical-options" aria-labelledby="technical-options-heading">
      <p className={styles.eyebrow}>FROM PRODUCT FAMILY TO SPECIFICATION</p>
      <h2 id="technical-options-heading">Technical options</h2>
      <dl className={styles.specifications}>
        <div><dt>Material options</dt><dd>{product.material}</dd></div>
        <div><dt>Application</dt><dd>{product.market}</dd></div>
        {focus.map(item => <div key={item}><dt>Design requirement</dt><dd>{item}</dd></div>)}
        <div><dt>Project information</dt><dd>Drawing, dimensions, quantity, operating conditions and acceptance criteria.</dd></div>
      </dl>
      <p className={styles.note}>The final specification is defined around your brief. Confirm the selected grade, dimensions and validation requirements for the finished component.</p>
    </section>

    <section className={styles.application} id="product-applications" aria-labelledby="product-applications-heading">
      <p className={styles.eyebrow}>BUILT AROUND YOUR APPLICATION</p>
      <h2 id="product-applications-heading">Make the whole journey part of the brief.</h2>
      <p>{guide.overview}</p>
      <div className={styles.applicationLinks}>{guide.applications.map(item => <Link key={item} href={`/markets/${marketSlug}/`}>{item} <span aria-hidden="true">↗</span></Link>)}</div>
    </section>

    <section className={styles.selection} aria-labelledby="product-selection-heading">
      <div><p className={styles.eyebrow}>BEFORE YOU SELECT</p><h2 id="product-selection-heading">Build a clearer specification.</h2><Link className={styles.textLink} href="/materials/">Explore materials <Icon kind="arrow"/></Link></div>
      <ol>{specificationItems.map(item => <li key={item}>{item}</li>)}</ol>
    </section>

    <div className={styles.faq}><ProductFaq product={product.name} questions={[
      ['What should the initial brief include?', `${focus.join('. ')}. Share your drawing, intended use and expected quantities so the specification can be developed around the complete application.`],
      ...guide.faq,
    ]}/></div>

    <section id="enquire" className={styles.enquiry} aria-labelledby="product-enquiry-heading">
      <div><p className={styles.eyebrow}>MAKE THE NEXT STEP USEFUL</p><h2 id="product-enquiry-heading">Your project.<br/>A clearer brief.</h2><p>Create a downloadable enquiry for this product family.</p></div>
      <Enquiry product={product.name}/>
    </section>

    {related.length > 0 && <section className={styles.related} aria-labelledby="related-products-heading">
      <div className={styles.relatedHeading}><h2 id="related-products-heading">Related possibilities.</h2><Link className={styles.textLink} href="/products/">All products <Icon kind="arrow"/></Link></div>
      <div className="product-grid">{related.map(item => <ProductCard key={item.slug} product={item}/>)}</div>
    </section>}
  </article>;
}
