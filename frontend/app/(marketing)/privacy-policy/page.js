import LegalPageClient from './LegalPageClient';

export const metadata = {
  title: 'Privacy Policy',
  description: 'How Proowrx collects, uses, and protects personal information shared through our website, enquiries, meetings, and downloadable resources.',
  alternates: { canonical: '/privacy-policy' },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <LegalPageClient />;
}
