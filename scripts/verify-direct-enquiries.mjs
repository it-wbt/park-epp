import {chromium,expect} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch();
for(const width of [1440,390])for(const path of ['/','/contact/','/products/stackable-delivery-boxes/']){
 const context=await browser.newContext({viewport:{width,height:900}});const page=await context.newPage();const errors=[];let calls=0;let success=false;let payload;
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('https://formsubmit.co/ajax/**',async route=>{
  if(route.request().method()==='OPTIONS')return route.fulfill({status:204,headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type, Accept'}});
  calls++;assert.equal(route.request().url(),'https://formsubmit.co/ajax/sales@parknonwoven.com');payload=route.request().postDataJSON();
  await route.fulfill({status:success?200:503,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:JSON.stringify(success?{success:'true',message:'Success!'}:{success:'false'})});
 });
 await page.goto((process.env.TEST_BASE_URL||'http://127.0.0.1:3000')+path,{waitUntil:'networkidle'});await page.getByRole('button',{name:'Continue to website'}).click();
 const form=['/','/contact/'].includes(path)?page.locator('#contact form'):page.locator('form').filter({has:page.locator('#quote-name')});
 await form.locator('[name="name"]').fill('Example Buyer');await form.locator('[name="email"]').fill('buyer@example.com');
 if(['/','/contact/'].includes(path))await form.locator('[name="message"]').fill('Need EPP delivery containers, 100 units.');
 else {await form.locator('[name="quantity"]').fill('100');await form.locator('[name="requirements"]').fill('Food delivery application');}
 const button=form.locator('button[type="submit"]');await button.click();await expect(form.getByRole('alert')).toContainText('Delivery was not confirmed');assert.equal(await form.locator('[name="name"]').inputValue(),'Example Buyer');await expect(button).toBeEnabled();
 success=true;await button.click();await expect(form.getByRole('status')).toContainText('submitted to PARK');await expect(button).toBeDisabled();assert.equal(calls,2);assert.equal(payload.email,'buyer@example.com');assert.equal(payload._replyto,'buyer@example.com');assert.ok(payload._subject.startsWith('[PARK EPP]'));assert.equal(payload.website_name,'PARK EPP');assert.equal(payload.business,'EPP');assert.equal(new URL(payload.page_url).pathname,path);assert.equal(payload.enquiry_source,path==='/'?'Homepage contact form':path==='/contact/'?'Contact page form':'Product quote form');assert.equal(new URL(page.url()).pathname,path);assert.deepEqual(errors,[]);
 assert.ok(await form.locator('input:not([type=checkbox]),textarea').evaluateAll(fields=>fields.every(field=>field.value==='')),path+' should clear after success');
 if(['/','/contact/'].includes(path))await expect(form).toContainText('0 / 4,000');
 await form.locator('[name="name"]').fill('Another Buyer');await expect(button).toBeEnabled();await context.close();
}
await browser.close();console.log('Three enquiry forms pass desktop/mobile: direct POST, fixed sales recipient, failure retry, success status, preserved inputs on failure, empty fields on success and duplicate prevention. No live emails sent.');
