import type {Metadata} from 'next';
import Header from '../components/Header';
import SiteMotion from '../components/SiteMotion';
import {Footer} from '../components/shared';
import {origin} from '../lib/catalog';
import './fonts.css';
import './globals.css';
import './park.css';
import './formats.css';
import './filtration-design.css';
import './filtration-menu.css';
import './modern-theme.css';
import './site-motion.css';
export const metadata:Metadata={metadataBase:new URL(origin),title:{default:'Parknonwoven EPP | Engineered Materials & Protective Packaging',template:'%s | Parknonwoven EPP'},description:'Explore EPP materials and components for Sports, Leisure & Early Childhood, Logistics & Material Handling, HVAC and Automotive.',openGraph:{type:'website',siteName:'Parknonwoven EPP',images:[{url:'/images/generated/factory-beads.webp',width:1920,height:1081,alt:'AI factory illustration of EPP beads and a guarded moulding line'}]},twitter:{card:'summary_large_image'},robots:{index:true,follow:true}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body><a href="#main" className="skip-link">Skip to content</a><Header/><main id="main">{children}</main><SiteMotion/><Footer/></body></html>;}
