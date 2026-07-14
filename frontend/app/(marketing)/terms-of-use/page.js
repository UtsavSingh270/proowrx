import LegalPageClient from './LegalPageClient';

export const metadata = {
  title: 'Terms of Use',
  description: 'The terms that govern access to and use of the Proowrx website and downloadable resources.',
  alternates: { canonical: '/terms-of-use' },
};

export default function Page() {
  return <LegalPageClient />;
}
