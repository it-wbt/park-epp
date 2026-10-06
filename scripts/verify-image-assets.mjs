import {readdirSync, readFileSync} from 'node:fs';
import path from 'node:path';

const root = path.resolve('out');
const files = [];
function visit(directory) {
  for (const entry of readdirSync(directory, {withFileTypes: true})) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) visit(file);
    else files.push(path.relative(root, file).split(path.sep).join('/'));
  }
}
visit(root);

// Compare exact path spelling too: deployment runs on a case-sensitive filesystem.
const available = new Set(files);
const references = new Map();
function check(source, page) {
  if (/^(?:https?:|data:|blob:|\/\/|#)/i.test(source)) return;
  const clean = decodeURIComponent(source.split(/[?#]/)[0]);
  if (!/\.(?:avif|gif|ico|jpe?g|png|svg|webp)$/i.test(clean)) return;
  const target = clean.startsWith('/')
    ? clean.slice(1)
    : path.posix.normalize(path.posix.join(path.posix.dirname(page), clean));
  if (!references.has(target)) references.set(target, new Set());
  references.get(target).add(page);
}

const pages = files.filter(file => file.endsWith('.html'));
for (const page of pages) {
  const html = readFileSync(path.join(root, page), 'utf8');
  for (const [tag] of html.matchAll(/<(?:img|video|source)\b[^>]*>/gi)) {
    for (const [, , source] of tag.matchAll(/\b(src|poster)="([^"]+)"/gi)) check(source, page);
    for (const [, candidates] of tag.matchAll(/\bsrcset="([^"]+)"/gi)) {
      for (const candidate of candidates.split(',')) check(candidate.trim().split(/\s+/)[0], page);
    }
  }
}
for (const css of files.filter(file => file.endsWith('.css'))) {
  const text = readFileSync(path.join(root, css), 'utf8');
  for (const [, source] of text.matchAll(/url\(["']?([^\s)"']+)["']?\)/gi)) check(source, css);
}

const missing = [...references].filter(([asset]) => !available.has(asset));
if (missing.length) {
  console.error('Missing exported image assets:');
  for (const [asset, pages] of missing) console.error(`  /${asset} (referenced by ${[...pages].slice(0, 3).join(', ')})`);
  throw new Error(`${missing.length} image asset(s) missing. Add the files or correct their paths before publishing.`);
}
console.log(`Image assets verified: ${references.size} local images across ${pages.length} exported HTML pages.`);
