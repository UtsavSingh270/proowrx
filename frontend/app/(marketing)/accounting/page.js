import AccountingClient from './AccountingClient';

export const metadata = {
  title: 'Accounting Outsourcing Services',
  description: 'Outsourced bookkeeping, tax, SMSF administration, and BAS/IAS/STP lodgements for Australian accounting firms — let your team focus on advisory work while we handle compliance.',
  alternates: { canonical: '/accounting' },
  openGraph: {
    title: 'Accounting Outsourcing for Australian Firms | Proowrx',
    description: 'Bookkeeping, tax, SMSF, and reporting support for Australian accountants, handled behind the scenes by a trained offshore team.',
    url: '/accounting',
  },
};

export default function Page() {
  return <AccountingClient />;
}
