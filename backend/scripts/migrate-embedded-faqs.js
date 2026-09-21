const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const API_URL = process.env.IMPORT_API_URL || 'http://localhost:5000/api';

function text(value = '') {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function extractFaqSection(html = '') {
  const faqLabel = /(?:frequently\s+asked\s+questions?|\bfaqs?\b)/i;
  const headings = [...html.matchAll(/<h[1-6]\b[^>]*>[\s\S]*?<\/h[1-6]>/gi)];
  const semanticHeading = headings.find(match => faqLabel.test(text(match[0])));
  const paragraphHeading = /<p\b[^>]*>\s*<(?:strong|b)\b[^>]*>\s*(?:frequently\s+asked\s+questions?|faqs?)\s*<\/(?:strong|b)>\s*<\/p>/i.exec(html);
  const heading = semanticHeading || paragraphHeading;
  if (!heading) return { htmlContent: html, faqs: [] };
  const start = heading.index;
  const contentStart = start + heading[0].length;
  const nextSection = /<h[1-2]\b[^>]*>[\s\S]*?<\/h[1-2]>/i.exec(html.slice(contentStart));
  const end = nextSection ? contentStart + nextSection.index : html.length;
  const markup = html.slice(contentStart, end);
  const faqs = [];
  const add = (question, answer) => {
    const cleanQuestion = text(question).replace(/^Q(?:uestion)?\s*\d*[:.)-]?\s*/i, '').replace(/^\d+[.)]\s*/, '').trim();
    const cleanAnswer = text(answer).replace(/^A(?:nswer)?\s*[:.)-]?\s*/i, '').trim();
    if (cleanQuestion && cleanAnswer && !faqs.some(item => item.question.toLowerCase() === cleanQuestion.toLowerCase())) {
      faqs.push({ question: cleanQuestion, answer: cleanAnswer });
    }
  };

  for (const match of markup.matchAll(/<p\b[^>]*>\s*<(?:strong|b)\b[^>]*>([\s\S]*?)(?:<br\s*\/?>)\s*<\/(?:strong|b)>([\s\S]*?)<\/p>/gi)) add(match[1], match[2]);
  for (const match of markup.matchAll(/<h[3-6]\b[^>]*>([\s\S]*?)<\/h[3-6]>([\s\S]*?)(?=<h[1-6]\b|$)/gi)) add(match[1], match[2]);
  for (const match of markup.matchAll(/<p\b[^>]*>\s*<(?:strong|b)\b[^>]*>([\s\S]*?)<\/(?:strong|b)>\s*<\/p>\s*<p\b[^>]*>([\s\S]*?)<\/p>/gi)) add(match[1], match[2]);
  for (const match of markup.matchAll(/<li\b[^>]*>\s*<(?:strong|b)\b[^>]*>([\s\S]*?)<\/(?:strong|b)>[\s\S]*?<\/li>\s*<p\b[^>]*>([\s\S]*?)<\/p>/gi)) add(match[1], match[2]);

  return { htmlContent: `${html.slice(0, start)}${html.slice(end)}`.trim(), faqs: faqs.slice(0, 5) };
}

async function request(route, options = {}) {
  const response = await fetch(`${API_URL}${route}`, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `${response.status} ${response.statusText}`);
  return data;
}

async function main() {
  const apply = process.argv.includes('--apply');
  if (!process.env.ADMIN_PASSWORD) throw new Error('ADMIN_PASSWORD is required.');
  const login = await request('/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username: 'admin@proowrx', password: process.env.ADMIN_PASSWORD }),
  });
  const headers = { 'content-type': 'application/json', authorization: `Bearer ${login.token}` };
  const summaries = await request('/posts/admin/all', { headers });
  const matches = [];

  for (const summary of summaries) {
    const post = await request(`/posts/admin/${summary._id}`, { headers });
    const extracted = extractFaqSection(post.htmlContent || '');
    if (extracted.htmlContent === (post.htmlContent || '')) continue;
    const existing = Array.isArray(post.faqs) ? post.faqs.filter(item => item.question && item.answer) : [];
    const merged = [...existing];
    extracted.faqs.forEach(item => {
      if (!merged.some(current => current.question.trim().toLowerCase() === item.question.trim().toLowerCase())) merged.push(item);
    });
    matches.push({ title: post.title, questions: extracted.faqs.length });
    if (apply) {
      await request(`/posts/${post._id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ ...post, htmlContent: extracted.htmlContent, faqs: merged.slice(0, 5) }),
      });
    }
  }

  console.log(JSON.stringify({ scanned: summaries.length, matched: matches.length, posts: matches, mode: apply ? 'apply' : 'dry-run' }, null, 2));
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
