import Link from 'next/link';
import {blogArticles} from '../lib/catalog';
import styles from './LithiumIonBatteryPackagingBlog.module.css';

const articleIntro=blogArticles[0].bodyIntro;

export const lithiumBatteryFaqs = [
  {
    question: 'What are the main lithium battery packaging requirements?',
    answer: 'Requirements depend on classification, condition, watt-hour rating, configuration and mode. Instructions may specify terminal protection, separation, movement control, cushioning, outer packaging, marks and documents. Confirm current provisions with a trained shipper.',
  },
  {
    question: 'How do I package lithium-ion batteries for shipping?',
    answer: 'Classify the battery and route first. Follow the applicable instruction for terminals, separation, restraint, inner and outer packaging, marks and documents. Use EPP only when the approved package design permits it.',
  },
  {
    question: 'Are EPP trays better than EPS for battery handling?',
    answer: 'EPP can be molded for repeatable location and may recover from some compression; EPS can be brittle. Compare tested performance and operating cost. Neither material alone proves compliance.',
  },
  {
    question: 'What is the difference between UN 3480 and UN 3481?',
    answer: 'UN 3480 is lithium-ion batteries shipped by themselves; UN 3481 is lithium-ion batteries packed with or contained in equipment. Confirm the actual configuration with the shipper.',
  },
  {
    question: 'Can Park Nonwoven make EPP trays from our CAD drawing?',
    answer: 'Park Nonwoven can discuss a custom tray using cell or module dimensions and CAD. Agree grade, tooling and sample validation. A tray does not grant dangerous-goods approval.',
  },
];

export default function LithiumIonBatteryPackagingBlog() {
  return (
    <article className={`editorial article-body resource-article-content ${styles.article}`} id="article-content">
      <p className={styles.articleIntro}>{articleIntro}</p>
      <section>
        <h2>Understanding Lithium-Ion Battery Transport Regulations (UN 3480, UN 3481 &amp; UN 38.3)</h2>
        <p>Classification starts with chemistry and shipment configuration. Lithium-ion and lithium-metal batteries use different UN numbers. Cells shipped by themselves differ from batteries packed with or contained in equipment.</p>
        <div className={styles.tableWrap} role="region" aria-label="Lithium battery UN number classifications" tabIndex={0}>
          <table>
            <thead><tr><th scope="col">UN number</th><th scope="col">Battery type</th><th scope="col">Typical configuration</th></tr></thead>
            <tbody>
              <tr><th scope="row">UN 3480</th><td>Lithium-ion</td><td>Batteries shipped by themselves</td></tr>
              <tr><th scope="row">UN 3481</th><td>Lithium-ion</td><td>Batteries packed with equipment or contained in equipment</td></tr>
              <tr><th scope="row">UN 3090</th><td>Lithium metal</td><td>Batteries shipped by themselves</td></tr>
              <tr><th scope="row">UN 3091</th><td>Lithium metal</td><td>Batteries packed with equipment or contained in equipment</td></tr>
            </tbody>
          </table>
        </div>
        <p>UN 38.3 tests cell and battery design types before transport; it does not certify an EPP tray or approve the complete shipping package. Keep the test summary available. Road rules depend on the countries on the route; ADR applies where adopted. Sea shipments use IMDG. Air shipments follow ICAO Technical Instructions and carrier rules, commonly implemented through IATA DGR. In 2026, IATA limits standalone UN 3480 air shipments to 30% state of charge unless required State approvals authorize otherwise. UN 3481 instructions differ. Confirm current packing instructions and carrier acceptance before booking.</p>
      </section>

      <section>
        <h2>Key Lithium Battery Packaging Requirements: Inner vs. Outer Protection</h2>
        <p>An outer box alone does not establish that the inner pack is suitable. Follow the applicable instruction for terminal protection, cell separation, conductive contact, movement and inner- and outer-package performance.</p>
        <ul>
          <li><strong>Prevent short circuits:</strong> protect exposed terminals and keep cells from contacting each other or conductive items where the instruction requires it.</li>
          <li><strong>Control movement:</strong> secure the battery so normal handling cannot create harmful shifting, abrasion or contact between terminals.</li>
          <li><strong>Cushion for the route:</strong> assess shock and vibration protection using the mass, fragility, orientation and actual distribution conditions.</li>
          <li><strong>Use the right outer package:</strong> some shipments require UN specification packaging; exceptions and permitted configurations differ. An inner EPP tray is not a substitute.</li>
        </ul>
        <p>Returnable trays can locate cells during factory and warehouse transfers. Confirm geometry, grade and any added insulation against the packing instruction; a fitted cavity alone does not guarantee terminal isolation.</p>
      </section>

      <section>
        <h2>How to Package Lithium-Ion Batteries for Shipping in 5 Steps</h2>
        <ol>
          <li><strong>Classify the consignment.</strong> Record lithium-ion or lithium-metal chemistry, cell or battery status, watt-hour rating, quantity, and whether units are new, used, damaged or defective. Damaged batteries need specialist assessment and may use separate provisions.</li>
          <li><strong>Confirm the route rules.</strong> Check state of charge, transport mode, origin, destination, transfer points and carrier rules. Do not carry an air instruction over to a sea or road shipment without checking its own packing provisions.</li>
          <li><strong>Protect and position each unit.</strong> Follow the relevant instruction for terminal protection and separation. A fitted <strong>EPP tray</strong> or molded box can be considered for repeatable positioning only if it is permitted in the selected package design and validated for the job.</li>
          <li><strong>Build the complete package.</strong> Add required inner packaging, cushioning and a compliant outer box. Check clearances, closures, stacking loads and moisture exposure against the actual shipment; do not leave movement or protective performance to assumption.</li>
          <li><strong>Check marks and paperwork.</strong> Apply the Class 9 label, lithium battery marks and handling information where the selected instruction requires them. Provide a UN 38.3 test summary and dangerous-goods documents when required; SDS and declaration needs depend on the applicable rules and carrier.</li>
        </ol>
        <p>To answer how to package lithium-ion batteries for shipping, give a dangerous-goods professional cell data, photos, configuration and route before finalizing packaging or tooling.</p>
      </section>

      <section>
        <h2>Why Molded EPP Trays Outperform Cardboard &amp; EPS for Battery Handling</h2>
        <p>“Outperform” depends on the job. EPP is a closed-cell bead foam that can be molded into fitted cavities and ribs. It can help organize cells and support repeated handling, depending on design. It does not prove impact performance, fire behaviour, electrical resistance or transport approval. Validate these on the complete package; do not treat a tray as thermal-runaway containment or proof of module-level crash performance.</p>
        <div className={styles.tableWrap} role="region" aria-label="Comparison of EPP, EPS and corrugated packaging" tabIndex={0}>
          <table>
            <thead><tr><th scope="col">Decision point</th><th scope="col">Molded EPP</th><th scope="col">EPS / Thermocol</th><th scope="col">Corrugated cardboard</th></tr></thead>
            <tbody>
              <tr><th scope="row">Repeated impact</th><td>Can recover after some compression; validate with the finished tray and load.</td><td>Can crack or retain crush damage; check the grade and impact conditions.</td><td>Fluting can crush and lose cushioning; performance depends on construction and humidity.</td></tr>
              <tr><th scope="row">Moisture and oils</th><td>Closed-cell structure can limit water uptake; chemical and oil compatibility is grade-specific.</td><td>Water behaviour depends on the part and exposure; verify contamination and handling needs.</td><td>Moisture can weaken the board; coatings and construction affect resistance.</td></tr>
              <tr><th scope="row">Clean handling</th><td>No loose paper fibres; inspect for wear and validate the cleanliness level required.</td><td>Beads can break away if the part is damaged; define cleanliness controls.</td><td>Paper fibres and dust may matter in sensitive work areas.</td></tr>
              <tr><th scope="row">Temperature range</th><td>Use grade-specific data and finished-part testing; there is no blanket -40°C to +110°C claim.</td><td>Confirm grade data and exposure limits for the actual part.</td><td>Humidity and heat affect board strength; validate the shipment environment.</td></tr>
              <tr><th scope="row">Reuse cycles</th><td>Can be designed for returnable use. Prove cycle life by testing; 100+ trips is not a universal guarantee.</td><td>Often used for one-way cushioning; reuse depends on condition and application.</td><td>Often used for one-way packaging; inspect before any reuse.</td></tr>
            </tbody>
          </table>
        </div>
        <p>Park Nonwoven can discuss <Link href="/products/lithium-ion-cell-epp-trays/">lithium-ion cell EPP trays</Link> for cylindrical formats such as 18650, 21700 and 4680, as well as prismatic cells. For heavier assemblies, see <Link href="/products/lithium-ion-battery-packaging/">molded battery module packaging</Link>. These product formats support a packaging conversation; whether a design is suitable for a regulated shipment depends on its complete construction and approval route.</p>
        <p>If the specification calls for an ESD threshold such as ≤10<sup>7</sup> Ω, or a flame classification such as FMVSS 302 or UL 94 HB, request current grade and test documentation. Confirm the method, conditioning and whether it applies to the finished component. Park Nonwoven should confirm grade availability against the brief; do not infer anti-static or flame performance from the material name alone.</p>
      </section>

      <section>
        <h2>Quick Pre-Shipment Lithium Battery Packaging Checklist</h2>
        <ul>
          <li>Battery chemistry, UN number, condition and watt-hour rating are confirmed.</li>
          <li>Route, mode, carrier, state of charge and current packing instruction are checked.</li>
          <li>Terminals are protected and cells are separated where the instruction requires it.</li>
          <li>The complete pack controls movement and has suitable, verified cushioning.</li>
          <li>Outer packaging, labels, marks and documents match the shipment configuration.</li>
          <li>Packaging inspection, return and retirement criteria are clear for reusable trays.</li>
        </ul>
      </section>

      <section>
        <h2>Frequently Asked Questions (FAQs)</h2>
        <div className={styles.faqList}>
          {lithiumBatteryFaqs.map(({question, answer}) => <div className={styles.faq} key={question}><h3>{question}</h3><p>{answer}</p></div>)}
        </div>
      </section>

      <section className={styles.cta}>
        <h2>Plan a battery handling tray around your application.</h2>
        <p>Park Nonwoven can review cell or module dimensions, CAD drawings and handling needs for a custom molded EPP packaging brief. Share your cell dimensions or CAD drawing for a custom quote.</p>
        <div><Link href="/markets/logistics-handling/">Explore logistics and handling</Link><Link href="/contact/">Contact Park Nonwoven</Link></div>
      </section>
    </article>
  );
}
