import {products,marketSourceSlugs} from './catalog';
import {marketGuides} from './content';
export const isDrainageProduct=(name:string)=>/revegetation|drainage/i.test(name);
export const marketProductSlugs=(slug:string)=>slug==='appliances-hvac'?['hvac','domestic-appliances']:slug==='revegetation-drainage'?['insulation-waterproofing']:marketSourceSlugs(slug);
export const marketPages=[
 {name:'Appliances and HVAC',slug:'appliances-hvac',number:'06',intro:'Protect household appliances in transit and explore engineered components for heating, ventilation and air-conditioning systems.',need:'Shipping protection and installed equipment components need different briefs. Review the load path and distribution route for packaging; define airflow, thermal interfaces and servicing for HVAC components.',products:products.filter(p=>['hvac','domestic-appliances'].includes(p.marketSlug)).map(p=>p.name),image:'technical'},
 {name:'Revegetation and drainage',slug:'revegetation-drainage',number:'10',intro:'Explore shaped components for planted roofs, landscape drainage and coordinated water management.',need:'Water movement, substrate loads, membrane protection and installation details should be considered within the complete roof or landscape system.',products:products.filter(p=>isDrainageProduct(p.name)).map(p=>p.name),image:'technical'}
].filter(market=>market.products.length>0);
export const additionalMarketGuides={
 'appliances-hvac':{overview:'Appliance protection and HVAC integration connect materials to two different jobs. Transit cushions support and protect a finished appliance through handling. Technical housings and air ducts become part of an installed system, where airflow, interfaces and access guide the design.',applications:['Household appliance packaging','Appliance technical components','HVAC air ducts','Insulated equipment housings'],priorities:[marketGuides['domestic-appliances'].priorities[0],marketGuides.hvac.priorities[1],marketGuides.hvac.priorities[2]],faq:[marketGuides['domestic-appliances'].faq[0],marketGuides.hvac.faq[1]]},
 'revegetation-drainage':{...marketGuides['insulation-waterproofing'],applications:['Planted roof components','Landscape drainage forms','Moulded drainage panels']}
};
