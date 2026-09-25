import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { serverCaseStudies } from '@/lib/serverApi';
import { buildSeoMetadata } from '@/lib/seoMetadata';
import CtaBanner from '@/components/shared/CtaBanner';
import '../../GrowthPages.css';

export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }) {
  const item = await serverCaseStudies.getOne((await params).slug);
  if (!item) return {};
  return buildSeoMetadata(item.seo, { title: item.title, description: item.summary, openGraph: { type: 'article', images: item.image ? [{ url: item.image }] : [] } }, `/case-study/${item.slug}`);
}
export default async function CaseStudyPage({ params }) {
  const item = await serverCaseStudies.getOne((await params).slug);
  if (!item) notFound();
  const schema = { '@context': 'https://schema.org', '@type': 'Article', headline: item.title, description: item.summary, image: item.image || undefined, datePublished: item.createdAt, dateModified: item.updatedAt };
  return <main className="growth-page"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <section className="growth-hero"><div className="container"><Link href="/case-study">← All case studies</Link><p className="growth-eyebrow">{item.industry || 'Client case study'}</p><h1>{item.title}</h1><p>{item.summary}</p><div className="case-facts">{[['Client', item.clientName], ['Service', item.service], ['Duration', item.duration]].filter(([, value]) => value).map(([label, value]) => <div key={label}><small>{label}</small><strong>{value}</strong></div>)}</div></div></section>
    {item.image && <div className="container"><Image className="case-cover" src={item.image} alt={item.title} width={1400} height={800} priority sizes="(max-width: 1220px) 100vw, 1164px" /></div>}
    {!!item.metrics?.length && <section className="growth-section"><div className="container growth-grid">{item.metrics.map((metric, index) => <article className="growth-card" key={index}><div className="case-result"><strong>{metric.value}</strong><span>{metric.label}</span></div></article>)}</div></section>}
    {[['The challenge', item.challenge], ['Our approach', item.approach], ['Results and impact', item.results]].map(([heading, text]) => <section className="growth-section" key={heading}><div className="container case-story"><h2>{heading}</h2><p>{text}</p></div></section>)}
    {item.testimonial && <section className="growth-section alt"><blockquote className="container case-story"><p>“{item.testimonial}”</p>{item.testimonialBy && <cite>{item.testimonialBy}</cite>}</blockquote></section>}
    <CtaBanner />
  </main>;
}
