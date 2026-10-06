'use client';

import Link from 'next/link';
import {useState} from 'react';
import {Icon} from './ui';
import styles from './HomeApplications.module.css';

const applications = [
  {
    title: 'Protective packaging',
    verb: 'Protect.',
    focus: 'SHAPED AROUND THE JOURNEY',
    image: '/images/generated/factory-logistics.webp',
    alt: 'AI factory illustration of moulded foam containers beside a production line',
    icon: 'shield',
    description: 'Fitted cushions, inserts and returnable packs shaped around your product and its handling journey.',
    examples: 'Transit protection · Custom inserts · Returnable packaging',
    href: '/solutions/protect-in-transit/',
    link: 'Explore protection',
  },
  {
    title: 'Thermal insulation',
    verb: 'Insulate.',
    focus: 'DESIGNED AROUND TEMPERATURE',
    image: '/images/generated/factory-hvac.webp',
    alt: 'AI factory illustration of HVAC housings beside guarded moulding equipment',
    icon: 'snow',
    description: 'Insulated containers and equipment housings developed around temperature, space and operating conditions.',
    examples: 'Insulated transport · Equipment housings · Cold-chain packs',
    href: '/solutions/manage-temperature/',
    link: 'Explore insulation',
  },
  {
    title: 'Lightweight components',
    verb: 'Lighten.',
    focus: 'MADE TO FIT THE ASSEMBLY',
    image: '/images/generated/factory-automotive.webp',
    alt: 'AI factory illustration of automotive foam supports on an inspection fixture',
    icon: 'layers',
    description: 'Moulded forms that bring material, geometry and assembly interfaces together in a considered component.',
    examples: 'Vehicle components · Shaped supports · Assembly inserts',
    href: '/solutions/reduce-weight/',
    link: 'Explore lightweight design',
  },
];

export default function HomeApplications() {
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <section className={styles.section} aria-labelledby="epp-applications-heading">
      <div className={styles.heading} data-reveal>
        <div>
          <p className="eyebrow">EPP IN APPLICATION</p>
          <h2 id="epp-applications-heading">Made to protect.<br/><span>Shaped to perform.</span></h2>
        </div>
        <div className={styles.intro}>
          <p>Explore EPP for protection, insulation and lightweight components.</p>
          <Link className={styles.link} href="/solutions/">Explore all solutions <Icon kind="arrow"/></Link>
        </div>
      </div>

      <div className={styles.layout} data-reveal>
        <figure className={styles.visual}>
          {applications.map((application, index) => (
            <div className={styles.scene} data-active={selected === index} aria-hidden={selected !== index} key={application.title}>
              <img src={application.image} alt={application.alt} width={1440} height={960} loading="lazy"/>
              <div className={styles.sceneCopy}>
                <span>{application.focus}</span>
                <strong>{application.verb}</strong>
              </div>
            </div>
          ))}
          <div className={styles.visualTop} aria-hidden="true"><span><Icon kind={applications[selected].icon}/> EPP IN PRACTICE</span><span>0{selected + 1} <i>/</i> 03</span></div>
          <div className={styles.markers} aria-hidden="true">{applications.map((application, index) => <span key={application.title} data-active={selected === index}/>)}</div>
        </figure>

        <div className={styles.applications}>
          <p className={styles.listLabel}>ONE MATERIAL. DIFFERENT POSSIBILITIES.</p>
          <div className={styles.rows}>
            {applications.map((application, index) => (
              <details className={styles.application} key={application.title} name="home-epp-applications" open={expanded === index}>
                <summary onClick={event => {
                  event.preventDefault();
                  setSelected(index);
                  setExpanded(current => current === index ? null : index);
                }}>
                  <span className={styles.number}>0{index + 1}</span>
                  <h3>{application.title}</h3>
                  <span className={styles.direction}><Icon kind="arrow"/></span>
                </summary>
                <div className={styles.copy}>
                  <p>{application.description}</p>
                  <p className={styles.examples}>{application.examples}</p>
                  <Link className={styles.link} href={application.href}>{application.link}<Icon kind="arrow"/></Link>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
