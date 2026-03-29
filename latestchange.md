## 2026-03-29

### What changed
- Installed jspdf as a runtime dependency. No @types package required — jsPDF bundles its own TypeScript definitions.
- Created lib/pdf-access.ts with a single exported isPdfUnlocked(paymentStatus) function. Currently returns true for all audits. To add payment gating with any provider in future, change the single return statement — no other files need updating.
- Created lib/generate-pdf.ts, a pure client-side PDF generation module. Accepts AuditResult and PdfMeta, returns a jsPDF document instance. Builds a multi-page A4 PDF: cover page with score panel and audit metadata, remediation roadmap page with CRITICAL/HIGH/MEDIUM sections, full 18-rule results pages sorted by severity and status (CRITICAL FAILs first), and a final sources and disclaimer page. Never imported statically — only loaded via dynamic import() inside the button component.
- Replaced components/report/PlaceholderPDFButton.tsx (was a static stub) with a full client component that accepts auditResult, auditUrl, bnplProvider, createdAt, score, auditId, and isUnlocked props. On click: dynamically imports lib/generate-pdf, generates the PDF, and triggers browser download as paylater-audit-[shortId].pdf. Shows a loading spinner during generation. Has an isUnlocked=false path ready for future payment gating (renders "Unlock PDF Report" CTA without crashing).
- Updated app/report/[id]/page.tsx to import isPdfUnlocked, compute isUnlocked from audit.payment_status, and pass all required props to PlaceholderPDFButton. Also fixed a layout bug in the score panel wrapper: changed from flex (row, which stacked score panel and disclaimer side-by-side) to flex-col items-end (vertical stack, correct layout).
- Updated README.md Week 4 status to Done and updated the PlaceholderPDFButton description.

### Why this changed
- Week 4 scope: PDF download is the main deliverable before the paywall. jsPDF is pure browser JS — zero Cloudflare edge runtime issues. Dynamic import means ~280KB is only loaded when the merchant actually clicks Download. The payment gate abstraction in lib/pdf-access.ts means adding Lemon Squeezy, Dodo Payments, or any other provider in Week 5+ requires changing exactly one line and no component refactoring.

# Latest Change

## 2026-03-29

### What changed
- Replaced DPC-002 search_strings with credit-specific phrases that exclude generic "credit card" false positives. New strings include 'credit agreement', 'form of credit', 'entering into a credit', 'you are borrowing', 'short-term fixed sum loan', and 14 additional variants.
- Replaced DPC-003 search_strings with BNPL-specific repayment phrases. Removed 'payment of' and 'per month' which caused false positives on shipping/subscription copy. New strings include 'instalments of £', 'interest-free instalments', 'first payment today', '4 instalments due every'.
- Replaced DPC-015 search_strings with credit-specific signpost phrases. Removed 'more information', 'learn more', 'read more' which matched generic navigation links on every retail page. New strings include 'full credit terms', 'additional product information', 'your payment rights', 'before entering'.
- Massively expanded search_strings across all 17 existing rules (DPC-001 through DPC-017) based on primary source research: FCA PS26/1 PDF, CONC 3.3 and 4.2A, Klarna UK merchant docs, Clearpay ToS, and PayPal Pay in 3 UK terms.
- Added new rule DPC-018 (HIGH, -10 points) for KPI requirement on total amount of credit as required by CONC 4.2A. Updated TOTAL_CHECK_COUNT in scorer.ts from 17 to 18.
- Added prohibited phrases to DPC-010: 'strapped for cash', 'dont wait until payday', 'broke af', 'cant afford it now', 'spend more', 'max out', 'instant approval', 'guaranteed approval', 'no credit check', 'pay nothing now', and additional variants sourced from Klarna UK legal guidelines and CONC 3.3.
- Added 'klarna_clearpay' to the provider dropdown in AuditForm.tsx with label 'Klarna + Clearpay (both)'. Reverted 'PayLater' dropdown label back to 'Clearpay' (the provider name, not our product name).
- Added 'klarna_clearpay' to VALID_PROVIDERS in create-audit/route.ts.
- Added mergeProviderResults() helper and updated runRuleEngine() in lib/rule-engine/index.ts to handle 'klarna_clearpay' provider by running the engine for both providers and merging results (PASS if either passes).
- Changed score label 'COMPLIANT' to 'DISCLOSURES DETECTED', 'AMBER — ACTION REQUIRED' to 'GAPS DETECTED — REVIEW NEEDED', 'NON-COMPLIANT — IMMEDIATE ACTION' to 'SIGNIFICANT GAPS — ACTION REQUIRED' in app/report/[id]/page.tsx.
- Changed score panel heading from 'COMPLIANCE SCORE' to 'DISCLOSURE COVERAGE' and report h1 from 'FCA BNPL Compliance Report' to 'FCA BNPL Disclosure Coverage Report'.
- Added small disclaimer box below the score panel in the report page.
- Added statusDisplayLabel mapping in RuleAccordion.tsx: PASS → 'DETECTED', FAIL → 'NOT DETECTED', UNCLEAR → 'INCONCLUSIVE'. Applied to rendered status badges only — internal logic still uses PASS/FAIL/UNCLEAR.
- Updated coveragePoints in app/page.tsx to give platform-specific guidance (Shopify vs WooCommerce) instead of generic store-wide advice.
- Updated AuditForm URL placeholder to 'https://mystore.co.uk/products/any-product-with-klarna'.
- Created lib/crawler.ts as a crawl abstraction layer with crawlUrl() export. Replaced direct Jina fetch calls in both API routes with crawlUrl() calls.
- Created lib/payment.ts as a payment provider abstraction placeholder.
- Added PAYMENT_PROVIDER= to .env.example and .dev.vars.example.
- Changed wrangler.toml name from 'clearpay-audit' to 'paylater-audit'.
- Changed package.json name from 'clearpay-audit' to 'paylater-audit'.

### Why this changed
- Rule string false positives (DPC-002, DPC-003, DPC-015) were causing merchants with no BNPL disclosures to pass checks incorrectly — a product-destroying bug for a compliance tool.
- Research against primary FCA and provider sources revealed additional real-world disclosure phrases used by Klarna OSM widgets and Clearpay T&C that need to be covered by the engine.
- Terminology 'COMPLIANT' and 'PASS'/'FAIL' create legal risk as they imply a legal determination — changed to detection-based language.
- Crawler and payment abstraction makes future provider swaps (e.g. Jina → Firecrawl, Lemon Squeezy → Dodo Payments) a single-file change.

## 2026-03-20

### What changed
- Updated `app/api/audit/[id]/submit-extra/route.ts` to import `after` from `next/server` and schedule the extra crawl pipeline with `after(...)` so the Edge runtime keeps the work alive after the response is returned.
- Tightened the `isValidEmail` helper in both `app/api/create-audit/route.ts` and `app/api/waitlist/route.ts` to use a minimal regex that rejects malformed addresses that previously slipped through the `includes` checks.
- Narrowed the DPC-003 `search_strings` array in `lib/rule-engine/rules.ts` to BNPL-specific repayment wording only, and appended the Klarna FRN 987816 migration note to the DPC-007 `fix_suggestion`.
- Updated `app/report/[id]/page.tsx` to detect a failed or unclear DPC-001 result and show a warning banner above the score section when the submitted URL appears to be the wrong page for BNPL disclosure analysis.
- Reviewed the existing `latestchange.md` history and confirmed the 2026-03-19 repo changes were already logged here; this entry adds the missing 2026-03-20 audit/report/rule updates.

### Why this changed
- Cloudflare Pages Edge isolates terminate immediately after the response unless background work is registered with `after(...)`, malformed email addresses should be rejected before they reach Supabase, overly broad repayment keywords were creating false DPC-003 passes, merchants needed explicit guidance about Klarna's old FRN 987816 copy, and the report now warns when the audit likely ran against the wrong page type.

## 2026-03-20

### What changed
- Updated `components/report/RuleAccordion.tsx` to show remediation-type badges in the collapsed row and, for failed rules, render the new regulatory consequence, provider remediation steps, and copyable compliant wording blocks inside the expanded panel.
- Replaced the report page `PRIORITY FIXES` section in `app/report/[id]/page.tsx` with the new roadmap-based remediation layout grouped into this week, this month, and before-deadline urgency buckets.
- Logged this task in `latestchange.md`.

### Why this changed
- The report UI now needs to surface richer remediation guidance directly next to each failed rule and present the summary fix plan as a deadline-aware roadmap instead of a simple top-three list.

## 2026-03-19

### What changed
- Replaced the preview-only `app/api/waitlist/route.ts` stub with a real Edge-runtime Next.js 15 POST handler that imports `NextRequest`, `NextResponse`, and `getSupabaseServiceClient`, validates `{ email, audit_id? }`, writes to the Supabase `waitlist` table, and silently ignores duplicate emails via `onConflict: 'email'`.
- Logged this task in `latestchange.md`.

### Why this changed
- The report waitlist form now needs to persist real signups in Supabase on Cloudflare Pages instead of returning a placeholder success message that never stores the email.

## 2026-03-19

### What changed
- Added `app/report/[id]/page.tsx` as an Edge-runtime server-rendered report page that fetches completed audits directly from Supabase, renders the score hero, priority fixes, full rule results, FCA sources, disclaimer, and the waitlist CTA.
- Added `components/report/PlaceholderPDFButton.tsx`, `components/report/RuleAccordion.tsx`, and `components/report/WaitlistForm.tsx` for the client-only interactions on the report page without turning the page itself into a client component.
- Added `app/api/waitlist/route.ts` as a minimal Edge POST endpoint for the report-page waitlist form.
- Updated `README.md` so the current merchant flow now mentions the landing page, processing page, report page, and waitlist endpoint instead of the old scaffold note.
- Logged this task in `latestchange.md`.

### Why this changed
- The audit flow needed a production-style report destination that loads fast with SSR, shows the full compliance result immediately for completed audits, and keeps the interactive pieces isolated to small client components.

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

## 2026-03-26

### What changed
- Updated website-facing brand copy across the landing page, report page header/disclaimer, and app metadata from `ClearPay Audit` to `PayLater Audit`.
- Updated all visible `Clearpay` provider mentions on website UI copy to `PayLater` (including homepage messaging and report warning copy), while keeping internal provider values unchanged to avoid API/database breakage.
- Updated the provider dropdown label in `components/AuditForm.tsx` from `Clearpay` to `PayLater` while preserving the submitted value (`clearpay`) for backward compatibility with existing validation and stored records.
- Updated the support contact mailto link on the processing error screen to `support@paylateraudit.com`.

### Why this changed
- The product branding and customer-facing provider naming were updated from Clearpay to PayLater, so all website-visible wording now matches the new naming without introducing breaking changes in the backend provider contract.
