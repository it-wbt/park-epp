import {chromium, expect} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdirSync, writeFileSync} from 'node:fs';
import {eppProcess} from '../src/lib/epp-process.ts';

const browser = await chromium.launch();
const baseUrl = process.env.BANNER_CHECK_URL || 'http://127.0.0.1:3000';
const duration = eppProcess.at(-1).end;
const errors = [];
const results = [];
const stages = [];
mkdirSync('artifacts', {recursive: true});

function observeErrors(page, label) {
  page.on('pageerror', error => errors.push(`${label}: ${error.message}`));
}

async function assertCaption(page, index) {
  const caption = page.locator('.epp-process-caption');
  await expect(caption).toBeVisible();
  await expect(caption).toHaveAttribute('data-step', String(index));
  await expect(caption).toContainText(eppProcess[index].name);
  await expect(page.locator('dialog[aria-labelledby="process-film-heading"]')).toContainText(eppProcess[index].detail);
}

async function seekPaused(page, seconds) {
  await page.locator('dialog[aria-labelledby="process-film-heading"] video').evaluate((video, target) => {
    video.pause();
    video.currentTime = target;
  }, seconds);
  await expect.poll(() => page.locator('dialog[aria-labelledby="process-film-heading"] video').evaluate(video => !video.seeking && video.paused)).toBe(true);
}

async function assertModalClosed(page) {
  await expect(page.locator('dialog[aria-labelledby="process-film-heading"]')).not.toBeVisible();
  assert.ok(await page.locator('dialog[aria-labelledby="process-film-heading"] video').evaluate(video => video.paused));
  await expect(page.getByRole('link', {name: 'Watch moulding process', exact: true})).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
}

try {
  const page = await browser.newPage({viewport: {width: 1440, height: 900}});
  observeErrors(page, 'desktop');
  const initialMediaRequests = [];
  page.on('request', request => { if (/\.mp4(?:\?|$)/.test(request.url())) initialMediaRequests.push(request.url()); });
  await page.goto(baseUrl);
  await page.evaluate(() => document.fonts.ready);
  const hero = page.locator('.park-hero');
  const image = hero.locator('img[src="/images/generated/factory-beads.webp"]');
  await expect(image).toHaveCount(1);
  await image.evaluate(image => image.decode());
  await expect(hero).toContainText('AI factory visual');
  await expect(hero.locator('h1')).toContainText('Future of');
  await expect(hero.locator('h1')).toContainText('light weight');
  await expect(hero.locator('video')).toHaveCount(0);
  await expect(page.locator('dialog[aria-labelledby="process-film-heading"]')).not.toBeVisible();
  assert.ok(await page.locator('dialog[aria-labelledby="process-film-heading"] video').evaluate(video => video.paused && !video.autoplay));
  assert.deepEqual(initialMediaRequests, [], 'The static hero does not fetch the film before a request to watch');
  await expect(hero.getByRole('link', {name: 'Explore our products'})).toHaveAttribute('href', '/products/');
  await expect(hero.getByRole('link', {name: /Find your industry/})).toHaveAttribute('href', '/markets/');
  await expect(hero.getByRole('link', {name: /Discover the possibilities/})).toHaveAttribute('href', '#discover');
  await expect(page.locator('#discover')).toHaveCount(1);

  const watch = page.getByRole('link', {name: 'Watch moulding process', exact: true});
  await watch.click();
  const dialog = page.locator('dialog[aria-labelledby="process-film-heading"]');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('3D PROCESS FILM');
  await expect(dialog.getByRole('button', {name: 'Close process film'})).toBeFocused();
  await page.waitForFunction(() => document.querySelector('dialog[aria-labelledby="process-film-heading"] video')?.readyState >= 2);
  const media = await page.locator('dialog[aria-labelledby="process-film-heading"] video').evaluate(video => ({
    duration: video.duration, width: video.videoWidth, height: video.videoHeight,
    controls: video.controls, muted: video.muted, autoplay: video.autoplay, source: video.currentSrc,
  }));
  assert.ok(Math.abs(media.duration - duration) < .1);
  assert.equal(media.width, 1600);
  assert.equal(media.height, 900);
  assert.ok(media.controls && media.muted && !media.autoplay);
  assert.ok(media.source.endsWith('/videos/park-epp-manufacturing.mp4'));
  await page.waitForFunction(() => document.querySelector('dialog[aria-labelledby="process-film-heading"] video').currentTime > .2);
  await dialog.getByRole('button', {name: 'Pause film', exact: true}).click();
  for (const [index, step] of eppProcess.entries()) {
    await seekPaused(page, (step.start + step.end) / 2);
    await assertCaption(page, index);
    stages.push({index, name: step.name, timedCaption: true});
  }
  const timeline = page.locator('.epp-process-timeline');
  await expect(timeline.getByRole('button')).toHaveCount(eppProcess.length);
  for (const [index, step] of eppProcess.entries()) {
    await timeline.getByRole('button', {name: `Show ${step.name}`, exact: true}).click();
    await expect.poll(() => page.locator('dialog[aria-labelledby="process-film-heading"] video').evaluate(video => video.currentTime)).toBeCloseTo(step.start + .2, 1);
    await assertCaption(page, index);
    assert.ok(await page.locator('dialog[aria-labelledby="process-film-heading"] video').evaluate(video => video.paused), 'Seeking preserves paused playback');
    stages[index].timelineSeeks = true;
  }
  await dialog.getByRole('button', {name: 'Play film', exact: true}).click();
  await expect.poll(() => page.locator('dialog[aria-labelledby="process-film-heading"] video').evaluate(video => video.paused)).toBe(false);
  await page.keyboard.press('Escape');
  await assertModalClosed(page);
  await watch.click();
  await expect.poll(() => page.locator('dialog[aria-labelledby="process-film-heading"] video').evaluate(video => video.paused)).toBe(false);
  await dialog.getByRole('button', {name: 'Close process film'}).click();
  await assertModalClosed(page);

  for (const [width, height] of [[1440, 900], [1920, 1080], [1024, 600], [768, 900], [390, 844], [320, 740]]) {
    await page.setViewportSize({width, height});
    await page.evaluate(() => window.scrollTo({top: 0, behavior: 'instant'}));
    const bounds = await hero.boundingBox();
    const actions = await hero.locator('.hero-buttons').boundingBox();
    const filmLink = await watch.boundingBox();
    assert.ok(bounds && actions && filmLink);
    assert.ok(actions.y + actions.height <= filmLink.y, `Hero actions overlap film link at ${width}px`);
    assert.ok(filmLink.y + filmLink.height <= bounds.y + bounds.height, `Watch link leaves hero at ${width}px`);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px overflow`);
    if (width > 900) assert.ok(Math.abs(bounds.y + bounds.height - height) < 2, `${width}px hero fills first screen`);
    if (width < 761) assert.ok(bounds.height <= Math.max(700, height - bounds.y), `${width}px hero remains compact`);
    if ([1440, 390].includes(width)) await hero.screenshot({path: `artifacts/factory-hero-${width === 1440 ? 'desktop' : 'mobile'}.png`});
    await watch.click();
    const modalBounds = await dialog.boundingBox();
    assert.ok(modalBounds && modalBounds.x >= 0 && modalBounds.x + modalBounds.width <= width && modalBounds.y >= 0 && modalBounds.y + modalBounds.height <= height, `${width}px dialog fits screen`);
    assert.ok(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth), `${width}px dialog horizontal overflow`);
    if ([1440, 390].includes(width)) await dialog.screenshot({path: `artifacts/process-dialog-${width === 1440 ? 'desktop' : 'mobile'}.png`});
    await page.keyboard.press('Escape');
    await assertModalClosed(page);
    results.push({width, height, heroHeight: bounds.height, fits: true});
  }

  const mobilePage = await browser.newPage({viewport: {width: 390, height: 844}, reducedMotion: 'reduce'});
  observeErrors(mobilePage, 'mobile reduced motion');
  await mobilePage.goto(baseUrl);
  await mobilePage.getByRole('link', {name: 'Watch moulding process', exact: true}).click();
  await mobilePage.waitForFunction(() => document.querySelector('dialog[aria-labelledby="process-film-heading"] video')?.readyState >= 2);
  const mobile = await mobilePage.locator('dialog[aria-labelledby="process-film-heading"] video').evaluate(video => ({
    source: video.currentSrc, width: video.videoWidth, height: video.videoHeight,
    duration: video.duration, paused: video.paused, error: video.error?.message || null,
  }));
  assert.ok(mobile.source.endsWith('/videos/park-epp-manufacturing-mobile.mp4'));
  assert.equal(mobile.width, 960);
  assert.equal(mobile.height, 540);
  assert.ok(Math.abs(mobile.duration - duration) < .1 && mobile.paused);
  assert.equal(mobile.error, null);
  await mobilePage.getByRole('button', {name: 'Play film', exact: true}).click();
  await expect.poll(() => mobilePage.locator('dialog[aria-labelledby="process-film-heading"] video').evaluate(video => video.paused)).toBe(false);
  await mobilePage.keyboard.press('Escape');
  await assertModalClosed(mobilePage);
  await mobilePage.close();

  const noScript = await browser.newContext({javaScriptEnabled: false, viewport: {width: 390, height: 844}});
  const staticPage = await noScript.newPage();
  await staticPage.goto(baseUrl);
  await expect(staticPage.locator('.park-hero img')).toBeVisible();
  const fallback = staticPage.getByRole('link', {name: 'Watch moulding process', exact: true});
  await expect(fallback).toBeVisible();
  await expect(fallback).toHaveAttribute('href', '/videos/park-epp-manufacturing.mp4');
  assert.equal((await staticPage.request.get(new URL(await fallback.getAttribute('href'), baseUrl).href)).status(), 200);
  await expect(staticPage.locator('dialog[aria-labelledby="process-film-heading"]')).not.toBeVisible();
  await noScript.close();
  assert.deepEqual(errors, [], 'No browser runtime errors');
  writeFileSync('artifacts/banner-check.json', JSON.stringify({passed: true, media, mobile, stages, viewports: results, errors,
    checks: ['Static factory image', 'No initial media download or autoplay', 'Native dialog', 'Manual reduced-motion playback', 'Six captions and timeline seeks', 'Escape/button close stops film', 'Focus restoration', 'Desktop/mobile sources', 'Responsive fit', 'No-JS film link']}, null, 2));
  console.log('Banner checks passed: static factory hero, on-demand 3D process dialog, six stages, playback/close/focus, reduced motion, desktop/mobile sources, six viewports and no-JS fallback.');
} finally { await browser.close(); }
