import PageInsights from '@/components/shared/PageInsights';
import { pageMetadata } from '@/lib/seo';
import SmsfClient from './smsf';

const metadata = {
  title: 'SMSF Outsourcing Services for Accounting Firms',
  description: 'Manage growing SMSF accounting and administration workloads with flexible outsourcing support from Proowrx.',
  keywords: [
    'SMSF outsourcing services',
    'SMSF accounting outsourcing',
    'SMSF administration support',
    'SMSF bookkeeping services',
    'SMSF support for accounting firms',
  ],
  alternates: { canonical: '/smsf' },
  openGraph: {
    title: 'SMSF Outsourcing Services for Accounting Firms | Proowrx',
    description: 'Manage growing SMSF accounting and administration workloads with flexible outsourcing support from Proowrx.',
    url: '/smsf',
  },
};

function Page() {
  return <SmsfClient />;
}

export function generateMetadata() { return pageMetadata('/smsf', metadata); }
export const dynamic = 'force-dynamic';

export default function PageWithInsights() { return <><Page /><PageInsights path="/smsf" /></>; }
