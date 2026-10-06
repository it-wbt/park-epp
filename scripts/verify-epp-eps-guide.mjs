import {chromium, expect} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdirSync, writeFileSync} from 'node:fs';

const origin = process.env.PREVIEW_URL || 'http://127.0.0.1:3000';
const path = '/resources/epp-or-eps/';
const browser = await chromium.launch();
const report = {origin, viewports: [], checks: [], links: []};
const sliderName = 'Compare EPP and EPS material views';
const captureStyle = 'header { visibility: hidden !important; } nextjs-portal { display: none !important; }';
mkdirSync('artifacts', {recursive: true});

async function noOverflow(page, label) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${label}: no horizontal document overflow`);
}

async function exclusive(details, selected) {
  for (let index = 0; index < 3; index++) {
    await expect.poll(() => details.nth(index).evaluate(element => element.open)).toBe(index === selected);
  }
}

async function sliderPosition(page, position, checkClipping = true) {
  const slider = page.getByRole('slider', {name: sliderName});
  await expect(slider).toHaveValue(String(position));
  await expect(slider).toHaveAttribute('aria-valuetext', position === 0 ? 'Full EPP view' : position === 100 ? 'Full EPS view' : `${position}% EPS, ${100 - position}% EPP`);
  if (!checkClipping) return;
  const visibleLayers = await slider.evaluate(input => {
    const frame = input.parentElement;
    const eps = frame.querySelector('img[src*="material-compare-eps"]').parentElement;
    const bounds = frame.getBoundingClientRect();
    return [.25, .75].map(ratio => document.elementsFromPoint(bounds.left + bounds.width * ratio, bounds.top + bounds.height * .35).includes(eps));
  });
  if ([0, 50, 100].includes(position)) assert.deepEqual(visibleLayers, position === 0 ? [false, false] : position === 100 ? [true, true] : [true, false], `${position}%: EPS layer clips to the actual visible area`);
}

async function sliderChecks(page) {
  const slider = page.getByRole('slider', {name: sliderName});
  await expect(slider).toBeEnabled();
  const frame = slider.locator('..');
  await frame.scrollIntoViewIfNeeded();
  await sliderPosition(page, 50);
  const bounds = await frame.boundingBox();
  const y = bounds.y + bounds.height * .5;
  await page.mouse.move(bounds.x + bounds.width / 2, y);
  await page.mouse.down();
  await page.mouse.move(bounds.x - 12, y, {steps: 8});
  await sliderPosition(page, 0);
  await page.mouse.move(bounds.x + bounds.width + 12, y, {steps: 12});
  await sliderPosition(page, 100);
  await page.mouse.move(bounds.x + bounds.width / 2, y, {steps: 8});
  await page.mouse.up();
  await sliderPosition(page, 50);
  await expect(slider).toBeFocused();

  await slider.focus();
  for (const [key, value] of [['Home', 0], ['ArrowLeft', 0], ['ArrowRight', 1], ['End', 100], ['ArrowRight', 100], ['ArrowLeft', 99], ['ArrowUp', 100], ['ArrowDown', 99], ['Home', 0]]) {
    await page.keyboard.press(key);
    await sliderPosition(page, value);
  }
  assert.ok(await frame.evaluate(element => parseFloat(getComputedStyle(element).outlineWidth) >= 3), 'Keyboard slider has a visible frame focus ring');
  for (const [name, value] of [['Show full EPS view', 100], ['Show full EPP view', 0], ['Show equal EPP and EPS split', 50]]) {
    const button = page.getByRole('button', {name, exact: true});
    await button.click();
    await sliderPosition(page, value);
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    assert.ok((await button.boundingBox()).height >= 44, 'Alternative material controls have 44px targets');
  }
  report.checks.push('Image slider: pointer drag left/right beyond frame clamps to 0/100, true full-layer clipping and 50% split; keyboard Home/End/arrows, focus ring and endpoint/reset buttons');
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
  await sliderChecks(page);
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
    const slider = page.getByRole('slider', {name: sliderName});
    const frame = slider.locator('..');
    await frame.scrollIntoViewIfNeeded();
    const dimensions = await frame.locator('img').evaluateAll(images => images.map(image => ({width: image.naturalWidth, height: image.naturalHeight, rect: {width: image.getBoundingClientRect().width, height: image.getBoundingClientRect().height}})));
    assert.equal(dimensions.length, 2, 'Exactly two image layers form one comparison');
    assert.deepEqual(dimensions[0], dimensions[1], 'Both material views share intrinsic dimensions and rendered geometry');
    assert.equal(dimensions[0].width, 1536, 'Comparison assets are the matched 1536px originals');
    assert.equal(dimensions[0].height, 1024, 'Comparison assets share a 3:2 image ratio');
    for (const [name, value] of [['Show full EPP view', 0], ['Show full EPS view', 100], ['Show equal EPP and EPS split', 50]]) {
      await page.getByRole('button', {name, exact: true}).click();
      await sliderPosition(page, value);
      await noOverflow(page, `${viewport.width}px slider ${value}%`);
      if ([1440, 390].includes(viewport.width)) await slider.locator('../..').screenshot({path: `artifacts/epp-eps-slider-${viewport.width}-${value}.png`, style: captureStyle});
    }
    assert.equal(await frame.evaluate(element => element.getAnimations({subtree: true}).filter(animation => animation.playState === 'running').length), 0, 'Reduced-motion comparison has no running animations');
    assert.ok(await table.locator('td').evaluateAll(cells => cells.every(cell => parseFloat(getComputedStyle(cell).fontSize) >= 14)), 'Table copy is at least 14px');
    if (viewport.width <= 760) {
      for (const row of await table.locator('tbody tr').all()) {
        await expect(row.locator('td').nth(0)).toContainText('EPP');
        await expect(row.locator('td').nth(1)).toContainText('EPS');
      }
      assert.ok(await table.locator('td').evaluateAll(cells => cells.every(cell => cell.scrollWidth <= cell.clientWidth)), 'Mobile comparison cells do not overflow');
    }
    if ([1440, 390].includes(viewport.width)) {
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

  const touchContext = await browser.newContext({viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true, reducedMotion: 'reduce'});
  const touchPage = await touchContext.newPage();
  touchPage.on('pageerror', error => errors.push(error.message));
  await touchPage.goto(new URL(path, origin).href);
  const touchSlider = touchPage.getByRole('slider', {name: sliderName});
  await expect(touchSlider).toBeEnabled();
  const touchFrame = touchSlider.locator('..');
  await touchFrame.scrollIntoViewIfNeeded();
  const touchBounds = await touchFrame.boundingBox();
  const cdp = await touchContext.newCDPSession(touchPage);
  const touchY = touchBounds.y + touchBounds.height * .5;
  await cdp.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [{x: touchBounds.x + touchBounds.width / 2, y: touchY, id: 1}]});
  for (const ratio of [.4, .25, .1, 0]) await cdp.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: [{x: touchBounds.x + touchBounds.width * ratio, y: touchY, id: 1}]});
  await sliderPosition(touchPage, 0);
  for (const ratio of [.1, .25, .5, .75, 1]) await cdp.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: [{x: touchBounds.x + touchBounds.width * ratio, y: touchY, id: 1}]});
  await sliderPosition(touchPage, 100);
  await cdp.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: [{x: touchBounds.x + touchBounds.width / 2, y: touchY, id: 1}]});
  await cdp.send('Input.dispatchTouchEvent', {type: 'touchEnd', touchPoints: []});
  await sliderPosition(touchPage, 50);
  await noOverflow(touchPage, 'Touch slider');
  report.checks.push('Real emulated touch pointer stream drags left/right to full material endpoints and back to a 50% split');
  await touchContext.close();

  const staticContext = await browser.newContext({javaScriptEnabled: false, reducedMotion: 'reduce', viewport: {width: 390, height: 844}});
  const staticPage = await staticContext.newPage();
  await staticPage.goto(new URL(path, origin).href);
  await expect(staticPage.locator('h1')).toContainText('EPP or EPS?');
  await expect(staticPage.locator('#material-comparison tbody tr')).toHaveCount(4);
  const staticSlider = staticPage.getByRole('slider', {name: sliderName});
  await expect(staticSlider).toBeDisabled();
  await staticSlider.locator('..').scrollIntoViewIfNeeded();
  await sliderPosition(staticPage, 50);
  await expect(staticPage.getByRole('button', {name: 'Show full EPP view'})).toHaveCount(0);
  await expect(staticSlider.locator('../..').locator('figcaption')).toContainText('EPS on the left and EPP on the right');
  const staticBounds = await staticSlider.locator('..').boundingBox();
  await staticPage.mouse.click(staticBounds.x + staticBounds.width * .2, staticBounds.y + staticBounds.height * .5);
  await sliderPosition(staticPage, 50);
  report.checks.push('No-JS comparison retains matched images at a static 50% split, descriptive caption and no inactive visible controls');
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
