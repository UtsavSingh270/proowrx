import { notFound } from 'next/navigation';
import { serverPosts } from '@/lib/serverApi';
import AuthorBlogClient from './AuthorBlogClient';

export const revalidate = 1800;

export async function generateMetadata({ params }) {
  const { authorId } = await params;
  const data = await serverPosts.getByAuthor(authorId, 1, 6);
  if (!data?.author) return {};

  const description = data.author.summary || data.author.description || `Read articles written by ${data.author.name}.`;
  return {
    title: `${data.author.name} — Author`,
    description,
    alternates: { canonical: `/blog/author/${authorId}` },
  };
}

export default async function AuthorPage({ params }) {
  const { authorId } = await params;
  const initialData = await serverPosts.getByAuthor(authorId, 1, 6);
  if (!initialData?.author) notFound();

  return <AuthorBlogClient authorId={authorId} initialData={initialData} />;
}
