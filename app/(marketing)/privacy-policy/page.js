import { pageMetadata } from '@/lib/seo';
import LegalPageClient from '@/components/shared/LegalPageClient';

const metadata = {
  title: 'Privacy Policy',
  description: 'How Proowrx collects, uses, and protects personal information shared through our website, enquiries, meetings, and downloadable resources.',
  alternates: { canonical: '/privacy-policy' },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <LegalPageClient />;
}

export function generateMetadata() { return pageMetadata('/privacy-policy', metadata); }
export const dynamic = 'force-dynamic';
