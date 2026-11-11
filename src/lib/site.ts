import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

// Prefix a site path with the deploy base: url('vault/') → /vault/
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function url(p = ''): string {
  const clean = p.replace(/^\//, '');
  return `${BASE}/${clean}`;
}

export const postSlug = (p: Post) => p.id;
export const postHref = (p: Post) => url(`logbook/${postSlug(p)}/`);

export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts');
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { year: 'numeric', month: 'short' });

export const readMinutes = (post: Post) =>
  Math.max(1, Math.round((post.body ?? '').replace(/<[^>]*>/g, ' ').split(/\s+/).length / 220));
