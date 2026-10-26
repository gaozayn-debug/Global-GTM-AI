# Deployment / 部署

## Cloud static host
`public/profit/` is a complete offline-capable static app. Publish this directory on any HTTPS static host; it needs no build, key, server, localhost or owner's computer. All paths are relative. Drafts remain browser-local; JSON exports enable cross-device transfer. It is not a cloud database.

## Vercel / Next
Connect this GitHub repository, select the V2 branch and use `npm ci`, `npm run build`, Next.js defaults. No env vars are needed for the main workflow. Root `/` embeds `/profit/index.html`. Vercel account authentication must be completed by the account owner; no paid services are required by the code.

## Development / QA
Node with npm: `npm ci`, `npm test`, `npm run typecheck`, `npm run build`. `npm run dev` is only a developer option, never required for deployed use.

## Optional legacy AI
Copy `.env.example` on a server only. Never commit keys. The V2 static app does not call the legacy API. A configured API may incur provider charges. Live AI was not tested without credentials. Do not claim a model call succeeded from parser fixtures.

## GitHub workflow
V2 belongs on `feat/v2-profit-lab`; retain main history and review the PR. Static assets can be deployed independently of merging. Keep actual data out of the public repository.
