import {chromium,expect} from '@playwright/test';import assert from 'node:assert/strict';
const browser=await chromium.launch();const page=await browser.newPage();page.setDefaultTimeout(15000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
for(const width of [1440,390]){
 await page.setViewportSize({width,height:900});await page.goto('http://127.0.0.1:3001/',{waitUntil:'domcontentloaded'});
 await expect(async()=>{await page.getByRole('tab',{name:'How is it made?',exact:true}).click();await expect(page.locator('[data-step][data-running]')).toHaveCount(1,{timeout:1000});}).toPass({timeout:20000});
 const diagram=page.locator('[data-step][data-running]');await diagram.scrollIntoViewIfNeeded();
 for(const [index,name] of ['Fill the mould','Fuse with steam','Cool & stabilise','Release & inspect'].entries()){
  await page.getByRole('button',{name:`Show process: ${name}`,exact:true}).click();assert.equal(await diagram.getAttribute('data-step'),String(index));assert.equal(await diagram.getAttribute('data-running'),'false');
 }
 await page.getByRole('button',{name:'Play EPP process animation',exact:true}).click();await diagram.scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.querySelector('[data-step]')?.getAttribute('data-step')==='0',null,{timeout:12000});
 await page.getByRole('button',{name:'Pause EPP process animation',exact:true}).click();assert.equal(await diagram.getAttribute('data-running'),'false');
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await diagram.screenshot({path:`artifacts/epp-process-diagram-${width}.png`});
}
await page.emulateMedia({reducedMotion:'reduce'});await expect(page.getByRole('button',{name:/^(Play|Pause) EPP process animation$/})).toBeDisabled();
await page.getByRole('button',{name:'Show process: Fuse with steam',exact:true}).click();assert.equal(await page.locator('[data-step]').getAttribute('data-step'),'1');assert.deepEqual(errors,[]);
console.log('Process steps, automatic playback, pause, reduced-motion manual controls and responsive SVG passed.');await browser.close();
