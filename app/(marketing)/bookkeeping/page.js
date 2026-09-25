import PageInsights from '@/components/shared/PageInsights';
import { pageMetadata } from '@/lib/seo';
import BookkeepingClient from './BookKeeping';

const metadata = {
  title: 'Bookkeeping Services',
  description: 'Reliable outsourced bookkeeping, reconciliation and payroll support for Australian businesses and accounting practices.',
  alternates: { canonical: '/bookkeeping' },
  openGraph: {
    title: 'Bookkeeping Services | Proowrx',
    description: 'Accurate bookkeeping, reconciliation and payroll support from Proowrx.',
    url: '/bookkeeping',
  },
};

function Page() {
  return <BookkeepingClient />;
}

export function generateMetadata() { return pageMetadata('/bookkeeping', metadata); }
export const dynamic = 'force-dynamic';

export default function PageWithInsights() { return <><Page /><PageInsights path="/bookkeeping" /></>; }
