import Link from 'next/link';
import {blogArticles} from '../lib/catalog';
import styles from './LithiumIonBatteryPackagingBlog.module.css';

const articleIntro=blogArticles[0].bodyIntro;

export const lithiumBatteryFaqs = [
  {
    question: 'What are the main lithium battery packaging requirements?',
    answer: 'Protect terminals and prevent damaging contact or movement. The exact inner packaging, outer box, labels and documents depend on battery type, condition and route. Ask your dangerous-goods shipper to confirm the current instructions.',
  },
  {
    question: 'How do I package lithium-ion batteries for shipping?',
    answer: 'First confirm the battery classification and shipping route. Then follow the matching instructions for terminal protection, inner tray, outer box and labels. Use an EPP tray only when the approved package design allows it.',
  },
  {
    question: 'Are EPP trays better than EPS for battery handling?',
    answer: 'EPP can be moulded to fit a cell layout and designed for return trips. EPS may crack after impact. Compare samples, handling needs and cost; neither material alone proves shipping compliance.',
  },
  {
    question: 'What is the difference between UN 3480 and UN 3481?',
    answer: 'UN 3480 is lithium-ion batteries shipped by themselves; UN 3481 is lithium-ion batteries packed with or contained in equipment. Confirm the actual configuration with the shipper.',
  },
  {
    question: 'Can Park Nonwoven make EPP trays from our CAD drawing?',
    answer: 'Yes. Park Nonwoven can discuss a custom-moulded tray using your cell or module dimensions, CAD drawing or sketch. Share quantity and handling needs for a quote. The tray itself does not approve a regulated shipment.',
  },
];

export default function LithiumIonBatteryPackagingBlog() {
  return (
    <article className={`editorial article-body resource-article-content ${styles.article}`} id="article-content">
      <p className={styles.articleIntro}>{articleIntro}</p>
      <section>
        <h2>Understanding Lithium-Ion Battery Transport Regulations (UN 3480, UN 3481 &amp; UN 38.3)</h2>
        <p>These UN numbers tell the shipper which battery is in the package and how it is packed. Lithium-ion and lithium-metal are different battery types, so they use different numbers.</p>
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
        <p><strong>UN 38.3</strong> is a set of tests for a battery design before transport. It checks the cell or battery, not the EPP tray. Ask the battery supplier for its test summary. Shipping rules also change by route: ADR may apply on road journeys, the IMDG Code covers sea freight, and air freight follows ICAO rules and carrier requirements, often using IATA instructions. For 2026, standalone UN 3480 air shipments have a 30% state-of-charge limit unless the required State approvals allow otherwise. Ask your dangerous-goods shipper which rule applies to your shipment before packing.</p>
      </section>

      <section>
        <h2>Key Lithium Battery Packaging Requirements: Inner vs. Outer Protection</h2>
        <p>Think of the package as two parts. The inner tray holds and separates the cells. The outer box protects the full load and must meet the shipping instruction. A suitable outer box does not automatically make the inside layout correct.</p>
        <ul>
          <li><strong>Cover the terminals:</strong> stop exposed contacts from touching other cells or conductive items when the rules require it.</li>
          <li><strong>Keep cells in place:</strong> use pockets, dividers or other approved restraint to prevent harmful movement.</li>
          <li><strong>Cushion the load:</strong> consider product weight, fragile areas and the handling route; test the complete packed load.</li>
          <li><strong>Choose the right outer box:</strong> follow the rule for the specific shipment. An EPP tray does not replace required shipping packaging.</li>
        </ul>
        <p>Park Nonwoven can discuss a tray layout around your cell dimensions, quantity per tray and handling process. Your dangerous-goods shipper should confirm that the chosen tray and outer box are permitted for the shipment.</p>
      </section>

      <section>
        <h2>How to Package Lithium-Ion Batteries for Shipping in 5 Steps</h2>
        <ol>
          <li><strong>Identify the battery.</strong> Note its chemistry, cell or module type, watt-hour rating, quantity and condition. Get specialist advice before shipping a damaged or defective battery.</li>
          <li><strong>Confirm how it will travel.</strong> Tell your dangerous-goods shipper the origin, destination and whether the shipment goes by road, sea or air. Ask which packing instruction and state-of-charge limit apply.</li>
          <li><strong>Plan the inner tray.</strong> Share cell dimensions, weight, quantity per tray and terminal locations. Park Nonwoven can discuss a custom-moulded <strong>EPP tray</strong> for positioning and handling, if the shipment rules allow it.</li>
          <li><strong>Select the outer packaging.</strong> Choose the box and any extra cushioning required by the shipper. Check that cells stay in place and the packed load suits the handling route.</li>
          <li><strong>Finish the shipping paperwork.</strong> Apply Class 9 labels, lithium battery marks and other documents where required. Ask the shipper which test summary, safety data sheet (SDS) or declaration to provide.</li>
        </ol>
        <p>Before ordering custom tooling, send Park Nonwoven a drawing or sketch, the cell or module size, quantity per tray and intended handling route. Your shipping specialist can confirm compliance details at the same time.</p>
      </section>

      <section>
        <h2>When Molded EPP Trays May Suit Battery Handling</h2>
        <p>Choose packaging around how your cells will be handled. A custom EPP tray can be moulded with pockets to match a product layout and may suit a return route. The right option depends on the cell, shipment and handling conditions. Test the finished pack before relying on it for impact protection. EPP trays are not fire-containment systems and do not prove shipping compliance.</p>
        <div className={styles.tableWrap} role="region" aria-label="Comparison of EPP, EPS and corrugated packaging" tabIndex={0}>
          <table>
            <thead><tr><th scope="col">Decision point</th><th scope="col">Molded EPP</th><th scope="col">EPS / Thermocol</th><th scope="col">Corrugated cardboard</th></tr></thead>
            <tbody>
              <tr><th scope="row">Handling and impact</th><td>Can be moulded to locate products; test the finished tray with the real load.</td><td>May crack after impact; check the grade and use.</td><td>Can crush and lose cushioning; check the box and route.</td></tr>
              <tr><th scope="row">Water and oils</th><td>May limit water uptake. Check chemical and oil compatibility for the selected grade.</td><td>Check the part and exposure conditions.</td><td>Moisture can weaken board strength.</td></tr>
              <tr><th scope="row">Clean handling</th><td>No paper fibres, but inspect for wear and set a cleanliness level.</td><td>Damaged beads can break away; set inspection rules.</td><td>Paper fibres or dust may matter in sensitive areas.</td></tr>
              <tr><th scope="row">Temperature</th><td>Check grade and finished-tray data. Do not assume a general -40 to +110 degree C range.</td><td>Check grade data and actual exposure.</td><td>Heat and moisture can affect strength.</td></tr>
              <tr><th scope="row">Reuse</th><td>Can be designed for return trips; test expected cycle life. 100+ trips is not guaranteed.</td><td>Often used once; inspect before reuse.</td><td>Often used once; inspect before reuse.</td></tr>
            </tbody>
          </table>
        </div>
        <p>Park Nonwoven offers custom <Link href="/products/lithium-ion-cell-epp-trays/">EPP trays for lithium-ion cells</Link>, including cylindrical formats such as 18650, 21700 and 4680, and prismatic formats. For larger assemblies, see <Link href="/products/lithium-ion-battery-packaging/">EPP battery-module packaging</Link>. Share your dimensions and quantity so the team can discuss a design and quote.</p>
        <p>If you need anti-static or a specific fire-test rating, tell Park Nonwoven which requirement applies. Ask for grade and finished-part test documents; do not assume EPP automatically meets an ESD or fire standard.</p>
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
        <h2>Need a custom EPP battery tray?</h2>
        <p>Park Nonwoven can discuss a moulded tray around your cells or module. For a useful first quote, send:</p>
        <ul>
          <li>Cell or module dimensions, CAD drawing or sketch</li>
          <li>Product weight and number of cells per tray</li>
          <li>Required quantity and whether trays will return for reuse</li>
          <li>How the product will be handled or shipped</li>
          <li>Any known outer-box, ESD or other packaging requirements</li>
        </ul>
        <p>The Park Nonwoven team can review your brief and discuss next steps. Your shipper should confirm shipment classification and dangerous-goods approval.</p>
        <div><Link href="/markets/logistics-handling/">Explore logistics and handling</Link><Link href="/contact/">Contact Park Nonwoven</Link></div>
      </section>
    </article>
  );
}
