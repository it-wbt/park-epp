'use client';

import {useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent} from 'react';
import styles from './MaterialComparisonSlider.module.css';

export default function MaterialComparisonSlider() {
  const [position, setPosition] = useState(50);
  const [interactive, setInteractive] = useState(false);
  const rangeRef = useRef<HTMLInputElement>(null);
  const activePointer = useRef<number | null>(null);
  const instructionsId = useId();

  useEffect(() => setInteractive(true), []);

  function moveDivider(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    if (bounds.width > 0) {
      setPosition(Math.round(Math.max(0, Math.min(100, (event.clientX - bounds.left) / bounds.width * 100))));
    }
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    event.preventDefault();
    activePointer.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    rangeRef.current?.focus({preventScroll: true});
    moveDivider(event);
  }

  function stopDrag(event: PointerEvent<HTMLDivElement>) {
    if (activePointer.current !== event.pointerId) return;
    activePointer.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  const valueText = position === 0 ? 'Full EPP view' : position === 100 ? 'Full EPS view' : `${position}% EPS, ${100 - position}% EPP`;

  return <figure className={styles.comparison} data-interactive={interactive}>
    <div
      className={styles.frame}
      style={{'--split': `${position}%`} as CSSProperties}
      onPointerDown={startDrag}
      onPointerMove={event => { if (activePointer.current === event.pointerId) moveDivider(event); }}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
      onLostPointerCapture={() => { activePointer.current = null; }}
    >
      <div className={styles.eppLayer}>
        <img src="/images/generated/material-compare-epp.webp" width={1536} height={1024} alt="Protective transport tray in dark expanded polypropylene, with a visible moulded bead texture" fetchPriority="high" draggable={false}/>
        <span className={styles.eppLabel} aria-hidden="true">EPP</span>
      </div>
      <div className={styles.epsLayer}>
        <img src="/images/generated/material-compare-eps.webp" width={1536} height={1024} alt="The same protective transport tray in white expanded polystyrene, shown from the same angle" draggable={false}/>
        <span className={styles.epsLabel} aria-hidden="true">EPS</span>
      </div>
      <input
        ref={rangeRef}
        className={styles.range}
        type="range"
        min={0}
        max={100}
        step={1}
        value={position}
        disabled={!interactive}
        aria-label="Compare EPP and EPS material views"
        aria-describedby={instructionsId}
        aria-valuetext={valueText}
        onChange={event => setPosition(Number(event.target.value))}
      />
      <div className={styles.divider} aria-hidden="true">
        <span className={styles.handle}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m8 7-5 5 5 5M16 7l5 5-5 5"/><path d="M12 5v14" strokeOpacity=".3"/></svg>
        </span>
      </div>
    </div>
    <div className={styles.controls} aria-label="Material view controls">
      <button type="button" disabled={!interactive} aria-label="Show full EPP view" aria-pressed={position === 0} onClick={() => setPosition(0)}><span aria-hidden="true">←</span> EPP</button>
      <button className={styles.reset} type="button" disabled={!interactive} aria-label="Show equal EPP and EPS split" aria-pressed={position === 50} onClick={() => setPosition(50)}>Split view</button>
      <button type="button" disabled={!interactive} aria-label="Show full EPS view" aria-pressed={position === 100} onClick={() => setPosition(100)}>EPS <span aria-hidden="true">→</span></button>
    </div>
    <figcaption className={styles.caption} id={instructionsId}>
      {interactive ? 'Drag left for EPP. Drag right for EPS.' : 'One protective transport tray, shown in EPS on the left and EPP on the right.'}
      <span>EPP: expanded polypropylene · EPS: expanded polystyrene</span>
    </figcaption>
  </figure>;
}
