const pages = require('../../data/pages.json');
const PageSeo = require('../models/PageSeo');
const Post = require('../models/Post');
const CaseStudy = require('../models/CaseStudy');
const Resource = require('../models/Resource');
const defaults = require('../../data/pageMetadata.json');

async function pageSeoReport(path) {
  if (!path) return null;
  const staticPage = pages.find(page => page.path === path);
  let entry, fallbackTitle = '', fallbackDescription = '', type;
  if (staticPage) {
    entry = await PageSeo.findOne({ path }).lean(); type = 'Static page';
    const metadata = defaults[path] || {};
    fallbackTitle = typeof metadata.title === 'string' ? metadata.title : metadata.title?.absolute || staticPage.label;
    fallbackDescription = metadata.description || '';
  } else {
    const match = path.match(/^\/(blog|case-study|resources)\/([^/]+)$/);
    if (!match) return { path, unavailable: true };
    const Model = { blog: Post, 'case-study': CaseStudy, resources: Resource }[match[1]];
    entry = await Model.findOne({ slug: match[2] }).lean();
    if (!entry) return { path, unavailable: true };
    type = { blog: 'Blog', 'case-study': 'Case study', resources: 'Downloadable' }[match[1]];
    fallbackTitle = entry.title; fallbackDescription = entry.excerpt || entry.summary || entry.desc;
  }
  const seo = entry?.seo || {};
  return {
    path, type, seo, title: seo.title || fallbackTitle, description: seo.description || fallbackDescription,
    pageLabel: fallbackTitle, usesDefaultTitle: !seo.title, usesDefaultDescription: !seo.description,
    canonical: seo.canonical || path, indexable: !seo.noindex, follow: !seo.nofollow,
  };
}
module.exports = pageSeoReport;
