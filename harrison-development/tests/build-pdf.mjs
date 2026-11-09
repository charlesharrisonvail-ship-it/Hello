// Renders assets/downloads/launch-readiness-checklist.html to PDF. Rerun if contact details or copy change.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const base = new URL('../assets/downloads/', import.meta.url);
const b = await chromium.launch(); const p = await b.newPage();
await p.goto(new URL('launch-readiness-checklist.html', base).href);
await p.evaluate(() => document.fonts.ready);
await p.pdf({ path: new URL('launch-readiness-checklist.pdf', base).pathname, format: 'Letter', printBackground: true, preferCSSPageSize: true });
await b.close();
