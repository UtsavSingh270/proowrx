import FAQClient from './FAQClient';
import { faqs } from '@/data/faqs';

export const metadata = {
  title: 'FAQ',
  description: 'Clear answers about working with Proowrx — which services you can outsource, how we protect client data, and how to get started with mortgage or accounting back-office support.',
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'Frequently Asked Questions | Proowrx',
    description: 'Answers about outsourcing mortgage processing and accounting support with Proowrx.',
    url: '/faq',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FAQClient />
    </>
  );
}
