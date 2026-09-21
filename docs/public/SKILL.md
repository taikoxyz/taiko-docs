---
name: taiko
description: >
  Taiko network reference for AI agents — RPC endpoints, chain IDs, contract addresses,
  bridging, and Taiko-specific behavior. Use this skill whenever you need to deploy contracts
  to Taiko, bridge tokens between Ethereum and Taiko, read on-chain state from Taiko,
  submit transactions to Taiko L2, configure a wallet or dApp for Taiko, look up Taiko
  contract addresses, or interact with Taiko in any way. Also trigger when the user mentions
  Taiko, Taiko Alethia, Taiko Hoodi, based rollup development, or asks about EVM chain
  differences for chain ID 167000 or 167013.
---

# Taiko — Agent Reference

Taiko is a based rollup on Ethereum. "Based" means Ethereum L1 validators sequence Taiko blocks — there is no centralized sequencer. Taiko is a type-1 ZK-EVM: fully Ethereum-equivalent. Standard EVM tooling works without modification.

## Quick Reference

|           | Mainnet (Alethia)               | Testnet (Hoodi)                 |
| --------- | ------------------------------- | ------------------------------- |
| Chain ID  | `167000`                        | `167013`                        |
| RPC       | `https://rpc.mainnet.taiko.xyz` | `https://rpc.hoodi.taiko.xyz`   |
| Explorer  | `https://taikoscan.io`          | `https://hoodi.taikoscan.io`    |
| L1        | Ethereum (1)                    | Ethereum Hoodi (560048)         |
| Currency  | ETH                             | ETH                             |
| Bridge UI | `https://bridge.taiko.xyz`      | `https://bridge.hoodi.taiko.xyz` |

## How Taiko Differs from Ethereum

- **No sequencer**: blocks are proposed by anyone and sequenced by L1 validators
- **EVM version**: Osaka. Transient storage, `MCOPY`, the BLS12-381 precompiles, `CLZ`, and `P256VERIFY` are available. See the "EVM Compatibility" section below for how to configure your tooling.
- **No blob transactions**: EIP-4844 (type-3) transactions are rejected on L2. `BLOBHASH` always returns `0` and `BLOBBASEFEE` always returns `1` because L2 blocks never carry blobs. Never build a blob transaction for Taiko.
- **zk gas**: every block is also metered in proving-cost-weighted "zk gas" with a per-block cap (`BLOCK_ZK_GAS_LIMIT`). A transaction that pushes a block over the cap is aborted and its state changes discarded, even with ordinary gas to spare; heavy precompiles (BLS12-381 pairing, `modexp`, point evaluation, BLAKE2F) carry large weights. If a call fails with `zk gas limit exceeded`, split the work; raising the gas limit does not help. See SITEURLPLACEHOLDER/protocol/unzen-fork.
- **Proving**: multi-proof system in which two independent sub-proofs, at least one of them ZK (RISC0 or SP1), must agree on every proposal range.

Everything else — account model, precompile addresses, and all other transaction types — matches Ethereum.

## EVM Compatibility (Osaka)

Taiko runs on the Osaka EVM version. Contracts compiled for any EVM target up to and including Osaka run on Taiko.

**Available on Taiko:**

- `TSTORE` / `TLOAD` (transient storage, EIP-1153) — used by OpenZeppelin's `ReentrancyGuardTransient` (v5.1+); the default `ReentrancyGuard` does not use transient storage
- `MCOPY` (EIP-5656)
- BLS12-381 precompiles (addresses `0x0b`–`0x11`)
- `CLZ` opcode (`0x1e`) and the `P256VERIFY` precompile (`0x100`)

**Not available on Taiko:**

- EIP-4844 blob transactions (type-3). The `BLOBHASH` and `BLOBBASEFEE` opcodes execute but always return `0` and `1` respectively.

**How to configure Foundry:**

Add a Taiko profile to your `foundry.toml`:

```toml
[profile.taiko]
evm_version = "osaka"
```

Then build and deploy with the profile:

```bash
FOUNDRY_PROFILE=taiko forge build
FOUNDRY_PROFILE=taiko forge create src/MyContract.sol:MyContract \
  --rpc-url https://rpc.mainnet.taiko.xyz \
  --private-key $PRIVATE_KEY
```

Alternatively, pass the flag directly:

```bash
forge build --evm-version osaka
```

Solidity's default EVM target changes between compiler releases, and any target up to Osaka runs on Taiko, so an unpinned build works. Pin `evm_version = "osaka"` to use `CLZ`, `P256VERIFY`, and the BLS12-381 precompiles from Solidity and to keep verification metadata consistent. The `osaka` target requires solc 0.8.29 or newer: older compilers reject it, and Foundry silently falls back to the newest target the compiler supports.

**Dependencies:** Libraries that use transient storage internally (such as `ReentrancyGuardTransient`) work on Taiko's Osaka EVM without modification. If a project still has `evm_version = "shanghai"` from earlier versions of these docs, change it to `osaka` first; transient-storage code does not compile under a Shanghai target.

## Tooling

Use standard EVM tools. No Taiko-specific SDK or CLI is required.

- **Foundry**: `forge create --rpc-url https://rpc.mainnet.taiko.xyz ...`
- **Hardhat**: set `url: "https://rpc.mainnet.taiko.xyz"` in network config
- **viem**: `createPublicClient({ chain: taiko, transport: http() })` — Taiko is in viem's chain list
- **ethers.js**: `new JsonRpcProvider("https://rpc.mainnet.taiko.xyz")`
- **cast**: `cast call --rpc-url https://rpc.mainnet.taiko.xyz ...`

For contract verification, Taikoscan is served through the Etherscan V2 unified API. The same Etherscan API key works for every chain; the `chainid` query param routes the request.

- Mainnet: `https://api.etherscan.io/v2/api?chainid=167000`
- Testnet: `https://api.etherscan.io/v2/api?chainid=167013`

The old `api.taikoscan.io/api` / `api-hoodi.taikoscan.io/api` V1 endpoints are deprecated and will return an error.

## Contract Addresses — Mainnet L1 (Ethereum)

Contracts developers interact with most on Ethereum mainnet:

| Contract           | Address                                      |
| ------------------ | -------------------------------------------- |
| TaikoToken (TAIKO) | `0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800` |
| Bridge             | `0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC` |
| SignalService      | `0x9e0a24964e5397B566c1ed39258e21aB5E35C77C` |
| ERC20Vault         | `0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab` |
| Permit2            | `0x000000000022D473030F116dDEE9F6B43aC78BA3` |

## Contract Addresses — Mainnet L2 (Taiko Alethia)

L2 contracts are predeployed at deterministic `0x167000...` addresses:

| Contract             | Address                                      |
| -------------------- | -------------------------------------------- |
| Bridge               | `0x1670000000000000000000000000000000000001` |
| ERC20Vault           | `0x1670000000000000000000000000000000000002` |
| SignalService        | `0x1670000000000000000000000000000000000005` |
| TaikoToken (bridged) | `0xA9d23408b9bA935c230493c40C73824Df71A0975` |
| USDC (native)        | `0x07d83526730c7438048D55A4fc0b850e2aaB6f0b` |
| WETH                 | `0xA51894664A773981C6C112C43ce576f315d5b1B6` |
| Permit2              | `0x000000000022D473030F116dDEE9F6B43aC78BA3` |

## Contract Addresses — Testnet L1 (Ethereum Hoodi)

| Contract      | Address                                      |
| ------------- | -------------------------------------------- |
| TaikoToken    | `0xf3b83e226202ECf7E7bb2419a4C6e3eC99e963DA` |
| Bridge        | `0x6a4cf607DaC2C4784B7D934Bcb3AD7F2ED18Ed80` |
| SignalService | `0x4c70b7F5E153D497faFa0476575903F9299ed811` |
| ERC20Vault    | `0x0857cd029937E7a119e492434c71CB9a9Bb59aB0` |

## Contract Addresses — Testnet L2 (Taiko Hoodi)

L2 contracts are predeployed at deterministic `0x167013...` addresses:

| Contract             | Address                                      |
| -------------------- | -------------------------------------------- |
| Bridge               | `0x1670130000000000000000000000000000000001` |
| ERC20Vault           | `0x1670130000000000000000000000000000000002` |
| SignalService        | `0x1670130000000000000000000000000000000005` |
| TaikoToken (bridged) | `0x557f5b2b222F1F59F94682dF01D35Dd11f37939a` |
| WETH                 | `0x3B39685B5495359c892DDD1057B5712F49976835` |

## Common Tasks

### Deploy a contract

```bash
# Using Foundry (recommended) — the taiko profile pins the Osaka EVM (solc 0.8.29 or newer).
# --broadcast is REQUIRED: without it forge create only simulates and nothing deploys.
FOUNDRY_PROFILE=taiko forge create src/MyContract.sol:MyContract \
  --rpc-url https://rpc.mainnet.taiko.xyz \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify \
  --verifier etherscan \
  --verifier-url 'https://api.etherscan.io/v2/api?chainid=167000' \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

### Verify a contract

```bash
FOUNDRY_PROFILE=taiko forge verify-contract $CONTRACT_ADDRESS \
  src/MyContract.sol:MyContract \
  --verifier etherscan \
  --verifier-url 'https://api.etherscan.io/v2/api?chainid=167000' \
  --etherscan-api-key $ETHERSCAN_API_KEY \
  --watch
```

Swap `chainid=167000` → `chainid=167013` for Hoodi testnet.

### Read on-chain state

```bash
# Get ETH balance
cast balance $ADDRESS --rpc-url https://rpc.mainnet.taiko.xyz

# Call a contract
cast call $CONTRACT "balanceOf(address)(uint256)" $ADDRESS \
  --rpc-url https://rpc.mainnet.taiko.xyz
```

### Add Taiko to a wallet or dApp

```json
{
  "chainId": "0x28C58",
  "chainName": "Taiko Mainnet",
  "nativeCurrency": { "name": "Ether", "symbol": "ETH", "decimals": 18 },
  "rpcUrls": ["https://rpc.mainnet.taiko.xyz"],
  "blockExplorerUrls": ["https://taikoscan.io"]
}
```

```json
{
  "chainId": "0x28C65",
  "chainName": "Taiko Testnet",
  "nativeCurrency": { "name": "Ether", "symbol": "ETH", "decimals": 18 },
  "rpcUrls": ["https://rpc.hoodi.taiko.xyz"],
  "blockExplorerUrls": ["https://hoodi.taikoscan.io"]
}
```

Hex chain ID: `0x28C58` (167000 decimal). For Hoodi testnet: `0x28C65` (167013 decimal).

### Bridge tokens (programmatic)

Bridging uses the Bridge contract on L1. Send a message with ETH value to the L1 Bridge:

1. On L1, call `Bridge.sendMessage()` at `0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC`.
2. For ERC-20 tokens, `ERC20Vault` (`0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab`) exposes three send paths — pick one:
   - `sendToken()` — the classic two-transaction flow. Requires a prior `approve` to the vault.
   - `sendTokenWithPermit()` — one transaction, for tokens that implement EIP-2612 `permit` (including Taiko's own `BridgedERC20V2`). The caller signs the permit off-chain.
   - `sendTokenWithPermit2()` — one transaction, works for **any** ERC-20 via Uniswap Permit2 at `0x000000000022D473030F116dDEE9F6B43aC78BA3`. Best for tokens without `permit` (USDT, WBTC, and similar) or when the caller has already granted Permit2 an allowance.
3. The bridge relayer processes the message — tokens appear on L2 after L1 finalization.

For the bridge UI: `https://bridge.taiko.xyz` or `https://bridge.hoodi.taiko.xyz`.

## Rules for Agents

- Always use the RPC endpoints listed above. Do not guess or fabricate endpoints.
- L2 predeployed contracts are at fixed addresses: `0x167000...` on mainnet and `0x167013...` on Hoodi (see the tables above) — do not search for them.
- Use Foundry (`forge`, `cast`) as the default CLI tooling unless the user specifies otherwise.
- When deploying, always verify contracts on the explorer in the same step.
- Build and deploy with `FOUNDRY_PROFILE=taiko` (or `--evm-version osaka`); this needs solc 0.8.29 or newer. Always pass `--broadcast` to `forge create`.
- For testnet work, use Hoodi (chain ID 167013) not any deprecated testnet.
- Contract addresses may update across protocol upgrades. For the canonical latest addresses, check:
  - L1: https://github.com/taikoxyz/taiko-mono/blob/main/packages/protocol/deployments/mainnet-contract-logs-L1.md
  - L2: https://github.com/taikoxyz/taiko-mono/blob/main/packages/protocol/deployments/mainnet-contract-logs-L2.md

## Full Documentation

For detailed guides, protocol design, node operation, and more:

- All docs: `SITEURLPLACEHOLDER/llms-full.txt`
- Docs index: `SITEURLPLACEHOLDER/llms.txt`
- Web docs: `SITEURLPLACEHOLDER`
