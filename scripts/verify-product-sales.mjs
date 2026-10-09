import {chromium,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const copy=JSON.parse(readFileSync('src/lib/product-sales-copy.json','utf8'));
assert.equal(Object.keys(copy).length,39);
for(const item of Object.values(copy)){
 assert.equal(item.benefits.length,3);
 assert.ok(item.summary.split(/\s+/).length<=30);
}
const browser=await chromium.launch();const page=await browser.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
for(const width of [1440,390]){
 await page.setViewportSize({width,height:900});
 for(const slug of ['stackable-delivery-boxes','custom-hvac-components','sports-helmet-foam-liners','vehicle-energy-absorbers']){
  await page.goto(`http://127.0.0.1:3001/products/${slug}/`,{waitUntil:'domcontentloaded'});
  const article=page.locator('main article');
  assert.ok((await article.innerText()).split(/\s+/).length<320);
  assert.equal(await article.getByRole('heading',{level:1}).count(),1);
  assert.equal(await article.locator('ul li').count(),3);
  await article.locator('.detail-image img').evaluate(img=>img.decode());
  await article.getByRole('link',{name:'Get a quote',exact:true}).click();
  await expect(page.locator('#enquire')).toBeInViewport();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  if(slug==='stackable-delivery-boxes')await article.screenshot({path:`artifacts/product-sales-${width}.png`});
 }
}
await page.getByLabel('Your name',{exact:true}).fill('Test Buyer');await page.getByLabel('Work email',{exact:true}).fill('buyer@example.com');
await page.getByLabel('Quantity',{exact:true}).fill('0');assert.equal(await page.getByLabel('Quantity',{exact:true}).evaluate(input=>input.checkValidity()),false);
await page.getByLabel('Quantity',{exact:true}).fill('100');await page.getByLabel('Size / requirements',{exact:false}).fill('Custom fitted insert');
await expect(async()=>{await page.getByRole('button',{name:'Request a quote',exact:true}).click();await expect(page.getByRole('status')).toContainText('Enquiry prepared',{timeout:1000});}).toPass({timeout:15000});
assert.deepEqual(errors,[]);console.log('39 short sales descriptions; four product pages under 320 words; desktop/mobile layout, quote links and form validation passed.');await browser.close();
