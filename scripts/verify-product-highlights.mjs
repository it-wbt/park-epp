import {chromium} from '@playwright/test';import assert from 'node:assert/strict';
const browser=await chromium.launch();const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
for(const width of [1440,390]){
 await page.setViewportSize({width,height:900});await page.goto('http://127.0.0.1:3001/',{waitUntil:'networkidle'});
 const section=page.locator('.product-highlights');await section.scrollIntoViewIfNeeded();assert.equal(await section.locator('.highlights-dots button').count(),5);
 for(let index=0;index<5;index++){
  await section.locator('.highlights-dots button').nth(index).click();
  assert.equal(await section.locator('.highlights-dots button[aria-pressed=true]').count(),1);
  const image=section.locator('.highlights-image img');await image.evaluate(img=>img.decode());
  assert.ok(await image.evaluate(img=>img.naturalWidth>0));
  const response=await page.request.get(new URL(await section.locator('.highlights-learn').getAttribute('href'),page.url()).href);assert.equal(response.status(),200);
 }
 await page.getByRole('button',{name:'Next highlighted product'}).click();await section.getByRole('heading',{name:'Stackable delivery boxes'}).waitFor();
 await page.getByRole('button',{name:'Previous highlighted product'}).click();await section.getByRole('heading',{name:'Custom cushioning foams'}).waitFor();
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await section.screenshot({path:`artifacts/product-highlights-${width}.png`});
}
assert.deepEqual(errors,[]);console.log('Five highlighted products: selectors, wraparound arrows, images, detail links and mobile layout passed.');await browser.close();
