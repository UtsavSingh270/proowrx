'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Clock, LoaderCircle, Tag, User } from 'lucide-react';
import { FaLinkedinIn } from 'react-icons/fa';
import CtaBanner from '@/components/shared/CtaBanner';
import { posts as postsApi } from '@/services/api';
import { postSlug } from '@/data/seedStats';
import '../../Blog.css';
import './AuthorBlog.css';

const PAGE_SIZE = 6;

function formatPostedTime(value) {
  const postedAt = new Date(value);
  if (Number.isNaN(postedAt.getTime())) return '';
  const elapsed = Math.max(0, Date.now() - postedAt.getTime());
  const hours = Math.floor(elapsed / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  return postedAt.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

function AuthorPostCard({ post }) {
  return (
    <article className="blog-card author-blog-card">
      <Link href={`/blog/${postSlug(post)}`} className="blog-card-img" aria-label={`Read ${post.title}`}>
        {post.image ? <Image src={post.image} alt={post.title} fill sizes="(max-width: 760px) 100vw, 33vw" /> : <div className="blog-image-placeholder" />}
        <span className="blog-cat blog-cat--overlay" style={{ background: post.categoryGlow, color: post.categoryColor }}><Tag size={11} /> {post.category}</span>
      </Link>
      <div className="blog-card-body">
        <div className="blog-card-details"><span className="blog-time"><Clock size={12} /> {formatPostedTime(post.createdAt)}</span><span className="blog-author"><User size={12} /> {post.author}</span></div>
        <h2 className="blog-card-title"><Link href={`/blog/${postSlug(post)}`}>{post.title}</Link></h2>
        <p className="blog-card-excerpt">{post.excerpt}</p>
        <Link href={`/blog/${postSlug(post)}`} className="blog-card-link">Read Article <ArrowRight size={14} /></Link>
      </div>
    </article>
  );
}

export default function AuthorBlogClient({ authorId, initialData }) {
  const [articles, setArticles] = useState(initialData.posts || []);
  const [page, setPage] = useState(initialData.pagination?.page || 1);
  const [hasMore, setHasMore] = useState(!!initialData.pagination?.hasMore);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef(null);
  const author = initialData.author;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const data = await postsApi.getByAuthor(authorId, nextPage, PAGE_SIZE);
      setArticles(current => [...current, ...(data.posts || [])]);
      setPage(nextPage);
      setHasMore(!!data.pagination?.hasMore);
    } finally {
      setLoading(false);
    }
  }, [authorId, hasMore, loading, page]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return undefined;
    const observer = new IntersectionObserver(entries => {
      if (entries[0]?.isIntersecting) loadMore();
    }, { rootMargin: '160px 0px' });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <main className="author-page">
      <section className="author-profile-hero">
        <div className="container">
          <Link href="/blog" className="author-back-link"><ArrowLeft size={15} /> Back to Blog</Link>
          <div className="author-profile-layout">
            <div className="author-profile-image">
              {author.image ? <Image src={author.image} alt={author.name} fill sizes="210px" priority /> : <span>{author.name?.charAt(0)}</span>}
            </div>
            <div className="author-profile-copy">
              <span className="blog-kicker">Proowrx Author</span>
              <h1>{author.name}</h1>
              <p className="author-role">{author.position}</p>
              <p className="author-bio">{author.summary || author.description || 'Explore practical insights and industry guidance from our Proowrx team.'}</p>
              {author.socialMedia?.linkedin && <a href={author.socialMedia.linkedin} target="_blank" rel="noreferrer" className="author-social-link"><FaLinkedinIn size={16} /> LinkedIn profile</a>}
            </div>
          </div>
        </div>
      </section>

      <section className="author-articles-section">
        <div className="container">
          <div className="author-articles-heading"><div><span className="blog-kicker">Written by {author.name}</span><h2>Latest articles and insights</h2></div><span>{initialData.pagination?.total || 0} articles</span></div>
          {articles.length > 0 ? <div className="blog-grid">{articles.map(post => <AuthorPostCard key={post._id || postSlug(post)} post={post} />)}</div> : <div className="blog-empty">No published articles from this author yet.</div>}
          <div ref={sentinelRef} className="author-load-more">
            {hasMore && <button type="button" className="btn btn-outline" onClick={loadMore} disabled={loading}>{loading ? <><LoaderCircle className="author-spinner" size={16} /> Loading...</> : <>Load 6 More Articles <ArrowRight size={15} /></>}</button>}
            <span>Showing {articles.length} of {initialData.pagination?.total || articles.length}</span>
          </div>
        </div>
      </section>

      <CtaBanner />
    </main>
  );
}
