'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Calendar, Tag, User, Eye, Heart } from 'lucide-react';
import CtaBanner from '../../../components/CtaBanner';
import { viewsOf, likesOf, postSlug } from '../../../data/seedStats';
import './Blog.css';

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function fmtNum(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

export default function BlogClient({ allPosts }) {
  const r1 = useReveal(), r2 = useReveal();

  const featured = allPosts.find(p => p.featured) || allPosts[0];
  const rest = allPosts.filter(p => p !== featured);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="page-hero page-hero--img blog-hero"
        style={{ '--hero-bg': 'url("https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1800&q=85")' }}
      >
        <div className="page-hero-orb-1" />
        <div className="page-hero-orb-2" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="chip chip-gold" style={{ marginBottom: 20 }}>Insights & Resources</span>
          <h1>Proowrx Blog</h1>
          <p>Industry insights, outsourcing guides, and practical tips for Australian mortgage brokers and accountants.</p>
        </div>
      </section>

      {!featured ? (
        <section className="section">
          <div className="container" style={{ textAlign: 'center', padding: '40px 0' }}>
            <p className="section-body" style={{ margin: '0 auto' }}>
              No articles published yet — check back soon.
            </p>
          </div>
        </section>
      ) : (
        <>
      {/* ── Featured Post ── */}
      <section className="section">
        <div className="container">
          <div ref={r1} className="reveal" style={{ marginBottom: 16 }}>
            <span className="chip chip-gold section-eyebrow">Featured Article</span>
          </div>
          <div className="blog-featured reveal reveal-delay-1">
            <div className="blog-featured-img">
              {featured.image && <img src={featured.image} alt={featured.title} loading="lazy" decoding="async" />}
              <div className="blog-featured-img-overlay" />
            </div>
            <div className="blog-featured-body">
              <div className="blog-meta">
                <span className="blog-cat" style={{ background: featured.categoryGlow, color: featured.categoryColor }}>
                  <Tag size={11} /> {featured.category}
                </span>
                <span className="blog-date"><Calendar size={12} /> {featured.date}</span>
                <span className="blog-time"><Clock size={12} /> {featured.readTime}</span>
              </div>
              {featured.author && (
                <div className="blog-author-row">
                  <span className="blog-author"><User size={12} /> {featured.author}</span>
                  <span className="blog-stat"><Eye size={12} /> {fmtNum(viewsOf(featured))}</span>
                  <span className="blog-stat"><Heart size={12} /> {fmtNum(likesOf(featured))}</span>
                </div>
              )}
              <h2 className="blog-featured-title">{featured.title}</h2>
              <p className="blog-featured-excerpt">{featured.excerpt}</p>
              <div className="blog-tags">
                {(featured.tags || []).map(t => <span key={t} className="blog-tag">{t}</span>)}
              </div>
              <Link href={`/blog/${postSlug(featured)}`} className="btn btn-gold blog-read-btn">
                Read Article <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Post Grid ── */}
      {rest.length > 0 && (
        <section className="section" style={{ background: 'var(--surface)', paddingTop: 0 }}>
          <div className="container">
            <div ref={r2} className="reveal" style={{ marginBottom: 48 }}>
              <span className="chip chip-sky section-eyebrow">Latest Articles</span>
              <h2 className="section-title" style={{ marginTop: 12 }}>More from the Blog</h2>
            </div>
            <div className="blog-grid">
              {rest.map((post, i) => (
                <article key={postSlug(post)} className={`blog-card reveal reveal-delay-${(i % 3) + 1}`}>
                  <div className="blog-card-img">
                    {post.image && <img src={post.image} alt={post.title} loading="lazy" decoding="async" />}
                    <span className="blog-cat blog-cat--overlay" style={{ background: post.categoryGlow, color: post.categoryColor }}>
                      <Tag size={11} /> {post.category}
                    </span>
                  </div>
                  <div className="blog-card-body">
                    <div className="blog-meta">
                      <span className="blog-date"><Calendar size={12} /> {post.date}</span>
                      <span className="blog-time"><Clock size={12} /> {post.readTime}</span>
                    </div>
                    {post.author && (
                      <div className="blog-author-row">
                        <span className="blog-author"><User size={12} /> {post.author}</span>
                        <span className="blog-stat"><Eye size={12} /> {fmtNum(viewsOf(post))}</span>
                        <span className="blog-stat"><Heart size={12} /> {fmtNum(likesOf(post))}</span>
                      </div>
                    )}
                    <h3 className="blog-card-title">{post.title}</h3>
                    <p className="blog-card-excerpt">{post.excerpt}</p>
                    <div className="blog-tags">
                      {(post.tags || []).map(t => <span key={t} className="blog-tag">{t}</span>)}
                    </div>
                    <Link href={`/blog/${postSlug(post)}`} className="blog-card-link">
                      Read Article <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
        </>
      )}

      <CtaBanner />
    </div>
  );
}
