'use client';

import Link from 'next/link';
import {useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent} from 'react';
import {Icon} from './ui';
import {navigation, type MenuLink} from '../lib/navigation';
import {products, activeProducts} from '../lib/catalog';
import {productVisual, productVisualAlt} from '../lib/content';

export function Brand() {
  return <Link href="/" className="park-brand" aria-label="PARK Nonwoven EPP home"><img src="/images/park-nonwoven-logo.png" alt="PARK Nonwoven" width={768} height={126}/></Link>;
}

const menuLabels = ['Industries', 'Our products'] as const;
type MenuLabel = typeof menuLabels[number];
const menuId = (label: MenuLabel) => label === 'Industries' ? 'industries' : 'products';
const lookup = (link: MenuLink) => products.find(product => link.href === `/products/${product.slug}/`);
const industryIcons: Record<string, string> = {'Sports, Leisure & Early Childhood': 'ball', 'Logistics & Material Handling': 'warehouse', HVAC: 'fan', Automotive: 'car'};
const categoryIcon = (name: string) => industryIcons[name] || (/logistics|packaging/i.test(name) ? 'box' : /technical/i.test(name) ? 'wind' : 'layers');
const UpRight = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 7h10v10M7 17 17 7"/></svg>;

export default function Header() {
  const [active, setActive] = useState<MenuLabel | null>(null);
  const [selected, setSelected] = useState(0);
  const [featuredHref, setFeaturedHref] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState('');
  const root = useRef<HTMLElement>(null);
  const mobileButton = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clear = () => { if (timer.current) clearTimeout(timer.current); };
  const hover = () => matchMedia('(min-width: 761px) and (hover: hover)').matches;
  const close = () => { clear(); setActive(null); setMobile(false); setSearch(false); };
  const select = (label: MenuLabel) => {
    clear();
    if (active !== label) { setSelected(0); setFeaturedHref(null); }
    setActive(label); setSearch(false);
  };
  const chooseGroup = (index: number) => { setSelected(index); setFeaturedHref(null); };
  const restoreTrigger = () => {
    if (matchMedia('(max-width: 760px)').matches) mobileButton.current?.focus();
    else root.current?.querySelector<HTMLButtonElement>('#park-trigger-products')?.focus();
  };

  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      const trigger = root.current?.querySelector<HTMLButtonElement>('.nav-trigger[aria-expanded="true"]')
        || (root.current?.querySelector('.park-search-panel') ? root.current.querySelector<HTMLButtonElement>('#park-trigger-products') : null);
      if (!trigger && !root.current?.querySelector('.park-nav.is-open')) return;
      clear(); setActive(null); setMobile(false); setSearch(false);
      if (matchMedia('(max-width: 760px)').matches) mobileButton.current?.focus();
      else trigger?.focus();
    };
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('keydown', escape); clear(); };
  }, []);

  useEffect(() => {
    const header = root.current;
    if (!header) return;
    const update = () => {
      document.documentElement.style.setProperty('--banner-header-height', `${header.offsetHeight + (header.previousElementSibling?.getBoundingClientRect().height || 0)}px`);
      header.style.setProperty('--panel-top', `${header.getBoundingClientRect().bottom + 8}px`);
    };
    const observer = new ResizeObserver(update);
    observer.observe(header);
    if (header.previousElementSibling) observer.observe(header.previousElementSibling);
    const breakpoint = matchMedia('(min-width: 761px)');
    const resetNavigation = () => { setMobile(false); setActive(null); setSearch(false); update(); };
    breakpoint.addEventListener('change', resetNavigation);
    window.addEventListener('scroll', update, {passive: true});
    window.addEventListener('resize', update);
    update();
    return () => {
      observer.disconnect(); breakpoint.removeEventListener('change', resetNavigation);
      window.removeEventListener('scroll', update); window.removeEventListener('resize', update);
    };
  }, []);

  function navigateCategories(event: ReactKeyboardEvent<HTMLButtonElement>, index: number) {
    if (!active) return;
    const count = navigation[active].length;
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? count - 1
      : ['ArrowRight', 'ArrowDown'].includes(event.key) ? (index + 1) % count
      : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? (index - 1 + count) % count : -1;
    if (next < 0) return;
    event.preventDefault(); chooseGroup(next);
    root.current?.querySelector<HTMLButtonElement>(`#park-${menuId(active)}-category-${next}`)?.focus();
  }

  const group = active ? navigation[active][selected] || navigation[active][0] : null;
  const links = group?.links || [];
  const featured = links.find(link => link.href === featuredHref) || links[0];
  const featuredProduct = featured ? lookup(featured) : undefined;
  const found = query.trim() ? activeProducts.filter(product => `${product.name} ${product.market} ${product.material}`.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 8) : [];

  return <>
    <div className="park-topbar"><span>Advanced materials. Meaningful possibilities.</span><Link href="/resources/standard-catalogue/">Explore our product catalogue <UpRight/></Link></div>
    <header className="park-header" ref={root} onBlur={event => { if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setActive(null); }}>
      <div className="park-nav-wrap">
        <Brand/>
        <nav id="park-navigation" className={mobile ? 'park-nav is-open' : 'park-nav'} aria-label="Main navigation">
          <Link className="park-nav-link" href="/about/" onClick={close} onMouseEnter={() => setActive(null)}>About us</Link>
          {menuLabels.map(label => <div key={label} className="nav-dropdown" onMouseEnter={() => { if (hover()) select(label); }} onMouseLeave={() => { if (hover()) { clear(); timer.current = setTimeout(() => setActive(null), 180); } }}>
            <button id={`park-trigger-${menuId(label)}`} className={active === label ? 'nav-trigger active' : 'nav-trigger'} aria-expanded={active === label} aria-controls={`park-mega-${menuId(label)}`} onClick={() => { if (hover()) select(label); else active === label ? setActive(null) : select(label); }}>
              {label}<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            {active === label && group && <section id={`park-mega-${menuId(label)}`} className={`mega-menu ${label === 'Our products' ? 'mega-products' : 'mega-mobility'}`} aria-label={`${label} navigation`} onMouseEnter={clear}>
              <div className="mega-categories">
                <p className="mega-eyebrow">{label}</p>
                <div className="epp-category-options" role="tablist" aria-orientation="vertical" aria-label={`${label} categories`}>
                  {navigation[label].map((item, index) => <button key={item.name} id={`park-${menuId(label)}-category-${index}`} className={`mega-category${index === selected ? ' selected' : ''}`} role="tab" aria-selected={index === selected} aria-controls={`park-${menuId(label)}-results`} tabIndex={index === selected ? 0 : -1} onKeyDown={event => navigateCategories(event, index)} onMouseEnter={() => { if (hover()) chooseGroup(index); }} onFocus={() => { if (hover()) chooseGroup(index); }} onClick={() => chooseGroup(index)}>
                    <span className="mega-icon"><Icon kind={categoryIcon(item.name)}/></span><span>{item.name}</span><span className="mega-category-arrow"><Icon kind="arrow"/></span>
                  </button>)}
                </div>
                <Link href={label === 'Industries' ? '/markets/' : '/products/'} onClick={close} className="mega-all">Explore all {label === 'Industries' ? 'industries' : 'products'} <Icon kind="arrow"/></Link>
                {label === 'Our products' && <button className="park-catalogue-search" onClick={() => { clear(); setSearch(true); setActive(null); setMobile(false); }}><Icon kind="search"/>Search catalogue</button>}
              </div>
              <div id={`park-${menuId(label)}-results`} className="mega-details product-menu-details" role="tabpanel" aria-labelledby={`park-${menuId(label)}-category-${selected}`} tabIndex={0}>
                <div className="mobility-intro"><div><span className="submenu-eyebrow">{label === 'Our products' ? 'PRODUCT RANGE' : 'MATERIAL SOLUTIONS'}</span><h2>{group.name}</h2></div><span className="solution-count">{links.length} product {links.length === 1 ? 'option' : 'options'}</span></div>
                <div className="product-menu-links">
                  {links.slice(0, 5).map(link => { const product = lookup(link); return <Link key={link.href} className="product-menu-link" href={link.href} onClick={close} onMouseEnter={() => setFeaturedHref(link.href)} onFocus={() => setFeaturedHref(link.href)}>
                    {product && <img src={productVisual(product)} alt="" width={56} height={56} loading="lazy"/>}
                    <span><strong>{link.name}</strong><small>{product?.material || link.description}</small></span><Icon kind="arrow"/>
                  </Link>; })}
                </div>
                <Link className="epp-explore-products" href={label === 'Our products' ? '/products/' : group.href} onClick={close}>Explore products <Icon kind="arrow"/></Link>
              </div>
              <aside className="mega-feature product-menu-feature">
                {label === 'Industries' ? <div className="mega-feature-card"><img src={group.image} alt={`${group.name} product manufacturing`} width={480} height={600}/><div className="mega-feature-copy"><span className="mega-eyebrow">Products &amp; solutions</span><h3>{group.name}</h3><Link className="button small" href={group.href} onClick={close}>Explore <Icon kind="arrow"/></Link></div></div>
                  : <div className="product-menu-preview"><span className="submenu-eyebrow">PARK EPP &amp; ENGINEERED MATERIALS</span><img src={featuredProduct ? productVisual(featuredProduct) : group.image} alt={featuredProduct ? productVisualAlt(featuredProduct) : group.name} width={320} height={240}/><h3>{featured?.name || group.name}</h3>{featuredProduct && <p>{featuredProduct.material}</p>}<Link className="button small" href={featured?.href || group.href} onClick={close}>View product <Icon kind="arrow"/></Link></div>}
                <div className="mega-catalogue"><Link href="/products/" onClick={close}><span>Explore all EPP products</span><UpRight/></Link></div>
              </aside>
            </section>}
          </div>)}
          <Link className="park-nav-link" href="/expertise/" onClick={close} onMouseEnter={() => setActive(null)}>Our technology</Link>
          <Link href="/contact/" className="button small park-contact-button" onClick={close} onMouseEnter={() => setActive(null)}>Let’s talk <UpRight/></Link>
        </nav>
        <button ref={mobileButton} className="park-mobile-button" aria-label={mobile ? 'Close menu' : 'Open menu'} aria-expanded={mobile} aria-controls="park-navigation" onClick={() => { setMobile(!mobile); setActive(null); setSearch(false); }}><Icon kind={mobile ? 'close' : 'menu'}/></button>
      </div>
      {search && <section className="park-search-panel" aria-label="Search catalogue">
        <div className="search-input"><Icon kind="search"/><input autoFocus type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search products, industries or materials…" aria-label="Search products"/><button className="icon-button" aria-label="Close search" onClick={() => { setSearch(false); restoreTrigger(); }}><Icon kind="close"/></button></div>
        <div className="search-results">{found.map(product => <Link key={product.slug} href={`/products/${product.slug}/`} onClick={close}>{product.name}<small>{product.market} →</small></Link>)}</div>
        {query.trim() && !found.length && <p>No results. Try EPP, HVAC, packaging or sports.</p>}
        <Link href="/products/" onClick={close}>Explore the full catalogue →</Link>
      </section>}
    </header>
    {(active || search) && <button className="mega-backdrop" tabIndex={-1} aria-label="Close expanded navigation" onClick={() => { setActive(null); setSearch(false); }}/>}
  </>;
}
