'use client';

import dynamic from 'next/dynamic';
import {companyEvents, eventAnnouncementsEnabled} from '../lib/site-engagement';

const EventAnnouncements = dynamic(() => import('./EventAnnouncements'), {ssr:false});

export default function SiteEngagement() {
  return eventAnnouncementsEnabled && companyEvents.length > 0 ? <EventAnnouncements events={companyEvents}/> : null;
}
