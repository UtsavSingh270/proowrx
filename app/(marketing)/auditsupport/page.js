import PageInsights from '@/components/shared/PageInsights';
import { pageMetadata } from '@/lib/seo';
import PayrollClient from './payroll';

const metadata = {
  title: 'Payroll Support',
  description: 'Reliable outsourced payroll processing and compliance support for Australian businesses and accounting practices.',
  alternates: { canonical: '/payroll' },
  openGraph: {
    title: 'Payroll Support | Proowrx',
    description: 'Accurate payroll processing and compliance support from Proowrx.',
    url: '/payroll',
  },
};

function Page() {
  return <PayrollClient />;
}

export function generateMetadata() { return pageMetadata('/payroll', metadata); }
export const dynamic = 'force-dynamic';

export default function PageWithInsights() { return <><Page /><PageInsights path="/payroll" /></>; }
