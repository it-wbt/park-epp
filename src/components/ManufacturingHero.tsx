'use client';

import Link from 'next/link';
import {useEffect, useRef, useState, type MouseEvent} from 'react';
import {eppProcess, getEppProcessStep} from '../lib/epp-process';
import {Icon} from './ui';
import styles from './ManufacturingHero.module.css';

export default function ManufacturingHero() {
  const backgroundVideo = useRef<HTMLVideoElement>(null);
  const resumeBackground = useRef(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const opener = useRef<HTMLAnchorElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [backgroundPaused, setBackgroundPaused] = useState(true);
  const [paused, setPaused] = useState(true);
  const [ready, setReady] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const step = eppProcess[stepIndex];

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const film = video.current;
    const background = backgroundVideo.current;
    const update = () => {
      if (preference.matches) {
        film?.pause();
        background?.pause();
        if (background) background.autoplay = false;
        setBackgroundPaused(true);
        resumeBackground.current = false;
      }
    };
    update();
    if (!preference.matches && background) {
      void background.play().then(() => setBackgroundPaused(background.paused)).catch(() => setBackgroundPaused(true));
    }
    preference.addEventListener('change', update);
    return () => {
      preference.removeEventListener('change', update);
      film?.pause();
      background?.pause();
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isOpen]);

  const openFilm = (event: MouseEvent<HTMLAnchorElement>) => {
    const panel = dialog.current;
    const film = video.current;
    if (!panel?.showModal || !film) return;
    event.preventDefault();
    resumeBackground.current = Boolean(backgroundVideo.current && !backgroundVideo.current.paused);
    backgroundVideo.current?.pause();
    panel.showModal();
    setIsOpen(true);
    setStepIndex(0);
    film.currentTime = 0;
    if (film.readyState === 0) film.load();
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      void film.play().catch(() => setPaused(true));
    }
  };

  const stopFilm = () => {
    video.current?.pause();
    setPaused(true);
    setIsOpen(false);
    if (resumeBackground.current && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      void backgroundVideo.current?.play().catch(() => setBackgroundPaused(true));
    }
    resumeBackground.current = false;
    opener.current?.focus({preventScroll: true});
  };

  const closeFilm = () => {
    video.current?.pause();
    dialog.current?.close();
  };

  const togglePlayback = () => {
    const film = video.current;
    if (!film) return;
    if (film.paused) void film.play().catch(() => setPaused(true));
    else film.pause();
  };

  const toggleBackground = () => {
    const film = backgroundVideo.current;
    if (!film) return;
    if (film.paused) void film.play().catch(() => setBackgroundPaused(true));
    else film.pause();
  };

  const showStep = (index: number) => {
    const film = video.current;
    if (!film || film.readyState < 1) return;
    film.currentTime = eppProcess[index].start + .2;
    setStepIndex(index);
  };

  return <>
    <section className={`park-hero ${styles.hero}`} aria-labelledby="hero-heading">
      <video ref={backgroundVideo} className={styles.backgroundVideo} autoPlay muted loop playsInline preload="metadata"
        poster="/images/epp-manufacturing-poster.webp" aria-hidden="true"
        onPlay={() => setBackgroundPaused(false)} onPause={() => setBackgroundPaused(true)}>
        <source src="/videos/park-epp-manufacturing-mobile.mp4" media="(max-width: 760px)" type="video/mp4"/>
        <source src="/videos/park-epp-manufacturing.mp4" type="video/mp4"/>
      </video>
      <div className={`park-hero-shade ${styles.shade}`} aria-hidden="true"/>
      <div className={`park-hero-content ${styles.copy}`}>
        <p className="eyebrow">PARK NONWOVEN · EPP & ENGINEERED MATERIALS</p>
        <h1 id="hero-heading">Future of <br/><span>light weight</span></h1>
        <p>From protective packaging to precision components, discover material possibilities built around your product, your industry and its next journey.</p>
        <div className="hero-buttons">
          <Link className="button light" href="/products/">Explore our products <Icon kind="arrow"/></Link>
          <Link className="park-white-link" href="/markets/">Find your industry ↗</Link>
        </div>
      </div>
      <span className={styles.visualLabel}>3D manufacturing film</span>
      <div className={styles.footer}>
        <a className={styles.discover} href="#discover">Discover the possibilities <span aria-hidden="true">↓</span></a>
        <div className={styles.heroControls}>
        <button className={styles.watch} type="button" onClick={toggleBackground}
          aria-label={backgroundPaused ? 'Play background video' : 'Pause background video'}>
          <Icon kind={backgroundPaused ? 'play' : 'pause'}/>{backgroundPaused ? 'Play video' : 'Pause video'}
        </button>
        <a ref={opener} className={styles.watch} href="/videos/park-epp-manufacturing.mp4" onClick={openFilm}>
          <Icon kind="play"/>Watch moulding process
        </a>
        </div>
      </div>
    </section>

    <dialog ref={dialog} className={styles.dialog} aria-labelledby="process-film-heading"
      aria-describedby="process-film-summary" onClose={stopFilm}
      onCancel={event => { event.preventDefault(); closeFilm(); }}>
      <div className={styles.dialogHeader}>
        <div><p className={styles.filmLabel}>3D PROCESS FILM</p><h2 id="process-film-heading">From bead to finished shape.</h2></div>
        <button className={styles.close} type="button" aria-label="Close process film" onClick={closeFilm} autoFocus><Icon kind="close"/></button>
      </div>
      <p id="process-film-summary" className={styles.filmSummary}>A 24-second animated guide to EPP moulding.</p>
      <video ref={video} className={styles.film} controls muted playsInline preload="none"
        poster="/images/epp-manufacturing-poster.webp" aria-label="EPP moulding 3D process film"
        onLoadedMetadata={() => setReady(true)} onEmptied={() => setReady(false)}
        onPlay={() => setPaused(false)} onPause={() => setPaused(true)} onEnded={() => setPaused(true)}
        onTimeUpdate={event => setStepIndex(getEppProcessStep(event.currentTarget.currentTime))}>
        <source src="/videos/park-epp-manufacturing-mobile.mp4" media="(max-width: 760px)" type="video/mp4"/>
        <source src="/videos/park-epp-manufacturing.mp4" type="video/mp4"/>
        <track kind="captions" src="/videos/epp-manufacturing.vtt" srcLang="en" label="English process captions"/>
        <a href="/videos/park-epp-manufacturing.mp4">Open the 3D process film</a>
      </video>
      <div className={styles.process}>
        <div className={styles.processHeader}>
          <div className={`epp-process-caption ${styles.caption}`} data-step={stepIndex}>
            <span className={styles.number}>0{stepIndex + 1}</span><strong>{step.name}</strong>
          </div>
          <button className={styles.playback} type="button" onClick={togglePlayback}><Icon kind={paused ? 'play' : 'pause'}/>{paused ? 'Play film' : 'Pause film'}</button>
        </div>
        <div className={`epp-process-timeline ${styles.timeline}`} role="group" aria-label="Explore the EPP manufacturing process">
          {eppProcess.map((item, index) => <button key={item.short} type="button" disabled={!ready}
            aria-label={`Show ${item.name}`} aria-pressed={index === stepIndex} onClick={() => showStep(index)}>
            <span className={styles.line}/><span>{item.short}</span>
          </button>)}
        </div>
        <p className={styles.description}>{step.detail}</p>
      </div>
    </dialog>
  </>;
}
