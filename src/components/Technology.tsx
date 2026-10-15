import Link from 'next/link';
import {Breadcrumb} from './shared';
import {Icon} from './ui';
import {expertise} from '../lib/catalog';
import styles from './Technology.module.css';

export default function Technology() {
 return <article className={styles.page}>
  <div className={styles.wrap}>
   <Breadcrumb items={[{name:'Our technology'}]}/>
   <section className={styles.hero} aria-labelledby="technology-title"><p className={styles.eyebrow}>OUR TECHNOLOGY</p><h1 id="technology-title">From material thinking.<br/><span>To a finished component.</span></h1><div className={styles.heroBottom}><p>Lightweight EPP solutions for protection, insulation and custom parts.</p><a href="#capabilities">Explore our capabilities <Icon kind="arrow"/></a></div></section>
   <nav className={styles.contents} aria-label="Technology sections"><a href="#capabilities">What we can help with</a><a href="#development">Development process</a><a href="#custom-parts">Custom EPP parts</a></nav>
   <section id="capabilities" className={styles.capabilities}>
    <div className={styles.sectionIntro}><p className={styles.eyebrow}>MADE FOR YOUR APPLICATION</p><h2>Better protection.<br/><span>Less weight. More possibilities.</span></h2><p>EPP solutions shaped around your product.</p><Link className={styles.inlineLink} href="/contact/">Discuss your requirements <Icon kind="arrow"/></Link></div>
    <div className={styles.benefits}>
     <section><span className={styles.benefitIcon}><Icon kind="box"/></span><div><h3>Protect what matters</h3><p>Custom-fit cushioning for safer transport.</p></div></section>
     <section><span className={styles.benefitIcon}><Icon kind="layers"/></span><div><h3>Lightweight & insulated</h3><p>Easy to handle. Designed for temperature control.</p></div></section>
     <section><span className={styles.benefitIcon}><Icon kind="check"/></span><div><h3>Made to fit</h3><p>Shapes and sizes to suit your application.</p></div></section>
    </div>
    <details className={styles.technical}><summary>Technical details <span aria-hidden="true">+</span></summary><div className={styles.methods}>{expertise.map(item=><section key={item.slug}><h3>{item.name}</h3><p>{item.text}</p><Link href={`/expertise/${item.slug}/`}>Learn more <Icon kind="arrow"/></Link></section>)}</div></details>
   </section>
  </div>
  <section id="development" className={styles.development}><div className={styles.wrap}><p className={styles.eyebrow}>FROM BRIEF TO PRODUCTION</p><h2>A clear path to your component.</h2><p className={styles.developmentLead}>Your brief. Our design. Tested for production.</p></div></section>
  <section id="custom-parts" className={`${styles.wrap} ${styles.custom}`}><div><p className={styles.eyebrow}>CUSTOM EPP PARTS</p><h2>Your geometry.<br/><span>Your operating conditions.</span></h2></div><div><p>Share your drawings and dimensions. We help develop an EPP part that fits.</p><Link className={styles.inlineLink} href="/expertise/custom-epp-parts/">Explore custom parts <Icon kind="arrow"/></Link></div></section>
  <section className={styles.contact}><div className={styles.wrap}><div><p className={styles.eyebrow}>START WITH YOUR APPLICATION</p><h2>Bring us your next<br/>engineering challenge.</h2><p>Tell us what you need.</p></div><Link href="/contact/">Discuss your project <Icon kind="arrow"/></Link></div></section>
 </article>;
}
