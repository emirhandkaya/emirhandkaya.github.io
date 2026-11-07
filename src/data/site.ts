// Site-wide data. Every URL here is sourced from research/profile-notes.md.
// Instagram and ORCID values are added in M4 together with the profile-notes
// "Owner decisions" entry that records them (plan.md M4).

export const SITE_URL = 'https://emirhandkaya.github.io';

export type SocialId = 'github' | 'linkedin' | 'evrimagaci' | 'academia' | 'medium';

export const SOCIALS: { id: SocialId; url: string }[] = [
  // profile-notes: Links — GitHub (GH-USER)
  { id: 'github', url: 'https://github.com/emirhandkaya' },
  // profile-notes: Links — LinkedIn (listed on SITE)
  { id: 'linkedin', url: 'https://www.linkedin.com/in/emirhan-durmuskaya-973546239/' },
  // profile-notes: Browser pass — Evrim Ağacı @ufens
  { id: 'evrimagaci', url: 'https://evrimagaci.org/ufens' },
  // profile-notes: Browser pass — Academia "ufens"
  { id: 'academia', url: 'https://independent.academia.edu/ufens' },
  // profile-notes: Browser pass — Medium "ufens" (approved in Owner decisions)
  { id: 'medium', url: 'https://medium.com/@ufens' },
];

export const NAV = ['projects', 'blog', 'resume', 'about', 'contact'] as const;
