import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {dirname, extname, join, relative, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = join(root, 'src', 'lib');
const outputRoot = join(root, 'out');
const require = createRequire(join(root, 'package.json'));
const typescript = require('typescript');
const moduleCache = new Map();

// Evaluate the actual catalogue and navigation without writing compiled files.
// TypeScript 7 omits the legacy transpileModule API, so use Next's bundled
// TypeScript and CommonJS transforms when that API is unavailable.
function compile(source, filename) {
  if (typeof typescript.transpileModule === 'function') {
    return typescript.transpileModule(source, {
      fileName: filename,
      compilerOptions: {
        module: typescript.ModuleKind.CommonJS,
        target: typescript.ScriptTarget.ES2022,
      },
    }).outputText;
  }
  return require('next/dist/compiled/babel/core').transformSync(source, {
    filename,
    babelrc: false,
    configFile: false,
    presets: [require('next/dist/compiled/babel/preset-typescript')],
    plugins: [require('next/dist/compiled/babel/plugin-transform-modules-commonjs')],
  }).code;
}

function loadModule(filename) {
  const absolute = resolve(filename);
  const sourceRelative = relative(sourceRoot, absolute);
  assert.ok(!sourceRelative.startsWith('..') && !sourceRelative.includes(':'),
    `Unexpected catalogue dependency: ${absolute}`);
  if (moduleCache.has(absolute)) return moduleCache.get(absolute).exports;
  const module = {exports: {}};
  moduleCache.set(absolute, module);
  const localRequire = request => {
    assert.ok(request.startsWith('.'), `Unexpected external dependency: ${request}`);
    let dependency = resolve(dirname(absolute), request);
    if (!extname(dependency)) dependency += '.ts';
    return loadModule(dependency);
  };
  const code = compile(readFileSync(absolute, 'utf8'), absolute);
  vm.runInNewContext(code, {
    module,
    exports: module.exports,
    require: localRequire,
    process: {env: {NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL}},
  }, {filename: absolute, timeout: 5000});
  return module.exports;
}

const {navigation} = loadModule(join(sourceRoot, 'navigation.ts'));
const {products} = loadModule(join(sourceRoot, 'catalog.ts'));
const groups = navigation.Markets;
const requiredLabels = [
  'Logistics and distribution',
  'Pharmaceuticals and healthcare',
  'Food industry',
  'Swimming-pool',
  'Early childhood',
  'Appliances and HVAC',
  'Sports and leisure',
  'Building',
  'Furniture and fittings',
  'Revegetation and drainage',
  'Mobility',
];
assert.ok(Array.isArray(groups), 'Markets navigation is missing');
assert.equal(groups.length, 13, 'Keep all 13 market menu categories');
const names = new Set(groups.map(group => group.name));
for (const name of requiredLabels) assert.ok(names.has(name), `Missing screenshot category: ${name}`);
assert.ok(names.has('Aviation'), 'Aviation category is missing');
assert.ok(names.has('Insulation & waterproofing'), 'Insulation & waterproofing category is missing');
assert.equal(names.size, groups.length, 'Market category labels must be unique');

function visibleLinks(group) {
  if (group.applications) {
    assert.ok(group.applications.length, `No application tabs in ${group.name}`);
    for (const application of group.applications) {
      assert.ok(application.links.length, `Empty application tab: ${group.name} / ${application.name}`);
    }
    return group.applications.flatMap(application => application.links);
  }
  return group.links;
}

function verifyExportedRoute(href) {
  assert.ok(href.startsWith('/'), `Expected local navigation URL: ${href}`);
  const pathname = decodeURIComponent(new URL(href, 'https://menu-check.invalid').pathname);
  const destination = resolve(outputRoot, '.' + pathname, 'index.html');
  assert.ok(!relative(outputRoot, destination).startsWith('..'), `Route outside export: ${href}`);
  assert.ok(existsSync(destination), `Missing exported menu route: ${href}`);
}

assert.ok(existsSync(outputRoot), 'Run the production build before verifying the market menu');
const reachable = new Set();
for (const group of groups) {
  verifyExportedRoute(group.href);
  const links = visibleLinks(group);
  assert.ok(links.length, `No reachable links in ${group.name}`);
  for (const link of [...group.links, ...links]) {
    verifyExportedRoute(link.href);
  }
  for (const link of links) {
    if (link.href.startsWith('/products/')) reachable.add(link.href);
  }
}
const expected = new Set(products.map(product => `/products/${product.slug}/`));
assert.equal(products.length, 77, 'Catalogue product-family count changed');
assert.equal(expected.size, 77, 'Catalogue product routes must be unique');
assert.deepEqual([...reachable].sort(), [...expected].sort(),
  'Every catalogue product must be reachable through its market category and application tabs');

const appliances = groups.find(group => group.name === 'Appliances and HVAC');
assert.equal(appliances.href, '/markets/appliances-hvac/', 'Combined category needs its aggregate landing page');
assert.equal(appliances.applications?.length, 2, 'Appliances and HVAC needs two application tabs');
const appliancesExpected = products
  .filter(product => ['hvac', 'domestic-appliances'].includes(product.marketSlug))
  .map(product => `/products/${product.slug}/`);
assert.equal(appliancesExpected.length, 5);
assert.deepEqual([...new Set(visibleLinks(appliances).map(link => link.href))].sort(),
  [...appliancesExpected].sort(), 'Combined category must expose all five appliance and HVAC products');
const applicationSets = [...appliances.applications].map(application =>
  [...new Set(application.links.map(link => link.href))].sort());
for (const slug of ['hvac', 'domestic-appliances']) {
  const expectedTab = products.filter(product => product.marketSlug === slug)
    .map(product => `/products/${product.slug}/`).sort();
  assert.ok(applicationSets.some(links => JSON.stringify(links) === JSON.stringify(expectedTab)),
    `Combined category needs a separate complete ${slug} tab`);
}

const drainage = groups.find(group => group.name === 'Revegetation and drainage');
assert.equal(drainage.href, '/markets/revegetation-drainage/', 'Drainage category needs its aggregate landing page');
const drainageNames = ['Urban revegetation components', 'Drainage landscaping forms', 'Moulded drainage panels'];
const drainageExpected = products.filter(product => drainageNames.includes(product.name))
  .map(product => `/products/${product.slug}/`);
assert.equal(drainageExpected.length, 3, 'Drainage product families are missing from the catalogue');
assert.deepEqual([...new Set(visibleLinks(drainage).map(link => link.href))].sort(),
  [...drainageExpected].sort(), 'Revegetation and drainage must expose its three relevant product families');
const insulation = groups.find(group => group.name === 'Insulation & waterproofing');
assert.ok(visibleLinks(insulation).some(link => link.href === '/products/roof-terrace-insulation/'),
  'Insulation & waterproofing must retain Roof terrace insulation');

console.log('Market menu checks passed: 13 categories, all 11 screenshot labels, 77 reachable product families, and complete exported routes.');
