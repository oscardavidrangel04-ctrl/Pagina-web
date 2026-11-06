'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const {placements, programs, render} = require('./affiliate-cards.cjs');
const root = path.resolve(__dirname, '..');
const base = process.env.MONETIZATION_BASE || '8e3ba9b96e141a5f05329414fa70ef9a2f12ac29';
const files = execFileSync('git', ['ls-tree', '-r', '--name-only', base], {cwd:root,encoding:'utf8'}).trim().split('\n');
const before = file => execFileSync('git', ['show', base + ':' + file], {cwd:root,encoding:'utf8'});
const after = file => fs.readFileSync(path.join(root,file),'utf8');
// Editorial SEO may update JSON-LD. Executable and advertising code stays invariant.
const scripts = html => (html.match(/<script\b[\s\S]*?<\/script>/gi) || []).filter(s=>!/^<script\b[^>]*type=["']application\/ld\+json["']/i.test(s));
let pages=0, adsense=0;
for (const file of files.filter(f=>f.endsWith('.html'))) {
  const a=before(file), b=after(file);
  const remaining=scripts(b);
  for(const script of scripts(a)) {
    const i=remaining.indexOf(script);
    assert.ok(i>=0, file + ': removed or altered original script');
    remaining.splice(i,1);
    if(script.includes('adsbygoogle.js')) adsense++;
  }
  assert.ok(remaining.every(s=>s==='<script defer src="/assets/js/affiliate-events.js?v=1"></script>'),file+': unexpected new script');
  for (const pattern of [/<meta\b[^>]*name="robots"[^>]*>/gi, /<link\b[^>]*rel="canonical"[^>]*>/gi]) {
    assert.deepEqual(b.match(pattern), a.match(pattern),file+': SEO changed');
  }
  pages++;
}
for(const file of files.filter(f=>f.startsWith('assets/js/') && !f.includes('affiliate'))) assert.equal(after(file),before(file),file+': calculation code changed');
for(const [file,program,placement] of placements) {
  const html=after(file),card=render(program,placement),p=programs[program];
  assert.ok(html.includes(card),file+': generated markup differs');
  assert.equal((html.match(/<!-- affiliate-card:start -->/g)||[]).length,1,file+': duplicate card');
  assert.equal((card.match(/rel="sponsored nofollow noopener"/g)||[]).length,2);
  assert.equal((card.split(p.href).length-1),2);
  assert.ok(card.includes('width="300" height="250" loading="lazy"'));
  assert.ok(card.includes(p.image));
  assert.equal(new URL(p.href).search,'?i=4');
  if(file.startsWith('calculadoras/')) assert.ok(html.indexOf(card)>html.indexOf('id="resultado"'));
  assert.equal((html.match(/affiliate-events.js/g)||[]).length,1);
}
const config=JSON.parse(after('vercel.json')), oldConfig=JSON.parse(before('vercel.json'));
assert.deepEqual(config.rewrites,oldConfig.rewrites);
assert.deepEqual(config.headers,oldConfig.headers);
assert.equal(config.git.deploymentEnabled['codex/monetizacion-contextual-2026-11-05'],false);
assert.equal(config.git.deploymentEnabled['codex/seo-geo-integral-2026-11-05'],false);
console.log(JSON.stringify({status:'PASS',baseline:base,pages,originalAdsenseScriptsPreserved:adsense,newCards:placements.length,calculationCode:'byte-identical',originalExecutableScripts:'all byte-identical',seo:'canonicals and robots unchanged; editorial SEO checked separately'},null,2));
