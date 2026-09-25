import { serverPosts, serverCaseStudies, serverResources } from '@/lib/serverApi';
import { getPageSeo } from '@/lib/seo';
import pages from '@/data/pages.json';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://proowrx.com';
export const dynamic = 'force-dynamic';
export default async function sitemap() {
  const posts = await serverPosts.getAll();
  const [cases, resources] = await Promise.all([serverCaseStudies.getAll(), serverResources.getAll()]);
  const entries = await Promise.all(pages.map(async page => {
    const settings = await getPageSeo(page.path);
    if (settings?.seo?.noindex) return null;
    return { url: new URL(page.path, SITE_URL).href, ...(settings?.updatedAt ? { lastModified: settings.updatedAt } : {}), changeFrequency: 'monthly', priority: page.path === '/' ? 1 : 0.7 };
  }));
  return [...entries.filter(Boolean), ...[...cases.map(item => ({ ...item, route: 'case-study' })), ...resources.map(item => ({ ...item, route: 'resources' }))].filter(item => !item.seo?.noindex).map(item => ({ url: new URL(`/${item.route}/${item.slug}`, SITE_URL).href, lastModified: new Date(item.updatedAt || item.createdAt), changeFrequency: 'monthly', priority: 0.6 })), ...posts.filter(post => !post.seo?.noindex).map(post => ({
    url: new URL(`/blog/${post.slug || post._id}`, SITE_URL).href,
    lastModified: new Date(post.updatedAt || post.createdAt), changeFrequency: 'monthly', priority: 0.6,
  }))];
}
