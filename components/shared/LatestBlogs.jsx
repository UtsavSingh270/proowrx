import Link from 'next/link';
import { serverPosts } from '@/lib/serverApi';
import BlogPostCard from './BlogPostCard';
import './PageInsights.css';
import '@/app/(marketing)/blog/Blog.css';

export default async function LatestBlogs() {
  const posts = await serverPosts.getLatest(3);
  // Keep every card on this server render relative to the same request time.
  // eslint-disable-next-line react-hooks/purity
  const generatedAt = Date.now();

  return (
    <section className="page-insights" aria-labelledby="home-insights-title">
      <div className="container">
        <div className="page-insights-heading">
          <div>
            <span className="pill">From our team</span>
            <h2 id="home-insights-title">Insights</h2>
            <p>Our latest practical ideas and guidance for Australian businesses.</p>
          </div>
          <Link href="/blog">Explore all insights →</Link>
        </div>
        <div className="blog-grid">
          {posts.map((post, index) => <BlogPostCard post={post} referenceTime={generatedAt} index={index} key={post._id} />)}
        </div>
        {!posts.length && <p className="page-insights-empty">Our latest insights will appear here as soon as they are published.</p>}
      </div>
    </section>
  );
}
