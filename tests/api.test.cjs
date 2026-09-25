const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const jwt = require('jsonwebtoken');

// Exercise the actual API/router/auth stack against isolated in-memory model doubles.
// No production database or existing content is modified.
require.cache[require.resolve('../server/config/db')] = { exports: async () => {} };
const PageSeo = require('../server/models/PageSeo');
const Post = require('../server/models/Post');
const AuditLog = require('../server/models/AuditLog');
const stored = new Map();
PageSeo.find = async () => [...stored.values()];
PageSeo.findOneAndUpdate = async ({ path }, { seo }) => {
  const entry = { _id: '507f1f77bcf86cd799439011', path, seo };
  stored.set(path, entry); return entry;
};
AuditLog.prototype.save = async function () { return this; };
Post.exists = async () => false;
Post.prototype.save = async function () { return this; };
process.env.JWT_SECRET = 'isolated-test-secret';
const api = require('../server/api');
let server, base;
const token = permissions => jwt.sign({ username: 'test', permissions }, process.env.JWT_SECRET);
const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token('view-write')}` };
before(async () => {
  server = http.createServer(api);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}/api`;
});
after(() => new Promise(resolve => server.close(resolve)));

test('health is served by the integrated API', async () => {
  const response = await fetch(`${base}/health`);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).status, 'ok');
});
test('SEO requires login and write permission', async () => {
  assert.equal((await fetch(`${base}/seo`)).status, 401);
  assert.equal((await fetch(`${base}/seo`, { method: 'PUT', headers: { ...headers, Authorization: `Bearer ${token('view')}` }, body: JSON.stringify({ path: '/', seo: {} }) })).status, 403);
});
test('static SEO saves, reloads, and rejects unknown routes', async () => {
  const response = await fetch(`${base}/seo`, { method: 'PUT', headers, body: JSON.stringify({ path: '/about', seo: { title: 'About our team', primaryKeywords: 'outsourcing' } }) });
  assert.equal(response.status, 200);
  const entries = await (await fetch(`${base}/seo`, { headers })).json();
  assert.equal(entries[0].seo.title, 'About our team');
  assert.equal((await fetch(`${base}/seo`, { method: 'PUT', headers, body: JSON.stringify({ path: '/missing', seo: {} }) })).status, 400);
});
test('post create preserves multiple placements and SEO and rejects invalid destinations', async () => {
  const payload = { title: 'A new insight', status: 'draft', displayPages: ['/', '/bookkeeping'], seo: { title: 'Insight SEO' } };
  const response = await fetch(`${base}/posts`, { method: 'POST', headers, body: JSON.stringify(payload) });
  assert.equal(response.status, 201);
  const post = await response.json();
  assert.deepEqual(post.displayPages, payload.displayPages);
  assert.equal(post.seo.title, 'Insight SEO');
  assert.equal((await fetch(`${base}/posts`, { method: 'POST', headers, body: JSON.stringify({ ...payload, displayPages: ['/about'] }) })).status, 400);
});
test('multipart requests still reach upload authentication', async () => {
  const body = new FormData();
  body.append('file', new Blob(['sample'], { type: 'image/png' }), 'sample.png');
  assert.equal((await fetch(`${base}/upload`, { method: 'POST', body })).status, 401);
});

test('post editing can clear all placements and SEO while preserving its existing slug', async () => {
  const id = '507f1f77bcf86cd799439012';
  Post.findById = () => ({ select: async () => ({ _id: id, slug: 'original-slug', toObject: () => ({ slug: 'original-slug' }) }) });
  Post.findByIdAndUpdate = async (postId, update) => new Post({ ...update, _id: postId, slug: 'original-slug' });
  const response = await fetch(`${base}/posts/${id}`, { method: 'PUT', headers, body: JSON.stringify({ title: 'Edited insight', slug: 'changed-slug', status: 'draft', displayPages: [], seo: {} }) });
  assert.equal(response.status, 200);
  const post = await response.json();
  assert.deepEqual(post.displayPages, []);
  assert.equal(post.seo.title, '');
  assert.equal(post.slug, 'original-slug');
});
