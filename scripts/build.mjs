import { build } from 'vite';
import { createHash } from 'node:crypto';
import { renderToString } from 'react-dom/server';
import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

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
// Inline the small stylesheet to avoid a render-blocking round trip on mobile.
const stylesheet = shell.match(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/);
if (stylesheet) {
  const css = await readFile(`dist/assets/${stylesheet[1].split('/').pop()}`, 'utf8');
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
const page = shell.replace('<div id="root"></div>', `<div id="root" data-content-version="${version}">${markup}</div>`);
await writeFile('dist/index.html', page);
await writeFile('index.html', page);
await cp('dist/assets', 'assets', { recursive: true });
// The full menu stays on its own page, outside the landing page's initial bundle.
await cp('menu.html', 'dist/menu.html');
await mkdir('dist/src', { recursive: true });
await cp('src/menu.json', 'dist/src/menu.json');
await writeFile('dist/.nojekyll', '');
await rm('dist/server', { recursive: true });
console.log('Published static HTML and assets for GitHub Pages.');
