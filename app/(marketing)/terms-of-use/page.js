import { pageMetadata } from '@/lib/seo';
import LegalPageClient from '@/components/shared/LegalPageClient';

const metadata = {
  title: 'Terms of Use',
  description: 'The terms that govern access to and use of the Proowrx website and downloadable resources.',
  alternates: { canonical: '/terms-of-use' },
};

export default function Page() {
  return <LegalPageClient />;
}

export function generateMetadata() { return pageMetadata('/terms-of-use', metadata); }
export const dynamic = 'force-dynamic';
