import {chromium, expect} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';

const origin = process.env.PREVIEW_URL || 'http://127.0.0.1:3000';
const industryNames = ['Sports, Leisure & Early Childhood', 'Logistics & Material Handling', 'HVAC', 'Automotive'];
const industryPaths = ['/markets/sports-leisure/', '/markets/logistics-handling/', '/markets/hvac/', '/markets/mobility/'];
const guidePath = '/materials/expanded-polypropylene/';
const guideAnchors = ['epp-properties', 'epp-manufacturing', 'epp-applications', 'epp-comparison', 'epp-design', 'epp-faq', 'epp-sources'];
const browser = await chromium.launch();
mkdirSync('artifacts', {recursive: true});

async function noOverflow(page, label) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow: ${label}`);
}

async function toggleFirstDetail(scope, label) {
  const detail = scope.locator('details').first();
  await expect(detail, `${label} has a native disclosure`).toBeAttached();
  const summary = detail.locator('summary');
  if (await detail.evaluate(el => el.open)) await summary.click();
  await summary.click();
  await expect(detail).toHaveJSProperty('open', true);
  assert.ok((await detail.innerText()).length > (await summary.innerText()).length, `${label} reveals its answer`);
  await summary.click();
  await expect(detail).toHaveJSProperty('open', false);
}

async function checkIndustryMenu(page, mobile = false) {
  if (mobile) await page.getByRole('button', {name: 'Toggle navigation'}).click();
  const trigger = page.getByRole('button', {name: 'Industries', exact: true});
  if (mobile) await trigger.click();
  else await trigger.hover();
  const menu = page.locator('#park-mega');
  await expect(menu).toBeVisible();
  const options = menu.locator('.mega-category');
  assert.deepEqual(await options.locator('> span:nth-child(2)').allTextContents(), industryNames);
  for (let index = 0; index < industryNames.length; index++) {
    await options.nth(index).click();
    await expect(options.nth(index)).toHaveAttribute('aria-pressed', 'true');
    const previews = menu.locator('.product-menu-link');
    await expect(previews.first()).toBeVisible();
    const count = await previews.count();
    assert.ok(count > 0 && count <= 5, `${industryNames[index]} has 1–5 product previews, received ${count}`);
    await expect(menu.getByRole('link', {name: 'Explore products', exact: true})).toBeVisible();
    await noOverflow(page, `${mobile ? 'mobile' : 'desktop'} ${industryNames[index]} menu`);
  }
  const bounds = await menu.boundingBox();
  assert.ok(bounds && bounds.x >= 0 && bounds.x + bounds.width <= page.viewportSize().width + 1, 'Menu stays within viewport');
  await page.keyboard.press('Escape');
  await expect(menu).toHaveCount(0);
}

try {
  const page = await browser.newPage({viewport: {width: 1440, height: 1000}});
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(origin);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(850);
  assert.equal(await page.locator('.modern-home').count(), 1);
  assert.equal(await page.locator('.modern-home .filters').count(), 0);

  const industries = page.locator('section[aria-labelledby="industry-heading"]');
  assert.equal(await industries.locator('select, button').count(), 0);
  assert.deepEqual(await industries.locator('h3').allTextContents(), industryNames);
  assert.deepEqual(await industries.locator('a').evaluateAll(links => links.map(link => link.getAttribute('href'))), industryPaths);
  for (const width of [1920, 1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({width, height: 900});
    await noOverflow(page, `${width}px home`);
    const columns = await industries.locator('a').evaluateAll(links => new Set(links.map(link => Math.round(link.getBoundingClientRect().left))).size);
    assert.equal(columns, width > 1100 ? 4 : width > 560 ? 2 : 1, `Industry columns at ${width}px`);
  }

  await page.setViewportSize({width: 1440, height: 1000});
  const applications = page.getByRole('region', {name: 'Made to protect. Shaped to perform.'});
  assert.ok(await applications.evaluate(el => parseFloat(getComputedStyle(el).paddingLeft) >= 16));
  assert.equal(await page.locator('.site-scroll-progress').evaluate(el => getComputedStyle(el).position), 'fixed');
  await applications.scrollIntoViewIfNeeded();
  await page.waitForTimeout(850);
  const card = applications.locator('a').first();
  await card.focus();
  assert.equal(await card.evaluate(el => getComputedStyle(el).opacity), '1');
  assert.ok(await page.locator('.site-scroll-progress').evaluate(el => getComputedStyle(el).transform !== 'matrix(0, 0, 0, 1, 0, 0)'));
  await applications.screenshot({path: 'artifacts/modern-applications.png'});

  assert.ok(await industries.evaluate(el => parseFloat(getComputedStyle(el).paddingLeft) >= 16));
  assert.ok((await industries.boundingBox()).height <= 600, 'Four-industry section remains compact on desktop');
  await industries.scrollIntoViewIfNeeded();
  await page.waitForTimeout(850);
  assert.ok(await industries.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)), 'All four industry images load');
  await industries.screenshot({path: 'artifacts/modern-industries.png'});
  await checkIndustryMenu(page);

  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.waitForTimeout(100);
  await expect(page.locator('.park-hero video')).toHaveCount(0);
  assert.ok(await page.locator('video[aria-label="EPP moulding 3D process film"]').evaluate(video => video.paused));
  assert.equal(await page.locator('.site-scroll-progress').evaluate(el => getComputedStyle(el).display), 'none');
  await applications.scrollIntoViewIfNeeded();
  await card.hover();
  assert.equal(await card.evaluate(el => getComputedStyle(el).transform), 'none');
  assert.equal(await page.evaluate(() => document.getAnimations().filter(animation => animation.playState === 'running').length), 0);

  await page.setViewportSize({width: 390, height: 844});
  await industries.scrollIntoViewIfNeeded();
  await industries.screenshot({path: 'artifacts/modern-industries-mobile.png'});
  await checkIndustryMenu(page, true);

  await page.setViewportSize({width: 1440, height: 1000});
  const knowledge = page.locator('section[aria-labelledby="epp-knowledge-heading"]');
  await expect(knowledge).toContainText('EPP');
  await toggleFirstDetail(knowledge, 'Home EPP knowledge');
  await knowledge.getByRole('link', {name: 'Read the complete EPP guide', exact: true}).click();
  await page.waitForURL(`**${guidePath}`);
  await expect(page.locator('main h1')).toContainText(/EPP|Expanded polypropylene/i);
  for (const anchor of guideAnchors) await expect(page.locator(`#${anchor}`)).toHaveCount(1);
  const faq = page.locator('#epp-faq');
  await toggleFirstDetail(faq, 'EPP guide FAQ');
  for (const width of [1440, 390]) {
    await page.setViewportSize({width, height: 900});
    await noOverflow(page, `${width}px EPP guide`);
  }

  await page.goto(`${origin}/products/`);
  assert.equal(await page.getByRole('textbox', {name: 'Search products', exact: true}).count(), 1);
  const marketFilter = page.getByRole('combobox', {name: 'Industry', exact: true});
  assert.deepEqual(await marketFilter.locator('option').allTextContents(), ['All industries', ...industryNames]);
  await marketFilter.selectOption({label: industryNames[0]});
  await expect(page.locator('.product-grid')).toContainText('Sports accessories');
  await expect(page.locator('.product-grid')).toContainText('Childhood accessories');
  await expect(page.locator('.product-grid')).toContainText('Moulded plastic toys');
  assert.deepEqual(errors, []);

  const noScript = await browser.newContext({javaScriptEnabled: false, viewport: {width: 390, height: 844}});
  const staticPage = await noScript.newPage();
  await staticPage.goto(origin);
  const heading = staticPage.getByRole('heading', {name: 'Made to protect. Shaped to perform.'});
  assert.ok(await heading.isVisible());
  assert.equal(await heading.evaluate(el => getComputedStyle(el).opacity), '1');
  await toggleFirstDetail(staticPage.locator('section[aria-labelledby="epp-knowledge-heading"]'), 'No-JS home EPP knowledge');
  await staticPage.goto(`${origin}${guidePath}`);
  await expect(staticPage.locator('main h1')).toContainText(/EPP|Expanded polypropylene/i);
  await toggleFirstDetail(staticPage.locator('#epp-faq'), 'No-JS EPP guide FAQ');
  await noOverflow(staticPage, 'No-JS mobile EPP guide');
  await noScript.close();
  console.log('Modern experience passed: six viewports, four visible industries, desktop/mobile industry menus, reduced motion, EPP guide and native FAQs, four-market catalogue with childhood products, and no-JS disclosure operation.');
} finally {
  await browser.close();
}
