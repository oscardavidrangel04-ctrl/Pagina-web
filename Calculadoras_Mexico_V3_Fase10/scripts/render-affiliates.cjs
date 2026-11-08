'use strict';
// Run after editing affiliate-cards.cjs. Fails on an ambiguous placement.
const fs = require('node:fs');
const path = require('node:path');
const {placements, render} = require('./affiliate-cards.cjs');
const root = path.resolve(__dirname, '..');
function afterElement(html, opening, tag) {
  const matches = [...html.matchAll(opening)];
  if (matches.length !== 1) throw Error('Expected one anchor: ' + opening);
  const start = matches[0].index;
  const tokens = new RegExp('</?' + tag + '\\b[^>]*>', 'gi');
  tokens.lastIndex = start;
  let depth = 0, token;
  while ((token = tokens.exec(html))) {
    depth += token[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return tokens.lastIndex;
  }
  throw Error('Unclosed placement anchor');
}
for (const [file, program, placement] of placements) {
  const absolute = path.join(root, file);
  let html = fs.readFileSync(absolute, 'utf8');
  html = html.replace(/<!-- affiliate-card:start -->[\s\S]*?<!-- affiliate-card:end -->/g, '');
  if (file === 'index.html') {
    // Replace the old text-only affiliate block; never touches network ad code.
    html = html.replace(/<aside class="cm-affiliate"[\s\S]*?<\/aside>/g, '');
    html = html.replace(/<link[^>]+href="\/assets\/css\/affiliate-block\.css[^"]*"[^>]*>/g, '');
  }
  const index = placement === 'home-popular'
    ? afterElement(html, /<section\b[^>]*class="[^"]*\bziro-home-popular\b[^"]*"[^>]*>/g, 'section')
    : placement === 'after-guide'
      ? afterElement(html, /<section\b[^>]*class="[^"]*\bseo-guide\b[^"]*"[^>]*>/g, 'section')
      : afterElement(html, /<article\b[^>]*class="article"[^>]*>/g, 'article');
  html = html.slice(0, index) + render(program, placement) + html.slice(index);
  if (!html.includes('/assets/css/affiliate-cards.css')) html = html.replace('</head>', '<link rel="stylesheet" href="/assets/css/affiliate-cards.css?v=1"></head>');
  if (!html.includes('/assets/js/affiliate-events.js')) html = html.replace('</body>', '<script defer src="/assets/js/affiliate-events.js?v=1"></script></body>');
  fs.writeFileSync(absolute, html);
}
console.log('Rendered ' + placements.length + ' contextual affiliate cards.');
