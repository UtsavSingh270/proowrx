import { pageMetadata } from '@/lib/seo';
import BlogClient from './BlogClient';
import { serverPosts } from '@/lib/serverApi';

const metadata = {
  title: 'Blog',
  description: 'Industry insights, outsourcing guides, and practical tips for Australian mortgage brokers and accountants — from the Proowrx team.',
  keywords: [
    'mortgage outsourcing Australia', 'mortgage broker support', 'loan processing outsourcing',
    'accounting outsourcing Australia', 'bookkeeping outsourcing', 'virtual assistant for mortgage brokers',
    'KPO services Australia', 'back office support', 'data security outsourcing', 'Proowrx insights',
  ],
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Proowrx Blog | Insights & Resources',
    description: 'Industry insights and practical outsourcing guides for Australian financial professionals.',
    url: '/blog',
  },
};



export default async function Page() {
  // Server-rendered request time is serialized so the client hydrates with the same clock.
  // eslint-disable-next-line react-hooks/purity
  const generatedAt = Date.now();
  const allPosts = await serverPosts.getAll().catch(() => []);
  const posts = allPosts || [];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://proowrx.com';
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Proowrx Blog',
    description: metadata.description,
    url: `${siteUrl}/blog`,
    isPartOf: { '@type': 'WebSite', name: 'Proowrx', url: siteUrl },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: posts.length,
      itemListElement: posts.slice(0, 20).map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${siteUrl}/blog/${post.slug || post.id}`,
        name: post.title,
      })),
    },
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
    ],
  };

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema).replace(/</g, '\\u003c') }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} /><BlogClient allPosts={posts} generatedAt={generatedAt} /></>;
}

export function generateMetadata() { return pageMetadata('/blog', metadata); }
export const dynamic = 'force-dynamic';
