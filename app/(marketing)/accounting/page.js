import PageInsights from '@/components/shared/PageInsights';
import { pageMetadata } from '@/lib/seo';
import AccountingClient from './AccountingClient';

const metadata = {
  title: 'Accounting Outsourcing Services',
  description: 'Outsourced bookkeeping, tax, SMSF administration, and BAS/IAS/STP lodgements for Australian accounting firms — let your team focus on advisory work while we handle compliance.',
  alternates: { canonical: '/accounting' },
  openGraph: {
    title: 'Accounting Outsourcing for Australian Firms | Proowrx',
    description: 'Bookkeeping, tax, SMSF, and reporting support for Australian accountants, handled behind the scenes by a trained offshore team.',
    url: '/accounting',
  },
};

function Page() {
  return <AccountingClient />;
}

export function generateMetadata() { return pageMetadata('/accounting', metadata); }
export const dynamic = 'force-dynamic';

export default function PageWithInsights() { return <><Page /><PageInsights path="/accounting" /></>; }
