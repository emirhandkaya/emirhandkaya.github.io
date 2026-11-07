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
  const base = site ?? 'https://emirhandurmuskaya.com';
  const self = new URL(`${localizedPath(lang)}rss.xml`, base).href;
  return rss({
    title: t(lang, 'rss.title'),
    description: t(lang, 'rss.description'),
    site: new URL(localizedPath(lang), base).href,
    trailingSlash: true,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: `<language>${LOCALES[lang].bcp47.toLowerCase()}</language><atom:link href="${self}" rel="self" type="application/rss+xml"/>`,
    items: posts.map((post) => ({
      title: post.data.title,
      description: describe(post),
      pubDate: post.data.date,
      link: localizedPath(lang, `blog/${slugOf(post)}`),
      categories: post.data.tags,
    })),
  });
};
