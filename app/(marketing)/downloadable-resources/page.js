import { pageMetadata } from '@/lib/seo';
import { serverResources } from '@/lib/serverApi';
import DownloadablesClient from './DownloadablesClient';

export const dynamic = 'force-dynamic';

export function generateMetadata() {
  return pageMetadata('/downloadable-resources', {
    title: 'Downloadables',
    description: 'Download free mortgage, accounting and outsourcing guides, ebooks, checklists and business resources from Proowrx.',
    alternates: { canonical: '/downloadable-resources' },
  });
}

export default async function DownloadablesPage() {
  const resources = await serverResources.getAll();
  return <DownloadablesClient initialResources={resources} />;
}
