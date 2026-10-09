'use client';
import ResponsiveImage from './ResponsiveImage';

import Link from 'next/link';
import {useRef, useState, type KeyboardEvent} from 'react';
import {Icon} from './ui';
import styles from './HomeEppExplainer.module.css';
import EppProcessDiagram from './EppProcessDiagram';

const tabs = ['What is EPP?', 'How is it made?', 'Why is it useful?'];


export default function HomeEppExplainer() {
  const [active,setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement|null)[]>([]);
  function navigate(event:KeyboardEvent<HTMLButtonElement>,index:number) {
    const next = event.key==='Home'?0:event.key==='End'?tabs.length-1:event.key==='ArrowRight'?(index+1)%tabs.length:event.key==='ArrowLeft'?(index-1+tabs.length)%tabs.length:null;
    if(next===null)return;
    event.preventDefault();setActive(next);buttons.current[next]?.focus();
  }
  return <section id="technology" className={styles.section} aria-labelledby="home-epp-title">
    <div className={styles.visual}>
      <figure className={styles.photo}><ResponsiveImage src="/images/generated/epp-material-closeup.webp" alt="Illustration of expanded polypropylene beads beside a moulded foam component" width={1440} height={960} loading="lazy"/><figcaption>SMALL BEADS. A LIGHTWEIGHT ENGINEERED SHAPE.</figcaption></figure>
      <div className={styles.structure}><svg viewBox="0 0 180 110" role="img" aria-label="Simplified foam bead cross-section showing small enclosed air cells"><defs><pattern id="home-epp-cell" width="18" height="16" patternUnits="userSpaceOnUse"><path d="M0 4 9 0 18 4v8l-9 4-9-4Z" fill="#edf6fa" stroke="#8db9cd" strokeWidth="1.3"/></pattern></defs><circle cx="62" cy="55" r="42" fill="url(#home-epp-cell)" stroke="#176b8a" strokeWidth="2"/><path d="M85 33h55M82 78h58" fill="none" stroke="#176b8a"/><text x="115" y="25" fill="#176b8a" fontSize="10">Air cells</text><text x="111" y="94" fill="#176b8a" fontSize="10">Polymer walls</text></svg><div><strong>The lightness is inside.</strong><p>Small air-filled cells sit within each bead. Thin polypropylene walls give the foam its structure.</p><small>Simplified bead cross-section</small></div></div>
    </div>
    <div className={styles.copy}><p className="eyebrow">UNDERSTAND THE MATERIAL</p><h2 id="home-epp-title">Understand EPP.<br/><span>Material. Process. Purpose.</span></h2>
      <div className={styles.toolbar}>
      <div className={styles.tabs} role="tablist" aria-label="Learn about EPP">{tabs.map((tab,index)=><button key={tab} ref={element=>{buttons.current[index]=element;}} id={`epp-explainer-tab-${index}`} role="tab" aria-selected={active===index} aria-controls={`epp-explainer-panel-${index}`} tabIndex={active===index?0:-1} onClick={()=>setActive(index)} onKeyDown={event=>navigate(event,index)}>{tab}</button>)}</div>
        <div className={styles.navigation} role="group" aria-label="Navigate EPP topics">
          <button type="button" aria-label="Previous EPP topic" onClick={()=>setActive(value=>(value+tabs.length-1)%tabs.length)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5-7 7 7 7"/></svg></button>
          <span aria-live="polite">0{active+1} / 03</span>
          <button type="button" aria-label="Next EPP topic" onClick={()=>setActive(value=>(value+1)%tabs.length)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 5 7 7-7 7"/></svg></button>
        </div>
      </div>
      <div id="epp-explainer-panel-0" role="tabpanel" aria-labelledby="epp-explainer-tab-0" hidden={active!==0} className={styles.panel} tabIndex={0}>
        <h3>Expanded polypropylene, explained simply.</h3><p>EPP stands for <strong>Expanded Polypropylene</strong>. It is a lightweight plastic foam made from expanded beads with a mostly closed-cell structure.</p><p>The beads are fused into a single moulded shape. That shape can be a protective insert, an insulated delivery container, a vehicle component or an HVAC housing.</p><div className={styles.takeaway}><Icon kind="layers"/><p><strong>Think of it as an engineered cushion.</strong><br/>Material grade, foam density and shape work together to support the job the part needs to do.</p></div>
      </div>
      <div id="epp-explainer-panel-1" role="tabpanel" aria-labelledby="epp-explainer-tab-1" hidden={active!==1} className={styles.panel} tabIndex={0}>
        <h3>Shaped using steam-chest moulding.</h3><p>Expanded beads are placed in a mould shaped like the finished component. Steam bonds the beads together, then the part is cooled and released.</p>{active===1 && <EppProcessDiagram/>}<p className={styles.note}>The mould creates the cavities, ribs and interfaces needed to fit the component into its assembly.</p>
      </div>
      <div id="epp-explainer-panel-2" role="tabpanel" aria-labelledby="epp-explainer-tab-2" hidden={active!==2} className={styles.panel} tabIndex={0}>
        <h3>Useful properties. Practical applications.</h3><div className={styles.benefits}>
          <div><Icon kind="shield"/><div><strong>Absorbs impact</strong><p>Helps cushion products during handling and transport. Resilience can support repeated use.</p></div></div>
          <div><Icon kind="snow"/><div><strong>Slows heat transfer</strong><p>Useful for insulated food-delivery containers and HVAC housings, with suitable grade and system design.</p></div></div>
          <div><Icon kind="layers"/><div><strong>Keeps components light</strong><p>The cellular structure reduces solid material, helping make vehicle parts and reusable packs easier to handle.</p></div></div>
        </div><p className={styles.note}>Performance depends on grade, density, geometry and use conditions. Validate the complete part for its application.</p>
      </div>
      <div className={styles.footer}>
        <Link className={styles.guide} href="/materials/expanded-polypropylene/">Explore the full EPP guide<Icon kind="arrow"/></Link>

      </div>
    </div>
  </section>;
}
