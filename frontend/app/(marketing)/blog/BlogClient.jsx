'use client';

import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, ChevronLeft, ChevronRight, Clock, Eye, Heart, Lightbulb, Search, ShieldCheck, Tag, TrendingUp, User, X } from 'lucide-react';
import CtaBanner from '@/components/shared/CtaBanner';
import { viewsOf, likesOf, postSlug } from '@/data/seedStats';
import { posts as postsApi } from '@/services/api';
import './Blog.css';

const PAGE_SIZE = 6;
const BLOG_FAQS = [
  ['What topics does the Proowrx blog cover?', 'We publish practical guidance about mortgage processing, accounting outsourcing, virtual assistance, back-office operations, data security and sustainable business growth for Australian firms.'],
  ['Who are these insights written for?', 'Our articles are created for Australian mortgage brokers, accounting practices, financial-services teams and business owners exploring reliable offshore or outsourced support.'],
  ['How can outsourcing help a mortgage brokerage?', 'A well-structured outsourcing model can increase processing capacity, improve turnaround consistency and give brokers more time for clients, compliance and business development.'],
  ['How often is the blog updated?', 'New articles are published as our specialists identify useful operational lessons, regulatory considerations and practical opportunities for mortgage and accounting businesses.'],
];

function fmtNum(value) {
  if (value >= 1000) return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(value || 0);
}

function formatPostedTime(value, referenceTime) {
  const postedAt = new Date(value);
  if (Number.isNaN(postedAt.getTime())) return '';
  const elapsed = Math.max(0, referenceTime - postedAt.getTime());
  const hours = Math.floor(elapsed / 3600000);
  if (elapsed < 60000) return 'Just now';
  if (hours < 1) {
    const minutes = Math.max(1, Math.floor(elapsed / 60000));
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  return postedAt.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

function searchableText(post) {
  return [
    post.title, post.author, post.excerpt, post.description, post.summary,
    post.category, ...(post.tags || []), post.authorProfile?.name,
    post.authorProfile?.title, post.authorProfile?.bio,
  ].filter(Boolean).join(' ').toLocaleLowerCase();
}

function PostCard({ post, referenceTime, index }) {
  return (
    <article className="blog-card blog-card-enter" style={{ '--blog-card-index': index % PAGE_SIZE }}>
      <Link href={`/blog/${postSlug(post)}`} className="blog-card-img" aria-label={`Read ${post.title}`}>
        {post.image ? <Image src={post.image} alt={post.title} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" /> : <div className="blog-image-placeholder" />}
        <span className="blog-cat blog-cat--overlay" style={{ background: post.categoryGlow, color: post.categoryColor }}><Tag size={11} /> {post.category}</span>
      </Link>
      <div className="blog-card-body">
        <div className="blog-card-details">
          <span className="blog-time"><Clock size={12} /> {formatPostedTime(post.createdAt, referenceTime)}</span>
          {post.author && <span className="blog-author"><User size={12} /> {post.author}</span>}
        </div>
        <h3 className="blog-card-title"><Link href={`/blog/${postSlug(post)}`}>{post.title}</Link></h3>
        <p className="blog-card-excerpt">{post.excerpt}</p>
        {!!post.tags?.length && <div className="blog-tags">{post.tags.slice(0, 3).map(tag => <span key={tag} className="blog-tag">{tag}</span>)}</div>}
        <Link href={`/blog/${postSlug(post)}`} className="blog-card-link">Read Article <ArrowRight size={14} /></Link>
      </div>
    </article>
  );
}

function LatestPostCard({ post, large = false }) {
  return (
    <article className={`blog-latest-card${large ? ' blog-latest-card--large' : ''}`}>
      <Link href={`/blog/${postSlug(post)}`} className="blog-latest-media" aria-label={`Read ${post.title}`}>
        {post.image ? <Image src={post.image} alt={post.title} fill sizes={large ? '(max-width: 760px) 100vw, 58vw' : '(max-width: 760px) 100vw, 34vw'} /> : <div className="blog-image-placeholder" />}
      </Link>
      <div className="blog-latest-copy">
        <div className="blog-latest-meta"><span>{post.author || 'Proowrx Team'}</span><span>•</span><span>{post.date}</span></div>
        <h3><Link href={`/blog/${postSlug(post)}`}>{post.title}</Link></h3>
        <p>{post.excerpt}</p>
        {!!post.tags?.length && <div className="blog-tags">{post.tags.slice(0, 3).map(tag => <span key={tag} className="blog-tag">{tag}</span>)}</div>}
      </div>
      <Link href={`/blog/${postSlug(post)}`} className="blog-latest-arrow" aria-label={`Open ${post.title}`}><ArrowRight size={18} /></Link>
    </article>
  );
}

export default function BlogClient({ allPosts: initialPosts, generatedAt }) {
  const [allPosts, setAllPosts] = useState(initialPosts || []);
  const [activeSlide, setActiveSlide] = useState(0);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [referenceTime, setReferenceTime] = useState(generatedAt);
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase());

  const featured = useMemo(() => allPosts.filter(post => post.featured).slice(0, 6), [allPosts]);
  const latestPosts = useMemo(() => allPosts.filter(post => !post.featured).slice(0, 3), [allPosts]);
  const categories = useMemo(() => ['All', ...new Set(allPosts.map(post => post.category).filter(Boolean))], [allPosts]);
  const filteredPosts = useMemo(() => allPosts.filter(post => {
    const matchesCategory = category === 'All' || post.category === category;
    const matchesSearch = !deferredQuery || searchableText(post).includes(deferredQuery);
    return matchesCategory && matchesSearch;
  }), [allPosts, category, deferredQuery]);
  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const displayedSlide = featured.length ? activeSlide % featured.length : 0;
  const currentFeatured = featured[displayedSlide];

  useEffect(() => {
    postsApi.getAll().then(freshPosts => {
      if (Array.isArray(freshPosts)) setAllPosts(freshPosts);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (window.location.hash === '#blog-library') {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }
  }, []);
  useEffect(() => {
    const timer = window.setInterval(() => setReferenceTime(Date.now()), 60000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    if (featured.length < 2) return undefined;
    const timer = window.setInterval(() => setActiveSlide(index => (index + 1) % featured.length), 6500);
    return () => window.clearInterval(timer);
  }, [featured.length]);
  useEffect(() => {
    if (featured.length < 2) return;
    const nextImage = featured[(activeSlide + 1) % featured.length]?.image;
    if (nextImage) {
      const preload = new window.Image();
      preload.src = nextImage;
    }
  }, [activeSlide, featured]);

  function moveSlide(direction) {
    setActiveSlide(index => (index + direction + featured.length) % featured.length);
  }

  return (
    <div className="blog-page">
      {currentFeatured ? (
        <section className="blog-featured-hero" aria-label="Featured blog posts">
          <div className="blog-featured-heading"><div><strong>Featured insights</strong></div><span>{String(displayedSlide + 1).padStart(2, '0')} / {String(featured.length).padStart(2, '0')}</span></div>
            <article className="blog-featured-slider">
              <div className="blog-featured-media">
                {currentFeatured.image ? <Image key={currentFeatured.image} src={currentFeatured.image} alt={currentFeatured.title} fill priority fetchPriority="high" sizes="(max-width: 900px) 100vw, 56vw" /> : <div className="blog-image-placeholder" />}
                <div className="blog-featured-shade" />
                <span className="blog-featured-number">{String(displayedSlide + 1).padStart(2, '0')}</span>
              </div>
              <div className="blog-featured-content">
                <div className="blog-meta"><span className="blog-cat" style={{ background: currentFeatured.categoryGlow, color: currentFeatured.categoryColor }}><Tag size={11} /> {currentFeatured.category}</span><span className="blog-date"><Calendar size={12} /> {currentFeatured.date}</span></div>
                <h2>{currentFeatured.title}</h2><p>{currentFeatured.excerpt}</p>
                <div className="blog-author-row">{currentFeatured.author && <span className="blog-author"><User size={12} /> {currentFeatured.author}</span>}<span className="blog-stat"><Eye size={12} /> {fmtNum(viewsOf(currentFeatured))}</span><span className="blog-stat"><Heart size={12} /> {fmtNum(likesOf(currentFeatured))}</span></div>
                <Link href={`/blog/${postSlug(currentFeatured)}`} className="btn btn-gold">Read Featured Article <ArrowRight size={15} /></Link>
                <div className="blog-slider-controls">
                  <button onClick={() => moveSlide(-1)} aria-label="Previous featured post"><ChevronLeft size={19} /></button>
                  <div>{featured.map((post, index) => <button key={postSlug(post)} className={index === displayedSlide ? 'active' : ''} onClick={() => setActiveSlide(index)} aria-label={`Show featured post ${index + 1}`} />)}</div>
                  <button onClick={() => moveSlide(1)} aria-label="Next featured post"><ChevronRight size={19} /></button>
                </div>
              </div>
            </article>
        </section>
      ) : <section className="blog-featured-empty"><div><span className="blog-kicker">Editor&apos;s selection</span><h1>Featured insights coming soon.</h1><p>Mark posts as Featured in the dashboard to display them here.</p></div></section>}

      {latestPosts.length > 0 && <section className="blog-latest-section">
        <div className="container">
          <div className="blog-latest-heading"><div><span className="blog-kicker">Fresh from our team</span><h2>Latest blogs</h2></div><button type="button" onClick={() => document.getElementById('blog-library')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Explore all articles <ArrowRight size={14} /></button></div>
          <div className="blog-latest-layout">
            <div className="blog-latest-row">
              {latestPosts[0] && <LatestPostCard post={latestPosts[0]} large />}
              <div className="blog-latest-stack">{latestPosts.slice(1, 3).map(post => <LatestPostCard key={postSlug(post)} post={post} />)}</div>
            </div>
          </div>
        </div>
      </section>}

      {!!allPosts.length && <section className="blog-value-section">
        <div className="container">
          <div className="blog-value-intro"><span className="blog-kicker">Built for practical growth</span><h2>Insights you can apply, not just admire.</h2><p>Each article turns industry experience into clear ideas for stronger operations, safer processes and sustainable business growth.</p></div>
          <div className="blog-value-grid">
            <article><span><TrendingUp size={20} /></span><h3>Grow efficiently</h3><p>Discover practical ways to improve capacity, turnaround times and client experience.</p></article>
            <article><span><Lightbulb size={20} /></span><h3>Work smarter</h3><p>Explore workflows, outsourcing strategies and ideas your team can use immediately.</p></article>
            <article><span><ShieldCheck size={20} /></span><h3>Operate confidently</h3><p>Stay informed about data security, compliance and dependable back-office operations.</p></article>
          </div>
        </div>
      </section>}

      {!!allPosts.length && <section className="blog-library-section" id="blog-library">
        <div className="container">
          <div className="blog-library-heading"><span className="blog-kicker">Explore the library</span><h2>Find your next useful read</h2><p>Search by article, writer, summary or tag.</p></div>
          <div className="blog-search-wrap"><Search size={20} /><input value={query} onChange={event => { setQuery(event.target.value); setVisibleCount(PAGE_SIZE); }} placeholder="Search articles, authors, topics or tags..." aria-label="Search blog posts" />{query && <button onClick={() => { setQuery(''); setVisibleCount(PAGE_SIZE); }} aria-label="Clear search"><X size={17} /></button>}</div>
          <div className="blog-category-tabs" role="tablist" aria-label="Blog categories">{categories.map(item => <button key={item} role="tab" aria-selected={category === item} className={category === item ? 'active' : ''} onClick={() => { setCategory(item); setVisibleCount(PAGE_SIZE); }}>{item}<span>{item === 'All' ? allPosts.length : allPosts.filter(post => post.category === item).length}</span></button>)}</div>
          <div className="blog-results-row">{(query || category !== 'All') && <button onClick={() => { setQuery(''); setCategory('All'); }}><ArrowLeft size={13} /> Reset filters</button>}</div>
          {visiblePosts.length ? <div className="blog-grid">{visiblePosts.map((post, index) => <PostCard key={postSlug(post)} post={post} referenceTime={referenceTime} index={index} />)}</div> : <div className="blog-empty-search"><Search size={28} /><h3>No matching articles</h3><p>Try another keyword or category.</p></div>}
          {visibleCount < filteredPosts.length && <div className="blog-load-more"><button className="btn btn-outline" onClick={() => setVisibleCount(count => count + PAGE_SIZE)}>Load 6 More Articles <ArrowRight size={15} /></button></div>}
        </div>
      </section>}

      {/* <section className="blog-topic-hubs">
        <div className="container">
          <div className="blog-topic-heading"><span className="blog-kicker">Explore our expertise</span><h2>Guidance for every stage of operational growth</h2><p>Go beyond individual articles with practical resources connected to the services and challenges Australian financial professionals manage every day.</p></div>
          <div className="blog-topic-grid">
            <article><span>Mortgage Operations</span><h3>Mortgage processing and broker support</h3><p>Learn how experienced loan-processing support can strengthen capacity, improve file consistency and keep applications moving efficiently.</p><Link href="/mortgage">Explore mortgage services <ArrowRight size={14} /></Link></article>
            <article><span>Accounting Support</span><h3>Accounting and bookkeeping outsourcing</h3><p>Explore scalable support for bookkeeping, tax preparation, BAS, SMSF administration and everyday accounting workflows.</p><Link href="/accounting">Explore accounting services <ArrowRight size={14} /></Link></article>
            <article><span>Flexible Capacity</span><h3>Virtual assistants and pay-per-application</h3><p>Compare flexible resourcing models for recurring administration, client follow-ups and application-based mortgage processing.</p><Link href="/virtual-assistant">Explore virtual assistance <ArrowRight size={14} /></Link></article>
            <article><span>Secure Outsourcing</span><h3>Data security and operational confidence</h3><p>Understand the controls, access practices and secure working habits that support responsible outsourced operations.</p><Link href="/data-security">Explore data security <ArrowRight size={14} /></Link></article>
          </div>
        </div>
      </section> */}

      {/* <section className="blog-faq-section">
        <div className="container blog-faq-layout">
          <div className="blog-faq-intro"><span className="blog-kicker">Common questions</span><h2>About Proowrx insights</h2><p>Quick answers about our articles, expertise and the businesses these resources are designed to support.</p><Link href="/contact" className="btn btn-outline">Ask our team <ArrowRight size={14} /></Link></div>
          <div className="blog-faq-list">{BLOG_FAQS.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div>
        </div>
      </section> */}
      <CtaBanner />
    </div>
  );
}
