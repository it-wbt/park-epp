'use client';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import {Icon} from './ui';
import {navigation,MenuLink} from '../lib/navigation';
import {products} from '../lib/catalog';
import {productVisual} from '../lib/content';

export function Brand(){return <Link href="/" className="park-brand" aria-label="PARK Nonwoven EPP home"><img src="/images/park-nonwoven-logo.png" alt="PARK Nonwoven" width="768" height="126"/><span>EPP & ENGINEERED MATERIALS</span></Link>;}
const lookup=(link:MenuLink)=>products.find(p=>link.href===`/products/${p.slug}/`);
const imageFor=(link:MenuLink,fallback:string)=>{const product=lookup(link);return product?productVisual(product):link.image||fallback;};
const categoryIcon=(label:string,name:string)=>/food/i.test(name)?'food':/logistics|packaging/i.test(name)?'box':/technical|expertise|hvac/i.test(name)?'wind':/building|insulation/i.test(name)?'factory':/mobility|aviation|appliance/i.test(name)?'car':/pool/i.test(name)?'waves':/furniture|sport|play|childhood/i.test(name)?'layers':label==='Solutions'?'leaf':label==='Resources'?'book':'layers';

export default function Header(){
 const [active,setActive]=useState<string|null>(null),[selected,setSelected]=useState(0),[application,setApplication]=useState(0),[featuredHref,setFeaturedHref]=useState<string|null>(null),[mobile,setMobile]=useState(false),[search,setSearch]=useState(false),[query,setQuery]=useState('');
 const root=useRef<HTMLElement>(null),timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const clear=()=>{if(timer.current)clearTimeout(timer.current);};
 const close=()=>{clear();setActive(null);setMobile(false);setSearch(false);};
 const hover=()=>matchMedia('(min-width: 901px) and (hover:hover)').matches;
 const select=(label:string)=>{clear();if(active!==label){setSelected(0);setApplication(0);setFeaturedHref(null);}setActive(label);setSearch(false);};
 const chooseGroup=(index:number)=>{setSelected(index);setApplication(0);setFeaturedHref(null);};
 const chooseApplication=(index:number)=>{setApplication(index);setFeaturedHref(null);};
 useEffect(()=>{const escape=(e:KeyboardEvent)=>{if(e.key==='Escape')close();};document.addEventListener('keydown',escape);return()=>{document.removeEventListener('keydown',escape);clear();};},[]);
 useEffect(()=>{if(!active&&!search)return;const update=()=>{const el=root.current;if(el)el.style.setProperty('--panel-top',`${el.getBoundingClientRect().bottom+8}px`);};update();window.addEventListener('resize',update);window.addEventListener('scroll',update,{passive:true});return()=>{window.removeEventListener('resize',update);window.removeEventListener('scroll',update);};},[active,search]);
 const group=active?navigation[active][selected]:null;
 const links=group?.applications?group.applications[application]?.links:group?.links;
 const featured=links?.find(link=>link.href===featuredHref)||links?.[0];
 const featuredProduct=featured?lookup(featured):undefined;
 const found=query?products.filter(p=>`${p.name} ${p.market} ${p.material}`.toLowerCase().includes(query.toLowerCase())).slice(0,8):[];
 const allHref=(label:string)=>label==='Markets'?'/markets/':label==='Our products'?'/products/':label==='Our expertise'?'/expertise/':label==='About us'?'/about/':`/${label.toLowerCase()}/`;
 return <>
  <div className="park-topbar"><span>Advanced materials. Meaningful possibilities.</span><Link href="/resources/standard-catalogue/">Explore our product catalogue ↗</Link></div>
  <header className="park-header" ref={root} onBlur={event=>{if(event.relatedTarget&&!event.currentTarget.contains(event.relatedTarget))setActive(null);}}>
   <div className="park-nav-wrap"><Brand/>
    <nav className={mobile?'park-nav is-open':'park-nav'} aria-label="Main navigation">
     {Object.keys(navigation).map(label=><div key={label} className="park-dropdown" onMouseEnter={()=>{if(hover())select(label);}} onMouseLeave={()=>{if(hover()){clear();timer.current=setTimeout(()=>setActive(null),200);}}}>
      <button className={active===label?'park-nav-trigger active':'park-nav-trigger'} aria-expanded={active===label} aria-controls="park-mega" onClick={()=>{if(hover())select(label);else active===label?setActive(null):select(label);}}>{label}<span aria-hidden="true">⌄</span></button>
      {active===label&&group&&<section id="park-mega" className={`park-mega park-mega-compact${label==='Our products'?' park-mega-products':''}`} aria-label={`${label} navigation`} onMouseEnter={clear}>
       <div className="park-category-rail"><p className="eyebrow">{label}</p><div className="park-rail-options">
        {navigation[label].map((item,i)=><button key={item.name} className={i===selected?'selected':''} aria-pressed={i===selected} onMouseEnter={()=>{if(hover())chooseGroup(i);}} onFocus={()=>chooseGroup(i)} onClick={()=>chooseGroup(i)}><span className="park-option-icon"><Icon kind={categoryIcon(label,item.name)}/></span><span>{item.name}</span><Icon kind="arrow"/></button>)}
       </div><Link href={allHref(label)} onClick={close} className="park-view-all">Explore all {label==='Our products'?'products':label==='Our expertise'?'expertise':label.toLowerCase()} <Icon kind="arrow"/></Link></div>
       <div className="park-menu-content"><div className="park-menu-title"><h2>{group.name}</h2></div>
        <div className={group.applications?'park-nested':'park-menu-links-only'}>
         {group.applications&&<div className="park-application-rail" role="tablist" aria-label={`${group.name} applications`}>{group.applications.map((a,i)=><button key={a.name} role="tab" aria-selected={i===application} onMouseEnter={()=>{if(hover())chooseApplication(i);}} onClick={()=>chooseApplication(i)}>{a.name}<Icon kind="arrow"/></button>)}</div>}
         <div className="park-menu-links">{links?.map(link=>{const p=lookup(link);return <Link key={link.href} className={p?'park-menu-product-link':'park-menu-simple-link'} href={link.href} onClick={close} onMouseEnter={()=>setFeaturedHref(link.href)} onFocus={()=>setFeaturedHref(link.href)}>{p&&<img src={productVisual(p)} alt="" width="44" height="44" loading="lazy"/>}<span><strong>{link.name}</strong>{p&&<small>{p.material}</small>}</span><Icon kind="arrow"/></Link>;})}</div>
        </div>
       </div>
       <aside className="park-menu-feature"><div className="park-product-preview"><img className="park-preview-image" src={featured?imageFor(featured,group.image):group.image} alt={featured?.name||group.name}/><h3>{featured?.name||group.name}</h3>{featuredProduct&&<p>{featuredProduct.material}</p>}<Link className="button" href={featured?.href||group.href} onClick={close}>{featuredProduct?'View product':'Discover more'} <Icon kind="arrow"/></Link></div><Link className="park-catalogue-link" href={label==='Our products'?'/products/':group.href} onClick={close}><span>{label==='Our products'?'Explore all EPP products':`Explore ${group.name.toLowerCase()}`}</span><span className="park-catalogue-arrow">↗</span></Link></aside>
      </section>}
     </div>)}
    </nav>
    <div className="park-nav-actions"><button className="icon-button" aria-label="Search catalogue" onClick={()=>{setActive(null);setSearch(!search);}}><Icon kind="search"/></button><Link href="/contact/" className="button compact" onClick={close}>Let’s talk <Icon kind="arrow"/></Link><button className="icon-button park-mobile-button" aria-label="Toggle navigation" aria-expanded={mobile} onClick={()=>{setMobile(!mobile);setActive(null);}}><Icon kind={mobile?'close':'menu'}/></button></div>
   </div>
   {search&&<section className="park-search-panel" aria-label="Search"><div className="search-input"><Icon kind="search"/><input autoFocus type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search products, industries or materials…" aria-label="Search products"/><button className="icon-button" aria-label="Close search" onClick={()=>setSearch(false)}><Icon kind="close"/></button></div><div className="search-results">{found.map(p=><Link key={p.slug} href={`/products/${p.slug}/`} onClick={close}>{p.name}<small>{p.market} →</small></Link>)}</div>{query&&!found.length&&<p>No results. Try EPP, foam, food or insulation.</p>}<Link href="/products/" onClick={close}>Explore the full catalogue →</Link></section>}
  </header>
  {active&&<button className="park-menu-backdrop" tabIndex={-1} aria-label="Close expanded navigation" onClick={()=>setActive(null)}/>}
 </>;
}
