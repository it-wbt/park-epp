import ResponsiveImage from './ResponsiveImage';
import Link from 'next/link';
import {eppProperties, eppManufacturingSteps, eppComparison, eppSelectionChecklist} from '../lib/epp-education';
import {Icon} from './ui';
import styles from './EppEducation.module.css';
import homeStyles from './EppKnowledge.module.css';

export function BeadStructure() {
  return <div className={styles.structure}>
    <svg viewBox="0 0 360 220" role="img" aria-label="Simplified EPP structure: expanded beads contain air-filled cells enclosed by polypropylene walls">
      <defs><pattern id="epp-cells" width="25" height="23" patternUnits="userSpaceOnUse"><path d="M0 7 12 0 25 7 25 19 12 26 0 19Z" fill="none" stroke="#c8e8b4" strokeWidth="1.2"/></pattern></defs>
      <g fill="url(#epp-cells)" stroke="#d7f58a" strokeWidth="2.5">
        <path d="M65 35Q77 9 104 18L143 28Q162 34 159 61L151 97Q146 118 119 115L78 107Q58 103 57 81Z"/>
        <path d="M178 19Q196 7 220 18L250 38Q265 49 256 75L242 108Q233 126 209 118L174 105Q157 97 161 75L165 40Z"/>
        <path d="M83 126Q92 114 116 123L150 132Q170 140 161 165L150 187Q141 202 119 195L85 185Q66 177 71 156Z"/>
        <path d="M190 125Q207 114 227 125L253 148Q268 163 255 181L234 200Q219 213 199 202L174 181Q159 167 170 149Z"/>
      </g>
      <g stroke="#8ba7ae" strokeWidth="1" fill="none"><path d="M267 46H308V24"/><path d="M91 154H33V181"/></g>
      <g fill="#dbe7e9" fontSize="10" fontFamily="inherit"><text x="288" y="17">Bead</text><text x="16" y="197">Cells</text></g>
    </svg>
    <div><span>AIR-FILLED CELLS</span><strong>Light by structure.</strong><p>Thin polypropylene walls surround the cells inside each expanded bead.</p><small>Simplified material illustration</small></div>
  </div>;
}

export default function EppKnowledge() {
  return <section className={homeStyles.section} aria-labelledby="epp-knowledge-heading">
    <div className={homeStyles.heading} data-reveal>
      <div><p className="eyebrow">GET TO KNOW EPP</p><h2 id="epp-knowledge-heading">Small beads.<br/><span>More possibilities.</span></h2></div>
      <div className={homeStyles.intro}><p>Understand the material behind the component, from its cellular structure to the choices that shape performance.</p><Link className={homeStyles.guideLink} href="/materials/expanded-polypropylene/">Read the complete EPP guide <Icon kind="arrow"/></Link></div>
    </div>
    <div className={homeStyles.layout}>
      <figure className={homeStyles.material}>
        <div className={homeStyles.visual}>
          <ResponsiveImage src="/images/generated/epp-material-closeup.webp" alt="Material illustration of loose EPP beads beside the textured surface of a moulded foam component" width="1100" height="1100" loading="lazy"/>
          <span className={homeStyles.imageLabel}>THE MATERIAL, UP CLOSE</span>
        </div>
        <figcaption className={homeStyles.caption}><span className={homeStyles.materialName}>EPP<span>Expanded polypropylene</span></span><p>Light by structure. Air-filled cells inside each bead bring low weight to a moulded component.</p></figcaption>
      </figure>
      <div className={homeStyles.topics}>
        <details name="home-epp-topics" open>
          <summary><span><small>01</small>Why choose EPP?</span><Icon kind="close"/></summary>
          <div className={homeStyles.properties}>{eppProperties.map(item => <article key={item.id}><h3>{item.title}</h3><p>{item.benefit}</p></article>)}</div>
        </details>
        <details name="home-epp-topics">
          <summary><span><small>02</small>How is EPP moulded?</span><Icon kind="close"/></summary>
          <ol className={homeStyles.steps}>{eppManufacturingSteps.map(item => <li key={item.title}><h3>{item.title}</h3><p>{item.description}</p></li>)}</ol>
        </details>
        <details name="home-epp-topics">
          <summary><span><small>03</small>EPP or EPS?</span><Icon kind="close"/></summary>
          <div className={homeStyles.comparison}>{eppComparison.slice(0, 3).map(row => <div key={row.topic}><h3>{row.topic}</h3><p><strong>EPP</strong> {row.epp}</p><p><strong>EPS</strong> {row.eps}</p></div>)}<Link href="/materials/expanded-polypropylene/#epp-comparison">Compare the materials <Icon kind="arrow"/></Link></div>
        </details>
        <details name="home-epp-topics">
          <summary><span><small>04</small>What should I specify?</span><Icon kind="close"/></summary>
          <ul className={homeStyles.checklist}>{eppSelectionChecklist.slice(0, 4).map(item => <li key={item.title}><Icon kind="check"/><div><h3>{item.title}</h3><p>{item.detail}</p></div></li>)}</ul>
        </details>
      </div>
    </div>
  </section>;
}
