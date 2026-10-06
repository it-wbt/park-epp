import {chromium, expect} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdirSync, writeFileSync} from 'node:fs';

const origin = process.env.PREVIEW_URL || 'http://127.0.0.1:3000';
const guides = [
  {label: 'Material selection', title: 'EPP or EPS: start with the application', href: '/resources/epp-or-eps/'},
  {label: 'Design for reuse', title: 'Designing returnable packaging for real journeys', href: '/resources/design-for-reuse/'},
];
const cataloguePath = '/downloads/park-nonwoven-epp-catalogue.pdf';
const cataloguePages = [1, 8, 12];
const browser = await chromium.launch();
const report = {origin, viewports: [], checks: []};
mkdirSync('artifacts', {recursive: true});

async function noOverflow(page, label) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${label}: document has no horizontal overflow`);
}

try {
  const page = await browser.newPage({viewport: {width: 1440, height: 900}, reducedMotion: 'reduce'});
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(origin);
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('.modern-home > section')).toHaveCount(7);
  const resources = page.getByRole('region', {name: 'Practical guidance.'});
  await resources.scrollIntoViewIfNeeded();
  const tabs = resources.getByRole('tab');
  await expect(tabs).toHaveCount(2);
  const panel = resources.getByRole('tabpanel');

  async function selectedGuide(index, focused = false) {
    await expect(tabs.nth(index)).toHaveAttribute('aria-selected', 'true');
    await expect(tabs.nth(index)).toHaveAttribute('tabindex', '0');
    await expect(tabs.nth(1 - index)).toHaveAttribute('aria-selected', 'false');
    await expect(tabs.nth(1 - index)).toHaveAttribute('tabindex', '-1');
    await expect(panel).toHaveCount(1);
    await expect(panel.getByRole('heading')).toHaveText(guides[index].title);
    await expect(panel.getByRole('link', {name: 'Read guide'})).toHaveAttribute('href', guides[index].href);
    if (focused) await expect(tabs.nth(index)).toBeFocused();
  }

  await selectedGuide(0);
  await tabs.nth(1).click();
  await selectedGuide(1, true);
  await page.keyboard.press('ArrowRight');
  await selectedGuide(0, true);
  await page.keyboard.press('ArrowLeft');
  await selectedGuide(1, true);
  await page.keyboard.press('Home');
  await selectedGuide(0, true);
  await page.keyboard.press('End');
  await selectedGuide(1, true);
  await tabs.nth(0).focus();
  await page.keyboard.press('Enter');
  await selectedGuide(0, true);
  await tabs.nth(1).focus();
  await page.keyboard.press('Space');
  await selectedGuide(1, true);
  report.checks.push('Guide click, Enter, Space, arrow wraparound, Home/End, roving focus and matching article links');

  const download = resources.getByRole('link', {name: /Download catalogue/});
  await expect(download).toHaveCount(1);
  await expect(download).toHaveAttribute('download', '');
  await expect(download).toHaveAttribute('href', cataloguePath);
  const response = await page.request.get(new URL(cataloguePath, origin).href);
  assert.ok(response.ok(), 'Catalogue request succeeds');
  assert.equal((await response.body()).subarray(0, 5).toString(), '%PDF-', 'Download contains a PDF');
  report.checks.push('Direct downloadable PDF URL and file signature');

  const opener = resources.getByRole('link', {name: /Preview catalogue/});
  const dialog = page.getByRole('dialog', {name: 'Inside the catalogue.'});
  const close = page.getByRole('button', {name: 'Close catalogue preview'});
  const next = page.getByRole('button', {name: 'Next preview page'});
  const previous = page.getByRole('button', {name: 'Previous preview page'});
  const originalOverflow = await page.evaluate(() => document.body.style.overflow);

  async function openPreview() {
    await opener.click();
    await expect(dialog).toBeVisible();
    await expect(close).toBeFocused();
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden');
    await expect(dialog.getByRole('status')).toContainText('Catalogue page 1 of 12');
  }

  async function checkClosed() {
    await expect(dialog).toHaveCount(0);
    await expect(opener).toBeFocused();
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe(originalOverflow);
  }

  await openPreview();
  const modalDownload = dialog.getByRole('link', {name: 'Download complete catalogue'});
  await expect(modalDownload).toHaveAttribute('href', cataloguePath);
  await expect(modalDownload).toHaveAttribute('download', '');
  await expect(previous).toBeDisabled();
  for (let index = 0; index < cataloguePages.length; index++) {
    await expect(dialog.getByRole('status')).toContainText(`Preview ${index + 1} of 3`);
    await expect(dialog.getByRole('status')).toContainText(`Catalogue page ${cataloguePages[index]} of 12`);
    const visibleImage = dialog.getByRole('img');
    await expect(visibleImage).toHaveCount(1);
    await expect.poll(() => visibleImage.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
    assert.ok((await visibleImage.getAttribute('alt')).length > 30, 'Preview image has a descriptive alternative');
    if (index < cataloguePages.length - 1) await next.click();
  }
  await expect(next).toBeDisabled();
  await previous.click();
  await expect(dialog.getByRole('status')).toContainText('Catalogue page 8 of 12');
  await previous.click();
  await expect(previous).toBeDisabled();
  await expect(dialog.getByRole('status')).toContainText('Catalogue page 1 of 12');
  await modalDownload.focus();
  for (let index = 0; index < 8; index++) {
    await page.keyboard.press('Tab');
    assert.ok(await dialog.evaluate(element => !document.hasFocus() || element.contains(document.activeElement)), 'Tab cannot focus background page controls');
  }
  for (let index = 0; index < 4; index++) {
    await page.keyboard.press('Shift+Tab');
    assert.ok(await dialog.evaluate(element => !document.hasFocus() || element.contains(document.activeElement)), 'Reverse Tab cannot focus background page controls');
  }
  await close.focus();
  await opener.evaluate(element => element.focus());
  await expect(close).toBeFocused();
  await page.keyboard.press('Escape');
  await checkClosed();
  await openPreview();
  await next.click();
  await close.click();
  await checkClosed();
  await openPreview();
  await expect(previous).toBeDisabled();
  await close.click();
  await checkClosed();
  report.checks.push('Modal initial focus, native Tab trap, scroll lock/restoration, Escape/button close, focus return and first-page reset');
  report.checks.push('Three real catalogue previews, pages 1/8/12, image decoding, descriptive alternatives and pagination boundaries');

  for (const viewport of [
    {width: 1440, height: 900}, {width: 768, height: 900},
    {width: 390, height: 844}, {width: 320, height: 740}, {width: 390, height: 640},
  ]) {
    await page.setViewportSize(viewport);
    await resources.scrollIntoViewIfNeeded();
    await noOverflow(page, `${viewport.width}x${viewport.height} resources`);
    const sectionBounds = await resources.boundingBox();
    if ([1440, 390].includes(viewport.width) && viewport.height !== 640) {
      await resources.screenshot({path: `artifacts/home-resources-${viewport.width}.png`});
    }
    await openPreview();
    const bounds = await dialog.boundingBox();
    assert.ok(bounds && bounds.x >= 0 && bounds.y >= 0 && bounds.x + bounds.width <= viewport.width + 1 && bounds.y + bounds.height <= viewport.height + 1,
      `${viewport.width}x${viewport.height}: modal fits viewport`);
    assert.ok(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth), 'Modal has no horizontal overflow');
    await noOverflow(page, `${viewport.width}x${viewport.height} modal`);
    if ([1440, 390].includes(viewport.width)) {
      await dialog.screenshot({path: `artifacts/catalogue-preview-${viewport.width}x${viewport.height}.png`});
    }
    report.viewports.push({...viewport, sectionHeight: Math.round(sectionBounds.height), dialogHeight: Math.round(bounds.height)});
    await close.click();
    await checkClosed();
  }
  await tabs.nth(0).click();
  assert.equal(await resources.evaluate(element => element.getAnimations({subtree: true}).filter(animation => animation.playState === 'running').length), 0,
    'Reduced-motion resources have no running animations');
  report.checks.push('Five desktop/tablet/mobile/short-mobile viewports, modal fit and no horizontal overflow; reduced motion');

  const staticContext = await browser.newContext({javaScriptEnabled: false, viewport: {width: 390, height: 844}});
  const staticPage = await staticContext.newPage();
  for (const guide of guides) {
    await staticPage.goto(origin);
    const section = staticPage.getByRole('region', {name: 'Practical guidance.'});
    await expect(section.getByRole('tab')).toHaveCount(0);
    const link = section.getByRole('link', {name: guide.label, exact: true});
    await expect(link).toHaveAttribute('href', guide.href);
    await expect(section.getByRole('link', {name: /Preview catalogue/})).toHaveAttribute('href', cataloguePath);
    await expect(section.getByRole('link', {name: /Download catalogue/})).toHaveAttribute('download', '');
    await expect(staticPage.getByRole('dialog')).toHaveCount(0);
    await noOverflow(staticPage, 'No-JS resources');
    await link.click();
    await staticPage.waitForURL(`**${guide.href}`);
    await expect(staticPage.locator('main h1')).toContainText(guide.label === 'Material selection' ? 'EPP or EPS?' : guide.title);
  }
  await staticContext.close();
  report.checks.push('No-JS guide navigation, direct preview/download PDF links and hidden modal');
  assert.deepEqual(errors, [], 'No browser runtime errors');
  report.checks.push('Seven homepage sections and no browser runtime errors');
  writeFileSync('artifacts/home-resources-checks.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
