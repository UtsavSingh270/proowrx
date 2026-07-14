import LegalPageClient from './LegalPageClient';

export const metadata = {
  title: 'Disclaimer',
  description: 'General information disclaimer for the Proowrx website — content is not professional, legal, financial, tax, or compliance advice.',
  alternates: { canonical: '/disclaimer' },
};

export default function Page() {
  return <LegalPageClient />;
}
