'use client';

import Link from 'next/link';
import {useEffect, useRef, useState, type KeyboardEvent, type MouseEvent} from 'react';
import {articles} from '../lib/catalog';
import {Icon} from './ui';
import styles from './HomeResources.module.css';

const featuredGuides = ['epp-or-eps', 'design-for-reuse']
  .map(slug => articles.find(article => article.slug === slug))
  .filter((article): article is typeof articles[number] => Boolean(article));

const guideLabels = ['Material selection', 'Design for reuse'];
const guidePreviews = [
  'Compare EPP and EPS around the component’s job, handling cycle and operating conditions.',
  'Plan the return journey, cleaning and inspection alongside the first delivery.',
];
const cataloguePath = '/downloads/park-nonwoven-epp-catalogue.pdf';
const previewPages = [
  {image: 'cover', page: 1, title: 'Future of light weight.', alt: 'PARK EPP catalogue cover: Future of light weight, introducing four industries and 47 product families'},
  {image: 'products', page: 8, title: 'HVAC product families', alt: 'PARK catalogue page 8: ten HVAC product families with application descriptions and material options'},
  {image: 'project-brief', page: 12, title: 'Your project brief', alt: 'PARK catalogue page 12: application, drawing, quantity and validation checklist for your project brief'},
];

export default function HomeResources() {
  const [selected, setSelected] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const guideTabs = useRef<(HTMLAnchorElement | null)[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLAnchorElement>(null);

  useEffect(() => { setEnhanced(true); }, []);
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isOpen]);

  function selectGuide(event: MouseEvent<HTMLAnchorElement>, index: number) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setSelected(index);
  }

  function navigateGuides(event: KeyboardEvent<HTMLAnchorElement>, index: number) {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % featuredGuides.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + featuredGuides.length) % featuredGuides.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = featuredGuides.length - 1;
    else if (event.key === ' ') { event.preventDefault(); setSelected(index); return; }
    else return;
    event.preventDefault();
    setSelected(next);
    guideTabs.current[next]?.focus();
  }

  function openCatalogue(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !dialog.current?.showModal) return;
    event.preventDefault();
    setPreviewIndex(0);
    dialog.current.showModal();
    setIsOpen(true);
  }

  function closeCatalogue() { dialog.current?.close(); }
  function restorePage() {
    setIsOpen(false);
    opener.current?.focus({preventScroll: true});
  }

  return <section className={styles.section} aria-labelledby="home-resources-heading">
    <div className={styles.layout}>
      <div className={styles.heading}>
        <p className={styles.eyebrow}>INSIGHTS & RESOURCES</p>
        <h2 id="home-resources-heading">Practical guidance.</h2>
        <Link className={styles.allResources} href="/resources/">All resources <Icon kind="arrow"/></Link>
      </div>
      <div className={styles.guides}>
        <div className={styles.tabs} role={enhanced ? 'tablist' : undefined} aria-label="Choose a guide">
          {featuredGuides.map((article, index) => <Link
            key={article.slug} ref={element => { guideTabs.current[index] = element; }}
            id={`home-guide-tab-${index}`} className={styles.tab} href={`/resources/${article.slug}/`}
            role={enhanced ? 'tab' : undefined} aria-selected={enhanced ? selected === index : undefined}
            aria-controls={enhanced ? `home-guide-panel-${index}` : undefined}
            tabIndex={enhanced ? selected === index ? 0 : -1 : undefined} data-active={selected === index}
            onClick={event => selectGuide(event, index)} onKeyDown={event => navigateGuides(event, index)}>
            {guideLabels[index]}
          </Link>)}
        </div>
        <div className={styles.preview}>
          {featuredGuides.map((article, index) => <div
            key={article.slug} id={`home-guide-panel-${index}`} className={styles.guidePanel}
            role={enhanced ? 'tabpanel' : undefined} aria-labelledby={`home-guide-tab-${index}`}
            hidden={selected !== index} tabIndex={enhanced ? 0 : undefined}>
            <h3>{article.title}</h3>
            <p>{guidePreviews[index]}</p>
            <Link className={styles.readGuide} href={`/resources/${article.slug}/`}>Read guide <Icon kind="arrow"/></Link>
          </div>)}
        </div>
      </div>
      <div className={styles.catalogue}>
        <a ref={opener} className={styles.cataloguePreview} href={cataloguePath} onClick={openCatalogue}
          aria-haspopup={enhanced ? 'dialog' : undefined}>
          <span className={styles.cover}><img src="/images/catalogue-preview/cover.webp" width={1050} height={1485} alt="" loading="lazy"/></span>
          <span className={styles.catalogueCopy}><span className={styles.category}>PARK CATALOGUE · 12 PAGES</span><span className={styles.catalogueTitle}>Take a closer look.</span><span className={styles.previewLabel}>Preview catalogue <Icon kind="arrow"/></span></span>
        </a>
        <a className={styles.download} href={cataloguePath} download><Icon kind="download"/>Download catalogue<span className={styles.fileType}>PDF</span></a>
      </div>
    </div>

    <dialog ref={dialog} className={styles.dialog} aria-labelledby="catalogue-preview-heading"
      aria-describedby="catalogue-preview-description" onClose={restorePage}
      onCancel={event => { event.preventDefault(); closeCatalogue(); }}
      onClick={event => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeCatalogue();
      }}>
      <div className={styles.dialogHeader}>
        <div><p className={styles.eyebrow}>PARK EPP &amp; ENGINEERED MATERIALS</p><h2 id="catalogue-preview-heading">Inside the catalogue.</h2></div>
        <button className={styles.close} type="button" aria-label="Close catalogue preview" onClick={closeCatalogue} autoFocus><Icon kind="close"/></button>
      </div>
      <p id="catalogue-preview-description" className={styles.dialogIntro}>Preview three selected pages. Download the complete 12-page catalogue for all four industries.</p>
      <div className={styles.pageFrame}>
        {isOpen && previewPages.map((page, index) => <img key={page.image} className={styles.pageImage}
          hidden={index !== previewIndex} src={`/images/catalogue-preview/${page.image}.webp`}
          width={1050} height={1485} alt={page.alt}/>)}
      </div>
      <div className={styles.pageControls}>
        <button type="button" className={styles.previous} aria-label="Previous preview page" disabled={previewIndex === 0} onClick={() => setPreviewIndex(index => Math.max(0, index - 1))}><Icon kind="arrow"/></button>
        <p className={styles.pageStatus} role="status" aria-live="polite" aria-atomic="true"><strong>{previewPages[previewIndex].title}</strong><span>Preview {previewIndex + 1} of {previewPages.length} · Catalogue page {previewPages[previewIndex].page} of 12</span></p>
        <button type="button" aria-label="Next preview page" disabled={previewIndex === previewPages.length - 1} onClick={() => setPreviewIndex(index => Math.min(previewPages.length - 1, index + 1))}><Icon kind="arrow"/></button>
      </div>
      <a className={styles.dialogDownload} href={cataloguePath} download>Download complete catalogue <Icon kind="download"/></a>
    </dialog>
  </section>;
}
