import { pageMetadata } from '@/lib/seo';
import ResourcesClient from "./ResourcesClient";
import { serverResources } from '@/lib/serverApi';

const metadata = {
  title: "Resources | Proowrx",
  description:
    "Download free mortgage, accounting and outsourcing guides, ebooks, checklists and business resources from Proowrx.",
  alternates: {
    canonical: "/resources",
  },
  openGraph: {
    title: "Resources | Proowrx",
    description:
      "Download free mortgage, accounting and outsourcing guides from Proowrx.",
    url: "/resources",
    type: "website",
  },
};

export default async function Page() {
  const resources = await serverResources.getAll().catch(() => []);

  return <ResourcesClient initialResources={resources} />;
}

export function generateMetadata() { return pageMetadata('/resources', metadata); }
export const dynamic = 'force-dynamic';
