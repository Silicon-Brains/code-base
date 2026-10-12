export type SiteSettings = {
  id: string;
  site_name: string;
  tagline: string | null;
  contact_email: string | null;
  phone: string | null;
  location: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  x_url: string | null;
  default_meta_title: string | null;
  default_meta_description: string | null;
  updated_at: string;
};

/** Form state: every field is a plain string; the server turns empty strings into null. */
export type SettingsForm = {
  site_name: string;
  tagline: string;
  contact_email: string;
  phone: string;
  location: string;
  linkedin_url: string;
  github_url: string;
  x_url: string;
  default_meta_title: string;
  default_meta_description: string;
};

export const toForm = (s: SiteSettings): SettingsForm => ({
  site_name: s.site_name,
  tagline: s.tagline ?? '',
  contact_email: s.contact_email ?? '',
  phone: s.phone ?? '',
  location: s.location ?? '',
  linkedin_url: s.linkedin_url ?? '',
  github_url: s.github_url ?? '',
  x_url: s.x_url ?? '',
  default_meta_title: s.default_meta_title ?? '',
  default_meta_description: s.default_meta_description ?? '',
});