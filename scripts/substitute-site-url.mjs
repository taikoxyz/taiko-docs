// Post-build pass that:
//   1. Replaces every site URL sentinel in the build output with the
//      resolved siteUrl (catches Vite's public-dir copies, Vocs's .md/.txt
//      exports, Vite's transform pipeline, and pre-rendered HTML).
//   2. Emits sitemap.xml + robots.txt so search engines can crawl and index
//      the site. Non-production builds get a Disallow-all robots so Vercel
//      previews never compete with the production domain.
//
// Vocs picks the output directory based on whether it detects Vercel:
// - Local / CI outside Vercel:  docs/dist
// - Vercel native build:        .vercel/output/static  (Build Output API v3)
//
// See node_modules/vocs/_lib/vite/utils/resolveOutDir.js.
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { siteUrl, substituteSiteUrl } from './site-url.mjs'

const outDir = process.env.VERCEL ? '.vercel/output/static' : 'docs/dist'
if (!existsSync(outDir)) {
  console.error(`[site-url] build output dir ${outDir} not found — did vocs build succeed?`)
  process.exit(1)
}
const textExts = new Set(['.md', '.txt', '.json', '.html', '.js'])

let replaced = 0
const htmlRoutes = []

const normalizeRouteMeta = (contents, route) => {
  const routeOgUrl = `<meta property="og:url" content="${siteUrl}${route}"/>`
  if (!contents.includes(routeOgUrl)) return contents

  // Vocs v1.4.1 emits a second og:url using baseUrl only. Keep the routed tag.
  return contents.replace(`<meta property="og:url" content="${siteUrl}"/>`, '')
}

const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      walk(full)
      continue
    }
    let route
    if (entry === 'index.html') {
      const rel = relative(outDir, full).split(sep).slice(0, -1).join('/')
      route = rel ? `/${rel}` : '/'
      htmlRoutes.push(route)
    }
    const dot = entry.lastIndexOf('.')
    if (dot < 0 || !textExts.has(entry.slice(dot))) continue
    const contents = readFileSync(full, 'utf8')
    let next = substituteSiteUrl(contents)
    if (route) next = normalizeRouteMeta(next, route)
    if (next === contents) continue
    writeFileSync(full, next)
    replaced += 1
  }
}

walk(outDir)
console.log(`[site-url] rewrote ${replaced} files in ${outDir} with ${siteUrl}`)

// --- sitemap.xml + robots.txt --------------------------------------------
const isProd = process.env.VERCEL_ENV === 'production'
const lastmod = new Date().toISOString().slice(0, 10)

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  htmlRoutes
    .sort()
    .map(
      (route) =>
        `  <url><loc>${siteUrl}${route}</loc><lastmod>${lastmod}</lastmod></url>`,
    )
    .join('\n') +
  `\n</urlset>\n`

const robots = isProd
  ? `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
  : `User-agent: *\nDisallow: /\n`

writeFileSync(join(outDir, 'sitemap.xml'), sitemap)
writeFileSync(join(outDir, 'robots.txt'), robots)
console.log(
  `[site-url] wrote sitemap.xml (${htmlRoutes.length} urls) and robots.txt (${isProd ? 'prod' : 'preview'})`,
)
