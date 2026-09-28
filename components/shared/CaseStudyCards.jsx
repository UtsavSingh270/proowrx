import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import './PageInsights.css';

export default function CaseStudyCards({ items }) {
  return <div className="page-insights-grid case-study-cards">{items.map(item => <article key={item._id} className="page-insight-card case-study-card">
    <Link href={`/case-study/${item.slug}`} className="page-insight-image" aria-label={item.title}>{item.image ? <Image src={item.image} alt="" fill sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw" /> : <span>PROOWRX<br />CASE STUDY</span>}</Link>
    <div className="page-insight-copy"><small>{item.industry || item.service || 'Case study'}</small><h3><Link href={`/case-study/${item.slug}`}>{item.title}</Link></h3><p>{item.summary}</p><Link className="case-study-explore" href={`/case-study/${item.slug}`}>Explore the project <ArrowRight size={15} aria-hidden="true" /></Link></div>
  </article>)}</div>;
}
