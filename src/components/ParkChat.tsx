'use client';
import {useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import {activeProducts} from '../lib/catalog';
import {whatsappNumber} from '../lib/site-engagement';
import {Icon} from './ui';
import styles from './ParkChat.module.css';
import {deliverEnquiry} from '../lib/enquiry-delivery';

type Message = {role:'bot'|'user';text:string;links?:{name:string;href:string}[]};
const welcome:Message={role:'bot',text:'Hi! I can help you explore PARK EPP products, materials and applications. What are you looking for?'};
function answer(query:string):Message {
 const text=query.toLowerCase();
 if (/\b(price|cost|quote|quotation|buy|order|rate|enquiry)\b/.test(text)) return {role:'bot',text:'Share your product, dimensions and quantity with our team for a quote.',links:[{name:'Request a quote',href:'/contact/'}]};
 if (/\b(contact|email|phone|whatsapp)\b/.test(text)) {
  const number=whatsappNumber.replace(/\D/g,'');
  return {role:'bot',text:`Contact PARK${number ? ' on WhatsApp at +' + number : ''} or email sales@parknonwoven.com.`,links:[{name:'Email PARK',href:'mailto:sales@parknonwoven.com'},...(number?[{name:'WhatsApp PARK',href:`https://wa.me/${number}`}]:[]),{name:'Contact us',href:'/contact/'}]};
 }
 if (/^(hi|hello|hey|namaste)[!. ]*$/.test(text)) return welcome;
 const terms=text.replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(word=>word.length>2&&!['the','for','and','need','want','show','find','can','you','please','product','products','epp'].includes(word));
 const matches=activeProducts.map(product=>({product,score:terms.filter(term=>`${product.name} ${product.market} ${product.material}`.toLowerCase().includes(term)).length})).filter(item=>item.score>0).sort((a,b)=>b.score-a.score).slice(0,4);
 if(matches.length) return {role:'bot',text:'These products may suit your application. Explore the details or ask our team for a quote.',links:matches.map(({product})=>({name:product.name,href:`/products/${product.slug}/`}))};
 return {role:'bot',text:'We can help with packaging, insulated containers, HVAC, automotive and sports products. Browse our range or share your requirements.',links:[{name:'Explore products',href:'/products/'},{name:'Request a quote',href:'/contact/'}]};
}
export default function ParkChat(){
 const [open,setOpen]=useState(false),[input,setInput]=useState('');
 const [messages,setMessages]=useState<Message[]>([welcome]);
 const [step,setStep]=useState<'query'|'name'|'phone'|'email'|'complete'>('query');
 const [lead,setLead]=useState({name:'',phone:'',email:''});
 const [status,setStatus]=useState<'idle'|'sending'|'sent'|'error'>('idle');
 const [error,setError]=useState('');
 const pending=useRef(false),requestId=useRef('');
 const launcher=useRef<HTMLButtonElement>(null),field=useRef<HTMLInputElement>(null),list=useRef<HTMLDivElement>(null);
 const close=()=>{setOpen(false);launcher.current?.focus();};
 useEffect(()=>{if(open)field.current?.focus();},[open]);
 useEffect(()=>{if(open&&list.current)list.current.scrollTop=list.current.scrollHeight;},[open,messages]);
 useEffect(()=>{if(!open)return;const escape=(event:KeyboardEvent)=>{if(event.key==='Escape'){setOpen(false);launcher.current?.focus();}};document.addEventListener('keydown',escape);return()=>document.removeEventListener('keydown',escape);},[open]);
 const add=(...items:Message[])=>setMessages(previous=>[...previous,...items]);
 const quote=()=>{setStep('name');setStatus('idle');setError('');requestId.current='';add({role:'bot',text:'Let us prepare your enquiry. What is your name?'});field.current?.focus();};
 const submitEnquiry=async(details=lead)=>{
  if(pending.current)return;
  pending.current=true;setStatus('sending');setError('');
  const message=messages.filter(item=>item.role==='user'&&![details.name,details.phone,details.email].includes(item.text)).map(item=>item.text).join('\n')||'Please contact me about EPP products.';
  try{
   requestId.current ||= crypto.randomUUID();
   await deliverEnquiry({...details,brief:message},'Chatbot enquiry',{requestId:requestId.current,source:'Chatbot'});
   setStatus('sent');
  }catch(cause){setError(cause instanceof Error?cause.message:'Unable to submit. Please try again.');setStatus('error');}
  finally{pending.current=false;}
 };
 const send=(value:string)=>{
  const text=value.trim();if(!text||pending.current)return;setInput('');
  const user:Message={role:'user',text};
  if(step==='name'){
   if(text.length<2){add(user,{role:'bot',text:'Please enter your full name.'});return;}
   setLead(previous=>({...previous,name:text}));setStep('phone');add(user,{role:'bot',text:'What mobile number can PARK contact you on? Include your country code if outside India.'});return;
  }
  if(step==='phone'){
   const phone=text.replace(/[\s()-]/g,'');
   if(!/^\+?\d{7,15}$/.test(phone)){add(user,{role:'bot',text:'Please enter a valid mobile number.'});return;}
   setLead(previous=>({...previous,phone}));setStep('email');add(user,{role:'bot',text:'What is your email address?'});return;
  }
  if(step==='email'){
   if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)){add(user,{role:'bot',text:'Please enter a valid email address.'});return;}
   const details={...lead,email:text};setLead(details);setStep('complete');add(user);void submitEnquiry(details);return;
  }
  if(step==='complete')return;
  if(/\b(quote|quotation|enquiry|inquiry|buy|order)\b/i.test(text)){add(user);quote();return;}
  add(user,answer(text));field.current?.focus();
 };
 return <div className={styles.widget}>
 {open&&<section id="park-chat" className={styles.panel} role="region" aria-label="PARK product assistant">
  <div className={styles.heading}><span className={styles.mark}><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg></span><div className={styles.info}><strong>PARK EPP assistant</strong><span>Products | Materials | Enquiries</span></div><button type="button" onClick={close} aria-label="Close chatbot"><Icon kind="close"/></button></div>
  <div ref={list} className={styles.messages} role="log" aria-live="polite" aria-relevant="additions">{messages.map((message,index)=><div key={index} className={message.role==='user'?styles.user:styles.bot}><p>{message.text}</p>{message.links&&<div className={styles.links}>{message.links.map(link=><Link key={link.href} href={link.href}>{link.name}<Icon kind="arrow"/></Link>)}</div>}</div>)}</div>
  {step==='query'&&<div className={styles.quick}>{['Find a product','EPP packaging','Request a quote'].map(text=><button key={text} type="button" onClick={()=>send(text)}>{text}</button>)}</div>}
  {step==='complete'?<div className={styles.ready}>
   <p role={status==='error'?'alert':'status'}>{status==='sent'?'Your enquiry has been submitted. The PARK team will contact you.':status==='sending'?'Submitting your enquiry...':error}</p>
   {status==='error'&&<button type="button" onClick={()=>void submitEnquiry()}>Retry submission <Icon kind="arrow"/></button>}
   <button type="button" disabled={status==='sending'} onClick={()=>{setStep('query');setStatus('idle');setLead({name:'',phone:'',email:''});add(welcome);}}>Ask another question</button>
  </div>:<form className={styles.form} onSubmit={event=>{event.preventDefault();send(input);}}><input ref={field} value={input} onChange={event=>setInput(event.target.value)} aria-label={step==='query'?'Your message':`Your ${step}`} placeholder={step==='name'?'Your name':step==='phone'?'Your mobile number':step==='email'?'Your email address':'Type your question...'} inputMode={step==='phone'?'tel':step==='email'?'email':'text'} autoComplete={step==='name'?'name':step==='phone'?'tel':step==='email'?'email':'off'} maxLength={500}/><button type="submit" disabled={!input.trim()} aria-label="Send message"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4 20-7ZM22 2 11 13"/></svg></button></form>}
  <p className={styles.note}>Catalogue guidance. Confirm your selected EPP product with PARK.</p>
 </section>}
 <button ref={launcher} type="button" className={styles.launch} aria-expanded={open} aria-controls="park-chat" onClick={()=>open?close():setOpen(true)}>{open?<Icon kind="close"/>:<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>}<span>{open?'Close':'Ask PARK'}</span></button>
 </div>;
}
