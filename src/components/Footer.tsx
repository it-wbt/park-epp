import Link from 'next/link';
import {brand} from '../lib/catalog';
import styles from './Footer.module.css';

const exploreLinks = [
  ['Industries we serve', '/markets/'],
  ['Products & applications', '/products/'],
  ['Understand EPP', '/materials/expanded-polypropylene/'],
  ['Our expertise', '/expertise/'],
  ['Resources & insights', '/resources/'],
  ['About PARK', '/about/'],
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.main}>
        <div>
          <Link className={styles.brand} href="/" aria-label="PARK Nonwoven EPP home">
            <img className={styles.logo} src="/images/park-nonwoven-logo.png" alt="PARK Nonwoven" width={768} height={126}/>
          </Link>
          <p>EPP &amp; EPS components · Protective packaging.<br/>Engineered polymer solutions.</p>
        </div>
        <div>
          <h4>Explore</h4>
          {exploreLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </div>
        <div>
          <h4>Connect with us</h4>
          <a href="mailto:sales@parknonwoven.com">sales@parknonwoven.com ↗</a>
          <Link href="/products/">Explore EPP products ↗</Link>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} {brand}. All rights reserved.</span>
        <Link href="/privacy/">Privacy &amp; information</Link>
        <span>Material possibilities. Made around your needs.</span>
      </div>
    </footer>
  );
}
