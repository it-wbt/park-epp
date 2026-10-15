'use client';
import {useId,useState,type ReactNode} from 'react';
import styles from './IndustryLanding.module.css';

export default function EppApplicationSelector({names,panels}:{names:string[];panels:ReactNode[]}){
 const [selected,setSelected]=useState(0);
 const id=useId();
 return <><div className={styles.tabs} role="group" aria-label="Applications">{names.map((name,index)=><button key={name} type="button" aria-pressed={index===selected} aria-controls={`${id}-panel`} onClick={()=>setSelected(index)}>{name}</button>)}</div><div id={`${id}-panel`} aria-live="polite">{panels[selected]}</div></>;
}
