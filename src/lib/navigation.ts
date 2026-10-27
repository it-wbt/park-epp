import {markets, activeProducts} from './catalog';
import {productVisual} from './content';

export const marketImage:Record<string,string> = {'hvac':'factory-hvac','aviation':'aviation','furniture':'furniture','mobility':'factory-automotive','domestic-appliances':'appliances','logistics-handling':'factory-logistics','sports-leisure':'factory-childhood','childhood':'factory-childhood','agrifood':'agrifood','building':'building','pharma-health':'pharma','insulation-waterproofing':'roofing','swimming-pools-filtration':'pools','appliances-hvac':'hvac','revegetation-drainage':'roofing'};
export const marketImagePath = (slug:string) => `/images/generated/${marketImage[slug] || 'logistics'}.webp`;
export type MenuLink = {name:string;href:string;description?:string;image?:string};
export type MenuGroup = {name:string;intro:string;href:string;image:string;links:MenuLink[];applications?:{name:string;links:MenuLink[]}[]};

const picks = (sourceSlugs:string[]):MenuLink[] => activeProducts
  .filter(product => sourceSlugs.includes(product.marketSlug))
  .map(product => ({name:product.name,href:`/products/${product.slug}/`,description:product.material,image:productVisual(product)}));

export const industryGroups:MenuGroup[] = markets.map(market => ({
  name:market.name,
  intro:market.intro,
  href:`/markets/${market.slug}/`,
  image:marketImagePath(market.slug),
  links:picks(market.sourceSlugs),
}));
export const marketGroups = industryGroups;

const automotivePriority = ['Head Absorber','Baggage Tray','Seat Cushion','Trunk Box','Battery Cover','Door Impact Pad','Heat Cushion','Energy Absorbers','PP Board Trunk Trims','Energy Absorbers for Bumpers','EPP Covers for Hydrogen Tanks – Hydrogen Tank Protection'];
const automotiveProducts = picks(['mobility']).sort((a,b) => automotivePriority.indexOf(a.name) - automotivePriority.indexOf(b.name));

export const productGroups:MenuGroup[] = [
  {name:'Automotive products',intro:'PARK EPP components for vehicle interiors, energy absorption, storage and battery protection.',href:'/markets/mobility/',image:marketImagePath('mobility'),links:automotiveProducts},
  {name:'Technical components',intro:'Moulded HVAC components shaped around airflow, insulation and equipment integration.',href:'/markets/hvac/',image:marketImagePath('hvac'),links:picks(['hvac'])},
  {name:'Packaging & material handling',intro:'Protective cushions, returnable containers, lightweight pallets and insulated transport formats.',href:'/markets/logistics-handling/',image:marketImagePath('logistics-handling'),links:picks(['logistics-handling'])},
  {name:'Sports & play products',intro:'Lightweight equipment, recreational forms and moulded accessories for sport, leisure and early childhood.',href:'/markets/sports-leisure/',image:marketImagePath('sports-leisure'),links:picks(['sports-leisure','childhood'])},
];
const defenceGroup:MenuGroup = {name:'Defence',intro:'Protective EPP packaging and lightweight components for defence applications.',href:'/#industries',image:marketImagePath('mobility'),links:[]};

export const resourceLinks:MenuLink[] = [{name:'Whitepapers & guides',href:'/resources/whitepapers/'},{name:'Application use cases',href:'/resources/use-cases/'},{name:'Webinars & learning',href:'/resources/webinars/'},{name:'Brochures & videos',href:'/resources/brochures-videos/'},{name:'Blog & insights',href:'/resources/blog/'},{name:'Circular design reports',href:'/resources/csr-reports/'}];
export const aboutLinks:MenuLink[] = [{name:'What is EPP?',href:'/materials/expanded-polypropylene/'},{name:'Who we are',href:'/about/'},{name:'Responsible design',href:'/about/responsible-design/'},{name:'Careers & collaboration',href:'/about/careers/'},{name:'Production & project support',href:'/about/project-support/'}];
export const navigation:Record<string,MenuGroup[]> = {
  'Industries':[...industryGroups,defenceGroup],
  'Our products':productGroups,
};
