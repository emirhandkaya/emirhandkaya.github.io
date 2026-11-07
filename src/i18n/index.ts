import tr from './tr.json';
import en from './en.json';

export const LANGS = ['tr', 'en'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'tr';

/** Locale tags for Intl, Open Graph and the sitemap. */
export const LOCALES: Record<Lang, { bcp47: string; og: string }> = {
  tr: { bcp47: 'tr-TR', og: 'tr_TR' },
  en: { bcp47: 'en-US', og: 'en_US' },
};

type Dict = { [key: string]: string | Dict };
const dicts: Record<Lang, Dict> = { tr, en };

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (LANGS as readonly string[]).includes(value);
}

/**
 * Look up a UI string by dotted key, e.g. t('tr', 'nav.blog').
 * Throws (and so fails the build) when the key is missing or not a string.
 * `{name}` placeholders are replaced from `vars`.
 */
export function t(lang: Lang, key: string, vars: Record<string, string | number> = {}): string {
  let node: string | Dict | undefined = dicts[lang];
  for (const part of key.split('.')) {
    node = typeof node === 'object' ? node[part] : undefined;
  }
  if (typeof node !== 'string') {
    throw new Error(`i18n: missing key "${key}" for "${lang}"`);
  }
  return node.replace(/\{(\w+)\}/g, (m, name: string) => (name in vars ? String(vars[name]) : m));
}

export function otherLang(lang: Lang): Lang {
  return lang === 'tr' ? 'en' : 'tr';
}

/**
 * Build a site path for a locale. `path` is locale-less ('' for home, 'blog/x').
 * Always ends with a slash (trailingSlash: 'always').
 */
export function localizedPath(lang: Lang, path = ''): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return clean ? `/${lang}/${clean}/` : `/${lang}/`;
}

/** Strip the locale prefix from a pathname: '/tr/blog/x/' → 'blog/x/'. */
export function stripLang(pathname: string): string {
  return pathname.replace(/^\/(tr|en)(\/|$)/, '').replace(/^\/+/, '');
}

export function formatDate(lang: Lang, date: Date): string {
  return new Intl.DateTimeFormat(lang, { dateStyle: 'long', timeZone: 'UTC' }).format(date);
}
