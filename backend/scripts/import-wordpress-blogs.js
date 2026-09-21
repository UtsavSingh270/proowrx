const fs = require('fs');
const path = require('path');
const slugify = require('slugify');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const PAGE_SIZE = 6;
const DEFAULT_API_URL = 'http://localhost:5000/api';
const AUTHOR_NAMES = {
  'deepika@proowrx.com': 'Deepika Dixit',
  naveen: 'Naveen Jain',
  manish: 'Manish Aggarwal',
};

function decodeEntities(value = '') {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'");
}

function field(block, tag) {
  const escaped = tag.replace(':', '\\:');
  const cdata = block.match(new RegExp(`<${escaped}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${escaped}>`, 'i'));
  if (cdata) return cdata[1].trim();
  const plain = block.match(new RegExp(`<${escaped}[^>]*>([\\s\\S]*?)</${escaped}>`, 'i'));
  return plain ? decodeEntities(plain[1].trim()) : '';
}

function taxonomy(block, domain) {
  const matches = [...block.matchAll(new RegExp(`<category\\s+domain="${domain}"[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</category>`, 'gi'))];
  return matches.map(match => decodeEntities(match[1].trim())).filter(Boolean);
}

function postMeta(block, key) {
  const entries = [...block.matchAll(/<wp:postmeta>([\s\S]*?)<\/wp:postmeta>/gi)];
  const match = entries.find(entry => field(entry[1], 'wp:meta_key') === key);
  return match ? field(match[1], 'wp:meta_value') : '';
}

function removeImagesAndUnsafeMarkup(html = '') {
  return html
    .replace(/<!--\s+wp:image\b[\s\S]*?<!--\s+\/wp:image\s+-->/gi, '')
    .replace(/<figure\b[^>]*class="[^"]*wp-block-image[^"]*"[^>]*>[\s\S]*?<\/figure>/gi, '')
    .replace(/<picture\b[^>]*>[\s\S]*?<\/picture>/gi, '')
    .replace(/<img\b[^>]*>/gi, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<!--\s*\/?wp:[\s\S]*?-->/gi, '')
    .replace(/<p[^>]*>\s*<a[^>]*>\s*<\/a>\s*<\/p>/gi, '')
    .trim();
}

function plainText(html = '') {
  return decodeEntities(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function extractFaqSection(html = '') {
  const faqLabel = /(?:frequently\s+asked\s+questions?|\bfaqs?\b)/i;
  const headings = [...html.matchAll(/<h[1-6]\b[^>]*>[\s\S]*?<\/h[1-6]>/gi)];
  const semanticHeading = headings.find(match => faqLabel.test(plainText(match[0])));
  const paragraphHeading = /<p\b[^>]*>\s*<strong\b[^>]*>\s*(?:frequently\s+asked\s+questions?|faqs?)\s*<\/strong>\s*<\/p>/i.exec(html);
  const heading = semanticHeading || paragraphHeading;
  if (!heading) return { htmlContent: html, faqs: [] };

  const sectionStart = heading.index;
  const contentStart = sectionStart + heading[0].length;
  const followingHeading = /<h[1-2]\b[^>]*>[\s\S]*?<\/h[1-2]>/i.exec(html.slice(contentStart));
  const sectionEnd = followingHeading ? contentStart + followingHeading.index : html.length;
  const faqMarkup = html.slice(contentStart, sectionEnd);
  const faqs = [];
  const addFaq = (question, answer) => {
    const cleanQuestion = plainText(question).replace(/^\d+[.)]\s*/, '').trim();
    const cleanAnswer = plainText(answer).trim();
    if (cleanQuestion && cleanAnswer && !faqs.some(faq => faq.question === cleanQuestion)) {
      faqs.push({ question: cleanQuestion, answer: cleanAnswer });
    }
  };

  for (const match of faqMarkup.matchAll(/<p\b[^>]*>\s*<strong\b[^>]*>([\s\S]*?)(?:<br\s*\/?>)\s*<\/strong>([\s\S]*?)<\/p>/gi)) {
    addFaq(match[1], match[2]);
  }
  for (const match of faqMarkup.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h[23]\b|$)/gi)) {
    addFaq(match[1], match[2]);
  }
  for (const match of faqMarkup.matchAll(/<ol\b[^>]*>[\s\S]*?<li\b[^>]*>\s*<strong\b[^>]*>([\s\S]*?)<\/strong>[\s\S]*?<\/ol>\s*<p\b[^>]*>([\s\S]*?)<\/p>/gi)) {
    addFaq(match[1], match[2]);
  }
  for (const match of faqMarkup.matchAll(/<p\b[^>]*>\s*<strong\b[^>]*>([\s\S]*?)<\/strong>\s*<\/p>\s*<p\b[^>]*>([\s\S]*?)<\/p>/gi)) {
    addFaq(match[1], match[2]);
  }

  return {
    htmlContent: `${html.slice(0, sectionStart)}${html.slice(sectionEnd)}`.trim(),
    faqs: faqs.slice(0, 5),
  };
}

function excerptOf(item, html) {
  const supplied = plainText(field(item, 'excerpt:encoded'));
  if (supplied) return supplied;
  const text = plainText(html);
  return text.length > 240 ? `${text.slice(0, 237).replace(/\s+\S*$/, '')}...` : text;
}

function readTimeOf(html) {
  const words = plainText(html).split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function dateLabel(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

function parsePosts(xml) {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map(match => match[1]);
  const attachmentById = new Map(
    items
      .filter(item => field(item, 'wp:post_type') === 'attachment')
      .map(item => [field(item, 'wp:post_id'), field(item, 'wp:attachment_url')])
      .filter(([id, url]) => id && url)
  );

  return items
    .filter(item => field(item, 'wp:post_type') === 'post' && field(item, 'wp:status') === 'publish')
    .map(item => {
      const title = decodeEntities(field(item, 'title'));
      const cleanedContent = removeImagesAndUnsafeMarkup(field(item, 'content:encoded'));
      const { htmlContent, faqs } = extractFaqSection(cleanedContent);
      const publishedAt = field(item, 'wp:post_date_gmt') || field(item, 'wp:post_date') || field(item, 'pubDate');
      const categories = taxonomy(item, 'category').filter(category => category.toLowerCase() !== 'uncategorized');
      const creator = field(item, 'dc:creator').toLowerCase();
      return {
        wordpressId: field(item, 'wp:post_id'),
        title,
        slug: field(item, 'wp:post_name') || slugify(title, { lower: true, strict: true }),
        excerpt: excerptOf(item, htmlContent),
        htmlContent,
        image: attachmentById.get(postMeta(item, '_thumbnail_id')) || '',
        category: categories[0] || 'General',
        tags: taxonomy(item, 'post_tag'),
        faqs,
        authorLogin: creator,
        author: AUTHOR_NAMES[creator] || creator,
        date: dateLabel(publishedAt),
        readTime: readTimeOf(htmlContent),
        status: 'published',
        featured: false,
        createdAt: publishedAt ? new Date(`${publishedAt.replace(' ', 'T')}Z`).toISOString() : undefined,
        updatedAt: publishedAt ? new Date(`${publishedAt.replace(' ', 'T')}Z`).toISOString() : undefined,
      };
    })
    .filter(post => post.title && post.htmlContent);
}

async function request(apiUrl, route, options = {}) {
  const response = await fetch(`${apiUrl}${route}`, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `${response.status} ${response.statusText}`);
  return data;
}

async function main() {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const imagesOnly = args.includes('--images-only');
  const faqsOnly = args.includes('--faqs-only');
  const xmlPath = args.find(argument => !argument.startsWith('--'));
  if (!xmlPath) throw new Error('Usage: node scripts/import-wordpress-blogs.js <export.xml> [--apply]');

  const resolvedPath = path.resolve(xmlPath);
  const posts = parsePosts(fs.readFileSync(resolvedPath, 'utf8'));
  const apiUrl = process.env.IMPORT_API_URL || DEFAULT_API_URL;
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error('ADMIN_PASSWORD is required in backend/.env');

  const login = await request(apiUrl, '/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username: 'admin@proowrx', password }),
  });
  const headers = { 'content-type': 'application/json', authorization: `Bearer ${login.token}` };
  const [members, existingPosts] = await Promise.all([
    request(apiUrl, '/team-members/admin/all', { headers }),
    request(apiUrl, '/posts/admin/all', { headers }),
  ]);

  const memberByName = new Map(members.map(member => [member.name.trim().toLowerCase().replace(/\s+/g, ' '), member]));
  const existingByTitle = new Map(existingPosts.map(post => [post.title.trim().toLowerCase().replace(/\s+/g, ' '), post]));
  const findExisting = post => existingPosts.find(existing => existing.slug === post.slug)
    || existingByTitle.get(post.title.trim().toLowerCase().replace(/\s+/g, ' '));
  const ready = posts.map(post => {
    const member = memberByName.get(post.author.trim().toLowerCase().replace(/\s+/g, ' '));
    const authorProfile = member ? {
      name: member.name,
      email: member.email || '',
      title: member.position || '',
      image: member.image || '',
      bio: member.summary || member.description || '',
    } : { name: post.author, email: post.authorLogin.includes('@') ? post.authorLogin : '', title: '', image: '', bio: '' };
    return {
      ...post,
      author: authorProfile.name,
      authorId: member?._id || null,
      authorSource: member ? 'team' : 'legacy',
      authorProfile,
    };
  });

  const skipped = ready.filter(findExisting);
  const pending = ready.filter(post => !findExisting(post));
  const imageUpdates = ready.filter(post => post.image && findExisting(post));
  const faqUpdates = ready.filter(post => post.faqs.length && findExisting(post));
  const authorSummary = ready.reduce((summary, post) => {
    summary[post.author] = (summary[post.author] || 0) + 1;
    return summary;
  }, {});

  console.log(JSON.stringify({
    source: resolvedPath,
    publishedPosts: ready.length,
    pending: pending.length,
    duplicatesSkipped: skipped.length,
    featuredImagesFound: ready.filter(post => post.image).length,
    imageUpdates: imageUpdates.length,
    faqSectionsFound: faqUpdates.length,
    faqQuestionsFound: faqUpdates.reduce((total, post) => total + post.faqs.length, 0),
    authors: authorSummary,
    unmatchedTeamAuthors: [...new Set(ready.filter(post => post.authorSource === 'legacy').map(post => post.author))],
    mode: apply ? (imagesOnly ? 'images-only' : faqsOnly ? 'faqs-only' : 'apply') : 'dry-run',
  }, null, 2));

  if (!apply) {
    console.log('\nDry run complete. Re-run with --apply to import the pending posts.');
    return;
  }

  if (imagesOnly) {
    let updated = 0;
    for (const sourcePost of imageUpdates) {
      const listedPost = findExisting(sourcePost);
      const fullPost = await request(apiUrl, `/posts/admin/${listedPost._id}`, { headers });
      await request(apiUrl, `/posts/${listedPost._id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ ...fullPost, image: sourcePost.image }),
      });
      updated += 1;
      console.log(`[${updated}/${imageUpdates.length}] Added image: ${sourcePost.title}`);
    }
    console.log(`\nImage update complete: ${updated} posts updated.`);
    return;
  }

  if (faqsOnly) {
    let updated = 0;
    for (const sourcePost of faqUpdates) {
      const listedPost = findExisting(sourcePost);
      const fullPost = await request(apiUrl, `/posts/admin/${listedPost._id}`, { headers });
      await request(apiUrl, `/posts/${listedPost._id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ ...fullPost, htmlContent: sourcePost.htmlContent, faqs: sourcePost.faqs }),
      });
      updated += 1;
      console.log(`[${updated}/${faqUpdates.length}] Migrated FAQs: ${sourcePost.title}`);
    }
    console.log(`\nFAQ migration complete: ${updated} posts updated.`);
    return;
  }

  let imported = 0;
  for (let index = 0; index < pending.length; index += PAGE_SIZE) {
    const batch = pending.slice(index, index + PAGE_SIZE);
    for (const post of batch) {
      const { wordpressId, authorLogin, ...payload } = post;
      await request(apiUrl, '/posts', { method: 'POST', headers, body: JSON.stringify(payload) });
      imported += 1;
      console.log(`[${imported}/${pending.length}] Imported: ${post.title}`);
    }
  }

  console.log(`\nImport complete: ${imported} added, ${skipped.length} existing posts skipped.`);
}

main().catch(error => {
  console.error(`Import failed: ${error.message}`);
  process.exit(1);
});
