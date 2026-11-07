import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { LANGS, LOCALES, localizedPath, t, type Lang } from '../../i18n';
import { describe, getPosts, slugOf } from '../../lib/posts';

export function getStaticPaths() {
  return LANGS.map((lang) => ({ params: { lang } }));
}

export const GET: APIRoute = async ({ params, site }) => {
  const lang = params.lang as Lang;
  const posts = await getPosts(lang);
  return rss({
    title: t(lang, 'rss.title'),
    description: t(lang, 'rss.description'),
    site: new URL(localizedPath(lang), site ?? 'https://emirhandkaya.github.io').href,
    trailingSlash: true,
    customData: `<language>${LOCALES[lang].bcp47.toLowerCase()}</language>`,
    items: posts.map((post) => ({
      title: post.data.title,
      description: describe(post),
      pubDate: post.data.date,
      link: localizedPath(lang, `blog/${slugOf(post)}`),
      categories: post.data.tags,
    })),
  });
};
