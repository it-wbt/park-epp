'use client';
import ResponsiveImage from './ResponsiveImage';

import {useEffect,useRef,useState} from 'react';
import {Icon} from './ui';
import styles from './EppProcessDiagram.module.css';

const steps = [
  {title:'Fill the mould',label:'Fill',detail:'Expanded EPP beads are carried into the closed mould cavity.'},
  {title:'Fuse with steam',label:'Steam',detail:'Steam heats the packed beads so their surfaces bond into one shape.'},
  {title:'Cool & stabilise',label:'Cool',detail:'The part cools inside the mould before the tool opens.'},
  {title:'Release & inspect',label:'Check',detail:'The mould opens, the part is released and its dimensions and fit are checked.'},
];


export default function EppProcessDiagram() {
  const [step,setStep]=useState(0),[paused,setPaused]=useState(false),[reduced,setReduced]=useState(true),[visible,setVisible]=useState(false);
  const root=useRef<HTMLDivElement>(null);
  useEffect(()=>{const preference=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(preference.matches);update();preference.addEventListener('change',update);return()=>preference.removeEventListener('change',update);},[]);
  useEffect(()=>{const element=root.current;if(!element)return;const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.2});observer.observe(element);return()=>observer.disconnect();},[]);
  useEffect(()=>{if(paused||reduced||!visible)return;const timer=setInterval(()=>{if(!document.hidden)setStep(value=>(value+1)%steps.length);},3800);return()=>clearInterval(timer);},[paused,reduced,visible]);
  const choose=(index:number)=>{setStep(index);setPaused(true);};
  const running=!paused&&!reduced&&visible;
  return <div ref={root} className={styles.diagram} data-step={step} data-running={running}>
    <div className={styles.topline}><span>BEADS → MOULDED COMPONENT</span><button onClick={()=>setPaused(value=>!value)} disabled={reduced} aria-label={paused?'Play EPP process animation':'Pause EPP process animation'}><Icon kind={paused?'play':'pause'}/><span>{reduced?'Manual steps':paused?'Play':'Pause'}</span></button></div>
    <div className={styles.presentation}>
      <div className={styles.wheel}>
        <svg viewBox="0 0 320 320" className={styles.scene} aria-hidden="true">
          <circle cx="160" cy="160" r="125" fill="none" stroke="#e4edf2" strokeWidth="1"/>
          <circle cx="160" cy="160" r="109" fill="none" stroke="#e2ecf2" strokeWidth="14"/>
          {[0,1,2,3].map(index=><circle key={index} cx="160" cy="160" r="109" fill="none" stroke={step===index?'#176b8a':'#bacfdc'} strokeWidth={step===index?15:10} strokeDasharray="147 538" transform={`rotate(${index*90-83} 160 160)`} strokeLinecap="round" className={step===index?styles.activeArc:undefined}/>)}
          <circle cx="160" cy="160" r="83" fill="#f4f8fb" stroke="#dce8ee" strokeWidth="1"/>
          <g className={styles.orbit}><circle cx="160" cy="160" r="138" fill="none" stroke="#aec7d5" strokeWidth="1" strokeDasharray="2 9"/><circle cx="160" cy="22" r="4" fill="#7ca156"/></g>
          <text x="257" y="73" className={styles.ringNumber}>01</text><text x="257" y="257" className={styles.ringNumber}>02</text><text x="50" y="257" className={styles.ringNumber}>03</text><text x="50" y="73" className={styles.ringNumber}>04</text>
        </svg>
        <div className={styles.product}><ResponsiveImage sizes="160px" loading="lazy" src="/images/products/branded/custom-hvac-components.webp" alt="Illustrative moulded EPP housing and duct component"/><span>BEADS TO COMPONENT</span></div>
        <span className={styles.stageBadge}><Icon kind={['layers','wind','snow','shield'][step]}/></span>
      </div>
      <div className={styles.caption} aria-live={paused||reduced?'polite':'off'}><span className={styles.kicker}>THE MOULDING CYCLE / 0{step+1}</span><strong>{steps[step].title}</strong><p>{steps[step].detail}</p><div className={styles.detailRule}/><span className={styles.stageHint}>{['Material enters the tool','Separate beads become one shape','The shape becomes stable','A finished part, ready to validate'][step]}</span></div>
    </div>
    <div className={styles.steps} role="group" aria-label="Choose a moulding stage">{steps.map((item,index)=><button key={item.label} aria-label={`Show process: ${item.title}`} aria-pressed={step===index} onClick={()=>choose(index)}><span>0{index+1}</span>{item.label}<i/></button>)}</div>
    <small className={styles.note}>Simplified process illustration</small>
  </div>;
}
