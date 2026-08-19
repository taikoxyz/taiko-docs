// Shared between playwright.config.ts (which builds and serves the site) and
// the specs (which assert against the URLs that build produced).
export const previewPort = 4173
export const previewUrl = `http://localhost:${previewPort}`

// Pinned so the assertions do not depend on the SITE_URL fallback chain in
// scripts/site-url.mjs, and so a wrong value cannot coincidentally match the
// origin the site is served from.
export const siteUrl = 'https://docs.example.test'
