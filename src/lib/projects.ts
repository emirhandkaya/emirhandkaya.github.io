import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n';

export type Project = CollectionEntry<'projects'>;

/** Projects in a language, by `order`. */
export async function getProjects(lang: Lang): Promise<Project[]> {
  const projects = await getCollection('projects', (p) => p.data.lang === lang);
  return projects.sort((a, b) => a.data.order - b.data.order);
}

/** All project tags in a language, in first-seen order (follows `order`). */
export function projectTags(projects: Project[]): string[] {
  return [...new Set(projects.flatMap((p) => p.data.tags))];
}
