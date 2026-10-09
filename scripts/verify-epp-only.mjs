import {chromium,expect} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1440,height:900}});
const errors=[];page.on('pageerror',error=>errors.push(error.message));
for(const path of ['/','/products/','/materials/','/expertise/','/materials/expanded-polypropylene/','/resources/','/markets/logistics-handling/','/resources/epp-grade-selection/']){
 await page.goto('http://127.0.0.1:3001'+path,{waitUntil:'domcontentloaded'});
 assert.doesNotMatch(await page.locator('body').innerText(),/\bEPS\b|polystyrene|Plastic pallets|Industrial storage bins/);
 if(path==='/products/'){
  await expect(page.locator('.product-card')).toHaveCount(39);
  const materials=await page.locator('.card-bottom>span:first-child').allTextContents();assert.ok(materials.every(material=>material==='EPP'));
  assert.equal(await page.locator('.filters select').count(),1);
 }
 console.log(path+' EPP-only passed');
}
for(const path of ['/products/eps-transport-boxes/','/products/plastic-pallets/','/materials/polypropylene/','/materials/expanded-polystyrene/','/expertise/injection-moulding/','/resources/epp-or-eps/']){
 const response=await page.goto('http://127.0.0.1:3001'+path,{waitUntil:'domcontentloaded'});assert.equal(response.status(),404);
}
await page.setViewportSize({width:390,height:900});await page.goto('http://127.0.0.1:3001/products/',{waitUntil:'domcontentloaded'});
assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);
console.log('39 EPP products; other product/material/process routes removed; mobile layout passes.');await browser.close();
