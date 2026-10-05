import type {Metadata} from 'next';
import {Header} from '../components/ui';
import {Footer} from '../components/shared';
import {origin} from '../lib/catalog';
import './globals.css';
export const metadata:Metadata={metadataBase:new URL(origin),title:{default:'AERON Industries | Engineered Materials & Protective Packaging',template:'%s | AERON Industries'},description:'Explore industrial packaging, moulded components and material guides across 13 markets. Build a clearer brief for protection, insulation and lightweight design.',openGraph:{type:'website',siteName:'AERON Industries',images:[{url:'/images/hero.webp',width:1672,height:941,alt:'Original industrial material concept photography'}]},twitter:{card:'summary_large_image'},robots:{index:true,follow:true}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body><a href="#main" className="skip-link">Skip to content</a><Header/><main id="main">{children}</main><Footer/></body></html>;}
