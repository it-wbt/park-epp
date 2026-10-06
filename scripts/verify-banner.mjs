import {chromium, expect} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdirSync, writeFileSync} from 'node:fs';
import {eppProcess} from '../src/lib/epp-process.ts';

const browser = await chromium.launch();
const results = [];
const stages = [];
const errors = [];
const baseUrl = process.env.BANNER_CHECK_URL || 'http://127.0.0.1:3000';
const duration = eppProcess.at(-1).end;

function observeErrors(page, label) {
  page.on('pageerror', error => errors.push(`${label}: ${error.message}`));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(`${label}: ${message.text()}`);
  });
}

async function assertCaption(page, index) {
  const caption = page.locator('.epp-process-caption');
  await expect(caption).toBeVisible();
  await expect(caption).toHaveAttribute('data-step', String(index));
  await expect(caption).toContainText(eppProcess[index].name);
  await expect(caption.locator('..')).toContainText(eppProcess[index].detail);
}

async function seekPaused(page, seconds) {
  await page.locator('.park-hero video').evaluate((video, target) => new Promise((resolve, reject) => {
    let receivedTimeUpdate = false;
    const cleanup = () => {
      clearTimeout(timeout);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('seeked', complete);
    };
    const complete = () => {
      if (receivedTimeUpdate && !video.seeking && Math.abs(video.currentTime - target) < .05) {
        cleanup();
        resolve();
      }
    };
    const onTimeUpdate = () => {
      receivedTimeUpdate = true;
      complete();
    };
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error(`Video did not emit timeupdate after seeking to ${target}s`));
    }, 10000);
    video.pause();
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('seeked', complete);
    video.currentTime = target;
  }), seconds);
}

try {
  const page = await browser.newPage({viewport: {width: 1440, height: 900}});
  observeErrors(page, 'desktop');
  await page.goto(baseUrl);
  await page.waitForFunction(() => document.querySelector('.park-hero video')?.readyState >= 2);
  const media = await page.locator('.park-hero video').evaluate(video => ({
    duration: video.duration, width: video.videoWidth, height: video.videoHeight,
    loop: video.loop, muted: video.muted, source: video.currentSrc,
  }));
  assert.ok(Math.abs(media.duration - duration) < .1);
  assert.equal(media.width, 1600);
  assert.equal(media.height, 900);
  assert.ok(media.loop && media.muted);
  assert.ok(media.source.endsWith('/videos/park-epp-manufacturing.mp4'));
  await page.waitForFunction(() => document.querySelector('.park-hero video').currentTime > .2);
  await page.getByRole('button', {name: 'Pause film', exact: true}).click();
  assert.ok(await page.locator('.park-hero video').evaluate(video => video.paused));

  for (const [index, step] of eppProcess.entries()) {
    const midpoint = (step.start + step.end) / 2;
    await seekPaused(page, midpoint);
    await assertCaption(page, index);
    assert.ok(await page.locator('.park-hero video').evaluate(video => video.paused));
    stages.push({index, name: step.name, checkedAt: midpoint, captionMatches: true});
  }

  const timeline = page.locator('.epp-process-timeline');
  await expect(timeline.getByRole('button')).toHaveCount(eppProcess.length);
  for (const [index, step] of eppProcess.entries()) {
    await timeline.getByRole('button', {name: `Show ${step.name}`, exact: true}).click();
    await page.waitForFunction(start => {
      const video = document.querySelector('.park-hero video');
      return !video.paused && Math.abs(video.currentTime - start) < .75;
    }, step.start);
    await assertCaption(page, index);
    await page.getByRole('button', {name: 'Pause film', exact: true}).click();
    stages[index].timelineSeeksAndPlays = true;
  }

  const mobilePage = await browser.newPage({viewport: {width: 390, height: 844}});
  observeErrors(mobilePage, 'mobile');
  await mobilePage.goto(baseUrl);
  await mobilePage.waitForFunction(() => document.querySelector('.park-hero video')?.readyState >= 2);
  const mobile = await mobilePage.locator('.park-hero video').evaluate(video => ({
    source: video.currentSrc, width: video.videoWidth, height: video.videoHeight,
    duration: video.duration, error: video.error?.message || null,
  }));
  assert.ok(mobile.source.endsWith('/videos/park-epp-manufacturing-mobile.mp4'));
  assert.equal(mobile.width, 960);
  assert.equal(mobile.height, 540);
  assert.ok(Math.abs(mobile.duration - duration) < .1);
  assert.equal(mobile.error, null);
  await mobilePage.close();

  await page.getByRole('button', {name: 'Play film', exact: true}).click();
  assert.ok(await page.locator('.park-hero video').evaluate(video => !video.paused));
  for (const [width, height] of [[1440, 900], [1920, 1080], [1024, 600], [390, 844]]) {
    await page.setViewportSize({width, height});
    await page.waitForTimeout(100);
    const hero = await page.locator('.park-hero').boundingBox();
    const actions = await page.locator('.hero-buttons').boundingBox();
    const controls = await page.locator('.park-hero-bottom').boundingBox();
    assert.ok(hero && actions && controls, `Hero controls are visible at ${width}x${height}`);
    assert.ok(actions.y + actions.height <= controls.y, `Actions overlap controls at ${width}x${height}`);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    if (width > 900) assert.ok(Math.abs(hero.y + hero.height - height) < 2);
    results.push({width, height, fits: true});
  }
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.reload();
  await page.waitForFunction(() => document.querySelector('.park-hero video')?.readyState >= 2);
  assert.ok(await page.locator('.park-hero video').evaluate(video => video.paused));
  assert.equal(await page.locator('.park-hero video').evaluate(video => video.error?.message || null), null);
  assert.deepEqual(errors, [], 'The banner must not produce browser or console errors');

  mkdirSync('artifacts', {recursive: true});
  writeFileSync('artifacts/banner-check.json', JSON.stringify({
    passed: true, media, mobile, stages, viewports: results, errors,
    checks: ['Autoplay', 'Silent loop', 'Play/pause controls', 'Six synchronized process captions', 'Six timeline seek/play buttons', 'Mobile source', 'Screen fit', 'Reduced motion'],
  }, null, 2));
  console.log(`Banner checks passed: ${duration}-second 1600x900 process film, 960x540 mobile source, all six captions and timeline controls, autoplay, pause, reduced motion and four screen sizes.`);
} finally {
  await browser.close();
}
