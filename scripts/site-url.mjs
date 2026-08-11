// Shared site-URL resolution for vocs.config.ts (dev + Vite transform) and
// scripts/substitute-site-url.mjs (post-build pass over dist/).
//
// Keep this token free of Markdown emphasis characters. Vocs serializes the
// llms markdown after parsing MDX, so a token like __SITE_URL__ can become
// **SITE_URL** before the post-build pass sees it.
export const siteUrlPlaceholder = 'SITEURLPLACEHOLDER'
export const siteUrlTokens = [
  siteUrlPlaceholder,
  '__SITE_URL__',
  'SITE_URL_PLACEHOLDER',
  'SITE\\_URL\\_PLACEHOLDER',
  '**SITE\\_URL**',
  '**SITE_URL**',
]

// Chain: explicit SITE_URL override → Vercel production alias → Vercel branch
// URL (stable per branch) → Vercel deployment URL → local dev fallback.
//
// All VERCEL_* vars are populated at build time only when Vercel builds
// natively — the --prebuilt flow does NOT expose them. Our GitHub workflows
// use `vercel deploy` (non-prebuilt) so Vercel builds on its own infra.
export const siteUrl =
  process.env.SITE_URL ??
  (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_BRANCH_URL
      ? `https://${process.env.VERCEL_BRANCH_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:5173')

export const substituteSiteUrl = (contents) =>
  siteUrlTokens.reduce((value, token) => value.replaceAll(token, siteUrl), contents)
