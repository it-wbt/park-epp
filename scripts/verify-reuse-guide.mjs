import {chromium, expect} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdirSync, writeFileSync} from 'node:fs';

const origin = process.env.PREVIEW_URL || 'http://127.0.0.1:3000';
const url = new URL('/resources/design-for-reuse/', origin).href;
const browser = await chromium.launch();
const report = {origin, viewports: [], checks: [], links: []};
mkdirSync('artifacts', {recursive: true});
const captureStyle = 'header { visibility: hidden !important; } nextjs-portal { display: none !important; }';
const stages = ['Pack & protect', 'Deliver & unload', 'Collect & return', 'Inspect & reuse'];

async function noOverflow(page) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal document overflow');
}

async function visibleImagesLoad(page) {
  for (const image of await page.locator('article img').all()) {
    if (!(await image.isVisible())) continue;
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
    assert.ok((await image.getAttribute('alt')).length > 20, 'Descriptive image alt');
  }
}

try {
  const page = await browser.newPage({viewport: {width: 1440, height: 900}, reducedMotion: 'reduce'});
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(url);
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole('heading', {level: 1})).toHaveCount(1);
  await expect(page.locator('h1')).toHaveText('Designing returnable packaging for real journeys');
  assert.ok(await page.locator('h1').evaluate(el => parseFloat(getComputedStyle(el).fontSize) <= 48), 'Compact desktop heading');
  const region = page.locator('#return-loop');
  const tabs = region.getByRole('tab');
  await expect(tabs).toHaveCount(4);
  for (let index = 0; index < 4; index++) {
    await expect(tabs.nth(index)).toContainText(stages[index]);
    await tabs.nth(index).click();
    await expect(tabs.nth(index)).toHaveAttribute('aria-selected', 'true');
    await expect(region.getByRole('tabpanel')).toHaveCount(1);
    const panelId = await tabs.nth(index).getAttribute('aria-controls');
    await expect(page.locator(`[id="${panelId}"]`)).toBeVisible();
    await visibleImagesLoad(page);
  }
  await tabs.nth(0).focus();
  await page.keyboard.press('End');
  await expect(tabs.nth(3)).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.nth(0)).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(tabs.nth(3)).toBeFocused();
  await page.keyboard.press('Home');
  await expect(tabs.nth(0)).toBeFocused();
  await page.keyboard.press('Space');
  await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
  await tabs.nth(1).focus();
  await page.keyboard.press('Enter');
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  assert.ok(await tabs.nth(1).evaluate(el => parseFloat(getComputedStyle(el).outlineWidth) >= 2), 'Visible keyboard focus');
  report.checks.push('Four image-led journey stages, matching panels, roving focus, keyboard Home/End/arrows/Enter/Space');

  for (const viewport of [{width: 1440, height: 900}, {width: 768, height: 900}, {width: 390, height: 844}, {width: 320, height: 740}]) {
    await page.setViewportSize(viewport);
    await page.goto(url);
    await page.evaluate(() => document.fonts.ready);
    for (let index = 0; index < 4; index++) {
      await tabs.nth(index).click();
      await visibleImagesLoad(page);
      await noOverflow(page);
      assert.ok((await tabs.nth(index).boundingBox()).height >= 44, '44px stage controls');
    }
    await tabs.nth(0).click();
    for (const target of ['return-loop', 'reuse-principles', 'reuse-brief']) {
      await page.getByRole('navigation', {name: 'Returnable packaging guide sections'}).locator(`a[href="#${target}"]`).click();
      await expect.poll(() => page.evaluate(id => {
        const top = document.getElementById(id).getBoundingClientRect().top;
        return top >= document.querySelector('header').getBoundingClientRect().bottom - 1 && top < innerHeight - 40;
      }, target)).toBe(true);
    }
    if ([1440, 390].includes(viewport.width)) {
      await page.locator('article > section').first().screenshot({path: `artifacts/reuse-hero-${viewport.width}.png`, style: captureStyle});
      await region.screenshot({path: `artifacts/reuse-journey-${viewport.width}.png`, style: captureStyle});
    }
    report.viewports.push({...viewport, articleHeight: Math.round((await page.locator('article').first().boundingBox()).height)});
  }
  report.checks.push('1440/768/390/320px: all images decode, stages fit, 44px controls, no overflow and anchors clear header');

  const links = await page.locator('article a[href]').evaluateAll(elements => [...new Set(elements.map(el => el.getAttribute('href')))].filter(href => href.startsWith('/')));
  for (const href of links) {
    const response = await page.request.get(new URL(href, origin).href);
    assert.equal(response.status(), 200, `Destination ${href}`);
    if (href.endsWith('.pdf')) assert.equal((await response.body()).subarray(0, 5).toString(), '%PDF-');
    report.links.push({href, status: response.status()});
  }
  assert.doesNotMatch(await page.locator('body').innerText(), /knauf|neops|celoops/i);
  assert.ok((await page.locator('a[href]').evaluateAll(elements => elements.map(el => el.href))).every(href => !/knauf|neops|celoops/i.test(href)));
  assert.deepEqual(errors, [], 'No browser runtime errors');
  report.checks.push('Article destinations/PDF, no competitor copy or links, no runtime errors');

  const staticContext = await browser.newContext({javaScriptEnabled: false, viewport: {width: 390, height: 844}, reducedMotion: 'reduce'});
  const staticPage = await staticContext.newPage();
  await staticPage.goto(url);
  await expect(staticPage.locator('h1')).toBeVisible();
  for (const stage of stages) await expect(staticPage.locator('#return-loop').getByText(stage, {exact: true}).first()).toBeVisible();
  await expect(staticPage.locator('#return-loop img')).toHaveCount(4);
  for (const image of await staticPage.locator('#return-loop img').all()) await expect(image).toBeVisible();
  await visibleImagesLoad(staticPage);
  await noOverflow(staticPage);
  report.checks.push('Without JavaScript all four journey stages and images remain available');
  await staticContext.close();
  writeFileSync('artifacts/reuse-guide-report.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally { await browser.close(); }
