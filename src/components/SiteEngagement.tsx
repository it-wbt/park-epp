'use client';
import ResponsiveImage from './ResponsiveImage';

import { useEffect, useRef, useState } from 'react';
function EngagementIcon({kind,size=20}:{kind:string,size?:number}) {
 const paths:Record<string,string>={arrow:'M7 17 17 7M7 7h10v10',close:'M6 6l12 12M6 18 18 6',mail:'M3 5h18v14H3zM3 5l9 7 9-7',calendar:'M8 2v4m8-4v4M3 9h18M3 4h18v18H3z',pin:'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0'};
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[kind]}/></svg>;
}
const ArrowUpRight=({size=20}:{size?:number})=><EngagementIcon kind="arrow" size={size}/>;
const CalendarDays=({size=20}:{size?:number})=><EngagementIcon kind="calendar" size={size}/>;
const MapPin=({size=20}:{size?:number})=><EngagementIcon kind="pin" size={size}/>;
const X=({size=20}:{size?:number})=><EngagementIcon kind="close" size={size}/>;
const Mail=({size=20}:{size?:number})=><EngagementIcon kind="mail" size={size}/>;
import { companyEvents, whatsappMessage, whatsappNumber, type CompanyEvent } from '../lib/site-engagement';

function WhatsAppIcon({size=28}:{size?:number}) {
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.52 3.48A11.85 11.85 0 0 0 12.05 0C5.5 0 .17 5.33.16 11.88c0 2.09.55 4.13 1.59 5.93L.06 24l6.33-1.66a11.9 11.9 0 0 0 5.65 1.44h.01c6.55 0 11.88-5.33 11.89-11.88a11.8 11.8 0 0 0-3.42-8.42ZM12.05 21.77h-.01a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.76.99 1-3.67-.24-.38a9.85 9.85 0 0 1-1.5-5.24c0-5.45 4.44-9.88 9.9-9.88a9.82 9.82 0 0 1 7 2.9 9.82 9.82 0 0 1 2.9 7c0 5.45-4.44 9.87-9.9 9.87Zm5.42-7.39c-.3-.15-1.76-.87-2.03-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.39-1.48-.88-.78-1.48-1.75-1.65-2.05-.18-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.5H7.8c-.2 0-.52.08-.8.38-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z"/></svg>;
}

export function upcomingEvents(events:CompanyEvent[], now = new Date()) {
 return events.filter(event => /^\d{4}-\d{2}-\d{2}$/.test(event.endDate) && new Date(event.endDate+'T23:59:59').getTime() >= now.getTime()).sort((a,b)=>a.startDate.localeCompare(b.startDate));
}

function eventDate(value:string) {
 return new Date(value+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
}

export default function SiteEngagement() {
 const dialog = useRef<HTMLDialogElement>(null);
 const [events,setEvents] = useState<CompanyEvent[]>([]);
 const [ready,setReady] = useState(false);
 const [supportOpen,setSupportOpen] = useState(false);
 const number = whatsappNumber.replace(/\D/g,'');
 const whatsappHref = number ? `https://wa.me/${number}?text=${encodeURIComponent(whatsappMessage)}` : null;
 useEffect(()=>{setEvents(upcomingEvents(companyEvents));setReady(true);},[]);
 useEffect(()=>{
  if(!ready) return;
  const key='park-epp-events:'+ (events.length ? events.map(event=>`${event.id}:${event.startDate}`).join('|') : 'updates-v1');
  try { if(sessionStorage.getItem(key)) return; } catch {}
  const modal=dialog.current;
  if(!modal) return;
  const previous=document.activeElement as HTMLElement|null;
  const overflow=document.body.style.overflow;
  const unlock=()=>{document.body.style.overflow=overflow;previous?.focus({preventScroll:true});};
  const dismissed=()=>{try{sessionStorage.setItem(key,'dismissed');}catch{} unlock();};
  modal.addEventListener('close',dismissed);
  document.body.style.overflow='hidden';
  modal.showModal();
  return ()=>{modal.removeEventListener('close',dismissed);if(modal.open)modal.close();unlock();};
 },[events,ready]);
 return <>
  {ready&&<dialog ref={dialog} className="event-modal" aria-labelledby="event-modal-title" onClick={event=>{if(event.target===event.currentTarget){const rect=event.currentTarget.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.current?.close();}}}>
   <div className="event-modal-heading"><div><span className="submenu-eyebrow">MEET PARK</span><h2 id="event-modal-title">Our upcoming events</h2><p>Explore our events and meet the team to discuss your EPP requirements.</p></div><button autoFocus className="engagement-close" aria-label="Close events" onClick={()=>dialog.current?.close()}><X size={20}/></button></div>
   <div className="event-list">{!events.length&&<article className="event-card"><div className="event-card-copy"><h3>Stay connected with PARK</h3><p>Our next event details will be shared here. Contact our team for upcoming exhibitions, meetings and EPP product enquiries.</p><a className="button small" href="mailto:sales@parknonwoven.com" onClick={()=>dialog.current?.close()}>Ask about upcoming events <ArrowUpRight size={17}/></a></div></article>}{events.map(event=><article className="event-card" key={event.id}>{event.image&&<ResponsiveImage sizes="(max-width: 640px) 90vw, (max-width: 1000px) 45vw, 640px" src={event.image} alt="" width={640} height={240}/>}<div className="event-card-copy"><h3>{event.title}</h3><p className="event-detail"><CalendarDays size={16}/><span>{eventDate(event.startDate)}{event.endDate!==event.startDate?' – '+eventDate(event.endDate):''}</span></p><p className="event-detail"><MapPin size={16}/><span>{event.venue}{event.booth?' · Booth '+event.booth:''}</span></p><p>{event.description}</p><a className="button small" href={event.href} onClick={()=>dialog.current?.close()}>View event <ArrowUpRight size={17}/></a></div></article>)}</div>
   <button className="event-continue" onClick={()=>dialog.current?.close()}>Continue to website <ArrowUpRight size={16}/></button>
  </dialog>}
  <div className="support-widget">
   {supportOpen&&<div id="park-support-card" className="support-card" role="region" aria-label="PARK support"><button className="engagement-close" aria-label="Close support" onClick={()=>setSupportOpen(false)}><X size={18}/></button><span className="submenu-eyebrow">PARK SUPPORT</span><h3>How can we help?</h3><p>Tell us about your application, component size or EPP product enquiry.</p>{whatsappHref?<a className="support-chat" href={whatsappHref} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={18}/>Chat on WhatsApp <ArrowUpRight size={16}/></a>:<a className="support-chat" href="mailto:sales@parknonwoven.com"><Mail size={18}/>Email our team <ArrowUpRight size={16}/></a>}</div>}
   <button className="support-bubble" aria-label={supportOpen?'Close support chat':'Open support chat'} aria-controls="park-support-card" aria-expanded={supportOpen} onClick={()=>setSupportOpen(!supportOpen)}>{supportOpen?<X size={26}/>:<WhatsAppIcon size={28}/>}</button>
  </div>
 </>;
}
