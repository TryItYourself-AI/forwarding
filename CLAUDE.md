# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Cloudflare Pages URL redirector service. Incoming requests are matched against domain-based environment variable rules and returned as 301 redirects. The React frontend is a no-op placeholder; all logic lives in the Pages Function.

## Commands

```bash
npm run dev      # Local dev server (Wrangler Pages dev mode)
npm run build    # Build with Vite
npm run deploy   # Build + deploy to Cloudflare Pages
```

No test runner is configured.

## Architecture

```
Request → functions/[[path]].ts → env var lookup → 301 redirect
```

- **`functions/[[path]].ts`** — Catch-all Cloudflare Pages Function. Extracts source host, resolves target domain via `getTargetDomain(env, sourceHost)`, and returns a 301 redirect to `https://<target><path><query>`.
- **`src/`** — Minimal React app that renders nothing. Exists only to satisfy the Cloudflare Pages build pipeline.

## Domain Mapping Convention

Environment variables control forwarding rules:

| Env Var | Effect |
|---|---|
| `FROM_example_com = "target.com"` | `example.com/*` → `target.com/*` |
| `FROM_www_example_com = "example.com"` | `www.example.com/*` → `example.com/*` |
| `DEFAULT_TARGET = "tiy.ai"` | Fallback for unmatched domains |

Domain names are converted to env var keys by replacing `.` and `-` with `_`, prefixed with `FROM_`.

## Key Files

- `functions/[[path]].ts` — All redirect logic (the only file that matters for business logic)
- `wrangler.toml` — Cloudflare config and default env vars
- `tsconfig.json` — Includes both `src` and `functions` directories; uses `@cloudflare/workers-types`
