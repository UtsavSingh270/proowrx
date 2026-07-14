import MortgageClient from './MortgageClient';

export const metadata = {
  title: 'Mortgage Processing Outsourcing',
  description: 'End-to-end mortgage loan processing for Australian brokers — data entry, compliance checks, lender submission, and post-submission follow-ups, so you can focus on closing deals.',
  alternates: { canonical: '/mortgage' },
  openGraph: {
    title: 'Mortgage Outsourcing Services | Proowrx',
    description: 'We handle loan processing, compliance, and post-submission follow-ups behind the scenes for Australian mortgage brokers.',
    url: '/mortgage',
  },
};

export default function Page() {
  return <MortgageClient />;
}
