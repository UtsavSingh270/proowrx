import { pageMetadata } from '@/lib/seo';
import LegalPageClient from '@/components/shared/LegalPageClient';

const metadata = {
  title: 'Disclaimer',
  description: 'General information disclaimer for the Proowrx website — content is not professional, legal, financial, tax, or compliance advice.',
  alternates: { canonical: '/disclaimer' },
};

export default function Page() {
  return <LegalPageClient />;
}

export function generateMetadata() { return pageMetadata('/disclaimer', metadata); }
export const dynamic = 'force-dynamic';
