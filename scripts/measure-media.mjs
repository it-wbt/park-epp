import {chromium} from '@playwright/test';
import {writeFileSync,mkdirSync} from 'node:fs';
const label=process.argv[2] || 'before';
const browser=await chromium.launch();const results=[];
for(const width of [1440,390])for(const pathname of ['/','/products/stackable-delivery-boxes/','/products/']){
 const context=await browser.newContext({viewport:{width,height:900}});const page=await context.newPage();const media=[];
 page.on('response',response=>{const headers=response.headers();if((/^(image|video)\//.test(headers['content-type'] || '')||/\.(webp|png|jpe?g|svg|mp4)(?:\?|$)/.test(response.url())))media.push({url:new URL(response.url()).pathname,bytes:Number(headers['content-length'] || 0)});});
 await page.addInitScript(()=>{window.__mediaVitals={lcp:0,cls:0};new PerformanceObserver(list=>{for(const entry of list.getEntries())window.__mediaVitals.lcp=entry.startTime;}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(list=>{for(const entry of list.getEntries())if(!entry.hadRecentInput)window.__mediaVitals.cls+=entry.value;}).observe({type:'layout-shift',buffered:true});});
 const response=await page.goto((process.env.MEDIA_PREVIEW_URL||'http://127.0.0.1:3001')+pathname,{waitUntil:'domcontentloaded'});if(response.status()!==200)throw new Error(`${pathname}: ${response.status()}`);await page.waitForTimeout(4000);
 const vitals=await page.evaluate(()=>window.__mediaVitals);const result={width,pathname,mediaBytes:media.reduce((sum,item)=>sum+item.bytes,0),mediaRequests:media.length,media,vitals};results.push(result);console.log(width,pathname,Math.round(result.mediaBytes/1024)+' KB',result.mediaRequests+' media requests');await context.close();
}
await browser.close();mkdirSync('artifacts',{recursive:true});writeFileSync(`artifacts/media-${label}.json`,JSON.stringify(results,null,2));
