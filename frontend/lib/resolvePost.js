import { serverPosts } from './serverApi';

/* Resolves a /blog/[slug] route param to a DB-backed post — the backend
   accepts either the real slug or a legacy Mongo _id (old shared links). */
export async function resolvePost(slugParam) {
  const post = await serverPosts.getOne(slugParam).catch(() => null);
  return { post };
}
