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

async function assertModalClosed(page, backgroundPlaying = true) {
  await expect(page.locator('dialog[aria-labelledby="process-film-heading"]')).not.toBeVisible();
  assert.ok(await page.locator('dialog[aria-labelledby="process-film-heading"] video').evaluate(video => video.paused));
  await expect(page.getByRole('link', {name: 'Watch moulding process', exact: true})).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
  await expect.poll(() => page.locator('.park-hero video').evaluate(video => video.paused)).toBe(!backgroundPlaying);
}

try {
  const page = await browser.newPage({viewport: {width: 1440, height: 900}});
  observeErrors(page, 'desktop');
  await page.goto(baseUrl);
  await page.evaluate(() => document.fonts.ready);
  const hero = page.locator('.park-hero');
  const backgroundVideo = hero.locator('video');
  await expect(backgroundVideo).toHaveCount(1);
  await expect.poll(() => backgroundVideo.evaluate(video => video.readyState >= 2 && video.currentTime > .2 && !video.paused)).toBe(true);
  const background = await backgroundVideo.evaluate(video => ({
    duration: video.duration, width: video.videoWidth, height: video.videoHeight,
    autoplay: video.autoplay, loop: video.loop, muted: video.muted, playsInline: video.playsInline,
    source: video.currentSrc, poster: video.poster,
  }));
  assert.ok(background.autoplay && background.loop && background.muted && background.playsInline);
  assert.ok(Math.abs(background.duration - duration) < .1);
  assert.equal(background.width, 1600);
  assert.equal(background.height, 900);
  assert.ok(background.source.endsWith('/videos/park-epp-manufacturing.mp4'));
  assert.ok(background.poster.endsWith('/images/epp-manufacturing-poster.webp'));
  await page.evaluate(async src => { const image = new Image(); image.src = src; await image.decode(); }, background.poster);
  await expect(hero.locator('h1')).toContainText('Future of');
  await expect(hero.locator('h1')).toContainText('light weight');
  await expect(page.locator('dialog[aria-labelledby="process-film-heading"]')).not.toBeVisible();
  assert.ok(await page.locator('dialog[aria-labelledby="process-film-heading"] video').evaluate(video => video.paused && !video.autoplay));
  await hero.getByRole('button', {name: 'Pause background video', exact: true}).click();
  await expect.poll(() => backgroundVideo.evaluate(video => video.paused)).toBe(true);
  const pausedTime = await backgroundVideo.evaluate(video => video.currentTime);
  await page.waitForTimeout(250);
  assert.ok(Math.abs(await backgroundVideo.evaluate(video => video.currentTime) - pausedTime) < .05, 'Background stops advancing while paused');
  await hero.getByRole('button', {name: 'Play background video', exact: true}).click();
  await expect.poll(() => backgroundVideo.evaluate(video => video.paused)).toBe(false);
  await expect(hero.getByRole('link', {name: 'Explore our products'})).toHaveAttribute('href', '/products/');
  await expect(hero.getByRole('link', {name: /Find your industry/})).toHaveAttribute('href', '/markets/');
  await expect(hero.getByRole('link', {name: /Discover the possibilities/})).toHaveAttribute('href', '#discover');
  await expect(page.locator('#discover')).toHaveCount(1);

  const watch = page.getByRole('link', {name: 'Watch moulding process', exact: true});
  await watch.click();
  const dialog = page.locator('dialog[aria-labelledby="process-film-heading"]');
  await expect(dialog).toBeVisible();
  await expect.poll(() => backgroundVideo.evaluate(video => video.paused)).toBe(true);
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
  await hero.getByRole('button', {name: 'Pause background video', exact: true}).click();
  await expect.poll(() => backgroundVideo.evaluate(video => video.paused)).toBe(true);
  await watch.click();
  assert.ok(await backgroundVideo.evaluate(video => video.paused));
  await expect.poll(() => page.locator('dialog[aria-labelledby="process-film-heading"] video').evaluate(video => video.paused)).toBe(false);
  await dialog.getByRole('button', {name: 'Close process film'}).click();
  await assertModalClosed(page, false);
  await hero.getByRole('button', {name: 'Play background video', exact: true}).click();
  await expect.poll(() => backgroundVideo.evaluate(video => video.paused)).toBe(false);

  for (const [width, height] of [[1440, 900], [1920, 1080], [1024, 600], [768, 900], [390, 844], [320, 740]]) {
    await page.setViewportSize({width, height});
    await page.evaluate(() => window.scrollTo({top: 0, behavior: 'instant'}));
    const bounds = await hero.boundingBox();
    const actions = await hero.locator('.hero-buttons').boundingBox();
    const filmLink = await watch.boundingBox();
    const playback = await hero.getByRole('button', {name: 'Pause background video', exact: true}).boundingBox();
    assert.ok(bounds && actions && filmLink && playback);
    assert.ok(actions.y + actions.height <= filmLink.y, `Hero actions overlap film link at ${width}px`);
    assert.ok(filmLink.y + filmLink.height <= bounds.y + bounds.height, `Watch link leaves hero at ${width}px`);
    assert.ok(playback.x >= bounds.x && playback.x + playback.width <= bounds.x + bounds.width && playback.y + playback.height <= bounds.y + bounds.height, `Background playback control stays in hero at ${width}px`);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px overflow`);
    if (width > 900) assert.ok(Math.abs(bounds.y + bounds.height - height) < 2, `${width}px hero fills first screen`);
    if (width < 761) assert.ok(bounds.height <= Math.max(700, height - bounds.y), `${width}px hero remains compact`);
    if ([1440, 390].includes(width)) await hero.screenshot({path: `artifacts/video-hero-${width === 1440 ? 'desktop' : 'mobile'}.png`});
    await watch.click();
    await expect.poll(() => backgroundVideo.evaluate(video => video.paused)).toBe(true);
    const modalBounds = await dialog.boundingBox();
    assert.ok(modalBounds && modalBounds.x >= 0 && modalBounds.x + modalBounds.width <= width && modalBounds.y >= 0 && modalBounds.y + modalBounds.height <= height, `${width}px dialog fits screen`);
    assert.ok(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth), `${width}px dialog horizontal overflow`);
    if ([1440, 390].includes(width)) await dialog.screenshot({path: `artifacts/process-dialog-${width === 1440 ? 'desktop' : 'mobile'}.png`});
    await page.keyboard.press('Escape');
    await assertModalClosed(page);
    results.push({width, height, heroHeight: bounds.height, fits: true});
  }

  const mobilePage = await browser.newPage({viewport: {width: 390, height: 844}});
  observeErrors(mobilePage, 'mobile');
  await mobilePage.goto(baseUrl);
  await expect.poll(() => mobilePage.locator('.park-hero video').evaluate(video => !video.paused && video.currentTime > .2)).toBe(true);
  const mobileBackground = await mobilePage.locator('.park-hero video').evaluate(video => ({source: video.currentSrc, width: video.videoWidth, height: video.videoHeight}));
  assert.ok(mobileBackground.source.endsWith('/videos/park-epp-manufacturing-mobile.mp4'));
  assert.equal(mobileBackground.width, 960);
  assert.equal(mobileBackground.height, 540);
  await mobilePage.emulateMedia({reducedMotion: 'reduce'});
  await expect.poll(() => mobilePage.locator('.park-hero video').evaluate(video => video.paused)).toBe(true);
  await mobilePage.reload();
  await expect.poll(() => mobilePage.locator('.park-hero video').evaluate(video => video.readyState >= 1 && video.paused)).toBe(true);
  await expect(mobilePage.getByRole('button', {name: 'Play background video', exact: true})).toBeVisible();
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
  await assertModalClosed(mobilePage, false);
  await mobilePage.close();

  const noScript = await browser.newContext({javaScriptEnabled: false, viewport: {width: 390, height: 844}});
  const staticPage = await noScript.newPage();
  await staticPage.goto(baseUrl);
  await expect(staticPage.locator('.park-hero video')).toBeVisible();
  await expect(staticPage.locator('.park-hero video')).toHaveAttribute('poster', '/images/epp-manufacturing-poster.webp');
  const fallback = staticPage.getByRole('link', {name: 'Watch moulding process', exact: true});
  await expect(fallback).toBeVisible();
  await expect(fallback).toHaveAttribute('href', '/videos/park-epp-manufacturing.mp4');
  assert.equal((await staticPage.request.get(new URL(await fallback.getAttribute('href'), baseUrl).href)).status(), 200);
  await expect(staticPage.locator('dialog[aria-labelledby="process-film-heading"]')).not.toBeVisible();
  await noScript.close();
  assert.deepEqual(errors, [], 'No browser runtime errors');
  writeFileSync('artifacts/banner-check.json', JSON.stringify({passed: true, background, mobileBackground, media, mobile, stages, viewports: results, errors,
    checks: ['Autoplay muted looping banner', 'Background pause/play', 'Matching process poster fallback', 'Native dialog suspends background', 'Closing respects previous playback state', 'Manual reduced-motion playback', 'Six captions and timeline seeks', 'Escape/button close stops film', 'Focus restoration', 'Desktop/mobile sources', 'Responsive fit', 'No-JS film link']}, null, 2));
  console.log('Banner checks passed: autoplay video banner, pause/play, on-demand process dialog with background suspension/resumption, six stages, close/focus, reduced motion, desktop/mobile sources, six viewports and no-JS fallback.');
} finally { await browser.close(); }
