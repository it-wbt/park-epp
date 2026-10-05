import type {MetadataRoute} from 'next';
import {origin,products,markets,materials,expertise,solutions,articles} from '../lib/catalog';
import {resourcePages,aboutPages,customExpertise} from '../lib/resource-pages';
export const dynamic='force-static';
export default function sitemap():MetadataRoute.Sitemap{const sections=['products','markets','materials','expertise','solutions','resources','about','contact','privacy'];return [{url:origin,changeFrequency:'monthly',priority:1},...sections.map(s=>({url:`${origin}/${s}/`,changeFrequency:'monthly' as const,priority:0.8})),...Object.entries({products,markets,materials,expertise:[...expertise,customExpertise],solutions,resources:[...articles,...resourcePages],about:aboutPages}).flatMap(([s,rows])=>rows.map(r=>({url:`${origin}/${s}/${r.slug}/`,changeFrequency:'monthly' as const,priority:0.6})))];}
