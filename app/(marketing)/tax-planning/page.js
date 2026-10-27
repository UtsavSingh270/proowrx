import PageInsights from '@/components/shared/PageInsights';
import { pageMetadata } from '@/lib/seo';
import TaxPlanningClient from './TaxPlanningClient';

const metadata = {
  title: 'Tax Planning Support for Accounting Firms',
  description: 'Meet surging tax planning demand without adding local staff or working overtime.',
  alternates: { canonical: '/tax-planning' },
  openGraph: {
    title: 'Tax Planning Support for Accounting Firms | Proowrx',
    description: 'Meet surging tax planning demand without adding local staff or working overtime.',
    url: '/tax-planning',
  },
};

export function generateMetadata() { return pageMetadata('/tax-planning', metadata); }
export const dynamic = 'force-dynamic';

export default function TaxPlanningPage() {
  return <><TaxPlanningClient /><PageInsights path="/tax-planning" /></>;
}
