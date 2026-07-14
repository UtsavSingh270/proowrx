'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, Clock, Tag, User, Eye, Heart, Timer, ChevronDown } from 'lucide-react';
import CtaBanner from '../../../../components/CtaBanner';
import AuthorProfilePopup from '../../../../components/AuthorProfilePopup';
import { posts as postsApi } from '../../../../services/api';
import { viewsOf, likesOf, postSlug } from '../../../../data/seedStats';
import '../Blog.css';
import './BlogPost.css';
import './InfoPages.css';

function fmtNum(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

function fmtReadSecs(s) {
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export default function BlogPostClient({ initialPost, allPosts, routeSlug }) {
  const [post, setPost]           = useState(initialPost);
  const [viewCount, setViewCount] = useState(() => viewsOf(initialPost));
  const [likeCount, setLikeCount] = useState(() => likesOf(initialPost));
  const [liked, setLiked]         = useState(false);
  const [readSecs, setReadSecs]   = useState(0);
  const [openFaq, setOpenFaq]     = useState(0);
  const [showAuthor, setShowAuthor] = useState(false);
  const timerRef = useRef(null);

  // Client-side view tracking + like-state hydration (device-specific, so
  // it can't be resolved during server rendering).
  useEffect(() => {
    const sessKey = `view_${routeSlug}`;
    const alreadyViewed = sessionStorage.getItem(sessKey);
    (alreadyViewed ? postsApi.getOne(routeSlug) : postsApi.getOneFull(routeSlug))
      .then(data => {
        if (!alreadyViewed) sessionStorage.setItem(sessKey, '1');
        setPost(data);
        setViewCount(data.views);
        setLikeCount(data.likes);
        setLiked(!!data.userLiked);
      })
      .catch(() => {});
  }, [routeSlug]);

  useEffect(() => {
    timerRef.current = setInterval(() => setReadSecs(s => s + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const related = allPosts.filter(p => postSlug(p) !== routeSlug).slice(0, 3);

  async function handleLike() {
    const { liked: nowLiked, likes } = await postsApi.toggleLike(routeSlug);
    setLiked(nowLiked);
    setLikeCount(likes);
  }

  return (
    <div className="post-page">

      {/* ── Hero ── */}
      <section className="post-hero">
        <div className="post-hero-img-wrap">
          {post.image && <img src={post.image} alt={post.title} loading="eager" decoding="async" />}
          <div className="post-hero-overlay" />
        </div>
        <div className="container post-hero-content">
          <Link href="/blog" className="post-back-link">
            <ArrowLeft size={15} /> Back to Blog
          </Link>
          <div className="blog-meta post-hero-meta">
            <span className="blog-cat" style={{ background: post.categoryGlow, color: post.categoryColor }}>
              <Tag size={11} /> {post.category}
            </span>
            <span className="blog-date"><Calendar size={12} /> {post.date}</span>
            <span className="blog-time"><Clock size={12} /> {post.readTime}</span>
          </div>
          <h1 className="post-hero-title">{post.title}</h1>
          <div className="post-hero-author-row">
            {post.author && post.authorProfile ? (
              <button
                type="button"
                className="post-hero-author"
                onClick={() => setShowAuthor(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <User size={13} /> {post.author}
              </button>
            ) : (
              post.author && <span className="post-hero-author"><User size={13} /> {post.author}</span>
            )}
            <span className="post-hero-stat"><Eye size={13} /> {fmtNum(viewCount)} views</span>
            <span className="post-hero-stat"><Heart size={13} /> {fmtNum(likeCount)} likes</span>
            <span className="post-hero-stat post-reading-timer">
              <Timer size={13} />
              Reading for {fmtReadSecs(readSecs)}
            </span>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="section post-section">
        <div className="container post-layout">

          {/* Article */}
          <article className="post-body">
            <p className="post-excerpt">{post.excerpt}</p>

            {/* Rich HTML content from the dashboard editor */}
            {post.htmlContent && (
              <div
                className="post-html-content"
                dangerouslySetInnerHTML={{ __html: post.htmlContent }}
              />
            )}

            {/* FAQs */}
            {post.faqs?.length > 0 && (
              <div className="post-faqs">
                <h2 className="post-heading">Frequently Asked Questions</h2>
                <div className="faq-list">
                  {post.faqs.map((faq, i) => (
                    <div key={i} className={`faq-item${openFaq === i ? ' open' : ''}`}>
                      <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                        <span>{faq.question}</span>
                        <ChevronDown size={18} />
                      </button>
                      {openFaq === i && <p>{faq.answer}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Like button */}
            <div className="post-like-row">
              <button
                className={`post-like-btn${liked ? ' post-like-btn--active' : ''}`}
                onClick={handleLike}
              >
                <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
                {liked ? 'Liked' : 'Like this post'}
                <span className="post-like-count">{fmtNum(likeCount)}</span>
              </button>
            </div>

            <div className="post-footer">
              <div className="blog-tags">
                {(post.tags || []).map(t => <span key={t} className="blog-tag">{t}</span>)}
              </div>
              <Link href="/blog" className="post-back-link post-back-link--bottom">
                <ArrowLeft size={15} /> Back to Blog
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="post-sidebar">
            <div className="post-sidebar-card post-sidebar-cta">
              <span className="chip chip-gold" style={{ marginBottom: 14, fontSize: '0.65rem' }}>Free Consultation</span>
              <h4>Ready to get started?</h4>
              <p>Book a free 30-minute discovery call with our team and learn what&apos;s possible for your practice.</p>
              <a
                href="https://calendly.com/proowrx/30min"
                target="_blank"
                rel="noreferrer"
                className="btn btn-gold"
                style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
              >
                Book a Call <ArrowRight size={14} />
              </a>
            </div>

            {related.length > 0 && (
              <div className="post-sidebar-card post-sidebar-related">
                <h4>More Articles</h4>
                <div className="post-related-list">
                  {related.map(p => (
                    <Link key={postSlug(p)} href={`/blog/${postSlug(p)}`} className="post-related-item">
                      <div className="post-related-img">
                        {p.image && <img src={p.image} alt={p.title} loading="lazy" decoding="async" />}
                      </div>
                      <div className="post-related-body">
                        <span className="blog-cat" style={{ background: p.categoryGlow, color: p.categoryColor, fontSize: '0.64rem', padding: '2px 8px', marginBottom: 6, display: 'inline-flex' }}>
                          <Tag size={9} /> {p.category}
                        </span>
                        <span className="post-related-title">{p.title}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>

        </div>
      </section>

      <CtaBanner />

      {showAuthor && <AuthorProfilePopup author={post.authorProfile} onClose={() => setShowAuthor(false)} />}
    </div>
  );
}
