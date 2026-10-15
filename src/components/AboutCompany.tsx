import Link from 'next/link';
import {Icon} from './ui';
import {Breadcrumb} from './shared';
import {markets} from '../lib/catalog';
import styles from './AboutCompany.module.css';

export default function AboutCompany() {
  return <article className={styles.page}>
    <div className={styles.container}><Breadcrumb items={[{name:'About us'}]}/>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>ABOUT PARK GROUP</p>
        <h1>Material innovation.<br/><span>Built on experience.</span></h1>
        <div className={styles.heroBottom}><p>From nonwoven textiles to polymer materials, we bring manufacturing experience to the applications that move everyday life.</p><a href="#our-story" className={styles.jump}>Discover our story <Icon kind="arrow"/></a></div>
      </header>
      <div className={styles.facts} aria-label="PARK Group at a glance"><div><strong>1997</strong><span>Year founded</span></div><div><strong>Panipat</strong><span>Headquartered in Haryana, India</span></div><div><strong>12+</strong><span>Manufacturing plants</span></div></div>
      <section id="our-story" className={styles.story}><div><p className={styles.eyebrow}>OUR BEGINNINGS</p><h2>A foundation in materials.<br/>A wider world of possibilities.</h2></div><div className={styles.prose}><p className={styles.lead}>Founded in 1997 by Pankaj Kapoor, PARK Group grew from its beginnings in automotive materials into a manufacturing business serving industries in India and overseas.</p><p>Headquartered in Panipat, Haryana, the group brings together PARK Industries Pvt Ltd, PARK Non-Woven Pvt Ltd, PARK Felts Pvt Ltd and Essar Industries.</p><p>Today, its manufacturing network includes locations across Delhi NCR, Chennai, Pune, Gujarat and Bangalore, supported by in-house laboratory testing.</p></div></section>
    </div>
    <section className={styles.manufacturing}><div className={styles.container}><div className={styles.sectionHeading}><p className={styles.eyebrow}>WHAT BRINGS US TOGETHER</p><h2>Experience in every process.<br/><span>Care in every decision.</span></h2></div><div className={styles.principles}>
      <section><h3>Materials & manufacturing</h3><p>Needle punching, stitch bonding, thermo-bonding and lamination bring together our experience in nonwoven textiles and polymer materials.</p></section>
      <section><h3>Quality through testing</h3><p>In-house laboratory testing supports the group's focus on quality and responsible manufacturing.</p></section>
      <section><h3>Care beyond manufacturing</h3><p>Health check-ups and eye-care camps are part of PARK's community initiatives, alongside a commitment to environmentally responsible business practices.</p></section>
    </div></div></section>
    <section className={`${styles.container} ${styles.applications}`}><div><p className={styles.eyebrow}>PARK NONWOVEN EPP</p><h2>Group experience.<br/><span>Applied to your industry.</span></h2><p>Explore expanded polypropylene products for protection, insulation and lightweight components, shaped around the needs of your application.</p><Link className={styles.textLink} href="/products/">Explore all EPP products <Icon kind="arrow"/></Link></div><div className={styles.industryList}>{markets.map(market => <Link key={market.slug} href={`/markets/${market.slug}/`}><span>{market.name}</span><Icon kind="arrow"/></Link>)}</div></section>
    <section className={styles.contact}><div className={styles.container}><p className={styles.eyebrow}>LET'S BUILD WHAT COMES NEXT</p><h2>Your next application.<br/>Our next conversation.</h2><div className={styles.contactBottom}><p>Bring your ideas, drawings and requirements.<br/>Start a conversation with the PARK team.</p><Link href="/contact/">Talk to our team <Icon kind="arrow"/></Link></div></div></section>
  </article>;
}
