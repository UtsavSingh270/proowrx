import BlogClient from './BlogClient';
import { serverPosts } from '../../../lib/serverApi';

export const metadata = {
  title: 'Blog',
  description: 'Industry insights, outsourcing guides, and practical tips for Australian mortgage brokers and accountants — from the Proowrx team.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Proowrx Blog | Insights & Resources',
    description: 'Industry insights and practical outsourcing guides for Australian financial professionals.',
    url: '/blog',
  },
};

export const revalidate = 3600;

export default async function Page() {
  const allPosts = await serverPosts.getAll().catch(() => []);
  return <BlogClient allPosts={allPosts || []} />;
}
