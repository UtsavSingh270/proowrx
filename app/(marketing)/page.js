import LatestBlogs from '@/components/shared/LatestBlogs';
import PageCaseStudies from '@/components/shared/PageCaseStudies';
import { pageMetadata } from '@/lib/seo';
import HomeClient from './HomeClient';

const metadata = {
  title: { absolute: 'Proowrx | KPO Back-Office Support for Mortgage Brokers & Accountants' },
  description: 'Australian-owned KPO providing expert mortgage processing, accounting, and virtual assistant services. 24-hour turnaround, Australia-hosted data security, no lock-in contracts.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Proowrx | Back-Office Excellence for Australian Financial Professionals',
    description: 'Expert loan processing, accounting, and back-office support so mortgage brokers and accountants can focus on growing their business.',
    url: '/',
  },
};

export function generateMetadata() { return pageMetadata('/', metadata); }
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return <HomeClient insights={<><LatestBlogs /><PageCaseStudies path="/" /></>} />;
}
