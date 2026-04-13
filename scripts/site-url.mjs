// Shared site-URL resolution for vocs.config.tsx (dev + Vite transform) and
// scripts/substitute-site-url.mjs (post-build pass over dist/).
//
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
