import {chromium, expect} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdirSync, writeFileSync} from 'node:fs';

const origin = process.env.PREVIEW_URL || 'http://127.0.0.1:3000';
const stages = [
  {title: 'Co-development', href: '/expertise/co-development/', description: 'Translate an application brief into material, geometry and validation decisions.'},
  {title: 'Foam moulding', href: '/expertise/foam-moulding/', description: 'Shape bead foams into protective packaging, insulation assemblies and lightweight technical components.'},
  {title: 'Testing & validation', href: '/expertise/testing-validation/', description: 'Build an evidence-based qualification plan around the finished application.'},
  {title: 'Industrialisation', href: '/expertise/industrialisation/', description: 'Prepare the design, tooling and process controls for a repeatable production route.'},
];
const browser = await chromium.launch();
const measurements = [];
const errors = [];
mkdirSync('artifacts', {recursive: true});

const sectionOn = page => page.locator('section#home-expertise[aria-labelledby="home-expertise-heading"]');
const linksOn = section => section.locator('a[href^="/expertise/"]:not([href="/expertise/"])');

async function visibleContent(section, label) {
  await expect(section.locator('h2')).toHaveCount(1);
  await expect(section.locator('h2')).not.toHaveText('');
  const links = linksOn(section);
  await expect(links).toHaveCount(4);
  assert.deepEqual(await links.evaluateAll(elements => elements.map(element => element.getAttribute('href'))), stages.map(stage => stage.href), `${label}: development stages retain their route order`);
  for (const stage of stages) {
    const link = section.getByRole('link', {name: stage.title, exact: true});
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', stage.href);
    await expect(section.getByText(stage.description, {exact: true})).toBeVisible();
    assert.equal(await link.evaluate(element => {
      let opacity = 1;
      for (let node = element; node && node.tagName !== 'SECTION'; node = node.parentElement) opacity *= Number(getComputedStyle(node).opacity);
      return opacity;
    }), 1, `${label}: ${stage.title} remains readable after reveal`);
  }
  await expect(section.locator('a[href="/expertise/"]')).toBeVisible();
  const image = section.getByRole('img');
  await expect(image).toHaveCount(1);
  await expect(image).toHaveAttribute('src', '/images/generated/factory-foam-finishing.webp');
  assert.ok((await image.getAttribute('alt'))?.trim(), `${label}: manufacturing image has an alternative`);
  await image.evaluate(element => element.decode());
}

async function noOverflow(page, label) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${label}: page overflow`);
  assert.ok(await sectionOn(page).evaluate(element => element.scrollWidth <= element.clientWidth), `${label}: expertise section overflow`);
}

try {
  const page = await browser.newPage({viewport: {width: 1440, height: 1000}});
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(origin, {waitUntil: 'domcontentloaded'});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(650);
  const section = sectionOn(page);
  await expect(section).toHaveCount(1);
  await expect(page.locator('.park-technical')).toHaveCount(0);
  await section.evaluate(element => element.scrollIntoView({block: 'center', behavior: 'instant'}));
  await expect.poll(() => section.evaluate(element => element.getAnimations({subtree: true}).some(animation => animation.playState === 'running'))).toBe(true);
  await expect.poll(() => section.evaluate(element => element.getAnimations({subtree: true}).filter(animation => animation.playState === 'running').length)).toBe(0);
  await visibleContent(section, 'Desktop');

  for (const stage of stages) {
    const link = section.getByRole('link', {name: stage.title, exact: true});
    await link.focus();
    await expect(link).toBeFocused();
    assert.notEqual(await link.evaluate(element => getComputedStyle(element).outlineStyle), 'none', `${stage.title}: keyboard focus visible`);
    assert.equal((await page.request.get(new URL(stage.href, origin).href)).status(), 200, `${stage.title}: route resolves`);
  }
  assert.equal((await page.request.get(new URL('/expertise/', origin).href)).status(), 200, 'All expertise route resolves');

  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({width, height: 1000});
    await section.scrollIntoViewIfNeeded();
    await noOverflow(page, `${width}px`);
    const bounds = await section.boundingBox();
    assert.ok(bounds && bounds.x >= 0 && bounds.x + bounds.width <= width, `${width}px section fits viewport`);
    const imageBounds = await section.locator('figure').boundingBox();
    const headingBounds = await section.locator('h2').boundingBox();
    if (width > 760) assert.ok(headingBounds.x + headingBounds.width <= imageBounds.x, `${width}px compact manufacturing photo sits beside the introduction`);
    else assert.ok(headingBounds.y + headingBounds.height <= imageBounds.y, `${width}px compact photo follows the introduction`);
    if (width >= 1440) assert.ok(bounds.height <= 480, `${width}px expertise stays compact (${bounds.height}px)`);
    assert.ok(imageBounds.height <= 200, `${width}px image leaves room for the expertise content`);
    const columns = await linksOn(section).evaluateAll(elements => new Set(elements.map(element => Math.round(element.getBoundingClientRect().left))).size);
    assert.equal(columns, width > 1050 ? 4 : width > 600 ? 2 : 1, `${width}px expertise links remain easy to scan`);
    for (const link of await section.getByRole('link').all()) {
      const target = await link.boundingBox();
      assert.ok(target && target.x >= 16 && target.x + target.width <= width - 16, `${width}px link gutters`);
      assert.ok(target.height >= 44, `${width}px link target is large enough`);
    }
    await section.locator('h2').click();
    if ([320, 390, 768, 1440, 1920].includes(width)) await section.screenshot({path: `artifacts/home-expertise-${width}.png`});
    measurements.push({width, height: bounds.height, imageHeight: imageBounds.height, columns, layout: 'open production flow'});
  }

  const reducedContext = await browser.newContext({reducedMotion: 'reduce', viewport: {width: 390, height: 844}});
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(origin, {waitUntil: 'domcontentloaded'});
  const reducedSection = sectionOn(reducedPage);
  await reducedSection.scrollIntoViewIfNeeded();
  await visibleContent(reducedSection, 'Reduced motion');
  const reducedLink = reducedSection.getByRole('link', {name: stages[0].title, exact: true});
  const beforeHover = await reducedLink.locator('svg').evaluateAll(elements => elements.map(element => getComputedStyle(element).transform));
  await reducedLink.hover();
  assert.deepEqual(await reducedLink.locator('svg').evaluateAll(elements => elements.map(element => getComputedStyle(element).transform)), beforeHover, 'Reduced motion prevents hover movement');
  assert.equal(await reducedSection.evaluate(element => element.getAnimations({subtree: true}).filter(animation => animation.playState === 'running').length), 0, 'Reduced motion has no running expertise effects');
  await noOverflow(reducedPage, 'Reduced motion');
  await reducedLink.focus();
  await reducedLink.press('Enter');
  await reducedPage.waitForURL(`**${stages[0].href}`);
  await expect(reducedPage.locator('main h1')).toContainText(stages[0].title);
  await reducedContext.close();

  const noScript = await browser.newContext({javaScriptEnabled: false, reducedMotion: 'reduce', viewport: {width: 390, height: 844}});
  const staticPage = await noScript.newPage();
  await staticPage.goto(origin, {waitUntil: 'domcontentloaded'});
  const staticSection = sectionOn(staticPage);
  await staticSection.scrollIntoViewIfNeeded();
  await visibleContent(staticSection, 'Without JavaScript');
  await noOverflow(staticPage, 'Without JavaScript');
  const staticLink = staticSection.getByRole('link', {name: stages[3].title, exact: true});
  await staticLink.focus();
  await staticLink.press('Enter');
  await staticPage.waitForURL(`**${stages[3].href}`);
  await expect(staticPage.locator('main h1')).toContainText(stages[3].title);
  await noScript.close();
  assert.deepEqual(errors, [], 'No browser runtime errors');
  writeFileSync('artifacts/home-expertise-check.json', JSON.stringify({passed: true, measurements, errors, checks: ['Four preserved expertise stages and descriptions', 'Five working expertise links', 'Manufacturing image decode', 'Scroll reveal settles', 'Keyboard focus/navigation', 'Six widths with compact photo and 4/2/1 production flow', 'Reduced motion', 'No-JS content and navigation']}, null, 2));
  console.log('Home expertise passed: four stages, content/image/routes, scroll reveal, keyboard, six responsive widths, reduced motion and no-JS navigation.');
} finally {
  await browser.close();
}
