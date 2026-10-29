import ResponsiveImage from './ResponsiveImage';
import Link from 'next/link';
import {Icon} from './ui';
import styles from './HomeEppExplainer.module.css';

export default function HomeEppExplainer() {
  return <section id="technology" className={styles.section} aria-labelledby="home-epp-title">
    <div className={styles.copy}>
      <p className={styles.eyebrow}>EPP SOLUTIONS FOR YOUR BUSINESS</p>
      <h2 id="home-epp-title">Lightweight products.<br/><span>Made for your needs.</span></h2>
      <p className={styles.description}>Explore custom moulded EPP components, protective packaging and insulated containers from an EPP foam manufacturer in India.</p>
      <ul className={styles.benefits}><li><Icon kind="check"/>Impact protection</li><li><Icon kind="check"/>Thermal insulation</li><li><Icon kind="check"/>Custom shapes & sizes</li></ul>
      <div className={styles.actions}><Link className={styles.primary} href="/products/">Explore products <Icon kind="arrow"/></Link><Link className={styles.secondary} href="/contact/">Get a quote <Icon kind="arrow"/></Link></div>
    </div>
    <ResponsiveImage className={styles.image} src="/images/generated/epp-material-closeup.webp" alt="Moulded EPP component with lightweight foam beads" width={1440} height={960} sizes="(max-width: 640px) 320px, 36vw" loading="lazy"/>
  </section>;
}
