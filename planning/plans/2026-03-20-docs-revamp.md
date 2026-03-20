# Taiko Agent-Friendly Docs Revamp — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Taiko's docs site with a Vocs-based, agent-first documentation site with SKILL.md, llms.txt, and Agent/Human tab patterns.

**Architecture:** Vocs (React + Vite) static site deployed to Vercel. Content in MDX files with file-based routing. Agent layer via static SKILL.md file + Vocs auto-generated llms.txt/llms-full.txt. All content rewritten from scratch, verified against protocol deployment logs.

**Tech Stack:** Vocs, React, MDX, Vercel, TypeScript

**Spec:** `docs/superpowers/specs/2026-03-20-docs-revamp-design.md`

---

## File Map

```
packages/docs-site/
├── docs/
│   ├── pages/
│   │   ├── index.mdx                              # Landing page
│   │   ├── quickstart/
│   │   │   ├── agent.mdx                           # Agent quickstart (one-prompt pattern)
│   │   │   ├── connect.mdx                         # Add Taiko to wallet/dApp
│   │   │   └── deploy.mdx                          # Deploy first contract
│   │   ├── guides/
│   │   │   ├── deploy-a-contract.mdx               # Full deploy guide
│   │   │   ├── bridge-tokens.mdx                   # L1↔L2 bridging
│   │   │   ├── verify-a-contract.mdx               # Explorer verification
│   │   │   ├── interact-with-contracts.mdx         # Read/write on-chain state
│   │   │   ├── run-a-node.mdx                      # Node operation (Docker + source)
│   │   │   ├── enable-a-prover.mdx                 # Proving setup
│   │   │   └── using-taiko-with-agents.mdx         # Agent integration guide
│   │   ├── network/
│   │   │   ├── rpc-endpoints.mdx                   # All RPC URLs, chain IDs, explorers
│   │   │   ├── contract-addresses.mdx              # L1 + L2 addresses
│   │   │   ├── differences-from-ethereum.mdx       # EVM version, gas, block time
│   │   │   └── software-releases.mdx               # Version links
│   │   ├── protocol/
│   │   │   ├── overview.mdx                        # What is Taiko
│   │   │   ├── based-rollups.mdx                   # Based sequencing
│   │   │   ├── proving-system.mdx                  # Multi-proof system
│   │   │   ├── bridging.mdx                        # Signal service, message passing
│   │   │   ├── economics.mdx                       # Fees, bonds, TAIKO token
│   │   │   └── preconfirmations.mdx                # Based preconfirmations
│   │   └── resources/
│   │       ├── faq.mdx                             # FAQ
│   │       ├── developer-tools.mdx                 # Tooling ecosystem
│   │       └── terminology.mdx                     # Glossary
│   ├── public/
│   │   ├── SKILL.md                                # Agent skill file (static)
│   │   ├── favicon.svg                             # Taiko favicon
│   │   └── img/                                    # Images
│   └── styles.css                                  # Taiko theme overrides
├── vocs.config.ts                                  # Full site configuration
├── package.json                                    # Vocs dependencies
├── tsconfig.json                                   # TypeScript config
└── vercel.json                                     # Deployment config
```

---

## Task 1: Scaffold Vocs Project

**Files:**

- Create: `packages/docs-site/package.json` (replace existing)
- Create: `packages/docs-site/vocs.config.ts`
- Create: `packages/docs-site/tsconfig.json` (replace existing)
- Create: `packages/docs-site/vercel.json` (replace existing)
- Create: `packages/docs-site/docs/styles.css`
- Create: `packages/docs-site/docs/public/favicon.svg`
- Delete: all existing `src/` directory content, `astro.config.ts`, old config files

**Important:** Read the current `packages/docs-site/package.json` and `packages/docs-site/src/assets/` first to understand existing branding assets.

- [ ] **Step 1: Remove old Astro/Starlight files**

Remove all Astro-specific files and directories. Keep `CHANGELOG.md` and `README.md`.

```bash
cd packages/docs-site
rm -rf src/ astro.config.ts tsconfig.json
```

- [ ] **Step 2: Create new package.json**

```json
{
  "name": "@taiko/docs-site",
  "version": "2.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vocs dev",
    "build": "vocs build",
    "preview": "vocs preview"
  },
  "dependencies": {
    "vocs": "^1.4.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "typescript": "^5.4.5"
  }
}
```

- [ ] **Step 3: Create vocs.config.ts**

Full configuration with sidebar, theme, socials, topNav, editLink.
See spec for exact config. Key settings:

- `theme.accentColor`: `{ light: '#e81899', dark: '#fc5cb5' }` (Taiko pink)
- `theme.colorScheme`: `'dark'`
- `font.google`: `'Inter'`
- `aiCta`: `true`
- `baseUrl`: `'https://docs.taiko.xyz'`
- Full sidebar structure as defined in spec

- [ ] **Step 4: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["docs/**/*.ts", "docs/**/*.tsx", "vocs.config.ts"]
}
```

- [ ] **Step 5: Create vercel.json**

```json
{
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install"
}
```

- [ ] **Step 6: Create docs/styles.css**

Taiko brand overrides — custom CSS variables for Taiko-specific colors.
Copy the Taiko SVG favicon from old `src/assets/` to `docs/public/favicon.svg`.

- [ ] **Step 7: Create docs directory structure**

```bash
mkdir -p docs/pages/{quickstart,guides,network,protocol,resources}
mkdir -p docs/public/img
```

- [ ] **Step 8: Install dependencies and verify dev server starts**

```bash
cd packages/docs-site
pnpm install
pnpm dev
```

Expected: Vocs dev server starts at http://localhost:5173 with empty site.

- [ ] **Step 9: Commit**

```bash
git add packages/docs-site/
git commit -m "feat(docs): scaffold Vocs project replacing Astro/Starlight"
```

---

## Task 2: Agent Layer — SKILL.md + Agent Quickstart

**Files:**

- Create: `packages/docs-site/docs/public/SKILL.md`
- Create: `packages/docs-site/docs/pages/quickstart/agent.mdx`

**Source:** The SKILL.md already exists at `packages/docs-site/taiko-skill/SKILL.md`. Copy and verify.

- [ ] **Step 1: Copy SKILL.md to public directory**

```bash
cp packages/docs-site/taiko-skill/SKILL.md packages/docs-site/docs/public/SKILL.md
```

Verify the SKILL.md contains:

- Correct chain IDs: 167000 (mainnet), 167013 (Hoodi testnet)
- Correct RPCs: `https://rpc.mainnet.taiko.xyz`, `https://rpc.hoodi.taiko.xyz`
- Shanghai EVM section with Foundry profile
- Contract addresses verified against `packages/protocol/deployments/mainnet-contract-logs-L1.md`

- [ ] **Step 2: Write agent quickstart page**

Create `docs/pages/quickstart/agent.mdx` with:

- "One Prompt" section with `:::code-group` tabs for Claude Code, Cursor, Codex CLI, generic
- `:::hide[md]` block directing LLMs to SKILL.md
- "What the Agent Gets" section explaining SKILL.md contents
- "Machine-Readable Docs" table (SKILL.md, llms.txt, llms-full.txt, .md URLs)
- "Starter Prompts" section with example agent tasks

See spec Design Section 5 for exact content.

- [ ] **Step 3: Verify SKILL.md is served as static file**

```bash
pnpm dev
# In another terminal:
curl http://localhost:5173/SKILL.md
```

Expected: Raw markdown content of SKILL.md.

- [ ] **Step 4: Commit**

```bash
git add packages/docs-site/docs/
git commit -m "feat(docs): add SKILL.md and agent quickstart page"
```

---

## Task 3: Landing Page

**Files:**

- Create: `packages/docs-site/docs/pages/index.mdx`

- [ ] **Step 1: Write landing page**

Create `docs/pages/index.mdx` with `layout: landing` frontmatter.

Content:

- Hero: "Taiko Docs" title, "A based rollup on Ethereum" description
- Three card sections:
  1. **For Agents** → `/quickstart/agent` — "Give your AI agent everything it needs"
  2. **Deploy a Contract** → `/quickstart/deploy` — "Deploy your first contract to Taiko"
  3. **Connect to Taiko** → `/quickstart/connect` — "Add Taiko to your wallet or dApp"
- Use `<Cards>` / `<Card>` components from Vocs

- [ ] **Step 2: Verify landing page renders**

```bash
pnpm dev
# Visit http://localhost:5173
```

Expected: Landing page with hero and three cards. Dark mode. Taiko pink accent.

- [ ] **Step 3: Commit**

```bash
git add packages/docs-site/docs/pages/index.mdx
git commit -m "feat(docs): add landing page"
```

---

## Task 4: Quickstart Pages

**Files:**

- Create: `packages/docs-site/docs/pages/quickstart/connect.mdx`
- Create: `packages/docs-site/docs/pages/quickstart/deploy.mdx`

Both pages use the Agent/Human tab pattern at the top.

- [ ] **Step 1: Write connect quickstart**

`quickstart/connect.mdx` — Adding Taiko to a wallet or dApp.

Opens with Agent/Human code-group:

````
:::code-group
```txt [Agent]
Read https://docs.taiko.xyz/SKILL.md and add Taiko mainnet and testnet to my wagmi config
````

```txt [Human]
Follow the step-by-step guide below.
```

:::

````

Manual mode content:
- MetaMask manual add (chain ID, RPC, explorer)
- wagmi/viem config with `defineChain`
- Wallet Connect / EIP-3085 `wallet_addEthereumChain` params
- Both mainnet and testnet via `:::code-group` tabs

Data to include:
- Mainnet: chain ID 167000, RPC `https://rpc.mainnet.taiko.xyz`, explorer `https://taikoscan.io`
- Hoodi: chain ID 167013, RPC `https://rpc.hoodi.taiko.xyz`, explorer `https://hoodi.taikoscan.io`
- Hex chain IDs: `0x28C58` (mainnet), `0x28C75` (testnet)

- [ ] **Step 2: Write deploy quickstart**

`quickstart/deploy.mdx` — Deploy your first contract to Taiko.

Opens with Agent/Human code-group. Simplified version of the full deploy guide — just the essentials:
1. Add `[profile.taiko]` to `foundry.toml` with `evm_version = "shanghai"`
2. Build: `FOUNDRY_PROFILE=taiko forge build`
3. Deploy + verify in one command (with mainnet/testnet tabs)
4. Confirm with `cast code`

Link to full guide at `/guides/deploy-a-contract` for advanced options.

- [ ] **Step 3: Verify both pages render with tabs**

```bash
pnpm dev
# Visit http://localhost:5173/quickstart/connect
# Visit http://localhost:5173/quickstart/deploy
````

Expected: Agent tab shown by default, manual steps below.

- [ ] **Step 4: Commit**

```bash
git add packages/docs-site/docs/pages/quickstart/
git commit -m "feat(docs): add connect and deploy quickstart pages"
```

---

## Task 5: Guide Pages — Developer Guides

**Files:**

- Create: `packages/docs-site/docs/pages/guides/deploy-a-contract.mdx`
- Create: `packages/docs-site/docs/pages/guides/bridge-tokens.mdx`
- Create: `packages/docs-site/docs/pages/guides/verify-a-contract.mdx`
- Create: `packages/docs-site/docs/pages/guides/interact-with-contracts.mdx`
- Create: `packages/docs-site/docs/pages/guides/using-taiko-with-agents.mdx`

**Sources for verified data:**

- Contract addresses: `packages/protocol/deployments/mainnet-contract-logs-L1.md` and `mainnet-contract-logs-L2.md`
- Network config: `packages/docs-site/src/content/docs/network-reference/` (old docs, verify data)
- Bridge flow: `packages/protocol/contracts/layer1/based/TaikoInbox.sol`, bridge contracts

All guide pages except `using-taiko-with-agents` use the Agent/Human tab pattern at the top.

- [ ] **Step 1: Write deploy-a-contract.mdx**

Full deployment guide with:

- Agent/Human tab pattern at top
- Prerequisites (Foundry, ETH on Taiko, Taikoscan API key)
- EVM Compatibility warning (`:::warning` callout about Shanghai)
- `[profile.taiko]` foundry.toml config
- `::::steps` with: configure → build → deploy+verify → confirm
- Mainnet/testnet `:::code-group` tabs for deploy commands
- Constructor args, script deployment alternatives
- Troubleshooting section

- [ ] **Step 2: Write bridge-tokens.mdx**

Programmatic bridging guide with:

- Agent/Human tab pattern at top
- Contracts table: ERC20Vault `0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab`, Bridge `0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC`
- `::::steps` flow: approve vault → call sendToken → wait for relay
- `BridgeTransferOp` struct with field descriptions
- Code examples in ethers.js and cast `:::code-group`
- Testnet addresses for Hoodi
- Notes on fee-on-transfer tokens, first-bridge behavior, self-relay

- [ ] **Step 3: Write verify-a-contract.mdx**

Verification guide with:

- Agent/Human tab pattern at top
- Verification endpoint: `https://api.taikoscan.io/api`
- `forge verify-contract` command with all flags
- Mainnet/testnet `:::code-group` tabs
- Shanghai EVM version warning (most common verification failure)
- Constructor args, deploy-time verification
- Troubleshooting: wrong EVM version, compiler mismatch, missing args

- [ ] **Step 4: Write interact-with-contracts.mdx**

Reading and writing on-chain state:

- Agent/Human tab pattern at top
- Read examples: `cast balance`, `cast call`, `cast storage`
- Write examples: `cast send`
- viem examples for reading/writing
- Common contract interactions (ERC20 balance, approve, transfer)
- Mainnet/testnet tabs

- [ ] **Step 5: Write using-taiko-with-agents.mdx**

Full agent integration guide (no Agent/Human tab — this IS the agent guide):

- What makes Taiko agent-friendly
- SKILL.md overview and how to use it
- Machine-readable docs (llms.txt, llms-full.txt, .md URLs)
- Agent platform setup (Claude Code, Cursor, Codex, generic)
- Example workflows with agents
- Best practices for agent-Taiko interaction

- [ ] **Step 6: Verify all guide pages render correctly**

```bash
pnpm dev
# Visit each guide page, verify tabs, steps, code-groups render
```

- [ ] **Step 7: Commit**

```bash
git add packages/docs-site/docs/pages/guides/
git commit -m "feat(docs): add developer guide pages"
```

---

## Task 6: Guide Pages — Node Operations

**Files:**

- Create: `packages/docs-site/docs/pages/guides/run-a-node.mdx`
- Create: `packages/docs-site/docs/pages/guides/enable-a-prover.mdx`

**Sources:**

- Old docs: `packages/docs-site/src/content/docs/guides/node-operators/` (7 files to consolidate into 2)
- simple-taiko-node repo references: https://github.com/taikoxyz/simple-taiko-node

- [ ] **Step 1: Write run-a-node.mdx**

Consolidated node guide (replaces 4+ old pages). No Agent/Human tab (too complex for a prompt).

Structure:

- Prerequisites (hardware, software)
- Method tabs: `:::code-group` with `[Docker]` and `[From Source]`
- Network tabs: `:::code-group` with `[Mainnet]` and `[Hoodi Testnet]`
- `::::steps` for each method:
  - Docker: clone simple-taiko-node, configure .env, docker compose up
  - Source: install deps, build taiko-geth, build taiko-client, run
- Monitoring and verification
- Troubleshooting (consolidate from old node-troubleshooting.mdx)

Reference old Docker guide (`run-a-taiko-alethia-node-with-docker.mdx`) for accurate commands and env vars, but rewrite for clarity.

- [ ] **Step 2: Write enable-a-prover.mdx**

Prover setup guide. No Agent/Human tab.

Structure:

- Prerequisites (node running, SGX hardware or ZK setup)
- Proof tier overview (SGX, ZK, multi-proof)
- Configuration for prover registration
- Bonds and economics
- Monitoring prover status

Reference old `enable-a-prover.mdx` for technical details.

- [ ] **Step 3: Commit**

```bash
git add packages/docs-site/docs/pages/guides/
git commit -m "feat(docs): add node operation guide pages"
```

---

## Task 7: Network Reference Pages

**Files:**

- Create: `packages/docs-site/docs/pages/network/rpc-endpoints.mdx`
- Create: `packages/docs-site/docs/pages/network/contract-addresses.mdx`
- Create: `packages/docs-site/docs/pages/network/differences-from-ethereum.mdx`
- Create: `packages/docs-site/docs/pages/network/software-releases.mdx`

**Sources (MUST verify against these):**

- `packages/protocol/deployments/mainnet-contract-logs-L1.md`
- `packages/protocol/deployments/mainnet-contract-logs-L2.md`
- `packages/protocol/deployments/taiko-hoodi-contract-logs.md`
- Old docs: `packages/docs-site/src/content/docs/network-reference/`

No Agent/Human tab on any of these — they're pure reference data that works identically for both audiences.

- [ ] **Step 1: Write rpc-endpoints.mdx**

Clean reference table:

- Mainnet: chain ID, RPC, WS, explorer, explorer API, bridge UI
- Hoodi testnet: same fields
- L1 references (Ethereum mainnet, Ethereum Hoodi)
- Hex chain IDs for wallet integration
- Bootnode info (link to simple-taiko-node repo)

- [ ] **Step 2: Write contract-addresses.mdx**

All contract addresses organized by network:

- Mainnet L1 (Ethereum): developer-relevant contracts (TaikoToken, Bridge, SignalService, ERC20Vault, ERC721Vault, ERC1155Vault, TaikoInbox)
- Mainnet L2 (Taiko): predeployed contracts at `0x167000...` addresses + key tokens (WETH, USDC)
- Hoodi L1: corresponding testnet contracts
- Links to canonical sources (GitHub deployment logs)

Read deployment logs files to get ALL addresses. Include more contracts than the SKILL.md (the SKILL.md is a curated subset; the docs page is comprehensive).

- [ ] **Step 3: Write differences-from-ethereum.mdx**

Key differences:

- EVM version: Shanghai (detail which opcodes are unavailable)
- No sequencer (based rollup — L1 validators sequence)
- Block time (variable, 2-6 seconds)
- Proving system overview (multi-proof, contestable)
- Link to taiko-geth diff page: https://geth.taiko.xyz/

- [ ] **Step 4: Write software-releases.mdx**

Links to release pages and changelogs:

- Protocol releases
- taiko-geth releases
- taiko-client releases
- simple-taiko-node releases
- raiko releases

Pull from old `software-releases-and-deployments.md`, verify links.

- [ ] **Step 5: Commit**

```bash
git add packages/docs-site/docs/pages/network/
git commit -m "feat(docs): add network reference pages"
```

---

## Task 8: Protocol Pages

**Files:**

- Create: `packages/docs-site/docs/pages/protocol/overview.mdx`
- Create: `packages/docs-site/docs/pages/protocol/based-rollups.mdx`
- Create: `packages/docs-site/docs/pages/protocol/proving-system.mdx`
- Create: `packages/docs-site/docs/pages/protocol/bridging.mdx`
- Create: `packages/docs-site/docs/pages/protocol/economics.mdx`
- Create: `packages/docs-site/docs/pages/protocol/preconfirmations.mdx`

**Sources:**

- Old docs: `packages/docs-site/src/content/docs/taiko-alethia-protocol/` (all subdirectories)
- Whitepapers linked from old docs

These are conceptual pages — no Agent/Human tab. Rewrite for clarity and accuracy.

- [ ] **Step 1: Write overview.mdx**

What is Taiko:

- Based rollup on Ethereum, type-1 ZK-EVM
- Key value propositions (Ethereum equivalence, decentralized sequencing, multi-proof)
- Architecture overview (proposers, provers, bridge, signal service)
- Merge content from old "What is Taiko Alethia?" page

- [ ] **Step 2: Write based-rollups.mdx**

Based sequencing explained:

- What "based" means (L1 validators as sequencers)
- Comparison with centralized sequencers
- Benefits (censorship resistance, liveness, shared security)
- How block proposing works on Taiko

Rewrite from old `based-rollups.md`.

- [ ] **Step 3: Write proving-system.mdx**

Multi-proof system:

- Proof tiers (SGX, ZK — RISC0, SP1)
- ComposeVerifier architecture
- Contestable proofs with bonding
- Proving windows and cooldown periods
- How verification works end-to-end

- [ ] **Step 4: Write bridging.mdx**

Cross-chain messaging:

- Signal service architecture
- Bridge contract flow (L1→L2 and L2→L1)
- Message lifecycle (send → prove → process)
- ERC20/721/1155 vault system
- Quota management

- [ ] **Step 5: Write economics.mdx**

Fee and token economics:

- TAIKO token utility
- Proving bonds and contestation
- L2 fee structure
- Proposer incentives

- [ ] **Step 6: Write preconfirmations.mdx**

Based preconfirmations:

- What preconfirmations are
- How they work with based sequencing
- Impact on block time
- Current status and roadmap

Rewrite from old `based-preconfirmations.md`.

- [ ] **Step 7: Commit**

```bash
git add packages/docs-site/docs/pages/protocol/
git commit -m "feat(docs): add protocol documentation pages"
```

---

## Task 9: Resources Pages

**Files:**

- Create: `packages/docs-site/docs/pages/resources/faq.mdx`
- Create: `packages/docs-site/docs/pages/resources/developer-tools.mdx`
- Create: `packages/docs-site/docs/pages/resources/terminology.mdx`

**Sources:**

- Old docs: `packages/docs-site/src/content/docs/resources/`

- [ ] **Step 1: Write faq.mdx**

Rewrite FAQ with updated answers. Remove outdated questions. Add agent-relevant questions:

- "How do I use Taiko with an AI coding agent?"
- "Why is my contract deployment failing on Taiko?" (Shanghai EVM answer)
- "What's the current testnet?" (Hoodi, not Hekla)

- [ ] **Step 2: Write developer-tools.mdx**

Ecosystem tooling:

- Block explorers (Taikoscan, Blockscout)
- RPC providers
- Bridge UI
- Faucets (if available for Hoodi)
- Development frameworks (Foundry, Hardhat)
- SDKs and libraries

- [ ] **Step 3: Write terminology.mdx**

Glossary of Taiko-specific terms:

- Based rollup, proposer, prover, proof tier, contestation, bond
- TaikoInbox, TaikoAnchor, SignalService
- Type-1 ZK-EVM

- [ ] **Step 4: Commit**

```bash
git add packages/docs-site/docs/pages/resources/
git commit -m "feat(docs): add resources pages (FAQ, tools, terminology)"
```

---

## Task 10: Build Verification & Cleanup

**Files:**

- Modify: `packages/docs-site/vocs.config.ts` (if sidebar adjustments needed)
- Delete: `packages/docs-site/taiko-skill/` (workspace files, keep SKILL.md in public/)
- Delete: `packages/docs-site/taiko-skill-workspace/` (eval workspace)

- [ ] **Step 1: Run full build**

```bash
cd packages/docs-site
pnpm build
```

Expected: Build completes without errors. Static site generated in `dist/`.

- [ ] **Step 2: Verify llms.txt and llms-full.txt are generated**

```bash
ls dist/llms.txt dist/llms-full.txt
cat dist/llms.txt
```

Expected: Both files exist. `llms.txt` contains index of all 25 pages. `llms-full.txt` contains full docs content.

- [ ] **Step 3: Verify .md URLs work**

```bash
pnpm preview
# In another terminal:
curl http://localhost:4173/quickstart/deploy.md
```

Expected: Raw markdown content of the deploy quickstart page.

- [ ] **Step 4: Verify SKILL.md is accessible**

```bash
curl http://localhost:4173/SKILL.md
```

Expected: Full SKILL.md content with correct addresses and EVM info.

- [ ] **Step 5: Verify all sidebar links work**

Visit every page in the sidebar and confirm:

- No broken links
- All code blocks render with syntax highlighting
- Code-groups show tabs correctly
- Steps auto-number correctly
- Callouts render with correct colors
- Agent/Human tabs show on applicable pages only

- [ ] **Step 6: Clean up workspace files**

```bash
rm -rf packages/docs-site/taiko-skill/
rm -rf packages/docs-site/taiko-skill-workspace/
```

The SKILL.md is now in `docs/public/SKILL.md`. The eval workspace was for testing only.

- [ ] **Step 7: Final commit**

```bash
git add packages/docs-site/
git commit -m "feat(docs): complete docs site build verification and cleanup"
```

---

## Parallelization Guide

Tasks that can run in parallel (for subagent-driven development):

| Parallel Group                       | Tasks                                                                                                                        | Dependencies               |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| **Group 1** (sequential)             | Task 1 (scaffold)                                                                                                            | None — must complete first |
| **Group 2** (parallel, after Task 1) | Task 2 (agent layer), Task 3 (landing)                                                                                       | Task 1                     |
| **Group 3** (parallel, after Task 1) | Task 4 (quickstarts), Task 5 (dev guides), Task 6 (node guides), Task 7 (network ref), Task 8 (protocol), Task 9 (resources) | Task 1                     |
| **Group 4** (sequential)             | Task 10 (verification)                                                                                                       | All previous tasks         |

Maximum parallelism: 8 tasks running simultaneously in Group 3.

---

## Content Accuracy Checklist

Before any page is considered complete, verify these values against source files:

| Value                  | Source                        | Expected                                     |
| ---------------------- | ----------------------------- | -------------------------------------------- |
| Mainnet chain ID       | Protocol deployment logs      | `167000`                                     |
| Testnet chain ID       | Protocol deployment logs      | `167013`                                     |
| Mainnet RPC            | Network config                | `https://rpc.mainnet.taiko.xyz`              |
| Testnet RPC            | Network config                | `https://rpc.hoodi.taiko.xyz`                |
| Mainnet explorer       | Network config                | `https://taikoscan.io`                       |
| Testnet explorer       | Network config                | `https://hoodi.taikoscan.io`                 |
| Explorer API (mainnet) | Network config                | `https://api.taikoscan.io/api`               |
| Explorer API (testnet) | Network config                | `https://api-hoodi.taikoscan.io/api`         |
| EVM version            | Protocol config               | Shanghai                                     |
| L1 Bridge address      | `mainnet-contract-logs-L1.md` | `0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC` |
| L1 ERC20Vault          | `mainnet-contract-logs-L1.md` | `0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab` |
| L2 Bridge              | Predeployed                   | `0x1670000000000000000000000000000000000001` |
| TAIKO token (L1)       | `mainnet-contract-logs-L1.md` | `0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800` |
