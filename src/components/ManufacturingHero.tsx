'use client';

import Link from 'next/link';
import {useEffect, useRef, useState} from 'react';
import {eppProcess, getEppProcessStep} from '../lib/epp-process';
import {Icon} from './ui';
import styles from './ManufacturingHero.module.css';

export default function ManufacturingHero() {
  const video = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const step = eppProcess[stepIndex];

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      if (preference.matches && video.current) {
        video.current.autoplay = false;
        video.current.pause();
        setPaused(true);
      }
    };
    update();
    if (!preference.matches) void video.current?.play().catch(() => setPaused(true));
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  const togglePlayback = () => {
    const film = video.current;
    if (!film) return;
    if (film.paused) void film.play().catch(() => setPaused(true));
    else film.pause();
  };

  const showStep = (index: number) => {
    const film = video.current;
    if (!film || film.readyState < 1) return;
    film.currentTime = eppProcess[index].start + .2;
    setStepIndex(index);
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      void film.play().catch(() => setPaused(true));
    }
  };

  return (
    <section className={`park-hero ${styles.hero}`} aria-labelledby="hero-heading">
      <video ref={video} autoPlay muted loop playsInline preload="metadata"
        poster="/images/epp-manufacturing-poster.webp" aria-hidden="true"
        onPlay={() => setPaused(false)} onPause={() => setPaused(true)}
        onTimeUpdate={event => setStepIndex(getEppProcessStep(event.currentTarget.currentTime))}>
        <source src="/videos/park-epp-manufacturing-mobile.mp4" media="(max-width: 760px)" type="video/mp4"/>
        <source src="/videos/park-epp-manufacturing.mp4" type="video/mp4"/>
      </video>
      <div className={`park-hero-shade ${styles.shade}`}/>
      <div className={`park-hero-content ${styles.copy}`}>
        <p className="eyebrow">PARK NONWOVEN · EPP & ENGINEERED MATERIALS</p>
        <h1 id="hero-heading">Future of <br/><span>light weight</span></h1>
        <p>From protective packaging to precision components, discover material possibilities built around your product, your industry and its next journey.</p>
        <div className="hero-buttons">
          <Link className="button light" href="/products/">Explore our products <Icon kind="arrow"/></Link>
          <Link className="park-white-link" href="/markets/">Find your industry ↗</Link>
        </div>
      </div>
      <div className={styles.process}>
        <div className={`epp-process-caption ${styles.caption}`} data-step={stepIndex}>
          <span className={styles.number}>0{stepIndex + 1}</span>
          <div><span className={styles.label}>EPP MOULDING · 3D PROCESS</span><strong>{step.name}</strong></div>
        </div>
        <div className={`epp-process-timeline ${styles.timeline}`} role="group" aria-label="Explore the EPP manufacturing process">
          {eppProcess.map((item, index) => (
            <button key={item.short} type="button" aria-label={`Show ${item.name}`}
              aria-pressed={index === stepIndex} onClick={() => showStep(index)}>
              <span className={styles.line}/><span>{item.short}</span>
            </button>
          ))}
        </div>
        <p className={styles.description}>{step.detail}</p>
      </div>
      <div className="park-hero-bottom">
        <a href="#discover">Discover the possibilities ↓</a>
        <button type="button" onClick={togglePlayback}><Icon kind={paused ? 'play' : 'pause'}/>{paused ? 'Play film' : 'Pause film'}</button>
      </div>
    </section>
  );
}
