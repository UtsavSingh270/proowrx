const assert = require('node:assert/strict');
const pages = require('../data/pages.json');
const base = process.env.CHECK_SITE_URL || 'http://localhost:3000';

async function main() {
  const health = await fetch(`${base}/api/health`);
  assert.equal(health.status, 200);
  assert.equal((await health.json()).status, 'ok');
  console.log('PASS /api/health through Next.js');
  for (const page of pages) {
    const response = await fetch(`${base}${page.path}`, { signal: AbortSignal.timeout(60000) });
    const html = await response.text();
    assert.equal(response.status, 200, page.path);
    assert.match(html, /<title>[^<]+<\/title>/, page.path);
    assert.match(html, /rel="canonical"/, page.path);
    console.log(`PASS ${page.path}: HTML, title and canonical`);
  }
  const dashboard = await fetch(`${base}/dashboard`);
  assert.equal(dashboard.status, 200);
  console.log('PASS /dashboard');
  const missing = await fetch(`${base}/uploads/missing-check-file.png`);
  assert.equal(missing.status, 404);
  console.log('PASS missing upload returns 404');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
