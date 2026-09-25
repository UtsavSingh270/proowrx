import Link from 'next/link';
import './PageInsights.css';

export default function CaseStudyCards({ items }) {
  return <div className="page-insights-grid">{items.map(item => <article key={item._id} className="page-insight-card">
    <Link href={`/case-study/${item.slug}`} className="page-insight-image" aria-label={item.title}>{item.image ? <img src={item.image} alt="" loading="lazy" /> : <span>PROOWRX<br />CASE STUDY</span>}</Link>
    <div className="page-insight-copy"><small>{item.industry || item.service || 'Case study'}</small><h3><Link href={`/case-study/${item.slug}`}>{item.title}</Link></h3><p>{item.summary}</p><Link href={`/case-study/${item.slug}`}>Explore the project →</Link></div>
  </article>)}</div>;
}
