import { notFound, redirect } from 'next/navigation';
import BlogPostClient from './BlogPostClient';
import { resolvePost } from '@/lib/resolvePost';
import { serverPosts } from '@/lib/serverApi';

export async function generateStaticParams() {
  const dynamic = await serverPosts.getAll().catch(() => []);
  return (dynamic || []).map(p => ({ slug: p.slug || p.id }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { post } = await resolvePost(slug);
  if (!post) return {};

  const canonicalSlug = post.slug || post.id;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${canonicalSlug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `/blog/${canonicalSlug}`,
      images: post.image ? [{ url: post.image }] : undefined,
      publishedTime: post.createdAt,
      authors: post.author ? [post.author] : undefined,
    },
  };
}

export const revalidate = 1800;

export default async function Page({ params }) {
  const { slug } = await params;
  const { post } = await resolvePost(slug);
  if (!post) notFound();

  // Old shared links used the raw Mongo id — send them to the canonical slug URL.
  if (post.slug && post.slug !== slug) {
    redirect(`/blog/${post.slug}`);
  }

  const allPosts = await serverPosts.getAll().catch(() => []);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.image ? [post.image] : undefined,
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    author: post.author ? { '@type': 'Person', name: post.author } : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BlogPostClient initialPost={post} allPosts={allPosts || []} routeSlug={slug} />
    </>
  );
}
