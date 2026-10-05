import {markets,products,materials,expertise,solutions} from './catalog';
import {isDrainageProduct} from './market-pages';
export const marketImage:Record<string,string>={'hvac':'hvac','aviation':'aviation','furniture':'furniture','mobility':'mobility','domestic-appliances':'appliances','logistics-handling':'logistics','sports-leisure':'sports','childhood':'childhood','agrifood':'agrifood','building':'building','pharma-health':'pharma','insulation-waterproofing':'roofing','swimming-pools-filtration':'pools','appliances-hvac':'hvac','revegetation-drainage':'roofing'};
export const marketImagePath=(slug:string)=>`/images/markets/${marketImage[slug]||'logistics'}.webp`;
export type MenuLink={name:string;href:string;description?:string;image?:string};
export type MenuGroup={name:string;intro:string;href:string;image:string;links:MenuLink[];applications?:{name:string;links:MenuLink[]}[]};
const baseMarketGroups:MenuGroup[]=markets.map(m=>({name:m.name,intro:m.intro,href:`/markets/${m.slug}/`,image:marketImagePath(m.slug),links:products.filter(p=>p.marketSlug===m.slug).map(p=>({name:p.name,href:`/products/${p.slug}/`,description:p.material,image:marketImagePath(p.marketSlug)})),applications: m.slug==='mobility'?[{name:'Vehicle components',links:products.filter(p=>p.marketSlug===m.slug).map(p=>({name:p.name,href:`/products/${p.slug}/`}))}]:m.slug==='agrifood'?[{name:'Fresh food',links:products.filter(p=>p.marketSlug===m.slug&&/meat|fish|seafood|shellfish|fruit|produce|cheese/i.test(p.name)).map(p=>({name:p.name,href:`/products/${p.slug}/`}))},{name:'Catering & prepared meals',links:products.filter(p=>p.marketSlug===m.slug&&/cater|meal|takeaway|reusable|container|gastronorm|retail|rigid/i.test(p.name)).map(p=>({name:p.name,href:`/products/${p.slug}/`}))},{name:'Frozen & desserts',links:products.filter(p=>p.marketSlug===m.slug&&/ice cream|dessert|bakery/i.test(p.name)).map(p=>({name:p.name,href:`/products/${p.slug}/`}))},{name:'Custom formats & sealing',links:products.filter(p=>p.marketSlug===m.slug&&/custom|skin|seal|high-volume|insulated|perishable/i.test(p.name)).map(p=>({name:p.name,href:`/products/${p.slug}/`}))}]:m.slug==='logistics-handling'?[{name:'Handling & storage',links:products.filter(p=>p.marketSlug===m.slug&&/pallet|storage|container/i.test(p.name)).map(p=>({name:p.name,href:`/products/${p.slug}/`}))},{name:'Insulated transport',links:products.filter(p=>p.marketSlug===m.slug&&/insulated|box|cooler|catering/i.test(p.name)).map(p=>({name:p.name,href:`/products/${p.slug}/`}))},{name:'Protective packaging',links:products.filter(p=>p.marketSlug===m.slug&&/cushion|support/i.test(p.name)).map(p=>({name:p.name,href:`/products/${p.slug}/`}))}]:undefined}));
const picks=(slugs:string[])=>products.filter(p=>slugs.includes(p.marketSlug)).map(p=>({name:p.name,href:`/products/${p.slug}/`,description:p.material,image:marketImagePath(p.marketSlug)}));
const namedMarket=(slug:string,name:string):MenuGroup=>({...baseMarketGroups.find(g=>g.href===`/markets/${slug}/`)!,name});
export const marketGroups:MenuGroup[]=[
 namedMarket('logistics-handling','Logistics and distribution'),
 namedMarket('pharma-health','Pharmaceuticals and healthcare'),
 namedMarket('agrifood','Food industry'),
 namedMarket('swimming-pools-filtration','Swimming-pool'),
 namedMarket('childhood','Early childhood'),
 {name:'Appliances and HVAC',intro:'Protect appliances in transit and explore technical components for air management and insulation.',href:'/markets/appliances-hvac/',image:marketImagePath('hvac'),links:picks(['domestic-appliances','hvac']),applications:[{name:'Domestic appliances',links:picks(['domestic-appliances'])},{name:'HVAC',links:picks(['hvac'])}]},
 namedMarket('sports-leisure','Sports and leisure'),
 namedMarket('building','Building'),
 namedMarket('furniture','Furniture and fittings'),
 {...namedMarket('insulation-waterproofing','Revegetation and drainage'),href:'/markets/revegetation-drainage/',links:picks(['insulation-waterproofing']).filter(p=>isDrainageProduct(p.name))},
 namedMarket('mobility','Mobility'),
 namedMarket('aviation','Aviation'),
 namedMarket('insulation-waterproofing','Insulation & waterproofing')
];
export const productGroups:MenuGroup[]=[
 {name:'Technical components',intro:'Moulded components shaped around assembly, insulation and lightweight integration.',href:'/products/',image:marketImagePath('hvac'),links:picks(['hvac','aviation','mobility','domestic-appliances'])},
 {name:'Packaging & logistics',intro:'Protective cushions, returnable containers, lightweight pallets and insulated shipping formats.',href:'/markets/logistics-handling/',image:marketImagePath('logistics-handling'),links:picks(['logistics-handling','pharma-health'])},
 {name:'Food packaging',intro:'Trays, containers and insulated formats for fresh food, catering and frozen products.',href:'/markets/agrifood/',image:marketImagePath('agrifood'),links:picks(['agrifood'])},
 {name:'Building & insulation',intro:'Explore building insulation, roof drainage and shaped pool construction components.',href:'/markets/building/',image:marketImagePath('building'),links:picks(['building','insulation-waterproofing','swimming-pools-filtration'])},
 {name:'Furniture, sport & play',intro:'Lightweight foam forms, furniture protection and moulded accessories.',href:'/markets/furniture/',image:marketImagePath('furniture'),links:picks(['furniture','sports-leisure','childhood'])}
];
export const resourceLinks:MenuLink[]=[{name:'Whitepapers & guides',href:'/resources/whitepapers/'},{name:'Application use cases',href:'/resources/use-cases/'},{name:'Standard catalogue',href:'/resources/standard-catalogue/'},{name:'Webinars & learning',href:'/resources/webinars/'},{name:'Brochures & videos',href:'/resources/brochures-videos/'},{name:'Blog & insights',href:'/resources/blog/'},{name:'Circular design reports',href:'/resources/csr-reports/'}];
export const aboutLinks:MenuLink[]=[{name:'Who we are',href:'/about/'},{name:'Responsible design',href:'/about/responsible-design/'},{name:'Careers & collaboration',href:'/about/careers/'},{name:'Production & project support',href:'/about/project-support/'}];
export const navigation:Record<string,MenuGroup[]>={
 'Our expertise':[{name:'Technical expertise',intro:'The manufacturing routes behind moulded technical parts and packaging.',href:'/expertise/',image:marketImagePath('hvac'),links:[{name:'Custom plastic parts',href:'/expertise/custom-plastic-parts/'},...expertise.slice(0,4).map(e=>({name:e.name,href:`/expertise/${e.slug}/`}))]},{name:'At your side',intro:'From the first drawing to testing, development and production readiness.',href:'/expertise/',image:marketImagePath('building'),links:expertise.slice(4).map(e=>({name:e.name,href:`/expertise/${e.slug}/`}))}],
 'Solutions':[{name:'Your challenges',intro:'Start with protection, weight, thermal performance or presentation.',href:'/solutions/',image:marketImagePath('logistics-handling'),links:solutions.map(s=>({name:s.name,href:`/solutions/${s.slug}/`,description:s.text}))},{name:'Materials',intro:'Compare material families against the application and its recovery route.',href:'/materials/',image:'/images/technical.webp',links:materials.map(m=>({name:m.name,href:`/materials/${m.slug}/`,description:m.short}))}],
 'Markets':marketGroups,
 'Our products':productGroups,
 'About us':[{name:'PARK Nonwoven',intro:'A practical conversation about materials, product design and your next project.',href:'/about/',image:marketImagePath('building'),links:aboutLinks}],
 'Resources':[{name:'Resource centre',intro:'Original reading, downloadable guides and visual introductions to material selection.',href:'/resources/',image:'/images/technical.webp',links:resourceLinks}]
};
