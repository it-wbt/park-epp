import {chromium,expect} from '@playwright/test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
const images=JSON.parse(readFileSync('src/lib/optimized-images.json','utf8'));const branded=JSON.parse(readFileSync('src/lib/branded-product-images.json','utf8'));
for(const source of Object.values(branded)){const asset=images[source];assert.ok(asset);assert.ok((await sharp('public'+asset.src).metadata()).hasAlpha,source+' transparency');assert.ok(asset.variants.length>=3);}
const browser=await chromium.launch();
for(const width of [1440,390]){
 const page=await browser.newPage({viewport:{width,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:3001/',{waitUntil:'domcontentloaded'});
 await expect(async()=>assert.ok(await page.locator('.park-banner video').evaluate(v=>!v.paused&&v.currentTime>0))).toPass({timeout:20000});
 assert.ok((await page.locator('.park-banner video').evaluate(v=>v.currentSrc)).includes('-fast-v1.mp4'));
 await page.screenshot({path:`artifacts/media-optimized-${width}.png`});await page.evaluate(()=>scrollTo(0,document.body.scrollHeight));await expect(page.locator('.park-banner video')).toHaveCount(0);assert.deepEqual(errors,[]);await page.close();
}
const reduced=await browser.newPage({reducedMotion:'reduce'});let videos=0;reduced.on('request',r=>{if(r.url().endsWith('.mp4'))videos++;});await reduced.goto('http://127.0.0.1:3001/');await reduced.waitForTimeout(1200);assert.equal(videos,0);assert.equal(await reduced.locator('.park-banner video').count(),0);assert.ok(await reduced.locator('.park-banner img').evaluate(i=>i.complete&&i.naturalWidth>0));
await browser.close();console.log('39 transparent cutouts preserved; responsive films play, stop offscreen, and do not download for reduced motion. No browser errors.');
