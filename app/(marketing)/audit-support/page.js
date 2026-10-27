import PageInsights from '@/components/shared/PageInsights';
import { pageMetadata } from '@/lib/seo';
import AuditClient from '../auditsupport/auditsupport';

const metadata = {
  title: 'Audit Support',
  description: 'Reliable outsourced audit support for Australian businesses and accounting practices.',
  alternates: { canonical: '/audit-support' },
  openGraph: {
    title: 'Audit Support | Proowrx',
    description: 'Reliable outsourced audit support for Australian businesses and accounting practices.',
    url: '/audit-support',
  },
};

export function generateMetadata() { return pageMetadata('/audit-support', metadata); }
export const dynamic = 'force-dynamic';

export default function AuditSupportPage() {
  return <><AuditClient /><PageInsights path="/audit-support" /></>;
}
