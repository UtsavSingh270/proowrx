/* Small helpers for rendering post stats/URLs — all posts are DB-backed,
   these just guard against undefined fields. */
export function viewsOf(post) {
  return post.views || 0;
}
export function likesOf(post) {
  return post.likes || 0;
}

/* Canonical URL path segment for a post. */
export function postSlug(post) {
  return post.slug || post.id;
}
