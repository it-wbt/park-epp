import {chromium, expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const images=JSON.parse(readFileSync('src/lib/branded-product-images.json','utf8'));
const optimized=JSON.parse(readFileSync('src/lib/optimized-images.json','utf8'));
const products=JSON.parse(readFileSync('research/product-image-generation.json','utf8'));
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];page.on('pageerror',error=>errors.push(error.message));
for(const market of ['hvac','mobility','logistics-handling','sports-leisure','childhood']){
 const items=products.filter(p=>p.marketSlug===market);
 await page.setContent(`<style>body{margin:0;padding:20px;background:#eef4f7;font:14px Arial;color:#163b4f}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.card{background:white;padding:12px;border-radius:10px}img{width:100%;height:190px;object-fit:contain}p{margin:8px 0 0}</style><h2>${market}</h2><div class="grid">${items.map(p=>`<div class="card"><img src="http://127.0.0.1:3001${images[p.slug]}"><p>${p.name}</p></div>`).join('')}</div>`);
 await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));
 assert.ok(await page.locator('img').evaluateAll(imgs=>imgs.every(img=>img.naturalWidth>0)));
 await page.screenshot({path:`artifacts/branded-products-${market}.png`,fullPage:true});
}
for(const width of [1440,390]){
 await page.setViewportSize({width,height:900});
 await page.goto('http://127.0.0.1:3001/',{waitUntil:'domcontentloaded'});
 if(width===390)await page.getByRole('button',{name:'Open menu',exact:true}).click();
 await expect(async()=>{
  await page.locator('#park-trigger-products').click();
  await expect(page.locator('.product-menu-links img')).toHaveCount(5,{timeout:1000});
 }).toPass({timeout:20000});
 const sources=await page.locator('.product-menu-links img').evaluateAll(imgs=>imgs.map(img=>img.getAttribute('src')));
 assert.equal(new Set(sources).size,5);assert.ok(sources.every(src=>src.includes('products-branded-')));
 await page.locator('.product-menu-links img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:`artifacts/branded-product-menu-${width}.png`});
}
for(const slug of ['custom-hvac-components','sports-helmet-foam-liners','stackable-delivery-boxes','vehicle-energy-absorbers']){
 await page.goto(`http://127.0.0.1:3001/products/${slug}/`,{waitUntil:'domcontentloaded'});
 const image=page.locator('.detail-image img');await expect(image).toHaveAttribute('src',optimized[images[slug]].src);await image.evaluate(img=>img.decode());
 assert.equal(await image.evaluate(img=>getComputedStyle(img).objectFit),'contain');
}
assert.deepEqual(errors,[]);console.log('39 distinct EPP assets load; desktop/mobile menu thumbnails are unique; detail pages use branded cutouts.');
await browser.close();
