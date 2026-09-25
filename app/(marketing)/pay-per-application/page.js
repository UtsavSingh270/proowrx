import PageInsights from '@/components/shared/PageInsights';
import { pageMetadata } from '@/lib/seo';
import PayPerApplicationClient from './PayPerApplicationClient';

const metadata = {
  title: 'Pay Per Application',
  description: 'No lock-in contracts, no idle staff costs. Submit a mortgage file, we process it end-to-end, you close the loan — a flexible pay-per-file outsourcing model for Australian brokers.',
  alternates: { canonical: '/pay-per-application' },
  openGraph: {
    title: 'Only Pay When You Have a File | Proowrx Pay Per Application',
    description: 'A flexible, no-contract mortgage processing model — pay only for the files you submit.',
    url: '/pay-per-application',
  },
};

function Page() {
  return <PayPerApplicationClient />;
}

export function generateMetadata() { return pageMetadata('/pay-per-application', metadata); }
export const dynamic = 'force-dynamic';

export default function PageWithInsights() { return <><Page /><PageInsights path="/pay-per-application" /></>; }
