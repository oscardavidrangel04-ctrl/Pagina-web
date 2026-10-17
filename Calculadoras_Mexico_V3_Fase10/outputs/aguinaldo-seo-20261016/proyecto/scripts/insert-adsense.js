// Inserts the site-level AdSense loader into public HTML files.
// Run with: node scripts/insert-adsense.js
// Check only: node scripts/insert-adsense.js --check
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const client = "ca-pub-1606770348282610";
const code = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}" crossorigin="anonymous"></script>`;
const dirs = [root, path.join(root, "articulos"), path.join(root, "calculadoras")];
const checkOnly = process.argv.includes("--check");
let checked = 0;
let changed = 0;
const errors = [];

for (const dir of dirs) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.toLowerCase().endsWith(".html")) continue;
    const file = path.join(dir, entry.name);
    const html = fs.readFileSync(file, "utf8");
    checked++;
    const occurrences = html.split("adsbygoogle.js?client=" + client).length - 1;
    if (occurrences > 1) {
      errors.push(`${file}: duplicate AdSense code`);
      continue;
    }
    if (occurrences === 1) {
      if (html.indexOf("adsbygoogle.js?client=" + client) > html.search(/<\/head\s*>/i)) {
        errors.push(`${file}: AdSense code is outside <head>`);
      }
      continue;
    }
    if (/adsbygoogle\.js\?client=ca-pub-/.test(html)) {
      errors.push(`${file}: another publisher ID is present`);
      continue;
    }
    const endHead = /<\/head\s*>/i.exec(html);
    if (!endHead) {
      errors.push(`${file}: no closing </head> tag`);
      continue;
    }
    if (checkOnly) {
      errors.push(`${file}: missing AdSense code`);
      continue;
    }
    const eol = html.includes("\r\n") ? "\r\n" : "\n";
    const updated = html.slice(0, endHead.index) + code + eol + html.slice(endHead.index);
    fs.writeFileSync(file, updated, "utf8");
    changed++;
  }
}

console.log(JSON.stringify({ checked, changed, errors: errors.length }));
for (const error of errors) console.error(error);
if (errors.length) process.exitCode = 1;
