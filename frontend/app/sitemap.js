import { serverPosts } from '../lib/serverApi';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://proowrx.com';

const STATIC_ROUTES = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/services', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/mortgage', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/accounting', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/data-security', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/virtual-assistant', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/pay-per-application', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/our-team', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/worklife', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/career', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/blog', priority: 0.8, changeFrequency: 'daily' },
  { path: '/faq', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/resources', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.7, changeFrequency: 'yearly' },
  { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms-of-use', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/disclaimer', priority: 0.3, changeFrequency: 'yearly' },
];

export default async function sitemap() {
  const dynamicPosts = await serverPosts.getAll().catch(() => []);

  const staticEntries = STATIC_ROUTES.map(r => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const dynamicPostEntries = (dynamicPosts || []).map(p => ({
    url: `${SITE_URL}/blog/${p.slug || p.id}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticEntries, ...dynamicPostEntries];
}
