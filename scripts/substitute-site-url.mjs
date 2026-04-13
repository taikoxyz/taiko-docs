// Post-build pass that replaces every __SITE_URL__ sentinel in the build
// output with the resolved siteUrl. Runs after `vocs build` fully exits,
// so it catches files written by Vite's transform pipeline, Vocs's llms
// plugin (.md/.txt exports), and Vite's public-dir copy (docs/public/SKILL.md).
//
// Vocs picks the output directory based on whether it detects Vercel:
// - Local / CI outside Vercel:  docs/dist
// - Vercel native build:        .vercel/output/static  (Build Output API v3)
//
// See node_modules/vocs/_lib/vite/utils/resolveOutDir.js.
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { siteUrl } from './site-url.mjs'

const outDir = process.env.VERCEL ? '.vercel/output/static' : 'docs/dist'
if (!existsSync(outDir)) {
  console.error(`[site-url] build output dir ${outDir} not found — did vocs build succeed?`)
  process.exit(1)
}
const textExts = new Set(['.md', '.txt', '.json', '.html', '.js'])

let replaced = 0
const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      walk(full)
      continue
    }
    const dot = entry.lastIndexOf('.')
    if (dot < 0 || !textExts.has(entry.slice(dot))) continue
    const contents = readFileSync(full, 'utf8')
    if (!contents.includes('__SITE_URL__')) continue
    writeFileSync(full, contents.replaceAll('__SITE_URL__', siteUrl))
    replaced += 1
  }
}

walk(outDir)
console.log(`[site-url] rewrote ${replaced} files in ${outDir} with ${siteUrl}`)
