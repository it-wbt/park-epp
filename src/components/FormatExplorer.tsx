'use client';
import ResponsiveImage from './ResponsiveImage';
import Link from 'next/link';
import {useState} from 'react';
import {activeProducts,markets,marketSourceSlugs} from '../lib/catalog';
import {productVisual,productVisualAlt} from '../lib/content';
import {Icon} from './ui';
export default function FormatExplorer(){
 const [query,setQuery]=useState(''),[market,setMarket]=useState('');
 const shown=activeProducts.filter(product=>(!market||marketSourceSlugs(market).includes(product.marketSlug))&&`${product.name} ${product.market} ${product.summary} ${product.material}`.toLowerCase().includes(query.trim().toLowerCase()));
 return <section className="section format-explorer" id="standard-formats">
  <div className="section-heading"><div><p className="eyebrow">PARK PRODUCT RANGE</p><h2>Explore product families.</h2></div><p>Browse material options and applications across our four industries. Open a product family to explore the design priorities for your project.</p></div>
  <div className="filters">
   <label><span>Search products</span><input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Product, application or material…"/></label>
   <label><span>Industry</span><select value={market} onChange={event=>setMarket(event.target.value)}><option value="">All industries</option>{markets.map(industry=><option key={industry.slug} value={industry.slug}>{industry.name}</option>)}</select></label>
   <button className="text-link" type="button" onClick={()=>{setQuery('');setMarket('');}}>Reset filters</button>
  </div>
  <p className="result-meta" aria-live="polite">{shown.length} product {shown.length===1?'family':'families'}</p>
  <div className="format-grid">{shown.map(product=><article className="format-card" key={product.slug}>
   <Link href={`/products/${product.slug}/`}><ResponsiveImage src={productVisual(product)} alt={productVisualAlt(product)} loading="lazy"/><div><span className="eyebrow">{product.market}</span><h3>{product.name}</h3><p>{product.summary}</p><span className="format-material">{product.material}</span></div></Link>
   <Link href={`/products/${product.slug}/`} className="format-design-link">Explore {product.name.toLowerCase()} <Icon kind="arrow"/></Link>
  </article>)}</div>
  {!shown.length&&<p className="empty">No products match. Try a broader search.</p>}
 </section>;
}
