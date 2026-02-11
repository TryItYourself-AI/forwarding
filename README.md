# Forwarding

A lightweight URL redirector service built on [Cloudflare Pages](https://pages.cloudflare.com/). It performs 301 permanent redirects based on per-domain environment variable rules, with an optional default fallback.

## How It Works

All incoming requests are handled by a single [Pages Function](https://developers.cloudflare.com/pages/functions/) (`functions/[[path]].ts`). The function:

1. Reads the source hostname from the request.
2. Looks up a matching environment variable (`FROM_<domain>`).
3. Falls back to `DEFAULT_TARGET` if no specific rule matches.
4. Returns a **301 redirect** to `https://<target><path><query>`.

If neither a specific rule nor `DEFAULT_TARGET` is set, a 500 error is returned.

## Configuration

Forwarding rules are defined as environment variables. Domain names are converted to variable keys by replacing `.` and `-` with `_`, then prefixed with `FROM_`.

| Environment Variable | Effect |
|---|---|
| `FROM_example_com = "target.com"` | `example.com/*` &rarr; `target.com/*` |
| `FROM_www_example_com = "example.com"` | `www.example.com/*` &rarr; `example.com/*` |
| `FROM_my_site_org = "newsite.com"` | `my-site.org/*` &rarr; `newsite.com/*` |
| `DEFAULT_TARGET = "tiy.ai"` | Fallback for any unmatched domain |

**Local development:** set variables in `wrangler.toml` under `[vars]`.
**Production:** configure via Cloudflare Dashboard &rarr; Pages &rarr; Project Settings &rarr; Environment Variables.

## Development

```bash
npm install          # Install dependencies
npm run dev          # Start local dev server (Wrangler Pages)
npm run build        # Build with Vite
npm run deploy       # Build + deploy to Cloudflare Pages
```

## License

MIT
