/**
 * URL slug for a tag. Tags are written with proper letters in the content
 * (e.g. "osmanlı-tarihi"); URLs and ?tag= use ASCII ("osmanli-tarihi").
 */
export function tagSlug(tag: string): string {
  return tag
    .toLocaleLowerCase('tr')
    .replace(/ı/g, 'i')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
