const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const sourcePath = process.argv[2];
if (!sourcePath) throw new Error('Provide the WordPress XML path.');

function field(block, tag) {
  const escaped = tag.replace(':', '\\:');
  const cdata = block.match(new RegExp(`<${escaped}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${escaped}>`, 'i'));
  if (cdata) return cdata[1].trim();
  const plain = block.match(new RegExp(`<${escaped}[^>]*>([\\s\\S]*?)</${escaped}>`, 'i'));
  return plain ? plain[1].trim() : '';
}

function words(html = '') {
  return html.replace(/<[^>]+>/g, ' ').replace(/&[^;]+;/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
}

async function request(route, options = {}) {
  const response = await fetch(`${process.env.IMPORT_API_URL || 'http://localhost:3000/api'}${route}`, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || response.statusText);
  return data;
}

async function main() {
  const xml = fs.readFileSync(path.resolve(sourcePath), 'utf8');
  const sourcePosts = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)]
    .map(match => match[1])
    .filter(item => field(item, 'wp:post_type') === 'post' && field(item, 'wp:status') === 'publish')
    .map(item => {
      const content = field(item, 'content:encoded');
      return {
        title: field(item, 'title').replace(/&amp;/g, '&'),
        words: words(content),
        headings: [...content.matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/gi)].map(match => match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()),
      };
    });
  const login = await request('/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ username: 'admin@proowrx', password: process.env.ADMIN_PASSWORD }) });
  const headers = { authorization: `Bearer ${login.token}` };
  const posts = await request('/posts/admin/all', { headers });
  const results = [];
  for (const summary of posts) {
    const post = await request(`/posts/admin/${summary._id}`, { headers });
    const source = sourcePosts.find(item => item.title.trim().toLowerCase() === post.title.trim().toLowerCase());
    if (!source) continue;
    const databaseWords = words(post.htmlContent);
    results.push({ title: post.title, sourceWords: source.words, databaseWords, retained: source.words ? Math.round(databaseWords / source.words * 100) : 100, headings: source.headings });
  }
  console.log(JSON.stringify(results.filter(item => item.retained < 70).sort((a, b) => a.retained - b.retained), null, 2));
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
