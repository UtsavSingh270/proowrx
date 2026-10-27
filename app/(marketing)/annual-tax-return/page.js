import PageInsights from '@/components/shared/PageInsights';
import { pageMetadata } from '@/lib/seo';
import AnnualTaxReturnClient from './AnnualTaxReturnClient';

const metadata = {
  title: 'Annual Tax Return Preparation Services for Accounting Firms',
  description: 'Clear tax return backlogs and manage busy tax periods with outsourced preparation support.',
  alternates: { canonical: '/annual-tax-return' },
  openGraph: {
    title: 'Annual Tax Return Preparation Services for Accounting Firms | Proowrx',
    description: 'Clear tax return backlogs and manage busy tax periods with outsourced preparation support.',
    url: '/annual-tax-return',
  },
};

export function generateMetadata() { return pageMetadata('/annual-tax-return', metadata); }
export const dynamic = 'force-dynamic';

export default function AnnualTaxReturnPage() {
  return <><AnnualTaxReturnClient /><PageInsights path="/annual-tax-return" /></>;
}
