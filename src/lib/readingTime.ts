// Reading time = words / 200 wpm, rounded up, minimum 1 (spec.md §3).
export const WPM = 200;

/** Reduce Markdown/MDX source to plain text. */
export function plainText(markdown: string): string {
  return markdown
    .replace(/<!--[\s\S]*?-->/g, ' ') // HTML comments (image placeholders)
    .replace(/```[\s\S]*?```/g, ' ') // fenced code
    .replace(/^\s*(import|export)\s.*$/gm, ' ') // MDX ESM
    .replace(/<[^>]+>/g, ' ') // HTML / JSX tags
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1') // images → alt
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links → text
    .replace(/[#>*_`~|-]+/g, ' ') // Markdown punctuation
    .replace(/\s+/g, ' ')
    .trim();
}

export function wordCount(markdown: string): number {
  const text = plainText(markdown);
  return text ? text.split(' ').length : 0;
}

export function readingTime(markdown: string): number {
  return Math.max(1, Math.ceil(wordCount(markdown) / WPM));
}
