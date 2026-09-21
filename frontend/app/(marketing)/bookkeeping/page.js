import PayPerApplicationClient from './BookKeeping';

export const metadata = {
  title: 'BookKeeping',
  description: 'No lock-in contracts, no idle staff costs. Submit a mortgage file, we process it end-to-end, you close the loan — a flexible pay-per-file outsourcing model for Australian brokers.',
  alternates: { canonical: '/bookkeeping' },
  openGraph: {
    title: 'Only Pay When You Have a File | Proowrx Pay Per Application',
    description: 'A flexible, no-contract mortgage processing model — pay only for the files you submit.',
    url: '/bookkeeping',
  },
};

export default function Page() {
  return <PayPerApplicationClient />;
}
