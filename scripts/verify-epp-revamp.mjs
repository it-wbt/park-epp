import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
const browser=await chromium.launch();const page=await browser.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));mkdirSync('artifacts',{recursive:true});
for(const width of [1440,390]){
 await page.setViewportSize({width,height:900});await page.goto(process.env.EPP_PREVIEW_URL||'http://127.0.0.1:3001/',{waitUntil:'networkidle'});
 await page.getByRole('button',{name:'Pause slideshow and film'}).click();
 assert.equal(await page.getByRole('link',{name:/catalogue/i}).count(),0);
 assert.equal(await page.locator('a[href*="park-nonwoven-epp-catalogue"]').count(),0);
 assert.equal(await page.locator('.park-industry-card').count(),4);
 assert.equal(await page.locator('.park-banner-dots button').count(),5);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 const sources=[];
 for(let index=0;index<5;index++){
  await page.locator('.park-banner-dots button').nth(index).click();
  const film=page.locator('.park-banner video');await film.waitFor();
  await page.getByRole('button',{name:'Play slideshow and film'}).click();
  await film.evaluate(el=>new Promise((resolve,reject)=>{if(el.readyState>=2)return resolve();el.addEventListener('loadeddata',resolve,{once:true});el.addEventListener('error',reject,{once:true});}));
  sources.push(await film.evaluate(el=>el.currentSrc));
  await page.waitForFunction(()=>{const v=document.querySelector('.park-banner video');return v&&!v.paused&&v.currentTime>0;});await page.getByRole('button',{name:'Pause slideshow and film'}).click();
 }
 assert.equal(new Set(sources).size,5);
 assert.ok(sources.every(src=>src.includes('/use-')&&!src.includes('manufacturing')));
 await page.locator('.park-banner-dots button').first().click();await page.screenshot({path:`artifacts/epp-filtration-${width}.png`,fullPage:true});
}
assert.deepEqual(errors,[]);console.log('Five distinct application films play on desktop/mobile; catalogue links absent; carousel and overflow checks passed.');await browser.close();
