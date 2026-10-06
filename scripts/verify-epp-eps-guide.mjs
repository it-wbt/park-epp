import {chromium, expect} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdirSync, writeFileSync} from 'node:fs';

const origin = process.env.PREVIEW_URL || 'http://127.0.0.1:3000';
const path = '/resources/epp-or-eps/';
const browser = await chromium.launch();
const report = {origin, viewports: [], checks: [], links: []};
mkdirSync('artifacts', {recursive: true});

async function noOverflow(page, label) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${label}: no horizontal document overflow`);
}

async function exclusive(details, selected) {
  for (let index = 0; index < 3; index++) {
    await expect.poll(() => details.nth(index).evaluate(element => element.open)).toBe(index === selected);
  }
}

async function accordionChecks(page, label) {
  const region = page.locator('#application-focus');
  const details = region.locator('details');
  const summaries = details.locator('summary');
  await expect(details).toHaveCount(3);
  await exclusive(details, 0);
  for (const index of [1, 2, 0]) {
    await summaries.nth(index).click();
    await exclusive(details, index);
    await expect(details.nth(index).getByRole('link')).toBeVisible();
  }
  await summaries.nth(1).focus();
  await page.keyboard.press('Enter');
  await exclusive(details, 1);
  await summaries.nth(2).focus();
  await page.keyboard.press('Space');
  await exclusive(details, 2);
  await expect(summaries.nth(2)).toBeFocused();
  assert.ok(await summaries.nth(2).evaluate(element => parseFloat(getComputedStyle(element).outlineWidth) >= 2), `${label}: visible keyboard focus ring`);
  await page.keyboard.press('Space');
  await exclusive(details, -1);
  await summaries.nth(0).focus();
  await page.keyboard.press('Enter');
  await exclusive(details, 0);
  for (const summary of await summaries.all()) {
    assert.ok((await summary.boundingBox()).height >= 44, `${label}: summary meets 44px target`);
  }
  report.checks.push(`${label}: native accordion click, Enter, Space, exclusive opening, all-closed state, focus and 44px controls`);
}

try {
  const page = await browser.newPage({viewport: {width: 1440, height: 900}, reducedMotion: 'reduce'});
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(new URL(path, origin).href);
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole('heading', {level: 1})).toHaveCount(1);
  await expect(page.getByRole('heading', {level: 1})).toHaveText('EPP or EPS?Start with the application.');
  assert.ok(await page.locator('h1').evaluate(element => parseFloat(getComputedStyle(element).fontSize) <= 48), 'Desktop heading is at most 48px');
  const table = page.locator('#material-comparison table');
  await expect(table.locator('tbody tr')).toHaveCount(4);
  await expect(table.locator('thead th')).toHaveCount(3);
  await expect(table.locator('thead th').nth(1)).toContainText('EPP');
  await expect(table.locator('thead th').nth(2)).toContainText('EPS');
  for (const header of await table.locator('tbody th').all()) await expect(header).toHaveAttribute('scope', 'row');
  report.checks.push('One compact H1, four comparison rows, EPP/EPS column headers and semantic row headers');
  await accordionChecks(page, 'JavaScript enabled');

  const bodyText = await page.locator('body').innerText();
  assert.doesNotMatch(bodyText, /knauf|neops|celoops/i, 'No competitor names in visible body copy');
  const allLinks = await page.locator('a[href]').evaluateAll(elements => elements.map(element => element.getAttribute('href')));
  assert.ok(allLinks.every(href => !/knauf|neops|celoops/i.test(href)), 'No competitor destination links');
  const articleLinks = await page.locator('article a[href]').evaluateAll(elements => [...new Set(elements.map(element => element.getAttribute('href')))].filter(href => href.startsWith('/')));
  for (const href of articleLinks) {
    const response = await page.request.get(new URL(href, origin).href);
    assert.equal(response.status(), 200, `Internal destination returns 200: ${href}`);
    if (href.endsWith('.pdf')) assert.equal((await response.body()).subarray(0, 5).toString(), '%PDF-', 'Checklist is a valid PDF file');
    report.links.push({href, status: response.status()});
  }
  await expect(page.getByRole('link', {name: /Download the selection checklist/})).toHaveAttribute('download', '');
  report.checks.push('All article destinations return 200; checklist has PDF signature and download attribute; no public competitor references');

  for (const viewport of [{width: 1440, height: 900}, {width: 768, height: 900}, {width: 390, height: 844}, {width: 320, height: 740}]) {
    await page.setViewportSize(viewport);
    await page.goto(new URL(path, origin).href);
    await page.evaluate(() => document.fonts.ready);
    await noOverflow(page, `${viewport.width}px`);
    for (const image of await page.locator('article img').all()) {
      await expect.poll(() => image.evaluate(element => element.complete && element.naturalWidth > 0)).toBe(true);
      assert.ok((await image.getAttribute('alt')).length > 20, 'Material image has descriptive alternative text');
    }
    assert.ok(await table.locator('td').evaluateAll(cells => cells.every(cell => parseFloat(getComputedStyle(cell).fontSize) >= 14)), 'Table copy is at least 14px');
    if (viewport.width <= 760) {
      for (const row of await table.locator('tbody tr').all()) {
        await expect(row.locator('td').nth(0)).toContainText('EPP');
        await expect(row.locator('td').nth(1)).toContainText('EPS');
      }
      assert.ok(await table.locator('td').evaluateAll(cells => cells.every(cell => cell.scrollWidth <= cell.clientWidth)), 'Mobile comparison cells do not overflow');
    }
    if ([1440, 390].includes(viewport.width)) {
      const captureStyle = 'header { visibility: hidden !important; } nextjs-portal { display: none !important; }';
      await page.locator('article > section').first().screenshot({path: `artifacts/epp-eps-hero-${viewport.width}.png`, style: captureStyle});
      await page.locator('#material-comparison').screenshot({path: `artifacts/epp-eps-comparison-${viewport.width}.png`, style: captureStyle});
      await page.locator('#application-focus').screenshot({path: `artifacts/epp-eps-application-${viewport.width}.png`, style: captureStyle});
    }
    const sectionHeights = await page.locator('article > section').evaluateAll(sections => sections.map(section => ({id: section.id || 'hero', height: Math.round(section.getBoundingClientRect().height)})));
    for (const target of ['material-comparison', 'application-focus', 'selection-steps']) {
      await page.getByRole('navigation', {name: 'Material selection guide sections'}).locator(`a[href="#${target}"]`).click();
      await expect.poll(async () => page.evaluate(id => {
        const top = document.getElementById(id).getBoundingClientRect().top;
        const headerBottom = document.querySelector('header').getBoundingClientRect().bottom;
        return top >= headerBottom - 1 && top < innerHeight - 60;
      }, target), {message: `${viewport.width}px: ${target} anchor clears sticky header`}).toBe(true);
    }
    const details = page.locator('#application-focus details');
    for (const index of [1, 2, 0]) {
      await details.nth(index).locator('summary').click();
      await exclusive(details, index);
      await noOverflow(page, `${viewport.width}px application ${index}`);
      assert.equal(await details.nth(index).evaluate(element => element.getAnimations({subtree: true}).filter(animation => animation.playState === 'running').length), 0, 'Reduced-motion accordion has no running animation');
    }
    report.viewports.push({...viewport, sectionHeights});
  }
  report.checks.push('1440, 768, 390 and 320px widths: image decoding, legible mobile table, no overflow, all application states, anchor visibility and reduced motion');

  const staticContext = await browser.newContext({javaScriptEnabled: false, reducedMotion: 'reduce', viewport: {width: 390, height: 844}});
  const staticPage = await staticContext.newPage();
  await staticPage.goto(new URL(path, origin).href);
  await expect(staticPage.locator('h1')).toContainText('EPP or EPS?');
  await expect(staticPage.locator('#material-comparison tbody tr')).toHaveCount(4);
  await accordionChecks(staticPage, 'JavaScript disabled');
  await noOverflow(staticPage, 'No-JS guide');
  await staticPage.locator('#application-focus details').nth(1).locator('summary').click();
  await staticPage.getByRole('link', {name: 'Explore thermal design'}).click();
  await staticPage.waitForURL('**/solutions/manage-temperature/');
  await expect(staticPage.locator('h1')).toBeVisible();
  report.checks.push('No-JS comparison and all application content remain usable; native related link navigates');
  await staticContext.close();
  assert.deepEqual(errors, [], 'No browser runtime errors');
  report.checks.push('No browser runtime errors');
  writeFileSync('artifacts/epp-eps-guide-report.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
