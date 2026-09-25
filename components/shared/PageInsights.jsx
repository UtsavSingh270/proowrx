import Link from 'next/link';
import { serverPosts, serverCaseStudies } from '@/lib/serverApi';
import CaseStudyCards from './CaseStudyCards';
import './PageInsights.css';

export default async function PageInsights({ path }) {
  const [posts, cases] = await Promise.all([serverPosts.getForPage(path), serverCaseStudies.getForPage(path)]);
  return <>{posts.length > 0 && <section className="page-insights" aria-labelledby="page-insights-title">
    <div className="container">
      <div className="page-insights-heading"><div><span className="pill">From our team</span><h2 id="page-insights-title">Insights for your next move</h2><p>Practical ideas and guidance from the Proowrx team.</p></div><Link href="/blog">Explore all insights →</Link></div>
      <div className="page-insights-grid">{posts.map(post => <article className="page-insight-card" key={post._id}>
        <Link href={`/blog/${post.slug || post._id}`} className="page-insight-image" aria-label={`Read ${post.title}`}>{post.image ? <img src={post.image} alt="" loading="lazy" /> : <span>PROOWRX<br />INSIGHTS</span>}</Link>
        <div className="page-insight-copy"><small>{post.category}{post.readTime ? ` · ${post.readTime}` : ''}</small><h3><Link href={`/blog/${post.slug || post._id}`}>{post.title}</Link></h3><p>{post.excerpt}</p><Link href={`/blog/${post.slug || post._id}`}>Read insight →</Link></div>
      </article>)}</div>
    </div>
  </section>}{cases.length > 0 && <section className="page-insights" aria-labelledby="page-cases-title"><div className="container"><div className="page-insights-heading"><div><span className="pill">Client stories</span><h2 id="page-cases-title">Our work in practice</h2><p>Explore the projects behind the results.</p></div><Link href="/case-study">All case studies →</Link></div><CaseStudyCards items={cases} /></div></section>}</>;
}
