// Site-wide data. Every value here is sourced from research/profile-notes.md
// (Links, Browser pass, and Owner decisions → Approved values).

export const SITE_URL = 'https://emirhandkaya.github.io';

// profile-notes: Owner decisions — public contact email.
export const EMAIL = 'emirhandurmuskaya@gmail.com';

export type SocialId = 'github' | 'linkedin' | 'evrimagaci' | 'academia' | 'medium' | 'instagram' | 'orcid';

export const SOCIALS: { id: SocialId; url: string }[] = [
  // Links — GitHub (GH-USER)
  { id: 'github', url: 'https://github.com/emirhandkaya' },
  // Links — LinkedIn (listed on SITE)
  { id: 'linkedin', url: 'https://www.linkedin.com/in/emirhan-durmuskaya-973546239/' },
  // Browser pass — Evrim Ağacı @ufens
  { id: 'evrimagaci', url: 'https://evrimagaci.org/ufens' },
  // Browser pass — Academia "ufens"
  { id: 'academia', url: 'https://independent.academia.edu/ufens' },
  // Owner decisions — Approved values
  { id: 'medium', url: 'https://medium.com/@ufens' },
  { id: 'instagram', url: 'https://www.instagram.com/ufens30/' },
  { id: 'orcid', url: 'https://orcid.org/0000-0003-4183-3247' },
];

export const NAV = ['projects', 'blog', 'resume', 'about', 'contact'] as const;
