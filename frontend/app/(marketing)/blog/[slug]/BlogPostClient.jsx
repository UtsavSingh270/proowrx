'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Tag, User, Eye, Heart, ChevronDown } from 'lucide-react';
import CtaBanner from '@/components/shared/CtaBanner';
import { posts as postsApi } from '@/services/api';
import { viewsOf, likesOf, postSlug } from '@/data/seedStats';
import '../Blog.css';
import './BlogPost.css';
import './InfoPages.css';

function fmtNum(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

function formatReadTime(value) {
  return String(value || '').replace(/\s*read\s*$/i, '').trim() || '1 min';
}

function formatCommentDate(value) {
  return new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
}

export default function BlogPostClient({ initialPost, allPosts, routeSlug }) {
  const [post, setPost]           = useState(initialPost);
  const [viewCount, setViewCount] = useState(() => viewsOf(initialPost));
  const [likeCount, setLikeCount] = useState(() => likesOf(initialPost));
  const [liked, setLiked]         = useState(false);
  const [openFaq, setOpenFaq]     = useState(0);
  const [comments, setComments]   = useState([]);
  const [commentForm, setCommentForm] = useState({ name: '', email: '', comment: '' });
  const [commentStatus, setCommentStatus] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Client-side view tracking + like-state hydration (device-specific, so
  // it can't be resolved during server rendering).
  useEffect(() => {
    const sessKey = `view_${routeSlug}`;
    const alreadyViewed = sessionStorage.getItem(sessKey);
    (alreadyViewed ? postsApi.getOne(routeSlug) : postsApi.getOneFull(routeSlug))
      .then(data => {
        if (!alreadyViewed) sessionStorage.setItem(sessKey, '1');
        setPost(current => ({ ...current, ...data }));
        setViewCount(data.views);
        setLikeCount(data.likes);
        setLiked(!!data.userLiked);
      })
      .catch(() => {});
  }, [routeSlug]);

  useEffect(() => {
    postsApi.getComments(routeSlug).then(setComments).catch(() => {});
  }, [routeSlug]);

  const relatedCandidates = allPosts.filter(candidate => postSlug(candidate) !== routeSlug);
  const relatedByCategory = relatedCandidates.filter(candidate => candidate.category === post.category);
  const featuredByAuthor = relatedCandidates.filter(candidate => candidate.author === post.author && candidate.featured && candidate.category !== post.category);
  const otherFeatured = relatedCandidates.filter(candidate => candidate.featured && candidate.category !== post.category && candidate.author !== post.author);
  const related = [
    ...relatedByCategory,
    ...featuredByAuthor,
    ...otherFeatured,
    ...relatedCandidates.filter(candidate => candidate.category !== post.category && !candidate.featured),
  ].slice(0, 3);

  async function handleLike() {
    const { liked: nowLiked, likes } = await postsApi.toggleLike(routeSlug);
    setLiked(nowLiked);
    setLikeCount(likes);
  }

  async function handleCommentSubmit(event) {
    event.preventDefault();
    setSubmittingComment(true);
    setCommentStatus('');
    try {
      const comment = await postsApi.addComment(routeSlug, commentForm);
      if (comment.ignored) {
        setCommentStatus(comment.message);
        return;
      }
      setComments(current => [comment, ...current]);
      setCommentForm({ name: '', email: '', comment: '' });
      setCommentStatus('Your comment has been published.');
    } catch (error) {
      setCommentStatus(error.message || 'Unable to publish your comment.');
    } finally {
      setSubmittingComment(false);
    }
  }

  return (
    <div className="post-page">

      {/* ── Hero ── */}
      <section className="post-hero">
        <div className="post-hero-img-wrap">
          {post.image && <img src={post.image} alt="" loading="eager" decoding="async" />}
          <div className="post-hero-overlay" />
        </div>
        <div className="container post-hero-content">
          <div className="post-hero-bottom">
            <div className="post-hero-author-row">
              {post.author && post.authorProfile && post.authorId && post.authorSource === 'team' ? (
                <Link href={`/blog/author/${post.authorId}`} className="post-hero-author">
                  <User size={13} /> {post.author}
                </Link>
              ) : (
                post.author && <span className="post-hero-author"><User size={13} /> {post.author}</span>
              )}
              <span className="post-hero-stat"><Eye size={13} /> {fmtNum(viewCount)} views</span>
              <span className="post-hero-stat"><Heart size={13} /> {fmtNum(likeCount)} likes</span>
              <span className="post-hero-stat"><Clock size={13} /> {formatReadTime(post.readTime)}</span>
            </div>
            <div className="blog-meta post-hero-meta">
              <span className="blog-cat" style={{ background: post.categoryGlow, color: post.categoryColor }}>
                <Tag size={11} /> {post.category}
              </span>
              <span className="blog-date"><Calendar size={12} /> {post.date}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="section post-section">
        <div className="container post-layout">

          {/* Article */}
          <div className="post-main-column">
            <article className="post-body">
              <p className="post-excerpt">{post.excerpt}</p>

              {post.htmlContent && (
                <div
                  className="post-html-content"
                  dangerouslySetInnerHTML={{ __html: post.htmlContent }}
                />
              )}

              <div className="post-footer">
                <div className="blog-tags">
                  {(post.tags || []).map(t => <span key={t} className="blog-tag">{t}</span>)}
                </div>
                <Link href="/blog" className="post-back-link post-back-link--bottom">
                  <ArrowLeft size={15} /> Back to Blog
                </Link>
              </div>
            </article>

            {post.faqs?.length > 0 && <section className="post-inline-faq">
              <div className="post-faq-section-heading"><span className="chip chip-gold">Helpful answers</span><h2>Frequently Asked Questions</h2><p>Clear answers to common questions related to this article.</p></div>
              <div className="post-faq-accordion">{post.faqs.slice(0, 5).map((faq, i) => (
                <div key={faq.question} className={`faq-item${openFaq === i ? ' open' : ''}`}>
                  <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                    <span><small>{String(i + 1).padStart(2, '0')}</small>{faq.question}</span>
                    <ChevronDown size={19} />
                  </button>
                  {openFaq === i && <p>{faq.answer}</p>}
                </div>
              ))}</div>
            </section>}

          </div>

          {/* Sidebar */}
          <aside className="post-sidebar">
            {related.length > 0 && <div className="post-sidebar-card post-sidebar-related">
              <div className="post-sidebar-related-heading"><span>Related insights</span><h4>You may also like</h4></div>
              <div className="post-related-list">{related.map(relatedPost => (
                <Link href={`/blog/${postSlug(relatedPost)}`} className="post-related-item" key={postSlug(relatedPost)}>
                  <span className="post-related-img">{relatedPost.image ? <img src={relatedPost.image} alt="" loading="lazy" decoding="async" /> : <span className="blog-image-placeholder" />}</span>
                  <span className="post-related-body">
                    <span className="blog-cat" style={{ background: relatedPost.categoryGlow, color: relatedPost.categoryColor }}>{relatedPost.category}</span>
                    <span className="post-related-title">{relatedPost.title}</span>
                    <span className="post-related-date"><Calendar size={11} /> {relatedPost.date}</span>
                  </span>
                </Link>
              ))}</div>
            </div>}
          </aside>

        </div>

        <div className="post-engagement-wrap">

          <section className="post-engagement" aria-labelledby="post-discussion-title">
            <div className="post-engagement-summary">
              <div><span>Article engagement</span><h2 id="post-discussion-title">Comments &amp; Discussion</h2><p>Share your perspective and continue the conversation with other readers.</p></div>
              <div className="post-engagement-actions">
                <span className="post-view-count"><Eye size={17} /> <strong>{fmtNum(viewCount)}</strong> views</span>
                <button type="button" className={`post-like-btn${liked ? ' post-like-btn--active' : ''}`} onClick={handleLike}>
                  <Heart size={17} fill={liked ? 'currentColor' : 'none'} />
                  <span>{liked ? 'Liked' : 'Like article'}</span>
                  <strong className="post-like-count">{fmtNum(likeCount)}</strong>
                </button>
              </div>
            </div>

            <div className="post-engagement-content">
              <form className="post-comment-form" onSubmit={handleCommentSubmit}>
                <div className="post-comment-fields">
                  <label>Name<input required maxLength={80} value={commentForm.name} onChange={event => setCommentForm(current => ({ ...current, name: event.target.value }))} placeholder="Your name" /></label>
                  <label>Email<input required type="email" maxLength={160} value={commentForm.email} onChange={event => setCommentForm(current => ({ ...current, email: event.target.value }))} placeholder="you@example.com" /></label>
                </div>
                <label>Comment<textarea required maxLength={1500} rows={4} value={commentForm.comment} onChange={event => setCommentForm(current => ({ ...current, comment: event.target.value }))} placeholder="Share your thoughts about this article" /></label>
                <div className="post-comment-submit"><small>Your email will never be displayed publicly.</small><button type="submit" className="post-comment-button" disabled={submittingComment}>{submittingComment ? 'Publishing…' : 'Publish Comment'}</button></div>
                {commentStatus && <p className="post-comment-status" role="status">{commentStatus}</p>}
              </form>

              <div className="post-comments">
                <h3>{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</h3>
                {comments.length === 0 ? <p className="post-comments-empty">Be the first to share your thoughts.</p> : comments.map(comment => (
                  <article className="post-comment" key={comment._id}>
                    <span className="post-comment-avatar">{comment.name.charAt(0).toUpperCase()}</span>
                    <div><header><strong>{comment.name}</strong><time>{formatCommentDate(comment.createdAt)}</time></header><p>{comment.comment}</p></div>
                  </article>
                ))}
              </div>
            </div>
          </section>

        </div>
      </section>

      <CtaBanner />

    </div>
  );
}
