const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const pages = require('../data/pages.json');
const { normalizeSeo, normalizePlacements } = require('../server/utils/seo');
const { publicPostFilter } = require('../server/utils/posts');

test('placements accept every real service page, deduplicate, and reject unrelated pages', async () => {
  const destinations = pages.filter(page => page.insights).map(page => page.path);
  assert.deepEqual(normalizePlacements([...destinations, '/']), destinations);
  for (const invalid of [['/about'], ['/missing'], ['//example.com'], '/', null]) assert.throws(() => normalizePlacements(invalid));
  assert.deepEqual(normalizePlacements([]), []);
  for (const page of pages) await fs.access(path.join(__dirname, '../app/(marketing)', page.path, 'page.js'));
});

test('SEO validation rejects unsafe URL schemes and normalizes booleans', () => {
  assert.equal(normalizeSeo({ title: ' Example ', noindex: 'false' }).title, 'Example');
  assert.equal(normalizeSeo({ noindex: 'false' }).noindex, false);
  assert.equal(normalizeSeo({ noindex: true }).noindex, true);
  for (const canonical of ['javascript:alert(1)', '//example.com', 'data:text/html,test']) assert.throws(() => normalizeSeo({ canonical }));
  assert.equal(normalizeSeo({ canonical: '/about' }).canonical, '/about');
});

test('public publication filter excludes drafts, paused posts and future scheduled posts', () => {
  const now = new Date('2026-01-01');
  assert.deepEqual(publicPostFilter(now), { $or: [{ status: 'published' }, { status: 'scheduled', scheduledAt: { $lte: now } }] });
});

test('metadata applies SEO overrides, social fallbacks, canonical and robots', async () => {
  const { buildSeoMetadata } = await import('../lib/seoMetadata.js');
  const defaults = { title: 'Default title', description: 'Default description', openGraph: { type: 'article', images: [{ url: '/cover.jpg' }] } };
  const metadata = buildSeoMetadata({ title: 'Custom title', description: 'Custom description', primaryKeywords: 'mortgage, accounting', secondaryKeywords: 'mortgage, support', noindex: true, canonical: '/canonical' }, defaults, '/original');
  assert.deepEqual(metadata.title, { absolute: 'Custom title' });
  assert.equal(metadata.openGraph.title, 'Custom title');
  assert.equal(metadata.twitter.description, 'Custom description');
  assert.deepEqual(metadata.keywords, ['mortgage', 'accounting', 'support']);
  assert.equal(metadata.alternates.canonical, '/canonical');
  assert.equal(metadata.robots.index, false);
  assert.equal(metadata.openGraph.type, 'article');
  const fallback = buildSeoMetadata({}, defaults, '/about');
  assert.equal(fallback.title, defaults.title);
  assert.equal(fallback.description, defaults.description);
  assert.equal(fallback.alternates.canonical, '/about');
});
