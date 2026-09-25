import PageInsights from '@/components/shared/PageInsights';
import { pageMetadata } from '@/lib/seo';
import MortgageClient from './MortgageClient';

const metadata = {
  title: 'Mortgage Processing Outsourcing',
  description: 'End-to-end mortgage loan processing for Australian brokers — data entry, compliance checks, lender submission, and post-submission follow-ups, so you can focus on closing deals.',
  alternates: { canonical: '/mortgage' },
  openGraph: {
    title: 'Mortgage Outsourcing Services | Proowrx',
    description: 'We handle loan processing, compliance, and post-submission follow-ups behind the scenes for Australian mortgage brokers.',
    url: '/mortgage',
  },
};

function Page() {
  return <MortgageClient />;
}

export function generateMetadata() { return pageMetadata('/mortgage', metadata); }
export const dynamic = 'force-dynamic';

export default function PageWithInsights() { return <><Page /><PageInsights path="/mortgage" /></>; }
