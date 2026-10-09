import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {writeFileSync,mkdirSync} from 'node:fs';
const base=process.env.SEO_PREVIEW_URL||'http://127.0.0.1:3105';
const browser=await chromium.launch();const page=await browser.newPage({javaScriptEnabled:false});
const sitemap=await (await page.request.get(base+'/sitemap.xml')).text();
const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(x=>x[1]);const results=[];
for(const url of urls){
 const path=new URL(url).pathname;const response=await page.goto(base+path,{waitUntil:'domcontentloaded'});
 const result=await page.evaluate(()=>({title:document.title,description:document.querySelector('meta[name="description"]')?.getAttribute('content'),canonical:document.querySelector('link[rel="canonical"]')?.getAttribute('href'),h1:document.querySelectorAll('h1').length,missingAlt:[...document.images].filter(i=>!i.hasAttribute('alt')).length,schemas:[...document.querySelectorAll('script[type="application/ld+json"]')].map(s=>JSON.parse(s.textContent)['@type'])}));
 assert.equal(response.status(),200,path);assert.ok(result.title,path+' title');assert.ok(result.description,path+' description');assert.equal(result.canonical.replace(/\/$/,''),url.replace(/\/$/,''),path+' canonical');assert.equal(result.h1,1,path+' h1');assert.equal(result.missingAlt,0,path+' alt');if(path.startsWith('/products/')&&path!='/products/')assert.ok(result.schemas.includes('Product'),path+' schema');results.push({path,...result});
}
assert.ok((await (await page.request.get(base+'/robots.txt')).text()).includes('Sitemap:'));
mkdirSync('research',{recursive:true});writeFileSync('research/seo-audit.json',JSON.stringify({preview:base,checkedAt:new Date().toISOString(),pages:results.length,results},null,2));
console.log(`${results.length} sitemap pages pass: status, title, description, canonical, single H1, image alt and product schema. HTML is indexable without JavaScript.`);await browser.close();
