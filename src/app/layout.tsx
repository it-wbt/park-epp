import type {Metadata} from 'next';
import Header from '../components/Header';
import {Footer} from '../components/shared';
import {origin} from '../lib/catalog';
import './globals.css';
import './park.css';
import './menu.css';
export const metadata:Metadata={metadataBase:new URL(origin),title:{default:'Parknonwoven EPP | Engineered Materials & Protective Packaging',template:'%s | Parknonwoven EPP'},description:'Explore industrial packaging, moulded components and material guides across 13 markets. Build a clearer brief for protection, insulation and lightweight design.',openGraph:{type:'website',siteName:'Parknonwoven EPP',images:[{url:'/images/hero.webp',width:1672,height:941,alt:'Original industrial material concept photography'}]},twitter:{card:'summary_large_image'},robots:{index:true,follow:true}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body><a href="#main" className="skip-link">Skip to content</a><Header/><main id="main">{children}</main><Footer/></body></html>;}
