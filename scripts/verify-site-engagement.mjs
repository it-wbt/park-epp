import {chromium,expect} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
const browser=await chromium.launch();mkdirSync('artifacts',{recursive:true});
for(const width of [1440,390]){
 const context=await browser.newContext({viewport:{width,height:900}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:3001/',{waitUntil:'domcontentloaded'});
 const modal=page.getByRole('dialog',{name:'Our upcoming events'});await expect(modal).toBeVisible();
 assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden');assert.ok(!(await modal.innerText()).includes('filtration'));
 assert.ok(await modal.evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight;}));
 await page.screenshot({path:`artifacts/epp-events-${width}.png`});await page.keyboard.press('Escape');await expect(modal).not.toBeVisible();await expect.poll(()=>page.evaluate(()=>document.body.style.overflow)).not.toBe('hidden');
 await page.reload({waitUntil:'networkidle'});await expect(page.locator('dialog[open]')).toHaveCount(0);
 await page.getByRole('button',{name:'Open support chat',exact:true}).click();const support=page.getByRole('region',{name:'PARK support'});await expect(support).toBeVisible();await expect(support.getByRole('link',{name:/Email our team/})).toHaveAttribute('href','mailto:sales@parknonwoven.com');assert.equal(await support.locator('a[href*="wa.me"]').count(),0);
 await page.screenshot({path:`artifacts/epp-support-${width}.png`});await page.getByRole('button',{name:'Close support',exact:true}).click();await expect(support).not.toBeVisible();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);await context.close();
}
await browser.close();console.log('Desktop/mobile event dialog, Escape, session dismissal, scroll restoration, support toggle and no-number email fallback pass.');
