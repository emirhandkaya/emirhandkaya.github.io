import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n';
import { plainText } from './readingTime';

export type Post = CollectionEntry<'blog'>;

/** 'tr/my-post' → 'my-post' */
export function slugOf(entry: { id: string }): string {
  return entry.id.split('/').slice(1).join('/');
}

/** Published posts in a language, newest first. */
export async function getPosts(lang: Lang): Promise<Post[]> {
  const posts = await getCollection('blog', (p) => p.data.lang === lang && !p.data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** All tags used in a language, alphabetical. */
export function tagsOf(posts: Post[], lang: Lang): string[] {
  return [...new Set(posts.flatMap((p) => p.data.tags))].sort((a, b) => a.localeCompare(b, lang));
}

/** Frontmatter description, or the first ≤160 characters of the body, cut at a word. */
export function describe(post: Post, max = 160): string {
  if (post.data.description) return post.data.description;
  const text = plainText(post.body ?? '');
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,.;:!?]+$/, '')}…`;
}

export type SourceKey = 'evrimagaci' | 'academia' | 'blogger' | 'wordpress' | 'medium' | 'web';

/** Which i18n `sources.*` name to show for an original/mirror URL. */
export function sourceKey(url: string): SourceKey {
  const host = new URL(url).hostname;
  if (host.endsWith('evrimagaci.org')) return 'evrimagaci';
  if (host.endsWith('academia.edu')) return 'academia';
  if (host.endsWith('blogspot.com')) return 'blogger';
  if (host.endsWith('wordpress.com')) return 'wordpress';
  if (host.endsWith('medium.com')) return 'medium';
  return 'web';
}
