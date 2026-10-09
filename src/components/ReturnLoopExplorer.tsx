'use client';
import ResponsiveImage from './ResponsiveImage';

import {useEffect, useRef, useState, type KeyboardEvent, type MouseEvent} from 'react';
import styles from './ReturnLoopExplorer.module.css';

const stages = [
  {
    label: 'Pack & protect',
    title: 'Start with the part inside.',
    description: 'Shape the pack around the product, its contact surfaces and the way operators load it. Plan protection and handling together, from the first shipment onwards.',
    questions: [
      'Which surfaces need support or clearance?',
      'How will operators load, lift and stack the pack?',
      'What handling conditions belong in the test plan?',
    ],
    image: 'factory-logistics',
    imageWidth: 1440,
    imageHeight: 960,
    alt: 'Moulded protective packaging inserts on a factory conveyor beside stacked containers',
  },
  {
    label: 'Deliver & unload',
    title: 'Design for the receiving end.',
    description: 'Consider how a loaded pack moves through delivery and unloading. Clear access, practical handling and a place for empty packaging all belong in the brief.',
    questions: [
      'Who receives and opens the shipment?',
      'How is the product removed without damaging the pack?',
      'Where are empty packs kept after unloading?',
    ],
    image: 'industry-logistics',
    imageWidth: 1440,
    imageHeight: 960,
    alt: 'Protective transport containers and shaped inserts arranged on a pallet in a warehouse',
  },
  {
    label: 'Collect & return',
    title: 'Give empties a route home.',
    description: 'Agree who collects the packaging, where it waits and how it travels back. Plan the return route alongside the outbound delivery, including any loose components.',
    questions: [
      'Who owns collection and return transport?',
      'How much storage space do empty packs need?',
      'How are packs, lids and inserts kept together?',
    ],
    image: 'logistics',
    imageWidth: 1600,
    imageHeight: 900,
    alt: 'Reusable transport packaging prepared for handling and storage',
  },
  {
    label: 'Inspect & reuse',
    title: 'Make every return a checkpoint.',
    description: 'Define cleaning and inspection criteria before introducing the pack. Record actual reuse, damage and missing parts so decisions reflect the conditions of your own operation.',
    questions: [
      'Which cleaning method and checks will be used?',
      'What damage makes a pack unsuitable for reuse?',
      'How will reuse, loss and replacement be recorded?',
    ],
    image: 'factory-foam-finishing',
    imageWidth: 1440,
    imageHeight: 960,
    alt: 'An operator examining a shaped foam insert at a factory workbench',
  },
];

export default function ReturnLoopExplorer() {
  const [selected, setSelected] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const tabs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => { setEnhanced(true); }, []);

  function selectStage(event: MouseEvent<HTMLAnchorElement>, index: number) {
    if (!enhanced || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setSelected(index);
  }

  function navigateStages(event: KeyboardEvent<HTMLAnchorElement>, index: number) {
    if (!enhanced) return;
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % stages.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + stages.length) % stages.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = stages.length - 1;
    else if (event.key === ' ' || event.key === 'Enter') next = index;
    else return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  }

  return <section id="return-loop" className={styles.section} aria-labelledby="return-loop-heading">
    <div className={styles.layout}>
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>THE RETURN JOURNEY</p>
          <h2 id="return-loop-heading">A journey that comes full circle.</h2>
        </div>
        <p className={styles.intro}>Explore each step to see what belongs in your packaging brief.</p>
      </div>
      <div className={styles.tabs} role={enhanced ? 'tablist' : undefined} aria-label="Explore the return journey">
        {stages.map((stage, index) => <a
          key={stage.label} ref={element => { tabs.current[index] = element; }}
          className={styles.tab} id={`return-loop-tab-${index}`} href={`#return-loop-panel-${index}`}
          role={enhanced ? 'tab' : undefined} aria-selected={enhanced ? selected === index : undefined}
          aria-controls={enhanced ? `return-loop-panel-${index}` : undefined}
          tabIndex={enhanced ? selected === index ? 0 : -1 : undefined}
          data-active={enhanced && selected === index}
          onClick={event => selectStage(event, index)} onKeyDown={event => navigateStages(event, index)}>
          <span className={styles.number} aria-hidden="true">0{index + 1}</span>
          <span>{stage.label}</span>
          <svg className={styles.stepArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>
        </a>)}
      </div>
      <div className={styles.panels} data-enhanced={enhanced}>
        {stages.map((stage, index) => <div key={stage.label}
          id={`return-loop-panel-${index}`} className={styles.panel}
          role={enhanced ? 'tabpanel' : undefined} aria-labelledby={`return-loop-tab-${index}`}
          tabIndex={enhanced ? 0 : undefined} hidden={enhanced && selected !== index}>
          <div className={styles.imageFrame}>
            <ResponsiveImage src={`/images/generated/${stage.image}.webp`} width={stage.imageWidth} height={stage.imageHeight} alt={stage.alt} loading="lazy"/>
            <span className={styles.imageLabel}><span aria-hidden="true">0{index + 1}</span> {stage.label}</span>
          </div>
          <div className={styles.copy}>
            <p className={styles.stageIndex}>STEP 0{index + 1} / 04</p>
            <h3>{stage.title}</h3>
            <p className={styles.description}>{stage.description}</p>
            <p className={styles.questionsLabel}>Questions for your brief</p>
            <ul>{stage.questions.map(question => <li key={question}>{question}</li>)}</ul>
          </div>
        </div>)}
      </div>
    </div>
  </section>;
}
