import {chromium} from '@playwright/test';import assert from 'node:assert/strict';
const browser=await chromium.launch();const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
for(const width of [1440,390]){
 await page.setViewportSize({width,height:900});await page.goto('http://127.0.0.1:3001/',{waitUntil:'domcontentloaded',timeout:60000});
 const section=page.locator('#technology');await section.scrollIntoViewIfNeeded();
 for(const name of ['What is EPP?','How is it made?','Why is it useful?']){await section.getByRole('tab',{name,exact:true}).click();assert.equal(await section.getByRole('tabpanel').count(),1);assert.equal(await section.getByRole('tab',{name,exact:true}).getAttribute('aria-selected'),'true');}
 await section.getByRole('tab',{name:'What is EPP?',exact:true}).focus();await page.keyboard.press('ArrowRight');assert.equal(await section.getByRole('tab',{name:'How is it made?',exact:true}).getAttribute('aria-selected'),'true');assert.equal(await section.getByRole('group',{name:'Choose a moulding stage'}).getByRole('button').count(),4);
 await page.keyboard.press('Home');assert.equal(await section.getByRole('tab',{name:'What is EPP?',exact:true}).getAttribute('aria-selected'),'true');
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await section.screenshot({path:`artifacts/epp-explainer-${width}.png`});
}
assert.deepEqual(errors,[]);console.log('EPP explainer tabs, keyboard navigation, process content, desktop/mobile layout passed.');await browser.close();
