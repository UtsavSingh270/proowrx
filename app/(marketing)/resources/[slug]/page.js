import { notFound } from 'next/navigation';
import Link from 'next/link';
import { serverResources } from '@/lib/serverApi';
import { buildSeoMetadata } from '@/lib/seoMetadata';
import DownloadButton from '@/components/shared/DownloadButton';
import { assetUrl } from '@/lib/media';
import '../../GrowthPages.css';

export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }) {
  const item = await serverResources.getOne((await params).slug);
  if (!item) return {};
  const image = assetUrl(item.image);
  return buildSeoMetadata(item.seo, { title: item.title, description: item.desc, openGraph: { images: image ? [{ url: image }] : [] } }, `/resources/${item.slug}`);
}
export default async function ResourcePage({ params }) {
  const item = await serverResources.getOne((await params).slug);
  if (!item) notFound();
  return <main className="growth-page"><section className="growth-hero"><div className="container"><Link href="/resources">← All downloadables</Link><h1>{item.title}</h1><p>{item.desc}</p><DownloadButton resource={{ slug: item.slug, title: item.title }} /></div></section>{assetUrl(item.image) && <section className="growth-section"><div className="container"><img className="case-cover" src={assetUrl(item.image)} alt={item.title} /></div></section>}</main>;
}
