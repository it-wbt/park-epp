'use client';

import ResponsiveImage from './ResponsiveImage';
import {useEffect, useRef} from 'react';
import type {CompanyEvent} from '../lib/site-engagement';

function EngagementIcon({kind,size=20}:{kind:string;size?:number}) {
  const paths:Record<string,string> = {
    arrow:'M7 17 17 7M7 7h10v10',
    close:'M6 6l12 12M6 18 18 6',
    calendar:'M8 2v4m8-4v4M3 9h18M3 4h18v18H3z',
    pin:'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[kind]}/></svg>;
}

const ArrowUpRight = ({size=20}:{size?:number}) => <EngagementIcon kind="arrow" size={size}/>;
const CalendarDays = ({size=20}:{size?:number}) => <EngagementIcon kind="calendar" size={size}/>;
const MapPin = ({size=20}:{size?:number}) => <EngagementIcon kind="pin" size={size}/>;
const X = ({size=20}:{size?:number}) => <EngagementIcon kind="close" size={size}/>;

export function upcomingEvents(events:CompanyEvent[], now = new Date()) {
  return events
    .filter((event) => /^\d{4}-\d{2}-\d{2}$/.test(event.endDate) && new Date(event.endDate + 'T23:59:59').getTime() >= now.getTime())
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

function eventDate(value:string) {
  return new Date(value + 'T12:00:00').toLocaleDateString('en-GB', {day:'numeric', month:'short', year:'numeric'});
}

export default function EventAnnouncements({events}:{events:CompanyEvent[]}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const activeEvents = upcomingEvents(events);

  useEffect(() => {
    if (!activeEvents.length) return;
    const key = 'park-epp-events:' + activeEvents.map((event) => event.id + ':' + event.startDate).join('|');
    try {
      if (sessionStorage.getItem(key)) return;
    } catch {}
    const modal = dialog.current;
    if (!modal) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    const unlock = () => {
      document.body.style.overflow = overflow;
      previous?.focus({preventScroll:true});
    };
    const dismissed = () => {
      try {
        sessionStorage.setItem(key, 'dismissed');
      } catch {}
      unlock();
    };
    modal.addEventListener('close', dismissed);
    document.body.style.overflow = 'hidden';
    modal.showModal();
    return () => {
      modal.removeEventListener('close', dismissed);
      if (modal.open) modal.close();
      unlock();
    };
  }, [activeEvents]);

  if (!activeEvents.length) return null;

  return <dialog ref={dialog} className="event-modal" aria-labelledby="event-modal-title" onClick={(event) => {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.current?.close();
  }}>
    <div className="event-modal-heading">
      <div>
        <span className="submenu-eyebrow">MEET PARK</span>
        <h2 id="event-modal-title">Our upcoming events</h2>
        <p>Explore our events and meet the team to discuss your EPP requirements.</p>
      </div>
      <button autoFocus className="engagement-close" aria-label="Close events" onClick={() => dialog.current?.close()}><X size={20}/></button>
    </div>
    <div className="event-list">
      {activeEvents.map((event) => <article className="event-card" key={event.id}>
        {event.image && <ResponsiveImage sizes="(max-width: 640px) 90vw, (max-width: 1000px) 45vw, 640px" src={event.image} alt="" width={640} height={240}/>}
        <div className="event-card-copy">
          <h3>{event.title}</h3>
          <p className="event-detail"><CalendarDays size={16}/><span>{eventDate(event.startDate)}{event.endDate !== event.startDate ? ' – ' + eventDate(event.endDate) : ''}</span></p>
          <p className="event-detail"><MapPin size={16}/><span>{event.venue}{event.booth ? ' · Booth ' + event.booth : ''}</span></p>
          <p>{event.description}</p>
          <a className="button small" href={event.href} onClick={() => dialog.current?.close()}>View event <ArrowUpRight size={17}/></a>
        </div>
      </article>)}
    </div>
    <button className="event-continue" onClick={() => dialog.current?.close()}>Continue to website <ArrowUpRight size={16}/></button>
  </dialog>;
}
