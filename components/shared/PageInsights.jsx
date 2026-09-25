import Link from 'next/link';
import Image from 'next/image';
import { serverPosts } from '@/lib/serverApi';
import PageCaseStudies from './PageCaseStudies';
import './PageInsights.css';

export default async function PageInsights({ path }) {
  const posts = await serverPosts.getForPage(path);
  return <>{posts.length > 0 && <section className="page-insights" aria-labelledby="page-insights-title">
    <div className="container">
      <div className="page-insights-heading"><div><span className="pill">From our team</span><h2 id="page-insights-title">Insights for your next move</h2><p>Practical ideas and guidance from the Proowrx team.</p></div><Link href="/blog">Explore all insights →</Link></div>
      <div className="page-insights-grid">{posts.map(post => <article className="page-insight-card" key={post._id}>
        <Link href={`/blog/${post.slug || post._id}`} className="page-insight-image" aria-label={`Read ${post.title}`}>{post.image ? <Image src={post.image} alt="" fill sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw" /> : <span>PROOWRX<br />INSIGHTS</span>}</Link>
        <div className="page-insight-copy"><small>{post.category}{post.readTime ? ` · ${post.readTime}` : ''}</small><h3><Link href={`/blog/${post.slug || post._id}`}>{post.title}</Link></h3><p>{post.excerpt}</p><Link href={`/blog/${post.slug || post._id}`}>Read insight →</Link></div>
      </article>)}</div>
    </div>
  </section>}<PageCaseStudies path={path} /></>;
}
