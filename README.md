# clearpay-audit

Starter Next.js 15 project configured for Cloudflare Pages using `@cloudflare/next-on-pages`.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS 4
- Cloudflare Pages + Wrangler
- Supabase client SDK
- Stripe SDK
- Resend SDK

## Prerequisites

- Node.js 20+
- npm
- A Cloudflare account for Pages deployment

## Environment variables

Create and fill these files locally before integrating real services:

- `.env.local` for Next.js local development
- `.dev.vars` for Wrangler / Cloudflare local bindings

Example templates are committed in:

- `.env.example`
- `.dev.vars.example`

Required keys:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_BASE_URL=http://localhost:3000
JINA_API_KEY=
```

## Scripts

```bash
npm run dev         # Next.js local dev server
npm run type-check  # TypeScript validation
npm run lint        # ESLint
npm run build       # Next.js production build
npm run pages:build # Build Cloudflare Pages output via next-on-pages
npm run pages:dev   # Preview Pages output locally with Wrangler
```

## Local development

### 1. Install dependencies

```bash
npm install
```

### 2. Start the Next.js dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 3. Build Cloudflare Pages output

```bash
npm run pages:build
```

This generates the Cloudflare-compatible output in `.vercel/output/static`.

### 4. Preview the Pages build locally

```bash
npm run pages:dev -- .vercel/output/static
```

If you prefer, you can also run Wrangler directly:

```bash
wrangler pages dev .vercel/output/static
```

## Cloudflare configuration

`wrangler.toml` is configured with:

- `name = "clearpay-audit"`
- `compatibility_date = "2024-11-01"`
- `compatibility_flags = ["nodejs_compat"]`
- `pages_build_output_dir = ".vercel/output/static"`

## Notes

- The project uses system font fallbacks instead of remote Google font downloads so builds are more reliable in CI and restricted environments.
- `app/page.tsx` remains the default scaffold content.
- Binary assets were intentionally removed from the repository so GitHub PR creation works cleanly in environments that reject binary files.
