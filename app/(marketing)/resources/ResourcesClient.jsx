'use client';
import Link from 'next/link';
import Image from 'next/image';
import DownloadButton from '@/components/shared/DownloadButton';
import { assetUrl } from '@/lib/media';
import CtaBanner from '@/components/shared/CtaBanner';
import '@/styles/InfoPages.css';

export default function ResourcesClient({ initialResources = [] }) {
  return <main><section className="page-hero info-hero"><div className="container"><span className="chip chip-gold">Downloadables</span><h1>Resources for your next step</h1><p>Guides, checklists and tools from the Proowrx team.</p></div></section><section className="section"><div className="container">{initialResources.length ? <div className="resources-grid">{initialResources.map(item => <article key={item.slug} className="resource-card">{assetUrl(item.image) && <Image src={assetUrl(item.image)} alt={item.title} className="resource-image" width={640} height={400} sizes="(max-width: 700px) 100vw, 33vw" />}<div className="resource-card-body"><h2><Link href={`/resources/${item.slug}`}>{item.title}</Link></h2><p>{item.desc}</p><DownloadButton resource={{ slug: item.slug, title: item.title }} /></div></article>)}</div> : <p>No downloadable resources are available right now.</p>}</div></section><CtaBanner /></main>;
}
