import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig } from 'vocs'

const siteUrl =
  process.env.SITE_URL ??
  (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_BRANCH_URL
      ? `https://${process.env.VERCEL_BRANCH_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:5173')

export default defineConfig({
  title: 'Taiko Docs',
  titleTemplate: '%s - Taiko',
  description: 'Documentation for Taiko, a based rollup on Ethereum',

  logoUrl: { dark: '/logo-dark.svg', light: '/logo-light.svg' },

  theme: {
    accentColor: { light: '#e81899', dark: '#fc5cb5' },
    colorScheme: 'dark',
  },

  aiCta: true,
  checkDeadlinks: 'warn',

  llms: {
    generateMarkdown: true,
  },

  font: {
    google: 'Public Sans',
  },

  socials: [
    { icon: 'github', link: 'https://github.com/taikoxyz' },
    { icon: 'discord', link: 'https://discord.com/invite/taiko-984015101017346058' },
    { icon: 'x', link: 'https://x.com/taikoxyz' },
  ],

  // editLink will be configured once the repo is pushed to GitHub

  sidebar: [
    { text: 'Home', link: '/' },
    {
      text: 'Quickstart',
      items: [
        { text: 'Agent Quickstart', link: '/quickstart/agent' },
        { text: 'Connect to Taiko', link: '/quickstart/connect' },
        { text: 'Deploy a Contract', link: '/quickstart/deploy' },
      ],
    },
    {
      text: 'Guides',
      collapsed: true,
      items: [
        { text: 'Bridge Tokens', link: '/guides/bridge-tokens' },
        { text: 'Run a Node', link: '/guides/run-a-node' }
      ],
    },
    {
      text: 'Network Reference',
      collapsed: true,
      items: [
        { text: 'Contract Addresses', link: '/network/contract-addresses' },
        { text: 'Differences from Ethereum', link: '/network/differences-from-ethereum' },
        { text: 'Software Releases', link: '/network/software-releases' },
      ],
    },
    {
      text: 'Protocol',
      collapsed: true,
      items: [
        { text: 'Overview', link: '/protocol/overview' },
        { text: 'Based Rollups', link: '/protocol/based-rollups' },
        { text: 'Shasta Fork (Current)', link: '/protocol/shasta-fork' },
        { text: 'Pacaya Fork', link: '/protocol/pacaya-fork' },
        { text: 'Proving System', link: '/protocol/proving-system' },
        { text: 'Bridging', link: '/protocol/bridging' },
        { text: 'Economics', link: '/protocol/economics' },
        { text: 'Preconfirmations', link: '/protocol/preconfirmations' },
      ],
    },
    {
      text: 'Resources',
      items: [
        { text: 'Tack: IPFS for Agents', link: '/resources/tack' },
        { text: 'Developer Tools', link: '/resources/developer-tools' },
        { text: 'FAQ', link: '/resources/faq' },
        { text: 'Getting Support', link: '/resources/getting-support' },
        { text: 'Contributing', link: '/resources/contributing' },
      ],
    },
  ],

  topNav: [
    { text: 'Taiko', link: 'https://taiko.xyz' },
    { text: 'GitHub', link: 'https://github.com/taikoxyz/taiko-docs' },
    { text: 'Bridge', link: 'https://bridge.taiko.xyz' },
  ],

  vite: {
    plugins: [
      {
        name: 'docs-site-url',
        enforce: 'pre',
        // Dev + HTML/JS builds: substitute at MDX load time.
        transform(code, id) {
          if (!id.includes('.mdx')) return null
          if (!code.includes('__SITE_URL__')) return null
          return { code: code.replaceAll('__SITE_URL__', siteUrl), map: null }
        },
        // Prod build only: rewrite the .md / llms-full.txt / llms.txt / search index
        // that Vocs's llms plugin writes directly to outDir, bypassing Vite's transform.
        closeBundle() {
          const outDir = 'docs/dist'
          const textExts = new Set(['.md', '.txt', '.json', '.html', '.js'])
          const walk = (dir: string) => {
            for (const entry of readdirSync(dir)) {
              const full = join(dir, entry)
              const stat = statSync(full)
              if (stat.isDirectory()) {
                walk(full)
                continue
              }
              const dot = entry.lastIndexOf('.')
              if (dot < 0) continue
              if (!textExts.has(entry.slice(dot))) continue
              const contents = readFileSync(full, 'utf8')
              if (!contents.includes('__SITE_URL__')) continue
              writeFileSync(full, contents.replaceAll('__SITE_URL__', siteUrl))
            }
          }
          try {
            walk(outDir)
          } catch (e) {
            // outDir may not exist in some build modes; ignore.
          }
        },
      },
    ],
  },
})
