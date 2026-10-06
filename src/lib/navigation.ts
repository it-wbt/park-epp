import formatData from './reference-formats.json';
import {markets, activeProducts} from './catalog';

export const marketImage:Record<string,string> = {'hvac':'industry-hvac','aviation':'aviation','furniture':'furniture','mobility':'industry-automotive','domestic-appliances':'appliances','logistics-handling':'industry-logistics','sports-leisure':'industry-childhood','childhood':'industry-childhood','agrifood':'agrifood','building':'building','pharma-health':'pharma','insulation-waterproofing':'roofing','swimming-pools-filtration':'pools','appliances-hvac':'hvac','revegetation-drainage':'roofing'};
export const marketImagePath = (slug:string) => `/images/generated/${marketImage[slug] || 'logistics'}.webp`;
export type MenuLink = {name:string;href:string;description?:string;image?:string};
export type MenuGroup = {name:string;intro:string;href:string;image:string;links:MenuLink[];applications?:{name:string;links:MenuLink[]}[]};

const picks = (sourceSlugs:string[]):MenuLink[] => activeProducts
  .filter(product => sourceSlugs.includes(product.marketSlug))
  .map(product => ({name:product.name,href:`/products/${product.slug}/`,description:product.material,image:marketImagePath(product.marketSlug)}));

export const industryGroups:MenuGroup[] = markets.map(market => ({
  name:market.name,
  intro:market.intro,
  href:`/markets/${market.slug}/`,
  image:marketImagePath(market.slug),
  links:picks(market.sourceSlugs),
}));
export const marketGroups = industryGroups;

const activeFamilySlugs = new Set(activeProducts.map(product => product.slug));
export const productGroups:MenuGroup[] = [
  {name:'Standard format references',intro:'Published manufacturer model names and linked product-family guides for our four industries.',href:'/resources/standard-catalogue/',image:'/images/packaging.webp',links:formatData.filter(format=>activeFamilySlugs.has(format.familySlug)).map(format=>({name:format.name,href:`/products/${format.familySlug}/`,description:format.material}))},
  {name:'Technical components',intro:'Moulded components shaped around automotive assemblies, HVAC insulation and lightweight integration.',href:'/products/',image:marketImagePath('hvac'),links:picks(['hvac','mobility'])},
  {name:'Packaging & material handling',intro:'Protective cushions, returnable containers, lightweight pallets and insulated transport formats.',href:'/markets/logistics-handling/',image:marketImagePath('logistics-handling'),links:picks(['logistics-handling'])},
  {name:'Sports & play products',intro:'Lightweight equipment, recreational forms and moulded accessories for sport, leisure and early childhood.',href:'/markets/sports-leisure/',image:marketImagePath('sports-leisure'),links:picks(['sports-leisure','childhood'])},
];

export const resourceLinks:MenuLink[] = [{name:'Whitepapers & guides',href:'/resources/whitepapers/'},{name:'Application use cases',href:'/resources/use-cases/'},{name:'Standard catalogue',href:'/resources/standard-catalogue/'},{name:'Webinars & learning',href:'/resources/webinars/'},{name:'Brochures & videos',href:'/resources/brochures-videos/'},{name:'Blog & insights',href:'/resources/blog/'},{name:'Circular design reports',href:'/resources/csr-reports/'}];
export const aboutLinks:MenuLink[] = [{name:'What is EPP?',href:'/materials/expanded-polypropylene/'},{name:'Who we are',href:'/about/'},{name:'Responsible design',href:'/about/responsible-design/'},{name:'Careers & collaboration',href:'/about/careers/'},{name:'Production & project support',href:'/about/project-support/'}];
export const navigation:Record<string,MenuGroup[]> = {
  'About us':[{name:'PARK Nonwoven',intro:'A practical conversation about materials, product design and your next project.',href:'/about/',image:marketImagePath('hvac'),links:aboutLinks}],
  'Industries':industryGroups,
  'Our products':productGroups,
};
