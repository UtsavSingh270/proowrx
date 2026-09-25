import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, Tag, User } from 'lucide-react';
import { postSlug } from '@/data/seedStats';

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

export default function BlogPostCard({ post, referenceTime, index = 0 }) {
  const href = `/blog/${postSlug(post)}`;
  const effectiveReferenceTime = Number.isFinite(referenceTime)
    ? referenceTime
    : new Date(post.createdAt).getTime();
  return (
    <article className="blog-card blog-card-enter" style={{ '--blog-card-index': index % 6 }}>
      <Link href={href} className="blog-card-img" aria-label={`Read ${post.title}`}>
        {post.image ? <Image src={post.image} alt={post.title} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" /> : <div className="blog-image-placeholder" />}
        <span className="blog-cat blog-cat--overlay" style={{ background: post.categoryGlow, color: post.categoryColor }}><Tag size={11} /> {post.category}</span>
      </Link>
      <div className="blog-card-body">
        <div className="blog-card-details">
          <span className="blog-time"><Clock size={12} /> {formatPostedTime(post.createdAt, effectiveReferenceTime)}</span>
          {post.author && <span className="blog-author"><User size={12} /> {post.author}</span>}
        </div>
        <h3 className="blog-card-title"><Link href={href}>{post.title}</Link></h3>
        <p className="blog-card-excerpt">{post.excerpt}</p>
        {!!post.tags?.length && <div className="blog-tags">{post.tags.slice(0, 3).map(tag => <span key={tag} className="blog-tag">{tag}</span>)}</div>}
        <Link href={href} className="blog-card-link">Read Article <ArrowRight size={14} /></Link>
      </div>
    </article>
  );
}
