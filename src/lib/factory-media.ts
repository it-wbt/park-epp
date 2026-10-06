/** Original AI factory illustrations, not photographs of a named production facility. */
export type FactoryMedia = {src: string; alt: string};

export const factoryMedia = {
  childhood: {src: '/images/generated/factory-childhood.webp', alt: 'AI factory illustration of moulded foam play forms being checked at a finishing workstation'},
  logistics: {src: '/images/generated/factory-logistics.webp', alt: 'AI factory illustration of reusable foam transport trays and insulated containers beside a moulding line'},
  hvac: {src: '/images/generated/factory-hvac.webp', alt: 'AI factory illustration of foam HVAC housings and ducts beside guarded moulding equipment'},
  automotive: {src: '/images/generated/factory-automotive.webp', alt: 'AI factory illustration of moulded automotive foam supports on a component inspection fixture'},
  inspection: {src: '/images/generated/factory-polymer-inspection.webp', alt: 'AI factory illustration of foam packaging and rigid polymer containers at a dimensional inspection station'},
  finishing: {src: '/images/generated/factory-foam-finishing.webp', alt: 'AI factory illustration of cellular foam sheets, fitted inserts and insole blanks at a finishing workstation'},
} satisfies Record<string, FactoryMedia>;

export const industryFactoryMedia: Record<string, FactoryMedia> = {
  'sports-leisure': factoryMedia.childhood,
  childhood: factoryMedia.childhood,
  'logistics-handling': factoryMedia.logistics,
  hvac: factoryMedia.hvac,
  mobility: factoryMedia.automotive,
};

/** Pick context by product family and material, rather than labelling every polymer as EPP. */
export function factoryVisualFor(product: {name: string; marketSlug: string; material: string}): FactoryMedia | undefined {
  const industry = industryFactoryMedia[product.marketSlug];
  if (!industry) return undefined;
  if (/insole|surfboard|cushion|support pad|sheet/i.test(product.name)) return factoryMedia.finishing;
  if (!/\bEPP\b/i.test(product.material) || /plastic pallet|storage bin|plastic toy|polystyrene|EPS transport|foam pallet|pallet box|condensate|fan-coil|shuttle tray/i.test(product.name)) return factoryMedia.inspection;
  if (/battery/i.test(product.name) && product.marketSlug === 'mobility') return factoryMedia.automotive;
  if (/protective insert/i.test(product.name)) return factoryMedia.logistics;
  return industry;
}
