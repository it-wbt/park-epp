import {chromium, expect} from '@playwright/test';
import assert from 'node:assert/strict';

const base = process.env.SITE_PREVIEW_URL || 'http://127.0.0.1:3001';
const browser = await chromium.launch();

for (const width of [1440, 390]) {
  const context = await browser.newContext({viewport:{width, height:900}});
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto(base + '/', {waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('a[href*="wa.me"]').count(), 0);

  await page.getByRole('button', {name:'Ask PARK', exact:true}).click();
  const chat = page.getByRole('region', {name:'PARK product assistant'});
  await expect(chat).toBeVisible();
  assert.equal(await chat.getByText(/WhatsApp/i).count(), 0);

  await chat.getByRole('button', {name:'Request a quote', exact:true}).click();
  await chat.getByLabel('Your name').fill('Example Buyer');
  await chat.getByRole('button', {name:'Send message', exact:true}).click();
  await chat.getByLabel('Your phone').fill('9876543210');
  await chat.getByRole('button', {name:'Send message', exact:true}).click();
  await chat.getByLabel('Your email').fill('buyer@example.com');
  await chat.getByRole('button', {name:'Send message', exact:true}).click();

  await expect(chat.getByText(/Please describe your requirement/)).toBeVisible();
  await expect(chat.getByLabel('Your requirement')).toBeVisible();
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
  assert.deepEqual(errors, []);
  await context.close();
}

await browser.close();
console.log('Desktop/mobile quote flow asks for a requirement and has no WhatsApp UI.');
