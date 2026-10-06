import Link from 'next/link';
import {Icon} from './ui';
import styles from './HomeApplications.module.css';

const applications = [
  {
    title: 'Protective packaging',
    image: '/images/generated/logistics.webp',
    alt: 'Moulded foam transport containers and fitted protective inserts',
    icon: 'shield',
    description: 'Fitted cushions, inserts and returnable packs shaped around your product and its handling journey.',
    examples: 'Transit protection · Custom inserts · Returnable packaging',
    href: '/solutions/protect-in-transit/',
    link: 'Explore protection',
  },
  {
    title: 'Thermal insulation',
    image: '/images/generated/hvac.webp',
    alt: 'Moulded EPP insulation housing around an HVAC assembly',
    icon: 'snow',
    description: 'Insulated containers and equipment housings developed around temperature, space and operating conditions.',
    examples: 'Insulated transport · Equipment housings · Cold-chain packs',
    href: '/solutions/manage-temperature/',
    link: 'Explore insulation',
  },
  {
    title: 'Lightweight components',
    image: '/images/generated/mobility.webp',
    alt: 'Shaped foam components alongside a vehicle interior assembly',
    icon: 'layers',
    description: 'Moulded forms that bring material, geometry and assembly interfaces together in a considered component.',
    examples: 'Vehicle components · Shaped supports · Assembly inserts',
    href: '/solutions/reduce-weight/',
    link: 'Explore lightweight design',
  },
];

export default function HomeApplications() {
  return (
    <section className={styles.section} aria-labelledby="epp-applications-heading">
      <div className={styles.heading} data-reveal>
        <div>
          <p className="eyebrow">EPP IN APPLICATION</p>
          <h2 id="epp-applications-heading">Made to protect.<br/><span>Shaped to perform.</span></h2>
        </div>
        <p>From a fitted transport pack to a part inside an assembly, explore where expanded polypropylene can fit into your next project.</p>
      </div>

      <div className={styles.cards}>
        {applications.map((application, index) => (
          <Link className={styles.card} href={application.href} key={application.title} data-reveal>
            <div className={styles.image}>
              <img src={application.image} alt={application.alt} width={900} height={600} loading="lazy"/>
              <span className={styles.number}>0{index + 1}</span>
              <span className={styles.icon}><Icon kind={application.icon}/></span>
            </div>
            <div className={styles.copy}>
              <h3>{application.title}</h3>
              <p>{application.description}</p>
              <p className={styles.examples}>{application.examples}</p>
              <span className={styles.link}>{application.link}<Icon kind="arrow"/></span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
