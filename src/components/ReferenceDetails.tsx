import Link from 'next/link';
import type {TechnicalGuide} from '../lib/reference-types';

export function DetailedGuide({guide}: {guide?: TechnicalGuide}) {
  if (!guide) return null;
  return <section className="section expanded-guide">
    <div className="focus-grid">{guide.sections.map(section => <article key={section.heading}>
      <h3>{section.heading}</h3><p>{section.text}</p>
    </article>)}</div>
    {guide.facts.length > 0 && <div className="reference-details">
      <h3>Material and design considerations</h3>
      <table className="selection-table"><tbody>{guide.facts.map((fact, index) => <tr key={index}>
        <th>{fact.label}</th><td>{fact.value}</td>
      </tr>)}</tbody></table>
    </div>}
    <Link className="text-link" href="/contact/">Discuss your application with PARK ↗</Link>
  </section>;
}
