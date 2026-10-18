import { build } from 'vite';
import { createHash } from 'node:crypto';
import { renderToString } from 'react-dom/server';
import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { metadata, restaurantSchema, json, esc, menuMarkup, allergenLegend, sectionTitlesEN, legalPages } from './page-content.mjs';

// Publish ready-to-read HTML; browser interaction uses a tiny standalone script.
await rm('dist', { recursive: true, force: true });
await build({ build: { emptyOutDir: true } });
await build({
  configFile: false,
  publicDir: false,
  build: { ssr: 'src/main.jsx', outDir: 'dist/server', emptyOutDir: true },
});
const { App } = await import(pathToFileURL(resolve('dist/server/main.js')));
const React = await import('react');
let shell = await readFile('dist/app.html', 'utf8');
shell = shell.replace(/<meta name="description"[^>]*>/, '').replace(/<title>[\s\S]*?<\/title>/, metadata({
  title:'Mộc 83 (Moc 83) | Vietnamesische Küche & Sushi in Quedlinburg',
  description:'Mộc 83 (Moc 83): vietnamesische Küche und Sushi in Quedlinburg. Steinweg 79, 06484 Quedlinburg. Speisekarte mit Preisen. Tisch: 03946 4159682.'
}) + `<script type="application/ld+json">${json(restaurantSchema)}</script>`);
// Inline the small stylesheet to avoid a render-blocking round trip on mobile.
const stylesheet = shell.match(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/);
if (stylesheet) {
  // Relative CSS URLs were originally resolved from assets/, but this CSS is inlined in index.html.
  const css = (await readFile(`dist/assets/${stylesheet[1].split('/').pop()}`, 'utf8')).replace(/url\(\.\//g, 'url(./assets/');
  const preloads = ['manrope-latin-400-normal', 'cormorant-garamond-latin-400-normal'].map(name => {
    const font = css.match(new RegExp(`url\\(([^)]*${name}[^)]*\\.woff2)\\)`))?.[1];
    return font ? `<link rel="preload" href="${font}" as="font" type="font/woff2" crossorigin>` : '';
  }).join('');
  shell = shell.replace(stylesheet[0], `${preloads}<style>${css}</style>`);
}
shell = shell.replace('<script type="module"', '<script fetchpriority="low" type="module"');
const markup = renderToString(React.createElement(App));
await mkdir('dist/assets', { recursive: true });
await writeFile('dist/assets/content-en.html', renderToString(React.createElement(App, {initialLang: 'en'})));
const panels = {};
for (const lang of ['de', 'en']) {
  panels[lang] = Array.from({length: 4}, (_, initialCategory) => {
    const html = renderToString(React.createElement(App, {initialLang: lang, initialCategory}));
    const panel = html.match(/(<div class="menu-layout"[\s\S]*?)<div class="menu-bottom">/)?.[1];
    if (!panel) throw new Error('Missing menu panel in static markup.');
    return panel;
  });
}
await writeFile('dist/assets/menu-panels.json', JSON.stringify(panels));
// Preload the same AVIF candidate as <picture>, without also downloading WebP.
const heroSource = markup.match(/<source type="image\/avif" srcSet="([^"]+)" sizes="([^"]+)"/i);
if (heroSource) shell = shell.replace('</title>', `</title><link rel="preload" as="image" type="image/avif" imagesrcset="${heroSource[1]}" imagesizes="${heroSource[2]}" fetchpriority="high">`);
const version = createHash('sha256').update(markup + JSON.stringify(panels)).digest('hex').slice(0, 12);
const page = shell.replace('<div id="root"></div>', `<div id="root" data-content-version="${version}">${markup}</div>`).replace(/^[\t ]+$/gm,'');
await writeFile('dist/index.html', page);
await writeFile('index.html', page);
// Full menu and legal pages are crawlable and readable without JavaScript.
const menu = JSON.parse(await readFile('src/menu.json', 'utf8'));
const menuPage = (await readFile('src/menu-template.html', 'utf8'))
  .replace('<!-- PAGE_METADATA -->', metadata({title:'Speisekarte | Mộc 83 (Moc 83), Quedlinburg',description:'Vietnamesische Gerichte, Sushi und Getränke bei Mộc 83: die vollständige HTML-Speisekarte mit Preisen und Allergenen (A–N), auf Deutsch und Englisch.',path:'menu.html'}))
  .replace('<!-- MENU_OPTIONS -->', menu.slice(0,-1).map((section,index)=>`<option value="${index}" data-de="${esc(section.title)}" data-en="${esc(sectionTitlesEN[index])}">${esc(section.title)}</option>`).join(''))
  .replace('<!-- MENU_CONTENT -->', menuMarkup(menu))
  .replace('<!-- ALLERGEN_LEGEND -->', allergenLegend());
await writeFile('menu.html', menuPage);
await writeFile('dist/menu.html', menuPage);
const legalTemplate = await readFile('src/legal-template.html', 'utf8');
for (const legal of await legalPages()) {
  const html = legalTemplate.replace('<!-- PAGE_METADATA -->',metadata({title:`${legal.title} | Mộc 83 (Moc 83)`,description:`${legal.title} des Restaurants Mộc 83 (Moc 83), Steinweg 79, 06484 Quedlinburg.`,path:legal.path,noindex:legal.noindex})).replace('<!-- PAGE_TITLE -->',legal.title).replace('<!-- PAGE_CONTENT -->',legal.content);
  await writeFile(legal.path,html);
  await writeFile(`dist/${legal.path}`,html);
}
await cp('src/pages.css','dist/assets/pages.css');
await cp('src/menu-client.js','dist/assets/menu-client.js');
for (const [family,file,out] of [
  ['manrope','manrope-latin-400-normal.woff2','manrope-regular.woff2'],
  ['manrope','manrope-latin-600-normal.woff2','manrope-semibold.woff2'],
  ['cormorant-garamond','cormorant-garamond-latin-500-normal.woff2','cormorant-medium.woff2']
]) await cp(`node_modules/@fontsource/${family}/files/${file}`,`dist/assets/${out}`);
await cp('dist/assets', 'assets', { recursive: true });
// Reviewable integration files for the separate Webcake wrapper, not a domain migration.
const outerMetadata = metadata({title:'Mộc 83 (Moc 83) | Vietnamesische Küche & Sushi in Quedlinburg',description:'Mộc 83 (Moc 83): vietnamesische Küche und Sushi. Steinweg 79, 06484 Quedlinburg. Öffnungszeiten und Speisekarte. Tisch reservieren: 03946 4159682.',baseURL:'https://moc83restaurant.com/'}) + `<script type="application/ld+json">${json({...restaurantSchema,'@id':'https://moc83restaurant.com/#restaurant',url:'https://moc83restaurant.com/'})}</script>`;
await mkdir('deployment',{recursive:true});
await writeFile('deployment/moc83restaurant-wrapper.html',(await readFile('src/wrapper-template.html','utf8')).replace('<!-- PAGE_METADATA -->',outerMetadata));
await writeFile('deployment/webcake-head.html',`<!-- Replace existing empty SEO fields/tags in the OUTER document head; avoid duplicate tags. -->\n${outerMetadata}\n<style>\n/* These are the exact unused Webcake popup containers observed on the current wrapper. */\n#w-__popup_default__, .login-popup-wrapper { display:none !important; visibility:hidden !important; }\n</style>\n`);
await writeFile('dist/.nojekyll', '');
await rm('dist/server', { recursive: true });
console.log('Published static HTML and assets for GitHub Pages.');
