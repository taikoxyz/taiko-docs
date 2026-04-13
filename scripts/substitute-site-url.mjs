// Post-build pass that replaces every __SITE_URL__ sentinel in docs/dist
// with the resolved siteUrl. Runs after `vocs build` fully exits, so it
// catches files written by Vite's transform pipeline, Vocs's llms plugin
// (.md/.txt exports), and Vite's public-dir copy (docs/public/SKILL.md).
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { siteUrl } from './site-url.mjs'

const outDir = 'docs/dist'
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
