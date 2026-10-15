export const enquiryWebsite = {name:'PARK EPP',type:'EPP'} as const;

export type EnquirySource = 'Homepage contact form' | 'Contact page form' | 'Product quote form' | 'Chatbot' | 'Website enquiry form';

export function enquirySourceFor(pathname:string,product?:string):EnquirySource {
 if(product)return 'Product quote form';
 if(pathname==='/')return 'Homepage contact form';
 if(/^\/contact\/?$/.test(pathname))return 'Contact page form';
 return 'Website enquiry form';
}

export function buildEppEnquiry(fields:Record<string,string>,subject:string,source:EnquirySource) {
 const pageUrl=window.location.origin+window.location.pathname;
 const enquirySubject='[PARK EPP] '+subject.replace(/^\[PARK EPP\]\s*/,'');
 const details=Object.entries(fields).filter(([key,value])=>value&&!['name','email','phone','mobile','botcheck','website','page','product'].includes(key)).map(([key,value])=>key+': '+value).join('\n');
 const message=['Website: '+enquiryWebsite.name,'Business: '+enquiryWebsite.type,'Website URL: '+window.location.origin,'Page URL: '+pageUrl,'Enquiry source: '+source,'Subject: '+enquirySubject,'',details].join('\n');
 return {name:fields.name||'',email:fields.email||'',phone:fields.phone||fields.mobile||'',product:fields.product||'',message,website:'',websiteName:enquiryWebsite.name,websiteType:enquiryWebsite.type,pageUrl,enquirySource:source,subject:enquirySubject};
}
