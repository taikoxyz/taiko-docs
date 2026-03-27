# Taiko Docs

> **Work in progress.** This is not the current live documentation site. It is under active development and not yet deployed to the official domain.

Agent-first documentation for [Taiko](https://taiko.xyz), a based rollup on Ethereum.

Built with [Vocs](https://vocs.dev). Every page is designed for both human developers and AI agents, with machine-readable formats generated automatically.

## Development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
pnpm preview
```

## AI-readable formats

The site auto-generates machine-readable docs:

- `/llms.txt` — Page index with descriptions
- `/llms-full.txt` — Full docs as plain text
- `/<path>.md` — Any page as raw Markdown

The site also serves a SKILL.md for agents with instructions on how to interact with the chain.

- `/SKILL.md` — Agent reference file

## Contributing

View [CONTRIBUTING.md](https://github.com/taikoxyz/taiko-mono/blob/main/CONTRIBUTING.md) in the Taiko monorepo.
