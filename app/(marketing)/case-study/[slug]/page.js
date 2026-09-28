import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowUpRight, ClipboardList, Quote, TrendingUp, Workflow } from 'lucide-react';
import { serverCaseStudies } from '@/lib/serverApi';
import { buildSeoMetadata } from '@/lib/seoMetadata';
import CtaBanner from '@/components/shared/CtaBanner';
import './CaseStudy.css';

export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }) {
  const item = await serverCaseStudies.getOne((await params).slug);
  if (!item) return {};
  return buildSeoMetadata(item.seo, { title: item.title, description: item.summary, openGraph: { type: 'article', images: item.image ? [{ url: item.image }] : [] } }, `/case-study/${item.slug}`);
}
export default async function CaseStudyPage({ params }) {
  const item = await serverCaseStudies.getOne((await params).slug);
  if (!item) notFound();
  const facts = [['Client', item.clientName], ['Industry', item.industry], ['Service delivered', item.service], ['Project duration', item.duration]].filter(([, value]) => value?.trim());
  const chapters = [
    { id: 'challenge', heading: 'The challenge', text: item.challenge, icon: ClipboardList },
    { id: 'approach', heading: 'Our approach', text: item.approach, icon: Workflow },
    { id: 'results', heading: 'Results and impact', text: item.results, icon: TrendingUp },
  ].filter(chapter => chapter.text?.trim());
  const metrics = (item.metrics || []).filter(metric => metric.value && metric.label);
  const schema = { '@context': 'https://schema.org', '@type': 'Article', headline: item.title, description: item.summary, image: item.image || undefined, datePublished: item.createdAt, dateModified: item.updatedAt };
  return <main className="case-detail-page"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <header className="case-detail-hero">
      <div className="container">
        <Link className="case-detail-back" href="/case-study"><ArrowLeft size={16} aria-hidden="true" /> All case studies</Link>
        <div className={`case-detail-intro${item.image ? ' case-detail-intro--with-image' : ''}`}>
          <div className="case-detail-heading">
            <span className="case-detail-eyebrow">{item.industry || 'Client case study'}</span>
            <h1>{item.title}</h1>
            {item.summary && <p>{item.summary}</p>}
            {!!chapters.length && <a className="case-detail-story-link" href={`#${chapters[0].id}`}>Discover the story <ArrowUpRight size={17} aria-hidden="true" /></a>}
          </div>
          {item.image && <div className="case-detail-cover"><Image src={item.image} alt={item.title} width={1000} height={800} priority sizes="(max-width: 760px) calc(100vw - 32px), 44vw" /></div>}
        </div>
      </div>
    </header>

    <div className="container case-detail-layout">
      <aside className="case-detail-sidebar" aria-label="Project overview">
        {!!facts.length && <div className="case-detail-facts"><h2>Project at a glance</h2><dl>{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div>}
        {!!chapters.length && <nav className="case-detail-contents" aria-label="In this case study"><h2>Inside the story</h2>{chapters.map(({ id, heading }, index) => <a key={id} href={`#${id}`}><span>{String(index + 1).padStart(2, '0')}</span>{heading}<ArrowUpRight size={15} aria-hidden="true" /></a>)}</nav>}
      </aside>
      <article className="case-detail-story" aria-label="Project story">
        {!!metrics.length && <div className="case-detail-outcomes" aria-label="Measurable outcomes">{metrics.map((metric, index) => <div key={index}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div>}
        {chapters.map(({ id, heading, text, icon: Icon }, index) => <section className={`case-detail-chapter case-detail-chapter--${id}`} id={id} key={id} aria-labelledby={`case-${id}-title`}>
          <div className="case-detail-chapter-heading"><span className="case-detail-chapter-icon"><Icon size={24} aria-hidden="true" /></span><div><small>0{index + 1}</small><h2 id={`case-${id}-title`}>{heading}</h2></div></div>
          <div className="case-detail-prose">{text.trim().split(/\n\s*\n/).map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}</div>
        </section>)}
        {item.testimonial?.trim() && <figure className="case-detail-testimonial"><Quote size={28} aria-hidden="true" /><blockquote><p>{item.testimonial}</p></blockquote>{item.testimonialBy && <figcaption>{item.testimonialBy}</figcaption>}</figure>}
        {/* <Link className="case-detail-back case-detail-back--bottom" href="/case-study"><ArrowLeft size={16} aria-hidden="true" /> Explore more case studies</Link> */}
      </article>
    </div>
    <CtaBanner />
  </main>;
}
