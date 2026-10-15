import Link from 'next/link';
import EppShowcase from './EppShowcase';
import HomeContact from './HomeContact';
import HomeResources from './HomeResources';
import {Icon} from './ui';
import ProductHighlights from './ProductHighlights';
import HomeEppExplainer from './HomeEppExplainer';
export default function Home(){

 return <div className="modern-home filtration-home"><EppShowcase/>
 <HomeEppExplainer/>
 <section id="about" className="epp-partner-intro" aria-labelledby="about-title"><div><p className="eyebrow">ABOUT PARK GROUP</p><h2 id="about-title">Material innovation.<br/><span>Built on experience.</span></h2></div><div className="epp-company-copy">
 <p>Founded in 1997 by Pankaj Kapoor, PARK Group manufactures nonwoven textiles and polymer materials. Headquartered in Panipat, Haryana, the group grew from its beginnings in automotive materials into a manufacturing business serving industries in India and overseas.</p>
 <p>The group brings together PARK Industries Pvt Ltd, PARK Non-Woven Pvt Ltd, PARK Felts Pvt Ltd and Essar Industries. Its manufacturing network includes locations across Delhi NCR, Chennai, Pune, Gujarat and Bangalore, supported by in-house laboratory testing.</p>
 <p>PARK combines processes such as needle punching, stitch bonding, thermo-bonding and lamination with a focus on quality and responsible manufacturing. Its community initiatives include health check-ups and eye-care camps.</p>
 <Link className="text-link" href="/about/">Learn more about PARK Group<Icon kind="arrow"/></Link><div className="epp-range-proof" aria-label="PARK Group at a glance"><div><strong>1997</strong><span>Year founded</span></div><div><strong>Panipat</strong><span>Group headquarters</span></div><div><strong>12+</strong><span>Manufacturing plants</span></div></div></div></section>
 <ProductHighlights/><HomeResources/><HomeContact/></div>;
}
