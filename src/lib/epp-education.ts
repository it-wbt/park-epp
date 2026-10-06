/** Original editorial guidance; references describe materials, not PARK capabilities. */
export type EppSourceId = 'bewi-epp' | 'knauf-hvac' | 'arpro-grades' | 'knauf-process' | 'arpro-design';
export type EppReference = {sourceIds: EppSourceId[]};
export type EppSource = {id: EppSourceId; title: string; organisation: string; url: string};

export const eppSources: EppSource[] = [
  {id: 'bewi-epp', title: 'EPP material properties and production', organisation: 'BEWI', url: 'https://bewi.com/material/epp/'},
  {id: 'knauf-hvac', title: 'EPP and EPS for technical HVAC components', organisation: 'Knauf Industries', url: 'https://www.knauf-industries.com/hvac-domestic-appliances/custom-made-hvac-components/'},
  {id: 'arpro-grades', title: 'ARPRO grade selection sheet', organisation: 'JSP', url: 'https://www.arpro.com/getContentAsset/21f4f120-db00-4e9d-bb9f-50227941434c/1771ac74-d775-4539-b7e3-0cbf0ab84455/arpro-grade-sheet-2025-issue-3_english.pdf?language=en-GB'},
  {id: 'knauf-process', title: 'EPP material, moulding and applications', organisation: 'Knauf Industries', url: 'https://info.knauf-industries.com/hubfs/Contenus%20%C3%A0%20t%C3%A9l%C3%A9charger%20-%20PDF/EPP%20MATERIAL%20SHEET%20EN_09-2026.pdf'},
  {id: 'arpro-design', title: 'ARPRO moulded-part design principles', organisation: 'JSP', url: 'https://www.arpro.com/getContentAsset/153f19cb-7bf8-4bd4-8ee8-f4082a783edb/1771ac74-d775-4539-b7e3-0cbf0ab84455/arpro-design-principles-en4.pdf?language=en-GB'},
];

export const eppOverview: EppReference & {eyebrow: string; title: string; summary: string; detail: string} = {
  eyebrow: 'UNDERSTANDING EPP',
  title: 'Lightweight foam. A considered engineering choice.',
  summary: 'Expanded polypropylene, or EPP, is a thermoplastic bead foam with a predominantly closed-cell structure.',
  detail: 'Air-filled beads form components combining low weight, cushioning and insulation. Grade, density and geometry determine performance.',
  sourceIds: ['bewi-epp'],
};

export const eppProperties: (EppReference & {id: string; title: string; benefit: string; consideration: string})[] = [
  {id: 'weight', title: 'Low weight', benefit: 'A cellular structure reduces the amount of solid polymer in a component.', consideration: 'Balance the weight target against support, stiffness and handling loads.', sourceIds: ['bewi-epp']},
  {id: 'impact', title: 'Impact absorption & recovery', benefit: 'EPP can absorb impact energy and recover after deformation.', consideration: 'Repeated-impact performance depends on the grade, geometry and severity of loading.', sourceIds: ['bewi-epp']},
  {id: 'thermal', title: 'Thermal insulation', benefit: 'The foam structure helps slow heat transfer through a part.', consideration: 'Evaluate thickness, joints and operating temperatures in the complete assembly.', sourceIds: ['knauf-hvac']},
  {id: 'moisture', title: 'Low water absorption', benefit: 'Closed cells limit water uptake within the material.', consideration: 'Seams, openings and cleaning conditions still need attention in a finished product.', sourceIds: ['bewi-epp']},
  {id: 'acoustic', title: 'Noise & vibration control', benefit: 'EPP can contribute to quieter technical assemblies.', consideration: 'Request measurements for the actual frequencies, mountings and material grade; acoustic functions differ.', sourceIds: ['knauf-hvac']},
  {id: 'geometry', title: 'Integrated moulded details', benefit: 'Cavities, ribs and interfaces can be designed into a foam component.', consideration: 'Discuss bead access, wall thickness, draft, vent locations and demoulding before fixing the drawing.', sourceIds: ['arpro-design']},
];

// Cooling/ejection sequence also cross-checked against JSP's indexed 2018
// General Product and Processing Guidelines and Erlenbach's EPP equipment guidance.
// The current Knauf document below provides the reader-facing process reference.
export const eppManufacturingSteps: (EppReference & {title: string; description: string})[] = [
  {title: 'Prepare & fill', description: 'Select expanded beads and fill the mould cavity. Pressure filling introduces beads into a closed tool.', sourceIds: ['knauf-process']},
  {title: 'Fuse with steam', description: 'Steam heats the packed beads so their surfaces bond into the required foam shape.', sourceIds: ['knauf-process']},
  {title: 'Cool & release', description: 'Cool and stabilise the part, then open the mould and eject it with support.', sourceIds: ['knauf-process']},
  {title: 'Condition & inspect', description: 'Apply any specified conditioning, then check dimensions, density, appearance and fit.', sourceIds: ['knauf-process']},
];

export const eppSelectionChecklist: (EppReference & {title: string; detail: string})[] = [
  {title: 'Drawing & interfaces', detail: 'Share dimensions, contact surfaces, clearances, attachment points and inspection datums.', sourceIds: ['arpro-design']},
  {title: 'Loads & impacts', detail: 'State payload, drop conditions, compression, repeated handling and acceptable deformation.', sourceIds: ['bewi-epp']},
  {title: 'Operating environment', detail: 'Describe temperatures, exposure duration, moisture, vibration and cleaning chemicals.', sourceIds: ['knauf-hvac']},
  {title: 'Grade & moulded density', detail: 'Specify the finished density and tolerance; request the matching grade data.', sourceIds: ['arpro-grades']},
  {title: 'Application qualifications', detail: 'Identify food contact, fire performance, electrical protection or UV requirements early.', sourceIds: ['arpro-grades']},
  {title: 'Tooling & finish', detail: 'Agree wall transitions, draft, visible vent marks, colour and surface expectations.', sourceIds: ['arpro-design']},
  {title: 'Samples & acceptance', detail: 'Set tests, conditioning, dimensional tolerances and pass criteria before approving production.', sourceIds: ['arpro-design']},
  {title: 'Volume & service life', detail: 'Share quantities, planned reuse, cleaning, collection and the intended recycling route.', sourceIds: ['knauf-process']},
];

export const eppComparison: (EppReference & {topic: string; epp: string; eps: string})[] = [
  {topic: 'Base material', epp: 'Expanded polypropylene.', eps: 'Expanded polystyrene.', sourceIds: ['knauf-hvac']},
  {topic: 'Typical selection priority', epp: 'Resilient components and repeated handling.', eps: 'Lightweight, economical insulation.', sourceIds: ['knauf-hvac']},
  {topic: 'Thermal role', epp: 'Insulation with application-specific thickness and grade.', eps: 'Insulation with application-specific thickness and grade.', sourceIds: ['knauf-hvac']},
  {topic: 'Cost decision', epp: 'Compare tooling, density and service life.', eps: 'Compare tooling, density and service life.', sourceIds: ['knauf-hvac']},
  {topic: 'End of life', epp: 'Confirm a suitable EPP collection and recycling stream.', eps: 'Confirm a suitable EPS collection and recycling stream.', sourceIds: ['knauf-hvac']},
];

export const eppApplications: (EppReference & {slug: string; title: string; summary: string; examples: string[]; designFocus: string})[] = [
  {slug: 'sports-leisure', title: 'Sports, Leisure & Early Childhood', summary: 'Lightweight forms for activity and play.', examples: ['Sports accessories', 'Moulded toy components', 'Protective equipment inserts'], designFocus: 'Define users, contact, attachments and complete-product testing.', sourceIds: ['knauf-process']},
  {slug: 'logistics-handling', title: 'Logistics & Material Handling', summary: 'Protection shaped around the handling cycle.', examples: ['Returnable trays', 'Protective inserts', 'Insulated containers'], designFocus: 'Map payload, stacking, cleaning and return journeys.', sourceIds: ['knauf-process']},
  {slug: 'hvac', title: 'HVAC', summary: 'Combine insulation with component integration.', examples: ['Insulating housings', 'Equipment supports', 'Thermal covers'], designFocus: 'Evaluate heat, condensation, noise and service access.', sourceIds: ['knauf-hvac']},
  {slug: 'mobility', title: 'Automotive', summary: 'Lightweight components within larger vehicle assemblies.', examples: ['Energy absorbers', 'Tool organisers', 'Component packaging'], designFocus: 'Validate loads, temperature, attachment and assembly behaviour.', sourceIds: ['bewi-epp']},
];

export const eppFaqs: (EppReference & {question: string; answer: string})[] = [
  {question: 'Is EPP the same as solid polypropylene?', answer: 'It uses polypropylene in an expanded cellular form. Solid PP mouldings and EPP foam components therefore need different geometry and performance specifications.', sourceIds: ['bewi-epp']},
  {question: 'How should I choose a density?', answer: 'Start with the required load response and geometry. Distinguish loose-bead bulk density from finished moulded density; ask for relevant curves and tolerances.', sourceIds: ['arpro-design']},
  {question: 'Can a part take repeated impacts?', answer: 'Resilience supports repeated use, but damage and permanent deformation remain possible. Agree realistic impact conditions and inspection or replacement criteria.', sourceIds: ['knauf-process']},
  {question: 'Does low water absorption mean waterproof?', answer: 'Low material uptake does not establish a watertight container. Validate closures, joints and drainage against the intended exposure.', sourceIds: ['bewi-epp']},
  {question: 'Is EPP fireproof?', answer: 'No blanket fire rating applies. Flame-retardant grades exist; request test evidence for the chosen grade, density, thickness and intended component.', sourceIds: ['arpro-grades']},
  {question: 'Can EPP contact food?', answer: 'Some grades have food-contact approval. Request current documentation for the exact material and intended conditions; the finished article may require migration testing.', sourceIds: ['arpro-grades']},
  {question: 'Which temperature range can I specify?', answer: 'Use the selected grade data and validate exposure duration, load and assembly fit. A generic foam temperature claim is insufficient for equipment design.', sourceIds: ['arpro-grades']},
  {question: 'Is every EPP part recycled or recyclable locally?', answer: 'Recycled content varies by grade. Recyclability also needs a collection route that accepts the finished part, including its inserts, labels and contamination.', sourceIds: ['arpro-grades']},
  {question: 'How accurate can a moulded part be?', answer: 'Shrinkage and tolerances depend on grade, density, tooling, geometry and processing. Agree critical dimensions and measurement conditions with the moulder.', sourceIds: ['arpro-design']},
  {question: 'What should be tested before approval?', answer: 'Test representative parts in the intended assembly. Agree load, fit and repeated-use checks, then add application-specific thermal, acoustic or qualification tests.', sourceIds: ['arpro-design']},
];
