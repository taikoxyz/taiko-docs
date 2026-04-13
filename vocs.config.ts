import { defineConfig } from 'vocs'

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
    { text: 'Docs', link: 'https://github.com/taikoxyz/taiko-docs' },
    { text: 'Taiko', link: 'https://taiko.xyz' },
    { text: 'GitHub', link: 'https://github.com/taikoxyz/taiko-mono' },
    { text: 'Bridge', link: 'https://bridge.taiko.xyz' },
  ],
})
