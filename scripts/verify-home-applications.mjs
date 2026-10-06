import {chromium, expect} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdirSync, writeFileSync} from 'node:fs';

const origin = process.env.PREVIEW_URL || 'http://127.0.0.1:3000';
const applications = [
  {title: 'Protective packaging', image: '/images/generated/factory-logistics.webp', href: '/solutions/protect-in-transit/', link: 'Explore protection', description: 'Fitted cushions, inserts and returnable packs shaped around your product and its handling journey.', examples: ['Transit protection', 'Custom inserts', 'Returnable packaging']},
  {title: 'Thermal insulation', image: '/images/generated/factory-hvac.webp', href: '/solutions/manage-temperature/', link: 'Explore insulation', description: 'Insulated containers and equipment housings developed around temperature, space and operating conditions.', examples: ['Insulated transport', 'Equipment housings', 'Cold-chain packs']},
  {title: 'Lightweight components', image: '/images/generated/factory-automotive.webp', href: '/solutions/reduce-weight/', link: 'Explore lightweight design', description: 'Moulded forms that bring material, geometry and assembly interfaces together in a considered component.', examples: ['Vehicle components', 'Shaped supports', 'Assembly inserts']},
];
const browser = await chromium.launch();
const errors = [];
const measurements = [];
mkdirSync('artifacts', {recursive: true});

const sectionOn = page => page.locator('section[aria-labelledby="epp-applications-heading"]');

async function selectApplication(page, index, {key = 'Enter', imageChanges = true} = {}) {
  const section = sectionOn(page);
  const rows = section.locator('details');
  const row = rows.nth(index);
  const application = applications[index];
  await expect(row.locator('summary')).toContainText(application.title);
  if (!(await row.evaluate(element => element.open))) {
    await row.locator('summary').focus();
    await row.locator('summary').press(key);
  }
  await expect(row).toHaveJSProperty('open', true);
  await expect(section.locator('details[open]')).toHaveCount(1);
  await expect(row.getByText(application.description, {exact: true})).toBeVisible();
  for (const example of application.examples) await expect(row).toContainText(example);
  const link = row.getByRole('link', {name: application.link, exact: true});
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href', application.href);
  if (imageChanges) {
    const image = section.getByRole('img');
    await expect(image).toHaveCount(1);
    await expect(image).toHaveAttribute('src', application.image);
    assert.ok((await image.getAttribute('alt'))?.trim(), `${application.title}: informative image alternative`);
    await image.evaluate(element => element.decode());
    await expect.poll(() => image.evaluate(element => {
      let opacity = 1;
      for (let node = element; node && node.tagName !== 'SECTION'; node = node.parentElement) opacity *= Number(getComputedStyle(node).opacity);
      return opacity;
    })).toBe(1);
  }
  return row;
}

async function assertNoOverflow(page, label) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${label}: page overflow`);
  assert.ok(await sectionOn(page).evaluate(element => element.scrollWidth <= element.clientWidth), `${label}: application section overflow`);
}

try {
  const page = await browser.newPage({viewport: {width: 1440, height: 1000}});
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(origin, {waitUntil: 'domcontentloaded'});
  await page.evaluate(() => document.fonts.ready);
  const section = sectionOn(page);
  await expect(section).toHaveCount(1);
  await expect(section.locator('details')).toHaveCount(3);
  await expect(section.locator('details').first()).toHaveJSProperty('open', true);
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(750);
  await selectApplication(page, 0);

  // Check the requested image transition independently of entrance effects.
  const secondSummary = section.locator('details').nth(1).locator('summary');
  await secondSummary.focus();
  await secondSummary.press('Enter');
  const imageTransition = await section.locator(`img[src="${applications[1].image}"]`).evaluate(element => {
    for (let node = element; node && node.tagName !== 'SECTION'; node = node.parentElement) {
      if (node.getAnimations().some(animation => animation.playState === 'running')) return true;
    }
    return false;
  });
  assert.ok(imageTransition, 'Selecting an application animates its image when motion is enabled');

  for (const index of [1, 2, 0]) await selectApplication(page, index, {key: index === 2 ? 'Space' : 'Enter'});
  await expect(section.locator('details').first().locator('summary')).toBeFocused();
  assert.notEqual(await section.locator('details').first().locator('summary').evaluate(element => getComputedStyle(element).outlineStyle), 'none', 'Keyboard selection has visible focus');
  await section.locator('details').first().locator('summary').press('Enter');
  await expect(section.locator('details[open]')).toHaveCount(0);
  await expect(section.getByRole('img')).toHaveAttribute('src', applications[0].image);
  await expect(section.getByRole('link', {name: applications[0].link, exact: true})).not.toBeVisible();
  await section.locator('details').first().locator('summary').press('Space');
  await selectApplication(page, 0);
  for (const application of applications) {
    assert.equal((await page.request.get(new URL(application.href, origin).href)).status(), 200, `${application.title}: destination resolves`);
  }

  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({width, height: 1000});
    for (const index of [0, 1, 2]) {
      await selectApplication(page, index);
      await assertNoOverflow(page, `${width}px ${applications[index].title}`);
      const bounds = await section.boundingBox();
      assert.ok(bounds && bounds.x >= 0 && bounds.x + bounds.width <= width, `${width}px section stays in viewport`);
      if (width >= 1024) assert.ok(bounds.height <= 600, `${width}px section remains compact (${bounds.height}px)`);
      for (const summary of await section.locator('summary').all()) {
        const target = await summary.boundingBox();
        assert.ok(target && target.height >= 44 && target.x >= 16 && target.x + target.width <= width - 16, `${width}px accessible summary target and gutters`);
      }
      measurements.push({width, application: applications[index].title, height: bounds.height});
    }
    await selectApplication(page, 0);
    await section.locator('h2').click();
    if ([320, 390, 768, 1440, 1920].includes(width)) await section.screenshot({path: `artifacts/home-applications-${width}.png`});
  }

  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.setViewportSize({width: 390, height: 844});
  for (const index of [1, 2, 0]) {
    await selectApplication(page, index);
    assert.equal(await section.evaluate(element => element.getAnimations({subtree: true}).filter(animation => animation.playState === 'running').length), 0, 'Reduced motion leaves no application animations running');
  }
  await assertNoOverflow(page, 'Reduced motion');

  const noScript = await browser.newContext({javaScriptEnabled: false, reducedMotion: 'reduce', viewport: {width: 390, height: 844}});
  const staticPage = await noScript.newPage();
  await staticPage.goto(origin, {waitUntil: 'domcontentloaded'});
  const staticSection = sectionOn(staticPage);
  await expect(staticSection.locator('details').first()).toHaveJSProperty('open', true);
  for (const index of [0, 1, 2]) await selectApplication(staticPage, index, {key: index === 1 ? 'Space' : 'Enter', imageChanges: false});
  await expect(staticSection.getByRole('img')).toHaveCount(1);
  await staticSection.getByRole('img').evaluate(element => element.decode());
  await assertNoOverflow(staticPage, 'Without JavaScript');
  await noScript.close();
  assert.deepEqual(errors, [], 'No browser runtime errors');
  writeFileSync('artifacts/home-applications-check.json', JSON.stringify({passed: true, imageTransition, measurements, errors, checks: ['Three content/image/link associations', 'Keyboard selection', 'Native exclusive disclosures without JavaScript', 'Reduced motion', 'Six responsive widths', 'Compact desktop section']}, null, 2));
  console.log('Home applications passed: all three content/image/link associations, keyboard and no-JS disclosures, image transition, reduced motion, six widths and compact desktop layout.');
} finally {
  await browser.close();
}
