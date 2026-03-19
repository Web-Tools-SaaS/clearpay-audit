# Latest Change

## 2026-03-19

### What changed
- Added `export const runtime = 'edge'` to `app/processing/[id]/page.tsx` so the dynamic processing route satisfies Cloudflare Pages and `@cloudflare/next-on-pages` edge-runtime requirements during preview and production builds.
- Logged this task in `latestchange.md`.

### Why this changed
- Cloudflare preview builds were failing even though Next.js compiled locally, because the dynamic `/processing/[id]` App Router page did not explicitly opt into the Edge Runtime that the current Pages adapter requires for non-static routes.

## 2026-03-19

### What changed
- Added `app/processing/[id]/page.tsx` as a client-side Next.js 15 processing screen that polls `/api/audit/[id]` every five seconds, redirects completed audits to `/report/[id]`, stops polling for `needs_input` and `error` states, and shows state-specific UI for loading, extra URL submission, and failure recovery.
- Styled the extra URL form to match the existing `AuditForm` input/button treatment and added client-side validation before posting to `/api/audit/[id]/submit-extra`.
- Logged this task in `latestchange.md`.

### Why this changed
- The audit flow needed a dedicated handoff page after submission so users can see progress, recover cart-gated Shopify audits by supplying additional URLs, and get clear failure messaging without breaking the existing API contract.

## 2026-03-19

### What changed
- Replaced `components/AuditForm.tsx` with the requested client-side hero form variant that uses pure React state, posts to `/api/create-audit`, shows a loading spinner, surfaces API errors inline, and redirects successful submissions to `/processing/[audit_id]`.
- Logged this task in `latestchange.md`.

### Why this changed
- The landing page hero now needs the exact submission UX requested for production: a simpler three-field form, clearer CTA copy, and a direct handoff into the processing route after the audit is created.

## 2026-03-19

### What changed
- Replaced the default `app/page.tsx` scaffold with a full ClearPay Audit landing page tailored to UK merchants, including the requested FCA deadline hero, workflow, compliance-check grid, authority-focused stats section, and footer CTA.
- Added `components/AuditForm.tsx` as a dedicated client component for the landing page form, wired to the existing `/api/create-audit` endpoint with URL, provider, and work-email inputs.
- Logged this task in `latestchange.md`.

### Why this changed
- The product needed a credible, merchant-facing homepage that explains the FCA BNPL compliance deadline clearly and gives visitors a direct path to start the paid £99 audit flow without relying on placeholder Next.js content.

## 2026-03-19

### What changed
- Updated `app/layout.tsx` metadata to brand the app as ClearPay Audit with UK BNPL/FCA-focused title and description text while keeping the existing root html/body structure intact.
- Replaced the `:root` and `@theme` blocks in `app/globals.css` with the new B2B SaaS compliance design tokens, system font stack, body smoothing, and global box-sizing rule.
- Logged this task in `latestchange.md`.

### Why this changed
- The product now needs professional UK merchant-facing branding and a clearer compliance-focused visual foundation before more UI work is layered on top.

## 2026-03-19

### What changed
- Added `app/api/audit/[id]/submit-extra/route.ts` as an Edge runtime Next.js 15 POST endpoint that validates 1-3 secure extra URLs, checks the audit is waiting for manual input, switches it back to `processing`, and resumes the crawl/rule-engine pipeline using the newly submitted pages.
- Logged this task in `latestchange.md`.

### Why this changed
- Audits that land on cart-gated or too-thin content now need a production-safe recovery path so a user can submit a few additional pages and let the compliance audit finish without creating a second audit record.

## 2026-03-19

### What changed
- Added `app/api/audit/[id]/route.ts` as an Edge runtime Next.js 15 App Router GET endpoint that awaits promised route params, validates the audit ID, and returns only the safe audit fields from Supabase.
- Logged this task in `latestchange.md`.

### Why this changed
- The app now needs a Cloudflare Pages-safe audit lookup endpoint so the frontend can poll audit status without exposing sensitive fields such as emails, crawl content, payment data, or service credentials.

## 2026-03-19

### What changed
- Added `app/api/create-audit/route.ts` as an Edge runtime Next.js App Router endpoint that validates incoming audit requests, creates the initial `audits` row in Supabase, and then starts the crawl/rule-engine pipeline with an edge-safe fire-and-forget pattern.
- Logged this task in `latestchange.md`.

### Why this changed
- The app now needs a production-ready create-audit API entry point for Cloudflare Pages that returns an audit ID immediately while the crawl and rule-engine work continues in the background without blocking the browser request.

## 2026-03-19

### What changed
- Removed the binary file `app/favicon.ico` from the repository.
- Updated `README.md` so it now reflects the real Cloudflare Pages workflow, environment setup, scripts, and the fact that the project uses system font fallbacks instead of remote font downloads.
- Added this `latestchange.md` file to keep a simple running record of the latest repo-level changes.

### Why this changed
- The previous PR could not be created because the repository still contained a binary file, and your GitHub flow rejected binary files.
- The README generated by the scaffold was outdated for this project because it still described the default Next.js/Vercel setup and old font behavior.
- Keeping a short latest-change log helps future tasks avoid contradicting recent project decisions.

## 2026-03-19

### What changed
- Added `lib/rule-engine/types.ts` with the shared rule-engine TypeScript unions and interfaces for rules, per-rule results, overall audit results, and source references.
- Logged this task in `latestchange.md`.

### Why this changed
- The audit domain now has a single typed contract for rule definitions and audit output, which makes future rule-engine code easier to build consistently without introducing ad-hoc shapes.

## 2026-03-19

### What changed
- Added `lib/rule-engine/normalise.ts` with pure string helpers for text normalisation and whitespace-based word counting for the rule-engine pipeline.
- Logged this task in `latestchange.md`.

### Why this changed
- The audit pipeline needs a consistent, dependency-free way to clean crawled content before search matching and to detect short cart-gated pages by word count.


## 2026-03-19

### What changed
- Added `lib/rule-engine/evaluateRule.ts` with the pure rule evaluation flow for search matching, invert handling, evidence generation, and result shaping.
- Logged this task in `latestchange.md`.

### Why this changed
- The rule engine now has a single reusable evaluator that converts normalized crawled text into the exact pass/fail result format expected by the audit pipeline.

## 2026-03-19

### What changed
- Added `lib/rule-engine/scorer.ts` with pure helpers to calculate audit scores, generate fixed-format FCA compliance summaries, and surface the top three fix suggestions by severity.
- Logged this task in `latestchange.md`.

### Why this changed
- The rule engine now needs a single, deterministic place to convert per-rule results into the numeric score and user-facing summary shown in the audit flow without introducing AI or extra dependencies.

## 2026-03-19

### What changed
- Added `lib/rule-engine/index.ts` with the pure `runRuleEngine` entry point that wires text normalisation, rule evaluation, scoring, summary generation, BNPL detection, and static FCA source references into one deterministic audit result.
- Added `lib/rule-engine/rules.ts` with a typed placeholder `RULES` export so the new entry point compiles cleanly until the concrete rule list is populated.
- Logged this task in `latestchange.md`.

### Why this changed
- The rule engine now needs a single importable orchestrator that returns the complete `AuditResult` shape for the audit flow without introducing async work, side effects, or network dependencies.

## 2026-03-19

### What changed
- Added `scripts/test-engine.ts`, a standalone terminal test script that fetches five placeholder Klarna Shopify URLs through `r.jina.ai`, runs the local deterministic rule engine twice per page, prints audit output, and writes one verification row to the Supabase `audits` table.
- Logged this task in `latestchange.md`.

### Why this changed
- The project now has a simple end-to-end smoke test for crawl input, deterministic rule-engine execution, and Supabase write access without depending on Next.js runtime APIs.

## 2026-03-19

### What changed
- Added `lib/supabase.ts` with a server-only `getSupabaseServiceClient()` helper that creates a Supabase client from `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
- Logged this task in `latestchange.md`.

### Why this changed
- The project now has a minimal shared helper for server-side routes that need service-role Supabase access without duplicating environment variable checks across API code.
