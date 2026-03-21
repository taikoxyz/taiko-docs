import { defineConfig } from 'vocs'

export default defineConfig({
  title: 'Taiko Docs',
  titleTemplate: '%s – Taiko',
  description: 'Documentation for Taiko, a based rollup on Ethereum',

  logoUrl: { dark: '/logo-dark.svg', light: '/logo-light.svg' },

  theme: {
    accentColor: { light: '#e81899', dark: '#fc5cb5' },
    colorScheme: 'dark',
  },

  aiCta: true,
  checkDeadlinks: 'warn',

  font: {
    google: 'Public Sans',
  },

  socials: [
    { icon: 'github', link: 'https://github.com/taikoxyz' },
    { icon: 'discord', link: 'https://discord.gg/taikoxyz' },
    { icon: 'x', link: 'https://x.com/taborrollup' },
  ],

  // editLink will be configured once the repo is pushed to GitHub

  sidebar: [
    {
      text: 'Quickstart',
      items: [
        { text: 'Agent Quickstart', link: '/quickstart/agent' },
        { text: 'Connect to Taiko', link: '/quickstart/connect' },
        { text: 'Deploy Your First Contract', link: '/quickstart/deploy' },
      ],
    },
    {
      text: 'Guides',
      collapsed: true,
      items: [
        { text: 'Deploy a Contract', link: '/guides/deploy-a-contract' },
        { text: 'Bridge Tokens', link: '/guides/bridge-tokens' },
        { text: 'Verify a Contract', link: '/guides/verify-a-contract' },
        { text: 'Interact with Contracts', link: '/guides/interact-with-contracts' },
        { text: 'Run a Node', link: '/guides/run-a-node' },
        { text: 'Enable a Prover', link: '/guides/enable-a-prover' },
        { text: 'Using Taiko with Agents', link: '/guides/using-taiko-with-agents' },
      ],
    },
    {
      text: 'Network Reference',
      collapsed: true,
      items: [
        { text: 'RPC Endpoints', link: '/network/rpc-endpoints' },
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
        { text: 'Proving System', link: '/protocol/proving-system' },
        { text: 'Bridging', link: '/protocol/bridging' },
        { text: 'Economics', link: '/protocol/economics' },
        { text: 'Preconfirmations', link: '/protocol/preconfirmations' },
      ],
    },
    {
      text: 'Resources',
      items: [
        { text: 'FAQ', link: '/resources/faq' },
        { text: 'Developer Tools', link: '/resources/developer-tools' },
        { text: 'Terminology', link: '/resources/terminology' },
      ],
    },
  ],

  topNav: [
    { text: 'Docs', link: '/quickstart/connect', match: '/' },
    { text: 'GitHub', link: 'https://github.com/taikoxyz/taiko-mono' },
    { text: 'Bridge', link: 'https://bridge.taiko.xyz' },
  ],
})
