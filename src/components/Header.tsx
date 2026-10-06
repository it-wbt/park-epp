'use client';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import {Icon} from './ui';
import {navigation,MenuLink} from '../lib/navigation';
import {products,activeProducts} from '../lib/catalog';
import formatData from '../lib/reference-formats.json';
import {productVisual,productVisualAlt} from '../lib/content';

export function Brand(){return <Link href="/" className="park-brand" aria-label="PARK Nonwoven EPP home"><img src="/images/park-nonwoven-logo.png" alt="PARK Nonwoven" width="768" height="126"/><span>EPP & ENGINEERED MATERIALS</span></Link>;}
const lookup=(link:MenuLink)=>products.find(p=>link.href===`/products/${p.slug}/`);
const imageFor=(link:MenuLink,fallback:string)=>{const product=lookup(link);return product?productVisual(product):link.image||fallback;};
const industryIcons:Record<string,string>={'Sports, Leisure & Early Childhood':'ball','Logistics & Material Handling':'warehouse','HVAC':'fan','Automotive':'car'};
const categoryIcon=(label:string,name:string)=>industryIcons[name]||(/food/i.test(name)?'food':/logistics|packaging/i.test(name)?'box':/technical|expertise|hvac/i.test(name)?'wind':/building|insulation/i.test(name)?'factory':/mobility|aviation|appliance/i.test(name)?'car':/pool/i.test(name)?'waves':/furniture|sport|play|childhood/i.test(name)?'layers':label==='Solutions'?'leaf':label==='Resources'?'book':'layers');

export default function Header(){
 const [active,setActive]=useState<string|null>(null),[selected,setSelected]=useState(0),[application,setApplication]=useState(0),[featuredHref,setFeaturedHref]=useState<string|null>(null),[mobile,setMobile]=useState(false),[search,setSearch]=useState(false),[query,setQuery]=useState('');
 const root=useRef<HTMLElement>(null),timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const clear=()=>{if(timer.current)clearTimeout(timer.current);};
 const close=()=>{clear();setActive(null);setMobile(false);setSearch(false);};
 const hover=()=>matchMedia('(min-width: 901px) and (hover:hover)').matches;
 const select=(label:string)=>{clear();if(active!==label){setSelected(0);setApplication(label==='Our products'?-1:0);setFeaturedHref(null);}setActive(label);setSearch(false);};
 const chooseGroup=(index:number)=>{if(index===selected)return;setSelected(index);setApplication(active==='Our products'?-1:0);setFeaturedHref(null);};
 const chooseApplication=(index:number)=>{setApplication(index);setFeaturedHref(null);};
 useEffect(()=>{const escape=(e:KeyboardEvent)=>{if(e.key==='Escape')close();};document.addEventListener('keydown',escape);return()=>{document.removeEventListener('keydown',escape);clear();};},[]);
 useEffect(()=>{const header=root.current;if(!header)return;const update=()=>document.documentElement.style.setProperty('--banner-header-height',`${header.offsetHeight+(header.previousElementSibling?.getBoundingClientRect().height||0)}px`);const observer=new ResizeObserver(update);observer.observe(header);if(header.previousElementSibling)observer.observe(header.previousElementSibling);update();return()=>observer.disconnect();},[]);
 useEffect(()=>{if(!active&&!search)return;const update=()=>{const el=root.current;if(el)el.style.setProperty('--panel-top',`${el.getBoundingClientRect().bottom+8}px`);};update();window.addEventListener('resize',update);window.addEventListener('scroll',update,{passive:true});return()=>{window.removeEventListener('resize',update);window.removeEventListener('scroll',update);};},[active,search]);
 const groups=active?navigation[active]:undefined;
 const group=groups?.[selected]||groups?.[0]||null;
 const applications=active==='Our products'&&group ? Array.from(new Set(group.links.map(link=>lookup(link)?.market||group.name))).map(name=>({name,links:group.links.filter(link=>(lookup(link)?.market||group.name)===name)})) : group?.applications;
 const links=applications?applications[application]?.links:group?.links;
 const featured=links?.find(link=>link.href===featuredHref)||links?.[0];
 const featuredProduct=featured?lookup(featured):undefined;
 const found=query?activeProducts.filter(p=>`${p.name} ${p.market} ${p.material} ${formatData.filter(f=>f.familySlug===p.slug).map(f=>f.name).join(' ')}`.toLowerCase().includes(query.toLowerCase())).slice(0,8):[];
 const allHref=(label:string)=>label==='Industries'?'/markets/':label==='Our products'?'/products/':label==='Our expertise'?'/expertise/':label==='About us'?'/about/':`/${label.toLowerCase()}/`;
 return <>
  <div className="park-topbar"><span>Advanced materials. Meaningful possibilities.</span><Link href="/resources/standard-catalogue/">Explore our product catalogue ↗</Link></div>
  <header className="park-header" ref={root} onBlur={event=>{if(event.relatedTarget&&!event.currentTarget.contains(event.relatedTarget))setActive(null);}}>
   <div className="park-nav-wrap"><Brand/>
    <nav className={mobile?'park-nav is-open':'park-nav'} aria-label="Main navigation">
     {Object.keys(navigation).map(label=><div key={label} className="nav-dropdown" onMouseEnter={()=>{if(hover())select(label);}} onMouseLeave={()=>{if(hover()){clear();timer.current=setTimeout(()=>setActive(null),200);}}}>
      <button className={active===label?'nav-trigger active':'nav-trigger'} aria-expanded={active===label} aria-controls="park-mega" onClick={()=>{if(hover())select(label);else active===label?setActive(null):select(label);}}>{label}<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button>
      {active===label&&group&&<section id="park-mega" className={`mega-menu${label==='Our products'?' mega-products':' mega-mobility'}`} aria-label={`${label} navigation`} onMouseEnter={clear}>
       <div className="mega-categories"><p className="mega-eyebrow">{label}</p><div className="epp-category-options">
        {navigation[label].map((item,i)=><button key={item.name} className={'mega-category'+(i===selected?' selected':'')} aria-pressed={i===selected} onMouseEnter={()=>{if(hover())chooseGroup(i);}} onFocus={()=>chooseGroup(i)} onClick={()=>chooseGroup(i)}><span className="mega-icon"><Icon kind={categoryIcon(label,item.name)}/></span><span>{item.name}</span><span className="mega-category-arrow"><Icon kind="arrow"/></span></button>)}
       </div><Link href={allHref(label)} onClick={close} className="mega-all">Explore all {label==='Our products'?'products':label==='Our expertise'?'expertise':label.toLowerCase()} <Icon kind="arrow"/></Link></div>
       <div className="mega-details product-menu-details"><div className="mobility-intro"><div><span className="submenu-eyebrow">{active==='Our products'?'PRODUCT RANGE':'MATERIAL SOLUTIONS'}</span><h2>{group.name}</h2></div>{links&&<span className="solution-count">{links.length} product {links.length===1?'option':'options'}</span>}</div>
        <div className={applications?'industry-submenu-layout':'product-menu-body'}>
         {applications&&<div className="mobility-application-tabs" role="tablist" aria-label={`${group.name} applications`}>{applications.map((a,i)=><button key={a.name} role="tab" aria-selected={i===application} onMouseEnter={()=>{if(hover())chooseApplication(i);}} onFocus={()=>{if(hover())chooseApplication(i);}} onClick={()=>chooseApplication(i)}><span className="application-option-label">{a.name}</span><Icon kind="arrow"/></button>)}</div>}
         <div className="product-menu-links">{links?.slice(0,5).map(link=>{const p=lookup(link);return <Link key={`${link.name}-${link.href}`} className="product-menu-link" href={link.href} onClick={close} onMouseEnter={()=>setFeaturedHref(link.href)} onFocus={()=>setFeaturedHref(link.href)}>{p&&<img src={productVisual(p)} onError={event=>{if(!event.currentTarget.dataset.fallback){event.currentTarget.dataset.fallback='true';event.currentTarget.src=group.image;}}} alt="" width="44" height="44" loading="lazy"/>}<span><strong>{link.name}</strong>{p&&<small>{p.material}</small>}</span><Icon kind="arrow"/></Link>;})}{links&&<Link className="button small epp-explore-products" href={active==='Our products'?'/products/':group.href} onClick={close}>{active==='About us'?'Explore PARK':'Explore products'} <Icon kind="arrow"/></Link>}</div>
        </div>
       </div>
       <aside className="mega-feature product-menu-feature"><div className="product-menu-preview"><span className="submenu-eyebrow">PARK EPP &amp; ENGINEERED MATERIALS</span><img className="product-preview-image" src={featured?imageFor(featured,group.image):group.image} alt={featuredProduct?productVisualAlt(featuredProduct):`Illustrative ${group.name.toLowerCase()} manufacturing scene`} onError={event=>{if(!event.currentTarget.dataset.fallback){event.currentTarget.dataset.fallback='true';event.currentTarget.src=group.image;}}}/><h3>{featured?.name||group.name}</h3>{featuredProduct&&<p>{featuredProduct.material}</p>}<Link className="button small" href={featured?.href||group.href} onClick={close}>{featuredProduct?'View product':'Discover more'} <Icon kind="arrow"/></Link></div><div className="mega-catalogue"><Link href={label==='Our products'?'/products/':group.href} onClick={close}><span>{label==='Our products'?'Explore all EPP products':`Explore ${group.name.toLowerCase()}`}</span><Icon kind="arrow"/></Link></div></aside>
      </section>}
     </div>)}
    </nav>
    <div className="park-nav-actions"><button className="icon-button" aria-label="Search catalogue" onClick={()=>{setActive(null);setSearch(!search);}}><Icon kind="search"/></button><Link href="/contact/" className="button compact park-contact-button" onClick={close}>Let’s talk <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 7h10v10M7 17 17 7"/></svg></Link><button className="icon-button park-mobile-button" aria-label="Toggle navigation" aria-expanded={mobile} onClick={()=>{setMobile(!mobile);setActive(null);}}><Icon kind={mobile?'close':'menu'}/></button></div>
   </div>
   {search&&<section className="park-search-panel" aria-label="Search"><div className="search-input"><Icon kind="search"/><input autoFocus type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search products, industries or materials…" aria-label="Search products"/><button className="icon-button" aria-label="Close search" onClick={()=>setSearch(false)}><Icon kind="close"/></button></div><div className="search-results">{found.map(p=><Link key={p.slug} href={`/products/${p.slug}/`} onClick={close}>{p.name}<small>{p.market} →</small></Link>)}</div>{query&&!found.length&&<p>No results. Try EPP, foam, food or insulation.</p>}<Link href="/products/" onClick={close}>Explore the full catalogue →</Link></section>}
  </header>
  {active&&<button className="mega-backdrop" tabIndex={-1} aria-label="Close expanded navigation" onClick={()=>setActive(null)}/>}
 </>;
}
