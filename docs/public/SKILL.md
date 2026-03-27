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
| Bridge UI | `https://bridge.taiko.xyz`      | `https://bridge.hoodi.taiko.xyz |

## How Taiko Differs from Ethereum

- **No sequencer**: blocks are proposed by anyone and sequenced by L1 validators
- **EVM version**: Shanghai. Cancun opcodes (`TSTORE`, `TLOAD`, `MCOPY`, `BLOBHASH`, `BLOBBASEFEE`) are not available. See the "EVM Compatibility" section below for how to configure your tooling.
- **Proving**: multi-proof system requiring multiple independent proof types (SGX and ZK) to agree on every state transition.

Everything else — precompiles, account model, transaction format — is identical to Ethereum.

## EVM Compatibility (Shanghai)

Taiko runs on the Shanghai EVM version. If your contracts or dependencies use Cancun-only features (transient storage, mcopy, blob opcodes), they will fail to deploy or execute on Taiko.

**What does NOT work on Taiko:**

- `TSTORE` / `TLOAD` (transient storage, EIP-1153) — used by some OpenZeppelin v5 ReentrancyGuard variants
- `MCOPY` (EIP-5656)
- `BLOBHASH` / `BLOBBASEFEE` (EIP-4844)

**How to configure Foundry:**

Add a Taiko profile to your `foundry.toml`:

```toml
[profile.taiko]
evm_version = "shanghai"
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
forge build --evm-version shanghai
```

If using Solidity 0.8.24+, the compiler defaults to Cancun. Setting `evm_version = "shanghai"` in your Foundry profile ensures the compiler targets the correct opcode set.

**Checking your dependencies:** If a library uses transient storage internally (common in newer reentrancy guards), you need a version of that library compatible with Shanghai. Check for `tstore`/`tload` in the library's assembly blocks.

## Tooling

Use standard EVM tools. No Taiko-specific SDK or CLI is required.

- **Foundry**: `forge create --rpc-url https://rpc.mainnet.taiko.xyz ...`
- **Hardhat**: set `url: "https://rpc.mainnet.taiko.xyz"` in network config
- **viem**: `createPublicClient({ chain: taiko, transport: http() })` — Taiko is in viem's chain list
- **ethers.js**: `new JsonRpcProvider("https://rpc.mainnet.taiko.xyz")`
- **cast**: `cast call --rpc-url https://rpc.mainnet.taiko.xyz ...`

For contract verification, use the explorer APIs:

- Mainnet: `https://api.taikoscan.io/api` (Etherscan-compatible)
- Testnet: `https://api-hoodi.taikoscan.io/api`

## Contract Addresses — Mainnet L1 (Ethereum)

Contracts developers interact with most on Ethereum mainnet:

| Contract           | Address                                      |
| ------------------ | -------------------------------------------- |
| TaikoToken (TAIKO) | `0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800` |
| Bridge             | `0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC` |
| SignalService      | `0x9e0a24964e5397B566c1ed39258e21aB5E35C77C` |
| ERC20Vault         | `0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab` |

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

## Contract Addresses — Testnet L1 (Ethereum Hoodi)

| Contract      | Address                                      |
| ------------- | -------------------------------------------- |
| TaikoToken    | `0xf3b83e226202ECf7E7bb2419a4C6e3eC99e963DA` |
| Bridge        | `0x6a4cf607DaC2C4784B7D934Bcb3AD7F2ED18Ed80` |
| SignalService | `0x4c70b7F5E153D497faFa0476575903F9299ed811` |
| ERC20Vault    | `0x0857cd029937E7a119e492434c71CB9a9Bb59aB0` |

## Contract Addresses — Testnet L2 (Taiko Hoodi)

L2 contracts are predeployed at deterministic `0x167000...` addresses:

| Contract             | Address                                      |
| -------------------- | -------------------------------------------- |
| Bridge               | `0x1670000000000000000000000000000000000001` |
| ERC20Vault           | `0x1670000000000000000000000000000000000002` |
| SignalService        | `0x1670000000000000000000000000000000000005` |
| TaikoToken (bridged) | `0x557f5b2b222F1F59F94682dF01D35Dd11f37939a` |
| WETH                 | `0x3B39685B5495359c892DDD1057B5712F49976835` |

## Common Tasks

### Deploy a contract

```bash
# Using Foundry (recommended) — use the taiko profile to target Shanghai EVM
FOUNDRY_PROFILE=taiko forge create src/MyContract.sol:MyContract \
  --rpc-url https://rpc.mainnet.taiko.xyz \
  --private-key $PRIVATE_KEY \
  --verify \
  --verifier etherscan \
  --verifier-url https://api.taikoscan.io/api \
  --etherscan-api-key $TAIKOSCAN_API_KEY
```

### Verify a contract

```bash
forge verify-contract $CONTRACT_ADDRESS src/MyContract.sol:MyContract \
  --chain-id 167000 \
  --verifier etherscan \
  --verifier-url https://api.taikoscan.io/api \
  --etherscan-api-key $TAIKOSCAN_API_KEY
```

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
  "chainId": "0x28C75",
  "chainName": "Taiko Testnet",
  "nativeCurrency": { "name": "Ether", "symbol": "ETH", "decimals": 18 },
  "rpcUrls": ["https://rpc.hoodi.taiko.xyz"],
  "blockExplorerUrls": ["https://hoodi.taikoscan.io"]
}
```

Hex chain ID: `0x28C58` (167000 decimal). For Hoodi testnet: `0x28C75` (167013 decimal).

### Bridge tokens (programmatic)

Bridging uses the Bridge contract on L1. Send a message with ETH value to the L1 Bridge:

1. On L1, call `Bridge.sendMessage()` at `0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC`
2. For ERC20 tokens, approve the ERC20Vault (`0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab`) then call `sendToken()`
3. The bridge relayer processes the message — tokens appear on L2 after L1 finalization

For the bridge UI: `https://bridge.taiko.xyz` or `https://bridge.hoodi.taiko.xyz`.

## Rules for Agents

- Always use the RPC endpoints listed above. Do not guess or fabricate endpoints.
- L2 predeployed contracts are at fixed `0x167000...` addresses — do not search for them.
- Use Foundry (`forge`, `cast`) as the default CLI tooling unless the user specifies otherwise.
- When deploying, always verify contracts on the explorer in the same step.
- Always use `FOUNDRY_PROFILE=taiko` or `--evm-version shanghai` when building or deploying with Foundry.
- For testnet work, use Hoodi (chain ID 167013) not any deprecated testnet.
- Contract addresses may update across protocol upgrades. For the canonical latest addresses, check:
  - L1: https://github.com/taikoxyz/taiko-mono/blob/main/packages/protocol/deployments/mainnet-contract-logs-L1.md
  - L2: https://github.com/taikoxyz/taiko-mono/blob/main/packages/protocol/deployments/mainnet-contract-logs-L2.md

## Full Documentation

For detailed guides, protocol design, node operation, and more:

- All docs: `https://taiko-agent-docs.vercel.app/llms-full.txt`
- Docs index: `https://taiko-agent-docs.vercel.app/llms.txt`
- Web docs: `https://taiko-agent-docs.vercel.app`
