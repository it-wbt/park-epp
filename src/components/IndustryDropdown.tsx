'use client';
import {useEffect,useId,useRef,useState,type KeyboardEvent} from 'react';
import styles from './IndustryDropdown.module.css';

type Option={value:string;label:string};
export default function IndustryDropdown({value,onChange,options}:{value:string;onChange:(value:string)=>void;options:Option[]}){
 const [open,setOpen]=useState(false),[active,setActive]=useState(0);
 const root=useRef<HTMLDivElement>(null),trigger=useRef<HTMLButtonElement>(null);
 const search=useRef({text:'',time:0});
 const id=useId();
 const selected=Math.max(0,options.findIndex(option=>option.value===value));
 useEffect(()=>{if(!open)return;const outside=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node))setOpen(false);};document.addEventListener('pointerdown',outside);return()=>document.removeEventListener('pointerdown',outside);},[open]);
 useEffect(()=>{if(open)document.getElementById(`${id}-option-${active}`)?.scrollIntoView({block:'nearest'});},[open,active,id]);
 const choose=(index:number)=>{onChange(options[index].value);setOpen(false);trigger.current?.focus();};
 function keyDown(event:KeyboardEvent<HTMLButtonElement>){
  if(event.key==='Tab'){setOpen(false);return;}
  if(event.key==='Escape'){if(open){event.preventDefault();event.stopPropagation();setOpen(false);}return;}
  if(['Enter',' '].includes(event.key)){event.preventDefault();if(open)choose(active);else{setActive(selected);setOpen(true);}return;}
  if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){
   event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?options.length-1:!open?selected:(active+(event.key==='ArrowDown'?1:-1)+options.length)%options.length;setActive(next);setOpen(true);return;
  }
  if(event.key.length===1&&!event.ctrlKey&&!event.metaKey&&!event.altKey){
   const now=Date.now();search.current={text:(now-search.current.time<700?search.current.text:'')+event.key.toLowerCase(),time:now};
   const next=options.findIndex(option=>option.label.toLowerCase().startsWith(search.current.text));if(next>=0){setActive(next);setOpen(true);}
  }
 }
 return <div className={styles.field} ref={root} onBlur={event=>{if(event.relatedTarget&&!event.currentTarget.contains(event.relatedTarget))setOpen(false);}}>
  <span id={`${id}-label`} className={styles.label}>Industry</span>
  <button ref={trigger} className={styles.trigger} type="button" role="combobox" aria-labelledby={`${id}-label ${id}-value`} aria-haspopup="listbox" aria-expanded={open} aria-controls={`${id}-list`} aria-activedescendant={open?`${id}-option-${active}`:undefined} onKeyDown={keyDown} onClick={()=>{setActive(selected);setOpen(!open);}}><span id={`${id}-value`}>{options[selected].label}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button>
  {open&&<ul id={`${id}-list`} className={styles.list} role="listbox" aria-labelledby={`${id}-label`}>{options.map((option,index)=><li id={`${id}-option-${index}`} key={option.value} role="option" aria-selected={option.value===value} data-active={index===active} onPointerMove={()=>setActive(index)} onPointerDown={event=>event.preventDefault()} onClick={()=>choose(index)}><span>{option.label}</span>{option.value===value&&<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>}</li>)}</ul>}
 </div>;
}
