import ResponsiveImage from './ResponsiveImage';
import Link from 'next/link';
import styles from './Footer.module.css';

const exploreLinks = [
  ['Industries we serve', '/markets/'],
  ['Products & applications', '/products/'],
  ['Understand EPP', '/materials/expanded-polypropylene/'],
  ['Our expertise', '/expertise/'],
  ['Resources & insights', '/resources/'],
  ['About PARK', '/about/'],
];

const socialLinks = [
  {name:'LinkedIn',href:'https://in.linkedin.com/company/park-non-woven-pvt-ltd',icon:'linkedin'},
  {name:'YouTube',href:'https://www.youtube.com/@parknonwoven5472',icon:'youtube'},
  {name:'Facebook',href:'https://www.facebook.com/parknonwovenofficial/',icon:'facebook'},
  {name:'X',href:'https://x.com/ParkWoven',icon:'x'},
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.main}>
        <div>
          <Link className={styles.brand} href="/" aria-label="PARK Nonwoven EPP home">
            <ResponsiveImage className={styles.logo} src="/images/park-nonwoven-logo.png" alt="PARK Nonwoven" width={768} height={126}/>
          </Link>
          <p>EPP components · Protective packaging.<br/>Engineered polymer solutions.</p>
        </div>
        <div className={styles.explore}>
          <h4>Explore</h4>
          {exploreLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </div>
        <div className={styles.connect}>
          <h4>Connect with us</h4>
          <address className={styles.location}>Panipat, India</address>
          <a href="mailto:sales@parknonwoven.com">sales@parknonwoven.com ↗</a>
          <Link href="/products/">Explore EPP products &#8599;</Link>
          <nav className={styles.social} aria-label="PARK social media">{socialLinks.map(social => <a key={social.icon} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={`PARK on ${social.name} (opens in a new tab)`} title={social.name}><ResponsiveImage src={`/icons/social/${social.icon}.svg`} width={20} height={20} alt=""/><span>{social.name}</span></a>)}</nav>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} PARK Nonwoven. All rights reserved.</span>
        <span>Engineered around your application.</span>
      </div>
    </footer>
  );
}
