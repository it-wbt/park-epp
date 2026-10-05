import Link from 'next/link';
export default function NotFound(){return <section className="section empty"><p className="eyebrow">404 / PAGE NOT FOUND</p><h1>Let’s find a better route.</h1><p>The page you requested is not in this catalogue.</p><Link className="button" href="/products/">Explore products →</Link></section>;}
