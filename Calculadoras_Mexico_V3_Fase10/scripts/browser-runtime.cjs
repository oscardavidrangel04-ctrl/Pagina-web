'use strict';
// Portable browser runner: local dependency, configured runtime, or explicit path.
const fs = require('node:fs'), path = require('node:path');
const candidates = ['playwright', process.env.PLAYWRIGHT_MODULE,
  process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES && path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright')].filter(Boolean);
let playwright;
for (const candidate of candidates) {try {playwright = require(candidate); break;} catch (e) {if (e.code !== 'MODULE_NOT_FOUND') throw e;}}
if (!playwright) throw Error('Install playwright or set PLAYWRIGHT_MODULE / NODE_PATH to its location.');
const executablePath = process.env.CHROMIUM_PATH || (fs.existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
const launchOptions = {headless:true, ...(executablePath ? {executablePath} : {}), ...(process.platform === 'linux' ? {args:['--no-sandbox']} : {})};
module.exports = {chromium: playwright.chromium, launchOptions};
