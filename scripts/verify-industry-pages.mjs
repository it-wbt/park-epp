import {chromium, expect} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';

const origin = process.env.PREVIEW_URL || 'http://127.0.0.1:3000';
const industries = [
  {slug: 'sports-leisure', name: 'Sports, Leisure & Early Childhood', image: 'industry-childhood'},
  {slug: 'logistics-handling', name: 'Logistics & Material Handling', image: 'industry-logistics'},
  {slug: 'hvac', name: 'HVAC', image: 'industry-hvac'},
  {slug: 'mobility', name: 'Automotive', image: 'industry-automotive'},
];
const browser = await chromium.launch();
mkdirSync('artifacts', {recursive: true});

async function noOverflow(page, label) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${label}: horizontal overflow`);
}

async function nativeFaq(page, label) {
  const faq = page.locator('section[aria-labelledby="industry-faq-title"] details').first();
  await expect(faq, `${label}: native FAQ`).toBeAttached();
  const summary = faq.locator('summary');
  await summary.focus();
  if (await faq.evaluate(element => element.open)) await summary.press('Enter');
  await summary.press('Enter');
  await expect(faq).toHaveJSProperty('open', true);
  assert.ok((await faq.innerText()).length > (await summary.innerText()).length, `${label}: FAQ answer visible`);
  await summary.press('Space');
  await expect(faq).toHaveJSProperty('open', false);
}

async function nativeAnchors(page, label) {
  const anchors = page.locator('main a[href^="#"]');
  const hashes = await anchors.evaluateAll(links => links.map(link => link.getAttribute('href')));
  assert.ok(hashes.length > 0, `${label}: section navigation exists`);
  for (const hash of hashes) {
    assert.ok(hash.length > 1, `${label}: meaningful anchor`);
    assert.ok(await page.evaluate(id => Boolean(document.getElementById(id)), decodeURIComponent(hash.slice(1))), `${label}: ${hash} has a destination`);
  }
  await anchors.first().focus();
  await anchors.first().press('Enter');
  await expect.poll(() => new URL(page.url()).hash).toBe(hashes[0]);
}

async function decodedImages(page, label) {
  const extraProducts = page.locator('#industry-range details');
  for (const disclosure of await extraProducts.all()) {
    if (!(await disclosure.evaluate(element => element.open))) await disclosure.locator('summary').click();
  }
  const images = page.locator('main img');
  assert.ok(await images.count() > 0, `${label}: page has imagery`);
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(element => element.complete && element.naturalWidth > 0), {message: `${label}: image loaded`}).toBe(true);
    await image.evaluate(element => element.decode());
    assert.notEqual(await image.getAttribute('alt'), null, `${label}: image alternative provided`);
  }
  for (const disclosure of await extraProducts.all()) await disclosure.locator('summary').click();
  for (const image of await page.locator('section[aria-labelledby="industry-title"] img, #industry-applications img, #industry-material img').all()) {
    assert.ok((await image.getAttribute('alt'))?.trim(), `${label}: informative application image alternative`);
  }
}

async function rangeDisclosure(page, label) {
  const disclosure = page.locator('#industry-range details').first();
  await expect(disclosure).toBeAttached();
  const summary = disclosure.locator('summary');
  await summary.focus();
  if (await disclosure.evaluate(element => element.open)) await summary.press('Enter');
  await summary.press('Enter');
  await expect(disclosure).toHaveJSProperty('open', true);
  await expect(disclosure.locator('a').first()).toBeVisible();
  await summary.press('Space');
  await expect(disclosure).toHaveJSProperty('open', false);
  await expect(disclosure.locator('a').first()).not.toBeVisible();
  await noOverflow(page, `${label}: expanded product range`);
}

async function stickyNavigation(page, label) {
  const navigation = page.getByRole('navigation', {name: 'Industry page sections'});
  const applications = navigation.getByRole('link', {name: 'Applications', exact: true});
  await applications.focus();
  await applications.press('Enter');
  await expect.poll(async () => {
    const header = await page.locator('.park-header').boundingBox();
    const nav = await navigation.boundingBox();
    const target = await page.locator('#industry-applications').boundingBox();
    return Boolean(header && nav && target && nav.y >= header.y + header.height - 1 && target.y >= nav.y + nav.height - 1);
  }, {message: `${label}: sticky navigation and anchor content clear the header`}).toBe(true);
}

async function menuHeaders(page, mobile) {
  if (mobile) await page.getByRole('button', {name: 'Toggle navigation'}).click();
  const trigger = page.getByRole('button', {name: 'Industries', exact: true});
  if (mobile) await trigger.click();
  else await trigger.hover();
  const menu = page.locator('#park-mega');
  await expect(menu).toBeVisible();
  assert.deepEqual(await menu.locator('.mega-category > span:nth-child(2)').allTextContents(), industries.map(industry => industry.name));
  await page.keyboard.press('Escape');
  await expect(menu).toHaveCount(0);
}

try {
  const errors = [];
  const page = await browser.newPage({viewport: {width: 1440, height: 1000}, reducedMotion: 'reduce'});
  page.on('pageerror', error => errors.push(error.message));
  for (const [index, industry] of industries.entries()) {
    const route = `${origin}/markets/${industry.slug}/`;
    const response = await page.goto(route);
    assert.equal(response.status(), 200, `${industry.slug}: successful route`);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('main h1')).not.toHaveText('');
    await expect(page.locator('main')).toContainText(industry.name);
    await expect(page.locator(`main img[src="/images/generated/${industry.image}.webp"]`)).toHaveCount(1);

    const applicationLinks = page.locator('#industry-applications a[href^="/products/"]');
    const destinations = await applicationLinks.evaluateAll(links => links.map(link => link.getAttribute('href')));
    assert.equal(destinations.length, 4, `${industry.slug}: four application links`);
    assert.equal(new Set(destinations).size, 4, `${industry.slug}: distinct application links`);
    assert.ok(destinations.every(href => /^\/products\/[^/?#]+\/$/.test(href)), `${industry.slug}: product detail destinations`);

    await decodedImages(page, industry.slug);
    await nativeFaq(page, industry.slug);
    await nativeAnchors(page, industry.slug);
    if (index === 0) await menuHeaders(page, false);
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({width, height: 900});
      await noOverflow(page, `${industry.slug} ${width}px`);
      if ([1440, 390, 320].includes(width)) await stickyNavigation(page, `${industry.slug} ${width}px`);
    }
    await page.setViewportSize({width: 390, height: 844});
    await nativeFaq(page, `${industry.slug} mobile`);
    if (index === 0) await menuHeaders(page, true);
    await page.screenshot({path: `artifacts/industry-${industry.slug}-mobile.png`, fullPage: true});
    await page.setViewportSize({width: 1440, height: 1000});
    await page.screenshot({path: `artifacts/industry-${industry.slug}-desktop.png`, fullPage: true});
    console.log(`${industry.slug}: headings, four applications, images, FAQ, anchors and five viewports passed.`);
  }
  assert.deepEqual(errors, [], 'No browser runtime errors');

  const noScript = await browser.newContext({javaScriptEnabled: false, reducedMotion: 'reduce', viewport: {width: 390, height: 844}});
  const staticPage = await noScript.newPage();
  for (const industry of industries) {
    await staticPage.goto(`${origin}/markets/${industry.slug}/`);
    await expect(staticPage.locator('main h1')).toBeVisible();
    await rangeDisclosure(staticPage, `${industry.slug} without JavaScript`);
    await nativeFaq(staticPage, `${industry.slug} without JavaScript`);
    await nativeAnchors(staticPage, `${industry.slug} without JavaScript`);
    await noOverflow(staticPage, `${industry.slug} without JavaScript`);
  }
  await noScript.close();
  console.log('All four industry pages passed, including desktop/mobile navigation and native FAQ/anchor operation without JavaScript.');
} finally {
  await browser.close();
}
