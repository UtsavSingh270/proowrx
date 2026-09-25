const pages = require('../../data/pages.json');
const fields = ['title', 'description', 'primaryKeywords', 'secondaryKeywords', 'canonical', 'ogTitle', 'ogDescription', 'ogImage'];

function normalizeSeo(input = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid SEO settings');
  const result = Object.fromEntries(fields.map(key => [key, String(input[key] || '').trim()]));
  if (result.title.length > 200 || result.description.length > 1000) throw new Error('SEO title or description is too long');
  for (const key of ['canonical', 'ogImage']) {
    const value = result[key];
    if (value && !(value.startsWith('/') && !value.startsWith('//')) && !/^https?:\/\/[^\s]+$/i.test(value)) {
      throw new Error(`${key} must be a site path or an HTTP(S) URL`);
    }
  }
  result.noindex = input.noindex === true;
  result.nofollow = input.nofollow === true;
  return result;
}

function normalizePlacements(value) {
  const allowed = new Set(pages.filter(page => page.insights).map(page => page.path));
  if (!Array.isArray(value) || value.some(path => !allowed.has(path))) throw new Error('Choose valid home or service pages');
  return [...new Set(value)];
}

module.exports = { normalizeSeo, normalizePlacements };
