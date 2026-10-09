'use client';
import ResponsiveImage from './ResponsiveImage';

import {useState} from 'react';
import Link from 'next/link';
import {activeProducts} from '../lib/catalog';
import {productVisual} from '../lib/content';
import {Icon} from './ui';

const selections = [
  {slug:'stackable-delivery-boxes',image:'/images/products/highlight-delivery-transparent.png',label:'Delivery boxes'},
  {slug:'custom-hvac-components',image:'/images/products/highlight-hvac-transparent.png',label:'HVAC components'},
  {slug:'vehicle-protective-inserts',image:'/images/products/highlight-vehicle-transparent.png',label:'Vehicle inserts'},
  {slug:'sports-helmet-foam-liners',image:'/images/products/highlight-helmet-transparent.png',label:'Helmet liners'},
  {slug:'custom-cushioning-foams',image:'/images/products/highlight-cushioning-transparent.png',label:'Protective cushioning'},
];
const highlights = selections.flatMap(selection => {
  const product = activeProducts.find(item => item.slug === selection.slug);
  return product ? [{...selection,image:productVisual(product),product}] : [];
});
const Chevron = ({left=false}: {left?:boolean}) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d={left ? 'm15 5-7 7 7 7' : 'm9 5 7 7-7 7'}/></svg>;

export default function ProductHighlights() {
  const [active,setActive] = useState(0);
  if (!highlights.length) return null;
  const {product,image} = highlights[active];
  const move = (direction:number) => setActive(index => (index + direction + highlights.length) % highlights.length);
  return <section className="product-highlights" aria-labelledby="product-highlights-title" aria-roledescription="carousel">
    <div className="highlights-heading"><div><h2 id="product-highlights-title">Product highlights</h2><span className="highlights-heading-rule"/></div><Link href="/products/">View all products <Icon kind="arrow"/></Link></div>
    <div className="highlights-stage">
      <button className="highlights-prev highlights-arrow" onClick={()=>move(-1)} aria-label="Previous highlighted product"><Chevron left/></button>
      <div key={product.slug} className="highlights-slide" aria-live="polite" aria-atomic="true">
        <div className="highlights-copy"><span className="highlights-category"><i/>PARK EPP / {product.market}</span><h3>{product.name}</h3><p>{product.summary}</p><Link href={`/products/${product.slug}/`} className="highlights-learn">Explore product <Icon kind="arrow"/></Link></div>
        <Link className="highlights-image" href={`/products/${product.slug}/`} aria-label={`Explore ${product.name}`}><ResponsiveImage src={image} alt={`Illustrative product formats for ${product.name.toLowerCase()}`} width={640} height={480} loading="lazy"/></Link>
      </div>
      <button className="highlights-next highlights-arrow" onClick={()=>move(1)} aria-label="Next highlighted product"><Chevron/></button>
    </div>
    <div className="highlights-bottom"><span>{String(active+1).padStart(2,'0')}<span> / {String(highlights.length).padStart(2,'0')}</span></span><div className="highlights-dots" role="group" aria-label="Choose a highlighted product">{highlights.map((item,index)=><button key={item.slug} aria-label={`Show ${item.product.name}`} aria-pressed={active===index} onClick={()=>setActive(index)}><span className="highlights-selector-number">{String(index+1).padStart(2,'0')}</span><span className="highlights-selector-name">{item.label}</span></button>)}</div></div>
  </section>;
}
