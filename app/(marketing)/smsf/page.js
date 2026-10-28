import PageInsights from '@/components/shared/PageInsights';
import { pageMetadata } from '@/lib/seo';
import SmsfClient from './smsf';

const metadata = {
  title: 'SMSF Management',
  description: 'Reliable outsourced SMSF management and compliance support for Australian businesses and accounting practices.',
  alternates: { canonical: '/smsf' },
  openGraph: {
    title: 'SMSF Management | Proowrx',
    description: 'Accurate SMSF management and compliance support from Proowrx.',
    url: '/smsf',
  },
};

function Page() {
  return <SmsfClient />;
}

export function generateMetadata() { return pageMetadata('/smsf', metadata); }
export const dynamic = 'force-dynamic';

export default function PageWithInsights() { return <><Page /><PageInsights path="/smsf" /></>; }
