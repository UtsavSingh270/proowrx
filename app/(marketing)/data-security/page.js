import { pageMetadata } from '@/lib/seo';
import DataSecurityClient from './DataSecurityClient';

const metadata = {
  title: 'Data Security',
  description: 'AES-256 encryption, Australia-hosted servers, 2-factor authentication, and NDA-signed staff — how Proowrx protects sensitive mortgage and accounting client data at every level.',
  alternates: { canonical: '/data-security' },
  openGraph: {
    title: 'Security at Every Level | Proowrx Data Security',
    description: 'Our infrastructure is designed around protecting sensitive client data — Australia-hosted servers, encryption, and strict access controls.',
    url: '/data-security',
  },
};

export default function Page() {
  return <DataSecurityClient />;
}

export function generateMetadata() { return pageMetadata('/data-security', metadata); }
export const dynamic = 'force-dynamic';
