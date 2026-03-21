# Taiko Docs — Analysis & Findings

> Research conducted 2026-03-20. Must-fix and should-fix items have been resolved (see section 6).

---

## 1. Repo Setup (Done)

- Docs copied to `/Users/gustavo/taiko/taiko-docs/`
- Git repo initialized with initial commit on `main`
- Planning docs from the monorepo included under `planning/`

---

## 2. Tempo Comparison — Content Gaps

Tempo (docs.tempo.xyz) has **144 pages** across 9 sections. Our docs have **23 pages** across 5 sections. While Tempo covers a different domain (payments/stablecoins), their docs architecture sets a high bar that highlights gaps in ours.

### What Tempo Has That We Don't

| Gap | Tempo Implementation | Our Current State | Priority |
|-----|---------------------|-------------------|----------|
| **Multi-language code examples** | 5-6 languages per guide (TypeScript/Viem, Wagmi, Rust/Alloy, Python, Go, Solidity) | Only `cast` + `viem` (2 tools per guide) | HIGH |
| **SDK documentation** | Dedicated `/sdk/` section with per-language getting-started, hooks, and action references | No SDK docs — we rely on standard EVM tools, but could document viem/ethers patterns better | MEDIUM |
| **MCP server** | `/api/mcp` endpoint with setup commands for Claude Code, Codex, and Amp | No MCP server — agents must fetch SKILL.md manually | HIGH |
| **CLI with agent-friendly output** | `--toon-output` flag for compact machine-readable output, `--describe` for JSON schemas, `--dry-run` for cost preview | No Taiko-specific CLI (by design — we use standard EVM tools) | LOW |
| **Formal protocol specs (TIPs)** | 14+ TIPs with Abstract/Motivation/Specification following RFC conventions, complete Solidity interfaces, events, errors, invariants | Protocol pages are explanatory prose, not formal specs. No TIP/TRC system. | MEDIUM |
| **Use case pages** | 7 use case pages (agentic commerce, embedded finance, global payouts, microtransactions, payroll, remittances, tokenized deposits) | No use case or "build X with Taiko" pages | MEDIUM |
| **Ecosystem directory** | 9 pages mapping partners, bridges, wallets, explorers with cards | `developer-tools.mdx` is a flat table. No ecosystem section. | LOW |
| **Interactive components** | `<ConnectWallet />` for one-click wallet setup, `<TempoTxProperties />` for tx visualization | No interactive components — all static tables and code blocks | LOW |
| **Hub-and-spoke navigation** | Overview pages use icon cards to route users to specific tasks | Only the landing page has cards. Section index pages are missing. | MEDIUM |
| **Scoped access keys / agent safety** | Spend controls, budget limits, scoped API keys for agent safety | No agent safety features documented (not applicable for EVM, but could document wallet security for agents) | LOW |
| **Service discovery** | `tempo wallet services --search` for agents to find available endpoints | No equivalent — agents must know what Taiko offers upfront via SKILL.md | LOW |

### What We Have That Tempo Doesn't

| Strength | Details |
|----------|---------|
| **Agent-first SKILL.md** | Our SKILL.md is comprehensive and well-structured for agent injection |
| **Vocs llms.txt auto-generation** | Built into framework — Tempo also has this, but ours is native |
| **Deep protocol documentation** | 6 protocol pages covering architecture in depth (based rollups, bridging, proving, preconfs, economics) |
| **Node operation guide** | Comprehensive run-a-node with Docker and from-source methods |
| **Prover setup guide** | No equivalent in Tempo (different architecture) |

### Recommended New Pages (Priority Order)

1. **MCP server endpoint** — Serve tools/resources at `/api/mcp` so agents can discover Taiko capabilities programmatically
2. **More language examples** — Add ethers.js, Hardhat, and Python (web3.py) examples to deploy/bridge/interact guides
3. **Use case pages** — "Build a DeFi Protocol on Taiko", "Agent-Powered Trading on Taiko", "Cross-Chain Bridge Integration"
4. **Protocol specs** — Formal TRC (Taiko Request for Comments) docs alongside the explanatory protocol pages
5. **Section hub pages** — Add overview/index pages for Guides, Network, Protocol sections with card navigation

---

## 3. Reference Accuracy — RPCs, Addresses, Links

### Issues Found

#### CRITICAL: Chain ID vs Network ID Mismatch (run-a-node.mdx:156)

```
Expected response for mainnet: "result":"0x28c61" (chain ID 167009).
```

**Problem:** The `eth_chainId` RPC method returns the **chain ID**, which is `167000` (`0x28C58`) for Taiko mainnet. The value `167009` (`0x28C61`) is the **network ID** used in the `--networkid` flag for taiko-geth. The curl example calls `eth_chainId`, so the expected response should be `0x28C58`, not `0x28C61`.

**Either:** The expected response is wrong and should be `0x28C58`, **or** taiko-geth returns the network ID instead of the chain ID for `eth_chainId` (which would be non-standard and should be documented as a known quirk).

**Action needed:** Test against a running node to confirm which value `eth_chainId` actually returns.

#### MEDIUM: TaikoAnchor Address Discrepancy (run-a-node.mdx:317 vs contract-addresses.mdx:91)

- **run-a-node.mdx** (mainnet from-source command): `--taikoAnchor 0x1670010000000000000000000000000000010001`
- **contract-addresses.mdx**: TaikoAnchor at `0x1670000000000000000000000000000000010001`

These are **different addresses** — note `167001` prefix vs `167000` prefix. One of these is wrong, or there are two different TaikoAnchor deployments. The `--taikoAnchor` flag in the CLI command should match the contract-addresses page.

**Action needed:** Verify against the deployment logs which address is canonical.

#### MEDIUM: Deprecated viem Chain Reference (connect.mdx:66)

```
viem ships with built-in Taiko chain definitions. You can import `taiko` and `taikoHekla` directly from `viem/chains`
```

**Problem:** Hekla is a deprecated testnet. The current testnet is Hoodi. Should reference `taikoHoodi` if viem has added it, or remove the Hekla mention and note that Hoodi may need `defineChain`.

#### LOW: Missing Hoodi Bridge URL in RPC Table (rpc-endpoints.mdx)

The RPC endpoints page doesn't include the Hoodi Bridge URL (`https://bridge.hoodi.taiko.xyz`), but it's referenced in FAQ (line 33) and developer-tools (line 98). The mainnet table includes the bridge URL but the Hoodi table doesn't.

#### LOW: Hoodi Etherscan URL Not Verified (enable-a-prover.mdx:77-78)

```
https://hoodi.etherscan.io/address/0xf3b83e226202ECf7E7bb2419a4C6e3eC99e963DA#writeProxyContract
```

Need to confirm that `hoodi.etherscan.io` is a real Etherscan instance. The Ethereum Hoodi testnet is relatively new and may not have an Etherscan deployment. Alternative: use Etherscan's generic chain view or a different explorer.

#### INFO: Deployment Logs Links

The following GitHub links should be periodically verified as the repository structure evolves:
- `https://github.com/taikoxyz/taiko-mono/blob/main/packages/protocol/deployments/mainnet-contract-logs-L1.md`
- `https://github.com/taikoxyz/taiko-mono/blob/main/packages/protocol/deployments/mainnet-contract-logs-L2.md`
- `https://github.com/taikoxyz/taiko-mono/blob/main/packages/protocol/deployments/taiko-hoodi-contract-logs.md`

#### INFO: geth.taiko.xyz Reference (differences-from-ethereum.mdx:90)

The link `https://geth.taiko.xyz/` for the full taiko-geth diff should be verified as still active.

### Addresses That Appear Consistent

The following addresses are consistent across all pages where they appear (contract-addresses.mdx, SKILL.md, bridge-tokens.mdx, enable-a-prover.mdx, interact-with-contracts.mdx):

- L1 Bridge: `0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC` ✓
- L1 ERC20Vault: `0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab` ✓
- L1 SignalService: `0x9e0a24964e5397B566c1ed39258e21aB5E35C77C` ✓
- L1 TaikoToken: `0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800` ✓
- L1 TaikoInbox: `0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a` ✓
- L2 Bridge: `0x1670000000000000000000000000000000000001` ✓
- L2 ERC20Vault: `0x1670000000000000000000000000000000000002` ✓
- L2 SignalService: `0x1670000000000000000000000000000000000005` ✓
- L2 USDC: `0x07d83526730c7438048D55A4fc0b850e2aaB6f0b` ✓
- L2 WETH: `0xA51894664A773981C6C112C43ce576f315d5b1B6` ✓
- L2 TaikoToken (bridged): `0xA9d23408b9bA935c230493c40C73824Df71A0975` ✓
- Hoodi L1 TaikoToken: `0xf3b83e226202ECf7E7bb2419a4C6e3eC99e963DA` ✓
- Hoodi L1 Bridge: `0x6a4cf607DaC2C4784B7D934Bcb3AD7F2ED18Ed80` ✓
- Hoodi L1 ERC20Vault: `0x0857cd029937E7a119e492434c71CB9a9Bb59aB0` ✓
- Hoodi L1 PacayaInbox: `0xf6eA848c7d7aC83de84db45Ae28EAbf377fe0eF9` ✓

### RPCs Consistent

- `https://rpc.mainnet.taiko.xyz` — consistent across all pages ✓
- `https://rpc.hoodi.taiko.xyz` — consistent across all pages ✓
- `https://api.taikoscan.io/api` — consistent ✓
- `https://api-hoodi.taikoscan.io/api` — consistent ✓
- Chain IDs: `167000` (mainnet), `167013` (Hoodi), `560048` (Ethereum Hoodi L1) — consistent ✓

---

## 4. Human/Agent Distinction — Page-by-Page Analysis

### Current Pattern

Most guide pages use a `:::code-group` with `[Agent]` / `[Human]` tabs at the top:
- **Agent tab**: "Read SKILL.md and do X"
- **Human tab**: "Follow the step-by-step guide below"

This pattern appears in: `quickstart/connect`, `quickstart/deploy`, `guides/deploy-a-contract`, `guides/verify-a-contract`, `guides/bridge-tokens`, `guides/interact-with-contracts`

### Assessment Per Page

| Page | Current Approach | Assessment | Recommendation |
|------|-----------------|------------|----------------|
| **index.mdx** | Cards only, no agent/human toggle | GOOD — landing page doesn't need the toggle | Keep as-is |
| **quickstart/agent.mdx** | Agent-only page | GOOD — dedicated agent content | Keep as-is |
| **quickstart/connect.mdx** | Agent/Human tabs | GOOD — agent gets SKILL.md, human gets MetaMask steps | Keep as-is |
| **quickstart/deploy.mdx** | Agent/Human tabs | GOOD — clear fork between agent and manual paths | Keep as-is |
| **guides/deploy-a-contract.mdx** | Agent/Human tabs | GOOD — same pattern, more detail | Keep as-is |
| **guides/verify-a-contract.mdx** | Agent/Human tabs | GOOD — works well for this task | Keep as-is |
| **guides/bridge-tokens.mdx** | Agent/Human tabs | GOOD — bridging is a natural agent task | Keep as-is |
| **guides/interact-with-contracts.mdx** | Agent/Human tabs | GOOD — reading/writing state is natural for agents | Keep as-is |
| **guides/enable-a-prover.mdx** | No agent/human tabs | GOOD — proving is not an agent task (requires SGX hardware) | Keep as-is |
| **guides/run-a-node.mdx** | No agent/human tabs | GOOD — running a node is not an agent task | Keep as-is |
| **guides/using-taiko-with-agents.mdx** | Agent-focused page | OVERLAPS with quickstart/agent.mdx. Contains largely the same SKILL.md instructions, platform setup, and starter prompts | **MERGE or DIFFERENTIATE** — one should be the quick version, the other the deep dive |
| **network/contract-addresses.mdx** | No toggle, flat tables | COULD IMPROVE — agents parse tables but a JSON endpoint would be better | Consider adding a `/addresses.json` or including structured data in SKILL.md |
| **network/rpc-endpoints.mdx** | No toggle, flat tables | FINE — agents get this from SKILL.md already | Keep as-is |
| **network/differences-from-ethereum.mdx** | No toggle, prose + code | FINE — both humans and agents benefit from the same content | Keep as-is |
| **network/software-releases.mdx** | No toggle, links table | FINE — reference page | Keep as-is |
| **protocol/overview.mdx** | No toggle, prose | FINE — conceptual content is the same for both audiences | Keep as-is |
| **protocol/based-rollups.mdx** | No toggle, prose | FINE | Keep as-is |
| **protocol/bridging.mdx** | No toggle, prose | FINE | Keep as-is |
| **protocol/proving-system.mdx** | No toggle, prose | FINE | Keep as-is |
| **protocol/preconfirmations.mdx** | No toggle, prose | FINE | Keep as-is |
| **protocol/economics.mdx** | No toggle, prose | FINE | Keep as-is |
| **resources/developer-tools.mdx** | No toggle, tables | FINE — reference page | Keep as-is |
| **resources/faq.mdx** | No toggle, Q&A | FINE — useful for both audiences | Keep as-is |
| **resources/terminology.mdx** | No toggle, glossary | FINE | Keep as-is |

### Key Findings

1. **The Agent/Human toggle works well for task-oriented guides** (deploy, bridge, verify, interact). Keep this pattern.

2. **quickstart/agent.mdx and guides/using-taiko-with-agents.mdx overlap significantly.** Both cover SKILL.md, machine-readable docs, platform setup, and starter prompts. They should either be merged or clearly differentiated (quickstart = "get started in 30 seconds", guide = "deep integration patterns").

3. **Protocol and reference pages correctly avoid the toggle.** These are conceptual/reference content where the distinction doesn't apply.

4. **Machine-readable alternative formats would help.** Consider:
   - `/addresses.json` — structured contract addresses endpoint
   - `/api/mcp` — MCP server for agent tool discovery (as Tempo does)
   - Keeping SKILL.md as the primary entry point, but enriching it with more structured data

5. **The `:::hide[md]` directive on quickstart/agent.mdx is clever** — it shows agent-only instructions when the page is read as raw markdown. Consider using this pattern on more pages.

---

## 5. Brand Kit Usage

### Official Taiko Brand (from codebase analysis + taiko.xyz)

| Element | Official Value | Our Docs Value | Match? |
|---------|---------------|----------------|--------|
| **Primary Pink** | `#C8047D` (pink-500) | Not used | NO — we use pink-400 as primary |
| **Accent Pink** | `#E81899` (pink-400) | `#e81899` (--taiko-pink) | YES |
| **Light Pink** | `#FC5CB5` | `#fc5cb5` (--taiko-pink-light) | YES |
| **Background (dark)** | `#0B101B` (gray-900) | `#0B0B0B` (--surface-0) | CLOSE but different — ours is warmer/neutral, brand is cooler/blue-ish |
| **Surface 1** | `#191E28` (gray-800) | `#111113` | DIFFERENT — brand has blue undertone |
| **Surface 2** | `#2B303B` (gray-700) | `#191919` | DIFFERENT — brand has blue undertone |
| **Body Font** | Public Sans | Public Sans | YES |
| **Display Font** | Clash Grotesk | Public Sans (no display font) | NO — missing display font |
| **Logo** | Pink icon + wordmark (dark/light variants) | favicon.svg only (pink icon) | PARTIAL — no full wordmark anywhere in docs |
| **Color palette** | Full 12-stop gray scale with blue undertone | Custom neutral gray scale | DIFFERENT tone |

### Assessment

**What's correct:**
- Accent pink (#E81899) is on-brand
- Light pink (#FC5CB5) is on-brand
- Public Sans body font matches
- Dark mode first — matches brand direction
- Pink is used as accent only, not overdone — this is correct per brand guidelines

**What's off-brand:**
1. **Missing Clash Grotesk.** The brand uses Clash Grotesk as a display font for headings. Our docs use Public Sans for everything. Adding Clash Grotesk for h1/h2 headings would make the docs feel more "Taiko."

2. **Gray scale doesn't match.** The official Taiko grays have a cool blue undertone (`#0B101B`, `#191E28`, `#2B303B`). Our docs use neutral/warm grays (`#0B0B0B`, `#111113`, `#191919`). This creates a visual disconnect between docs and the main site.

3. **No full wordmark/logo.** The docs only have the favicon icon — no "taiko" wordmark in the navbar. The brand kit has `logo-dark.svg` and `logo-light.svg` with the full icon + wordmark.

4. **Primary brand color (#C8047D) unused.** The brand distinguishes pink-400 (#E81899) as "accent" and pink-500 (#C8047D) as "primary." We only use the accent. For CTA buttons and primary interactive elements, the brand primary should be used.

**Pink usage assessment:** The docs use pink **tastefully and sparingly** — only for:
- Link hover states
- Active sidebar items
- Code block borders on hover
- Card borders on hover
- A few accent elements

This is **correct** — the brand uses pink as an accent, not as a dominant color. We are NOT overusing pink. If anything, we could use slightly more pink-500 (#C8047D) for primary buttons and CTAs where they exist.

### Recommendations

1. **Add Clash Grotesk** for h1 and h2 headings (available from fontshare.com, variable font 200-700)
2. **Shift gray scale** to match brand grays with blue undertone:
   - `--surface-0`: `#0B101B` (from `#0B0B0B`)
   - `--surface-1`: `#191E28` (from `#111113`)
   - `--surface-2`: `#2B303B` (from `#191919`)
3. **Add full wordmark** to navbar (logo-dark.svg from ui-lib)
4. **Use pink-500** (`#C8047D`) for primary interactive elements (buttons, primary links)
5. **Keep current pink accent usage** — it's well-calibrated

---

## 6. Summary of All Issues

### Must Fix (Before Launch) — DONE

| # | Issue | Fix Applied |
|---|-------|-------------|
| 1 | Chain ID vs Network ID mismatch in expected curl response | Fixed to `0x28c58` (167000). Added info callout explaining `--networkid` (167009) is the P2P network ID, not the chain ID. |
| 2 | TaikoAnchor address discrepancy (`0x167001...` vs `0x167000...`) | Fixed run-a-node.mdx to use `0x1670000000000000000000000000000000010001` matching canonical deployment logs. |
| 3 | Deprecated `taikoHekla` viem chain reference | Removed Hekla reference. Updated to note `taiko` is available from viem/chains, Hoodi may need `defineChain`. |

### Should Fix (Polish) — DONE

| # | Issue | Fix Applied |
|---|-------|-------------|
| 4 | Merge or differentiate quickstart/agent.mdx and guides/using-taiko-with-agents.mdx | Differentiated: quickstart is the 30-second entry point (one prompt, starter prompts, links to deep guide). Guide covers platform setup, integration patterns, best practices. Added cross-links between both. |
| 5 | Add Hoodi Bridge URL to RPC endpoints table | Added `bridge.hoodi.taiko.xyz` to Hoodi Testnet table. |
| 6 | Verify `hoodi.etherscan.io` is a real endpoint | Replaced with generic instruction to use Hoodi Taikoscan explorer (`hoodi.taikoscan.io`) since `hoodi.etherscan.io` is unverified. |
| 7 | Shift gray scale to match brand (blue undertone) | Updated all surface colors: `--surface-0: #050912`, `--surface-1: #0b101b`, `--surface-2: #191e28`, `--surface-3: #2b303b`, `--surface-4: #444a55`. Navbar background updated to match. |
| 8 | Add Clash Grotesk display font for headings | Added via fontshare CDN `@import`. Applied to h1 (weight 600) and h2 (weight 500) headings. |
| 9 | Add full Taiko wordmark to navbar | Copied `logo-dark.svg` and `logo-light.svg` to `docs/public/`. Configured `logoUrl` in vocs.config.ts with dark/light variants. |

### UX Redesign: Prompt Mode / Manual Mode — DONE

Replaced the `[Agent]` / `[Human]` code-group tabs with a "Prompt mode / Manual mode" section pattern on 6 pages:

| Page | Design Rationale |
|------|-----------------|
| `quickstart/connect.mdx` | Both sections visible. Prompt gives agent the task + SKILL.md reference. Manual mode has MetaMask and wagmi steps. |
| `quickstart/deploy.mdx` | Prompt includes FOUNDRY_PROFILE hint. Manual mode has the full step-by-step. |
| `guides/deploy-a-contract.mdx` | Prompt adds Taikoscan verifier URL detail since this is the comprehensive guide. |
| `guides/verify-a-contract.mdx` | Prompt is address-parameterized so the user fills in their contract address. |
| `guides/bridge-tokens.mdx` | Prompt names the BridgeTransferOp struct so the agent knows the pattern to look for in SKILL.md. |
| `guides/interact-with-contracts.mdx` | Prompt specifies both ETH and USDC balance reads to demonstrate multi-asset queries. |

**Pages deliberately NOT changed:**
- `guides/run-a-node.mdx` — Not an agent task (requires hardware, Docker, firewall config)
- `guides/enable-a-prover.mdx` — Not an agent task (requires SGX hardware, TAIKO bond deposits)
- All `protocol/` pages — Conceptual content read the same way by both audiences
- All `network/` pages — Reference tables, no action divergence
- All `resources/` pages — Reference content

**Why this pattern is better than tabs:**
1. Both prompt and manual content are visible simultaneously — no hidden tab
2. The old `[Human]` tab just said "Follow the guide below" which added zero value
3. The prompt block is clearly a copy-paste target with specific context (SKILL.md URL, key flags)
4. The `---` separator creates a clean visual break between the two modes
5. Agents reading raw markdown see both the prompt AND the full guide

### Nice to Have (Future)

| # | Enhancement |
|---|-------------|
| 10 | Add MCP server endpoint at `/api/mcp` |
| 11 | Add multi-language code examples (ethers.js, Hardhat, Python) to guides |
| 12 | Add `/addresses.json` structured endpoint |
| 13 | Add use case pages ("Build X with Taiko") |
| 14 | Add section hub/index pages with card navigation |
| 15 | Add formal TRC protocol spec documents alongside explanatory pages |
