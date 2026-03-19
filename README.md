# ClearPay Audit

**UK BNPL Compliance Checker — FCA PS26/1 Rule Engine**

A deterministic SaaS tool for UK merchants offering Klarna, Clearpay, or
Laybuy. Merchants paste their checkout URL, receive a full compliance audit
report citing exact FCA clauses for every finding, and download a PDF.

**No AI. No hallucination risk. Every check is a string match.**

---

## Current Status

| Week | Scope | Status |
|---|---|---|
| Week 1 | Rule engine, 14 rules, Supabase schema | ✅ Done |
| Week 2 | Full pipeline, all UI pages, cart-gated flow | ✅ Done |
| Week 3 | PDF download (jsPDF), Lemon Squeezy paywall | 🔨 Next |
| Week 4 | Screenshot OCR fallback, error polish, production domain | ⏳ Pending |

**Hard deadline:** First paying customer by **May 15, 2026**

---

## Why This Exists

The UK FCA is bringing Buy Now Pay Later (now formally called Deferred Payment
Credit, or DPC) under formal regulation from **July 15, 2026**. FCA Policy
Statement PS26/1 (published 11 February 2026) requires BNPL lenders to surface
specific disclosures to consumers before they enter into an agreement. This
obligation flows down to merchants.

Enterprise law firms charge £2,500+ for a manual BNPL triage. There is no
automated SaaS tool for the 80,000+ small UK Shopify and WooCommerce merchants
who need to know right now whether their checkout is compliant.

**What we do:** Merchant pastes checkout URL → we crawl it → run it through
a deterministic rule engine derived directly from PS26/1 and CP25/23 → output
a compliance report that cites the exact FCA clause for each finding.

---

## Business Model

- Price TBD (was £99 one-time) — payments via **Lemon Squeezy** (not Stripe —
  Stripe India is invite-only for businesses; Lemon Squeezy is Merchant of
  Record, no registered business required)
- £19/month subscription for ongoing monitoring (post-MVP, waitlist only)
- Hard deadline: first paying customer by **May 15, 2026**

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend + API | Next.js 15 (App Router) | SSR + API routes in one repo |
| Database | Supabase | Free tier, Postgres + Storage |
| Hosting | Cloudflare Pages | Free tier, no commercial use restriction |
| URL Crawling | Jina.ai Reader API (`r.jina.ai`) | Renders JS pages to markdown, 1M tokens/month free |
| Compliance Engine | Custom TypeScript rule engine | In-repo, zero per-run cost, no AI |
| Payments | Lemon Squeezy | Merchant of Record, works without registered business |
| PDF Reports | jsPDF (client-side) | Pure browser JS, no Cloudflare runtime issues |
| Email | Resend (post-MVP) | Transactional email — skipped for MVP |

**No AI API calls in the audit pipeline. Zero. Do not add any.**

### Why Cloudflare Pages, not Vercel

Vercel Hobby ToS prohibits commercial use. This product charges for audits.
Cloudflare Pages free tier has no such restriction.

### Why jsPDF, not @react-pdf/renderer

Cloudflare Workers run on V8 isolates, not Node.js. `@react-pdf/renderer`
uses Node.js canvas internals and crashes in Cloudflare Pages Functions.
`jsPDF` is pure browser JavaScript — runs client-side on button click,
reads `audit_result` JSON already in Supabase. No server involved.

### Why after(), not ctx.waitUntil()

`after()` is the Next.js 15 native equivalent of `ctx.waitUntil()`. It
registers a promise before the response is dispatched, preventing the
Cloudflare V8 isolate from killing the pipeline mid-execution. The bare
fire-and-forget pattern (`promise.catch(...)`) does not work on Cloudflare —
the isolate terminates the moment the response is sent.

---

## Architecture — Current Flow (No Payment Yet)
```
[Merchant visits /]
  ↓
Enters: checkout URL + BNPL provider + email
  ↓
POST /api/create-audit
  → Validates input
  → Creates audit row in Supabase (status: 'processing')
  → after(runAuditPipeline(auditId))  ← Next.js 15 pattern
  → Returns { audit_id } immediately
  ↓
[/processing/[id] — polls GET /api/audit/[id] every 5 seconds]
  ↓
[Audit Pipeline — runs async via after()]
  Step 1: Fetch audit row from Supabase
  Step 2: Crawl URL via Jina.ai Reader API
  Step 3: Check word count — if < 400, set status='needs_input'
  Step 4: normaliseText() — lowercase, strip HTML/markdown/non-ASCII
  Step 5: runRuleEngine(text, provider) — all 14 rules evaluated
  Step 6: Update audit row: status='done', audit_result=JSON, score=N
  ↓
[/processing/[id] detects status='done' → redirects to /report/[id]]
  ↓
[/report/[id] — SSR, fetches directly from Supabase]
  → Score circle (colour-coded)
  → Top 3 priority fixes
  → Full 14-rule accordion results with evidence + FCA citations
  → Download PDF button (jsPDF, coming Week 3)
  → Waitlist CTA
```

### Cart-Gated Flow
```
[word count < 400 after initial crawl]
  ↓
status = 'needs_input', crawl_status = 'cart_gated'
  ↓
[/processing/[id] shows extra URL form]
Merchant submits up to 3 additional URLs
  ↓
POST /api/audit/[id]/submit-extra
  → Crawls each extra URL
  → Concatenates all text
  → Runs full pipeline on combined content
  ↓
[Redirects to /report/[id] on completion]
```

---

## The Rule Engine

Core of the product. Located in `lib/rule-engine/`.
```
lib/rule-engine/
  types.ts        — TypeScript interfaces (Rule, RuleCheckResult, AuditResult)
  normalise.ts    — Text cleaning before matching
  rules.ts        — All 14 Rule objects
  evaluateRule.ts — Single rule evaluator (handles invert flag)
  scorer.ts       — Score calculation, summary generation, top fixes
  index.ts        — runRuleEngine(text, provider): AuditResult
```

### Key Design Principles

**Pure function:** `runRuleEngine()` has zero side effects. Same input always
produces identical output. Legally required for an FCA compliance tool.

**No AI:** Every check is a string match. Results are verifiable. A lawyer
can read the rule definition and independently confirm the finding.

**Easily updatable:** If FCA clarifies a rule before July 15, edit one string
in `rules.ts`, rebuild, redeploy. No re-prompting, no migration.

### The 14 Rules

#### CRITICAL (6 rules) — 20 points deducted each on FAIL

| ID | Category |
|---|---|
| DPC-001 | BNPL Detection — provider mentioned on page |
| DPC-002 | Credit Nature — BNPL identified as credit, not just payment method |
| DPC-003 | Repayment Schedule — instalment count and GBP amount stated |
| DPC-004 | Interest Rate — 0% must be explicitly stated |
| DPC-005 | Consequences of Missed Payments — mandatory KPI disclosure |
| DPC-006 | Right to Withdraw — 14-day right under CCA s.66A |

#### HIGH (5 rules) — 10 points deducted each on FAIL

| ID | Category |
|---|---|
| DPC-007 | Lender Identity — full legal name + FCA Firm Reference Number (FRN) |
| DPC-008 | Early Settlement Rights — accessible in linked terms |
| DPC-009 | Section 75 / CCA Applicability — stated or accessible |
| DPC-010 | Prohibited Promotional Language — **INVERTED RULE** |
| DPC-011 | T&C Link — link to lender's full credit agreement terms |

#### MEDIUM (3 rules) — 5 points deducted each on FAIL

| ID | Category |
|---|---|
| DPC-012 | Continuous Payment Authority (CPA) — how auto-payments work |
| DPC-013 | Free Debt Advice Signposting — MoneyHelper, StepChange etc. |
| DPC-014 | FCA Authorisation — provider must be FCA-authorised by July 15 |

### The Inverted Rule (DPC-010)

All 13 standard rules: search for required strings → PASS if found, FAIL if absent.

DPC-010 works in reverse: search for prohibited strings like "treat yourself",
"why wait", "guilt-free" → **FAIL if found, PASS if absent.**

The `Rule` interface has `invert?: boolean`. DPC-010 has `invert: true`.
`evaluateRule()` checks this flag and flips logic. Missing this flag causes
merchants with predatory copy to silently PASS — product-destroying bug.

### Scoring
```
Score = 100 - deductions
CRITICAL FAIL: -20 points
HIGH FAIL:     -10 points
MEDIUM FAIL:    -5 points
UNCLEAR:       half deduction
Minimum:        0
```

Score colour coding: ≥ 80 green · 60–79 amber · < 60 red

---

## Database Schema

### Table: `audits`

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | Auto-generated |
| created_at | timestamptz | Auto |
| email | text | Merchant email |
| url | text | Primary URL submitted |
| extra_urls | text[] | Additional URLs from cart-gated flow |
| bnpl_provider | text | 'klarna' \| 'clearpay' \| 'laybuy' \| 'other' |
| lemon_order_id | text | Added for future Lemon Squeezy integration |
| stripe_session | text | Reserved — Stripe not in use |
| payment_status | text | 'pending' \| 'paid' — set to 'paid' on creation (no payment yet) |
| crawl_content | text | Concatenated normalised text |
| crawl_status | text | 'ok' \| 'cart_gated' \| 'screenshot_ocr' \| 'failed' |
| crawl_method | text | 'jina' \| 'screenshot_ocr' |
| audit_result | jsonb | Full AuditResult JSON from rule engine |
| report_pdf_url | text | Reserved for future use |
| status | text | 'queued' \| 'processing' \| 'needs_input' \| 'done' \| 'error' |
| score | numeric | 0–100 compliance score |
| error_message | text | Error detail if status='error' |

### Table: `waitlist`

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | Auto-generated |
| email | text NOT NULL | Merchant email |
| audit_id | uuid FK → audits.id | Associated audit |
| created_at | timestamptz | Auto |

### Permissions

RLS disabled. Service role key only. Grants applied manually:
```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON public.audits TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.waitlist TO service_role;
```

---

## API Routes

### `POST /api/create-audit`
```json
{ "email": "merchant@store.co.uk", "url": "https://...", "bnpl_provider": "klarna" }
```

Validates input → creates audit row → fires pipeline via `after()` →
returns `{ audit_id }` immediately.

### `GET /api/audit/[id]`

Returns `{ id, status, score, crawl_status, audit_result, error_message }`.
Polled every 5 seconds by `/processing/[id]`.

### `POST /api/audit/[id]/submit-extra`

Input: `{ urls: string[] }` (1–3 URLs, all must start with `https://`).
Only valid when audit `status === 'needs_input'`. Crawls each URL,
concatenates with existing content, re-runs full pipeline.

### `POST /api/waitlist`

Input: `{ email, audit_id? }`. Inserts into waitlist table, silently
ignores duplicate emails.

---

## Frontend Pages

### `/` — Landing Page

Server component. AuditForm is a client component. Sections: hero with
regulation deadline badge, how it works (3 steps), what we check (14 rules
with severity dots), why it matters (stats + explanation), footer.

### `/processing/[id]` — Progress Page

Client component. Polls every 5 seconds. States:

- `null / queued / processing` — animated spinner, cycling step text
- `needs_input` — extra URL submission form (up to 3 URLs)
- `done` — auto-redirects to `/report/[id]`
- `error` — error message + "Try again" button

### `/report/[id]` — Results Page

Server component (SSR, fast). Fetches directly from Supabase. Sections:
score hero, top 3 fixes, full rule accordion (14 rules, expand/collapse,
evidence + FCA source + fix suggestion), FCA sources, disclaimer, waitlist CTA.

**PlaceholderPDFButton:** Currently shows "Download PDF (coming soon)".
Will be wired to jsPDF in Week 3.

---

## Environment Variables

Two files required — both git-ignored, both have the same keys:

- `.env.local` — read by Next.js dev server and `tsx` test scripts
- `.dev.vars` — read by Wrangler for local Cloudflare Pages preview

Templates committed as `.env.example` and `.dev.vars.example`.
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_BASE_URL=http://localhost:3000
JINA_API_KEY=

# Week 3 additions (Lemon Squeezy):
# LEMON_SQUEEZY_API_KEY=
# LEMON_SQUEEZY_WEBHOOK_SECRET=
# LEMON_SQUEEZY_STORE_ID=
# LEMON_SQUEEZY_VARIANT_ID=

# Post-MVP (email):
# RESEND_API_KEY=
# FROM_EMAIL=
```

---

## Scripts
```bash
npm run dev          # Next.js local dev server
npm run build        # Next.js production build
npm run pages:build  # Build Cloudflare Pages output
npm run pages:dev    # Preview Pages build with Wrangler
npm run type-check   # TypeScript check — run before every commit
npm run lint         # ESLint

# Week 1 test script — validates rule engine locally
npx tsx --env-file=.env.local scripts/test-engine.ts
```

---

## What Is NOT In MVP

- ❌ User accounts / authentication / dashboard
- ❌ £19/month subscription billing (waitlist only)
- ❌ Batch / multi-URL audit in one purchase
- ❌ Shopify App Store integration
- ❌ Automated monitoring / re-scanning
- ❌ Admin panel (use Supabase dashboard)
- ❌ Any AI API calls in the audit pipeline

---

## Known Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Jina < 400 words (cart-gated) | Detect + prompt for product/cart URLs |
| Jina rate limit | 1M tokens/month with API key — sufficient for MVP volume |
| Cloudflare isolate kills pipeline | `after()` from Next.js 15 prevents early termination |
| DPC-010 invert bug | `evaluateRule()` checks invert flag explicitly before assigning status |
| FCA rules clarified before July 15 | Edit strings in `rules.ts`, rebuild, redeploy — no migration |
| Merchant disputes finding | Evidence string quotes exact text found or exact strings searched |
| Lemon Squeezy webhook fires twice | Check `lemon_order_id` before triggering pipeline — skip if already set |

---

## Official FCA Sources

All five cited in every report:

1. **FCA PS26/1** — https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit
2. **FCA CP25/23** — https://www.fca.org.uk/publications/consultation-papers/cp25-23-deferred-payment-credit
3. **Amendment Order 2025** — https://www.legislation.gov.uk/uksi/2025/855/contents/made
4. **FCA Register** — https://register.fca.org.uk/s/
5. **Consumer Credit Act 1974 s.66A** — https://www.legislation.gov.uk/ukpga/1974/39/section/66A

---

## Mandatory Disclaimer (Every Report)

> This report is produced by an automated rule-matching engine that searches
> page content for the presence or absence of specific text strings required
> by FCA PS26/1 (Deferred Payment Credit regulation, effective 15 July 2026).
> This report does NOT constitute legal advice. It is an informational
> compliance checklist tool only. ClearPay Audit is not authorised or
> regulated by the FCA.

---

*No AI. No ambiguity. No excuses.*
