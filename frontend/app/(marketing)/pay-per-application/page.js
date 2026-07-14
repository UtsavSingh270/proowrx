import PayPerApplicationClient from './PayPerApplicationClient';

export const metadata = {
  title: 'Pay Per Application',
  description: 'No lock-in contracts, no idle staff costs. Submit a mortgage file, we process it end-to-end, you close the loan — a flexible pay-per-file outsourcing model for Australian brokers.',
  alternates: { canonical: '/pay-per-application' },
  openGraph: {
    title: 'Only Pay When You Have a File | Proowrx Pay Per Application',
    description: 'A flexible, no-contract mortgage processing model — pay only for the files you submit.',
    url: '/pay-per-application',
  },
};

export default function Page() {
  return <PayPerApplicationClient />;
}
