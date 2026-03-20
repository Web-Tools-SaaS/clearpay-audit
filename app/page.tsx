import AuditForm from "@/components/AuditForm";

const complianceChecks = [
  { label: "Detects Klarna, Clearpay, PayPal Pay in 3, or other BNPL presence", severity: "CRITICAL" },
  { label: "States BNPL is credit, not just a payment option", severity: "CRITICAL" },
  { label: "Shows the number and amount of repayments clearly", severity: "CRITICAL" },
  { label: "Discloses the 0% interest rate explicitly", severity: "CRITICAL" },
  { label: "Explains missed-payment consequences up front", severity: "CRITICAL" },
  { label: "Provides access to the 14-day right to withdraw in linked terms", severity: "HIGH" },
  { label: "Names the lender and FCA firm reference number", severity: "HIGH" },
  { label: "Covers early settlement rights in linked terms", severity: "HIGH" },
  { label: "Clarifies whether Section 75 applies", severity: "HIGH" },
  { label: "Flags prohibited impulse-spend wording", severity: "HIGH" },
  { label: "Links to full lender terms before checkout", severity: "HIGH" },
  { label: "Signposts to additional product information containing your rights", severity: "HIGH" },
  { label: "Explains automatic repayment authority (CPA) clearly", severity: "MEDIUM" },
  { label: "Signposts customers to free debt advice", severity: "MEDIUM" },
  { label: "Confirms the provider is FCA authorised", severity: "MEDIUM" },
  { label: "Discloses whether a credit reference agency check will be performed", severity: "MEDIUM" },
  { label: "Provides access to FOS complaint rights and escalation procedure", severity: "MEDIUM" },
] as const;

const severityBar = {
  CRITICAL: "bg-[#EF4444]",
  HIGH: "bg-[#F59E0B]",
  MEDIUM: "bg-[#3B82F6]",
} as const;

const severityText = {
  CRITICAL: "text-[#EF4444]",
  HIGH: "text-[#F59E0B]",
  MEDIUM: "text-[#3B82F6]",
} as const;

const steps = [
  { title: "Paste your URL", description: "Enter your checkout or product page URL." },
  { title: "We audit it", description: "Our rule engine checks 17 FCA PS26/1 requirements." },
  { title: "Get your report", description: "Download a full PDF with exact clause citations." },
] as const;

const stats = [
  "80,000+ UK merchants affected",
  "£2,500+ law firm triage cost",
  "July 15, 2026 hard deadline",
] as const;

const coveragePoints = [
  {
    heading: "One product page is enough",
    body: "Shopify and WooCommerce themes apply BNPL display settings globally. If Klarna or Clearpay appears on one product page, the same widget configuration applies across your store.",
  },
  {
    heading: "The compliance gap is in the theme, not the product",
    body: "FCA PS26/1 requires the Key Product Information to appear at the point of sale. That wording is configured once, at the theme or app level. A single audit tells you whether your configuration meets the standard.",
  },
  {
    heading: "When you might need a second audit",
    body: "If you operate multiple Shopify stores, use different BNPL providers on different sections, or have a custom-built checkout that departs from your theme defaults — audit each distinct configuration separately.",
  },
] as const;

export default function Home() {
  return (
    <div className="min-h-full bg-[#080808] text-white">

      {/* ── NAV ── */}
      <nav className="border-b border-[#2A2A2A] bg-[#080808]">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
          <span className="font-mono text-sm font-semibold uppercase tracking-widest text-white">
            ClearPay Audit
          </span>
          <span className="border border-[#3A3A3A] px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#A1A1A1]">
            FCA PS26/1
          </span>
        </div>
      </nav>

      <main className="flex flex-col">

        {/* ── HERO ── */}
        <section className="bg-[#080808]">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-6 py-20 text-center sm:px-8 lg:px-12 lg:py-28">
            <div className="border border-[#F59E0B] px-4 py-2 font-mono text-xs uppercase tracking-widest text-[#F59E0B]">
              ⚠ FCA REGULATION DAY: 15 JULY 2026
            </div>
            <h1 className="mt-8 max-w-4xl text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl lg:text-5xl">
              Is Your Checkout Ready for FCA BNPL Regulation?
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#A1A1A1]">
              The FCA&apos;s July 15, 2026 deadline applies to every UK merchant offering Klarna or Clearpay.
              Get a full compliance audit in 60 seconds — check all 17 FCA PS26/1 requirements against your checkout.
            </p>
            <div className="mt-10 flex w-full justify-center">
              <AuditForm />
            </div>
            <p className="mt-4 font-mono text-[11px] text-[#6B6B6B] uppercase tracking-widest">
              No account needed · Results in under 60 seconds · Cites exact FCA clauses
            </p>
          </div>
        </section>

        {/* ── ONE AUDIT COVERS YOUR STORE ── */}
        <section className="bg-[#0F0F0F] border-y border-[#2A2A2A]">
          <div className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-8 lg:px-12">
            <div className="border border-[#3A3A3A] border-l-2 border-l-white p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <span className="font-mono text-xs text-[#A1A1A1] mt-0.5 shrink-0">[i]</span>
                <div>
                  <h2 className="font-mono text-sm font-semibold uppercase tracking-wide text-white">
                    One audit covers your entire store — you don&apos;t need to audit every product page.
                  </h2>
                  <p className="mt-3 text-xs leading-6 text-[#A1A1A1]">
                    Shopify and WooCommerce themes apply BNPL settings globally. When you configure Klarna or Clearpay,
                    the same widget and the same surrounding disclosure text — or the same absence of it — appears on
                    every product page across your store. The compliance gap is in your theme configuration, not in individual products.
                  </p>
                  <div className="mt-6 grid gap-0 sm:grid-cols-3">
                    {coveragePoints.map((point, i) => (
                      <div
                        key={point.heading}
                        className={`py-4 sm:py-0 sm:px-6 ${i > 0 ? "border-t border-[#2A2A2A] sm:border-t-0 sm:border-l sm:border-[#2A2A2A]" : ""}`}
                      >
                        <p className="font-mono text-xs font-semibold uppercase tracking-wide text-white">
                          {point.heading}
                        </p>
                        <p className="mt-2 text-xs leading-5 text-[#A1A1A1]">
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

        {/* ── HOW IT WORKS ── */}
        <section className="bg-[#080808] border-b border-[#2A2A2A]">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-24">
            <div className="max-w-2xl mb-12">
              <p className="font-mono text-[11px] uppercase tracking-widest text-[#A1A1A1]">
                {/* AUDIT WORKFLOW */}
              </p>
              <h2 className="mt-3 text-xl font-bold uppercase tracking-tight text-white sm:text-2xl">
                How It Works
              </h2>
            </div>
            <div className="grid gap-0 md:grid-cols-3">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className={`border border-[#2A2A2A] bg-[#0F0F0F] p-6 ${index > 0 ? "border-t-0 md:border-t md:border-l-0" : ""}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-xs text-[#A1A1A1]">
                      [{String(index + 1).padStart(2, "0")}]
                    </span>
                    <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs leading-6 text-[#A1A1A1]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT WE CHECK ── */}
        <section className="bg-[#0F0F0F] border-b border-[#2A2A2A]">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-24">
            <div className="max-w-3xl mb-10">
              <p className="font-mono text-[11px] uppercase tracking-widest text-[#A1A1A1]">
                {/* FCA SCOPE */}
              </p>
              <h2 className="mt-3 text-xl font-bold uppercase tracking-tight text-white sm:text-2xl">
                What We Check
              </h2>
              <p className="mt-3 text-xs leading-6 text-[#A1A1A1]">
                Every audit maps your product or checkout page against 17 rule areas derived from FCA PS26/1
                (published 11 February 2026), with severity flags for remediation priority.
              </p>
            </div>

            {/* Ledger table header */}
            <div className="border-b border-[#3A3A3A] pb-2 mb-0 grid grid-cols-[auto_1fr] gap-4 md:grid-cols-[120px_1fr]">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#6B6B6B]">SEVERITY</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#6B6B6B]">REQUIREMENT</span>
            </div>

            <div className="divide-y divide-[#2A2A2A]">
              {complianceChecks.map((item) => (
                <div
                  key={item.label}
                  className="grid grid-cols-[auto_1fr] gap-4 md:grid-cols-[120px_1fr] py-3 items-start"
                >
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className={`h-1 w-4 flex-shrink-0 ${severityBar[item.severity]}`} aria-hidden="true" />
                    <span className={`font-mono text-[10px] uppercase tracking-widest ${severityText[item.severity]}`}>
                      {item.severity}
                    </span>
                  </div>
                  <p className="text-xs text-[#A1A1A1] leading-5">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY IT MATTERS ── */}
        <section className="bg-[#080808] border-b border-[#2A2A2A]">
          <div className="mx-auto grid w-full max-w-7xl gap-0 px-6 py-20 sm:px-8 lg:grid-cols-[1fr_1fr] lg:px-12 lg:py-24">
            {/* Stats panel */}
            <div className="border border-[#2A2A2A] bg-[#0F0F0F] p-8">
              <p className="font-mono text-[11px] uppercase tracking-widest text-[#A1A1A1] mb-8">
                {/* WHY MERCHANTS ACT NOW */}
              </p>
              <div className="space-y-6">
                {stats.map((stat) => (
                  <div
                    key={stat}
                    className="border-l-2 border-white pl-4 font-mono text-base font-semibold tracking-tight text-white sm:text-lg"
                  >
                    {stat}
                  </div>
                ))}
              </div>
            </div>

            {/* Copy panel */}
            <div className="border border-[#2A2A2A] border-t-0 lg:border-t lg:border-l-0 bg-[#0F0F0F] p-8 flex flex-col justify-center">
              <p className="font-mono text-[11px] uppercase tracking-widest text-[#A1A1A1]">
                {/* WHY IT MATTERS */}
              </p>
              <h2 className="mt-3 text-xl font-bold uppercase tracking-tight text-white sm:text-2xl">
                FCA oversight now reaches merchant BNPL journeys.
              </h2>
              <p className="mt-6 text-xs leading-7 text-[#A1A1A1]">
                FCA PS26/1 brings Deferred Payment Credit promotions and checkout disclosures into a regulated
                standard from 15 July 2026. If a UK merchant surfaces Klarna or Clearpay without the right
                pre-contract wording, lender details, or risk disclosures, the checkout journey can expose the
                business to remediation costs, delayed launches, and regulator scrutiny. ClearPay Audit gives
                operations, legal, and eCommerce teams a fast first-pass compliance view before a manual legal review.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#2A2A2A] bg-[#080808]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-6 py-6 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-white">
              ClearPay Audit
            </p>
            <p className="mt-1 font-mono text-[11px] text-[#6B6B6B]">
              This tool is not legal advice.
            </p>
          </div>
          <a
            href="https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[11px] text-[#A1A1A1] underline underline-offset-4 decoration-[#3A3A3A] transition hover:text-white hover:decoration-white"
          >
            FCA PS26/1 official document →
          </a>
        </div>
      </footer>
    </div>
  );
}
