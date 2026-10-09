import Link from 'next/link';
import EppShowcase from './EppShowcase';
import HomeContact from './HomeContact';
import HomeResources from './HomeResources';
import {activeProducts, markets} from '../lib/catalog';
import {Icon} from './ui';
import ProductHighlights from './ProductHighlights';
import HomeEppExplainer from './HomeEppExplainer';
export default function Home(){

 return <div className="modern-home filtration-home"><EppShowcase/>
 <HomeEppExplainer/>
 <section id="about" className="epp-partner-intro"><div><p className="eyebrow">YOUR EPP PARTNER</p><h2>Your application.<br/><span>Our starting point.</span></h2></div><div><p>Start with what your component needs to do: protect a product in transit, manage temperature or fit into an assembly. At PARK Nonwoven, we help you connect material, geometry and manufacturing around that requirement.</p><Link className="text-link" href="/expertise/">Discover our approach<Icon kind="arrow"/></Link><div className="epp-range-proof"><div><strong>{activeProducts.length}</strong><span>Product families</span></div><div><strong>{markets.length}</strong><span>Industry groups</span></div><div><strong>01</strong><span>Application-led approach</span></div></div></div></section>
 <ProductHighlights/><HomeResources/><HomeContact/></div>;
}
