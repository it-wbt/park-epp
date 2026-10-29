'use client';

import dynamic from 'next/dynamic';
import {companyEvents, whatsappMessage, whatsappNumber} from '../lib/site-engagement';

const EventAnnouncements = dynamic(() => import('./EventAnnouncements'), {ssr:false});

function WhatsAppIcon({size=28}:{size?:number}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.52 3.48A11.85 11.85 0 0 0 12.05 0C5.5 0 .17 5.33.16 11.88c0 2.09.55 4.13 1.59 5.93L.06 24l6.33-1.66a11.9 11.9 0 0 0 5.65 1.44h.01c6.55 0 11.88-5.33 11.89-11.88a11.8 11.8 0 0 0-3.42-8.42ZM12.05 21.77h-.01a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.76.99 1-3.67-.24-.38a9.85 9.85 0 0 1-1.5-5.24c0-5.45 4.44-9.88 9.9-9.88a9.82 9.82 0 0 1 7 2.9 9.82 9.82 0 0 1 2.9 7c0 5.45-4.44 9.87-9.9 9.87Zm5.42-7.39c-.3-.15-1.76-.87-2.03-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.39-1.48-.88-.78-1.48-1.75-1.65-2.05-.18-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.5H7.8c-.2 0-.52.08-.8.38-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z"/></svg>;
}

function EmailIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 5h18v14H3zM3 5l9 7 9-7"/></svg>;
}

export default function SiteEngagement() {
  const number = whatsappNumber.replace(/\D/g, '');
  const whatsappHref = number ? 'https://wa.me/' + number + '?text=' + encodeURIComponent(whatsappMessage) : '';

  return <>
    {companyEvents.length > 0 && <EventAnnouncements events={companyEvents}/>}
    <div className="support-widget">
      {whatsappHref
        ? <a className="support-bubble" href={whatsappHref} target="_blank" rel="noopener noreferrer" aria-label="Chat with PARK on WhatsApp"><WhatsAppIcon/></a>
        : <a className="support-bubble" href="mailto:sales@parknonwoven.com" aria-label="Email PARK"><EmailIcon/></a>}
    </div>
  </>;
}
