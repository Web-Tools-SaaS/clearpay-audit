import AuditForm from "@/components/AuditForm";

// 17 rules — CRITICAL(5) + HIGH(7) + MEDIUM(5)
// DPC-006 is HIGH not CRITICAL: PS26/1 final rules moved right to withdraw
// from Key Product Information to Additional Product Information.
const complianceChecks = [
  // CRITICAL (5)
  {
    label: "Detects Klarna, Clearpay, PayPal Pay in 3, or other BNPL presence",
    severity: "CRITICAL",
  },
  {
    label: "States BNPL is credit, not just a payment option",
    severity: "CRITICAL",
  },
  {
    label: "Shows the number and amount of repayments clearly",
    severity: "CRITICAL",
  },
  {
    label: "Discloses the 0% interest rate explicitly",
    severity: "CRITICAL",
  },
  {
    label: "Explains missed-payment consequences up front",
    severity: "CRITICAL",
  },
  // HIGH (7)
  {
    label: "Provides access to the 14-day right to withdraw in linked terms",
    severity: "HIGH",
  },
  {
    label: "Names the lender and FCA firm reference number",
    severity: "HIGH",
  },
  {
    label: "Covers early settlement rights in linked terms",
    severity: "HIGH",
  },
  {
    label: "Clarifies whether Section 75 applies",
    severity: "HIGH",
  },
  {
    label: "Flags prohibited impulse-spend wording",
    severity: "HIGH",
  },
  {
    label: "Links to full lender terms before checkout",
    severity: "HIGH",
  },
  {
    label: "Signposts to additional product information containing your rights",
    severity: "HIGH",
  },
  // MEDIUM (5)
  {
    label: "Explains automatic repayment authority (CPA) clearly",
    severity: "MEDIUM",
  },
  {
    label: "Signposts customers to free debt advice",
    severity: "MEDIUM",
  },
  {
    label: "Confirms the provider is FCA authorised",
    severity: "MEDIUM",
  },
  {
    label: "Discloses whether a credit reference agency check will be performed",
    severity: "MEDIUM",
  },
  {
    label: "Provides access to FOS complaint rights and escalation procedure",
    severity: "MEDIUM",
  },
] as const;

const severityStyles = {
  CRITICAL: "bg-red-500",
  HIGH: "bg-amber-500",
  MEDIUM: "bg-blue-600",
} as const;

const steps = [
  {
    title: "Paste your URL",
    description: "Enter your checkout or product page URL.",
  },
  {
    title: "We audit it",
    description: "Our rule engine checks 17 FCA PS26/1 requirements.",
  },
  {
    title: "Get your report",
    description: "Download a full PDF with exact clause citations.",
  },
] as const;

const stats = [
  "80,000+ UK merchants affected",
  "£2,500+ law firm triage cost",
  "July 15, 2026 hard deadline",
] as const;

const coveragePoints = [
  {
    heading: "One product page is enough",
    body:
      "Shopify and WooCommerce themes apply BNPL display settings globally. If Klarna or Clearpay appears on one product page, the same widget configuration — and the same disclosures, or lack of them — appears on every product page in your store.",
  },
  {
    heading: "The compliance gap is in the theme, not the product",
    body:
      "FCA PS26/1 requires the Key Product Information to appear at the point of sale, before the consumer enters into the agreement. That wording is configured once, at the theme or app level. A single audit tells you whether your theme-level configuration meets the standard.",
  },
  {
    heading: "When you might need a second audit",
    body:
      "If you operate multiple Shopify stores, use different BNPL providers on different sections of your site, or have a custom-built checkout that departs from your theme defaults — audit each distinct configuration separately.",
  },
] as const;

export default function Home() {
  return (
    <div className="min-h-full bg-white text-slate-900">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
          <span className="text-lg font-bold tracking-tight text-blue-950 sm:text-xl">
            ClearPay Audit
          </span>
          <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
            FCA PS26/1 Compliant
          </span>
        </div>
      </nav>

      <main className="flex flex-col">
        <section className="bg-[#0f172a] text-white">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-6 py-20 text-center sm:px-8 lg:px-12 lg:py-24">
            <span className="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-300">
              ⚠️ FCA Regulation Day: 15 July 2026
            </span>
            <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Is Your Checkout Ready for FCA BNPL Regulation?
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              The FCA&apos;s July 15, 2026 deadline applies to every UK merchant
              offering Klarna or Clearpay. Get a full compliance audit in 60
              seconds — check all 17 FCA PS26/1 requirements against your checkout.
            </p>
            <div className="mt-10 flex w-full justify-center">
              <AuditForm />
            </div>
            <p className="mt-4 text-sm text-slate-400">
              No account needed · Results in under 60 seconds · Cites exact FCA
              clauses
            </p>
          </div>
        </section>

        {/* One audit covers your store — reassurance section */}
        <section className="bg-blue-950 text-white">
          <div className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-8 lg:px-12">
            <div className="rounded-2xl border border-blue-800 bg-blue-900/60 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <span className="mt-0.5 shrink-0 text-2xl" aria-hidden="true">
                  ℹ️
                </span>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                    One audit covers your entire store — you don&apos;t need to
                    audit every product page.
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-blue-200">
                    Shopify and WooCommerce themes apply BNPL settings globally.
                    When you configure Klarna or Clearpay, the same widget and
                    the same surrounding disclosure text — or the same absence of
                    it — appears on every product page across your store. The
                    compliance gap is in your theme configuration, not in
                    individual products.
                  </p>
                  <div className="mt-6 grid gap-5 sm:grid-cols-3">
                    {coveragePoints.map((point) => (
                      <div key={point.heading}>
                        <p className="text-sm font-semibold text-white">
                          {point.heading}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-blue-300">
                          {point.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-24">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
                Audit workflow
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                How it works
              </h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-950 text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-slate-950">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-24">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
                FCA scope
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                What we check
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Every audit maps your product or checkout page against 17 rule
                areas derived from FCA PS26/1 (published 11 February 2026), with
                severity flags for remediation priority.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {complianceChecks.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <span className="mt-0.5 text-lg text-emerald-600">✓</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${severityStyles[item.severity]}`}
                        aria-hidden="true"
                      />
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {item.severity}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-slate-700">
                      {item.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-20 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:px-12 lg:py-24">
            <div className="rounded-3xl border border-slate-200 bg-slate-950 p-8 text-white shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Why merchants act now
              </p>
              <div className="mt-8 space-y-6">
                {stats.map((stat) => (
                  <div
                    key={stat}
                    className="border-l-2 border-blue-400 pl-4 text-xl font-semibold tracking-tight sm:text-2xl"
                  >
                    {stat}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
                Why it matters
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                FCA oversight now reaches merchant BNPL journeys.
              </h2>
              <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
                FCA PS26/1 brings Deferred Payment Credit promotions and checkout
                disclosures into a regulated standard from 15 July 2026. If a UK
                merchant surfaces Klarna or Clearpay without the right pre-contract
                wording, lender details, or risk disclosures, the checkout journey
                can expose the business to remediation costs, delayed launches,
                and regulator scrutiny. ClearPay Audit gives operations, legal,
                and eCommerce teams a fast first-pass compliance view before a
                manual legal review.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-100">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-6 text-sm text-slate-600 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <div>
            <p className="font-semibold text-slate-800">ClearPay Audit</p>
            <p className="mt-1">This tool is not legal advice.</p>
          </div>
          
            href="https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-blue-700 underline decoration-blue-300 underline-offset-4 transition hover:text-blue-900"
          >
            FCA PS26/1 official document
          </a>
        </div>
      </footer>
    </div>
  );
              }
