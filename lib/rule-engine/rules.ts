import type { Rule } from './types'

// ─────────────────────────────────────────────────────────────────────────────
// ClearPay Audit — FCA DPC Compliance Rule Set
// Source: FCA PS26/1 (published 11 February 2026) — final rules
// Source: FCA CP25/23 (published 18 July 2025) — consulted rules
// Regulation Day: 15 July 2026
//
// RULE COUNT: 17
//   CRITICAL (5): DPC-001 to DPC-005   — -20 pts each on FAIL
//   HIGH     (7): DPC-006 to DPC-011, DPC-015 — -10 pts each on FAIL
//   MEDIUM   (5): DPC-012 to DPC-014, DPC-016, DPC-017 — -5 pts each on FAIL
//
// KEY PS26/1 AMENDMENT vs CP25/23:
//   Right to Withdraw was moved from Key Product Information to Additional
//   Product Information in the final PS26/1 rules. DPC-006 is therefore HIGH,
//   not CRITICAL. (Source: A&O Shearman PS26/1 analysis, Feb 2026)
//
// PROVIDER NOTE:
//   Laybuy entered administration 24 June 2024 and no longer operates in the UK.
//   It has been removed from all search strings.
//
// LAST VERIFIED: March 2026 against FCA PS26/1 (11 Feb 2026)
// ─────────────────────────────────────────────────────────────────────────────

export const RULES: Rule[] = [

  // ─── CRITICAL (5 rules — 20 points each) ──────────────────────────────────

  {
    id: 'DPC-001',
    category: 'BNPL Detection',
    severity: 'CRITICAL',
    requirement:
      'The page must mention a regulated DPC provider to confirm BNPL is offered. ' +
      'From 15 July 2026, any DPC provider operating in the UK must be FCA-authorised ' +
      'or registered under the Temporary Permissions Regime (TPR). ' +
      '(FCA PS26/1, Regulation Day 15 July 2026; FSMA 2000 s.19)',
    fca_source: 'FCA PS26/1 (Feb 2026) — scope of DPC regulation; Regulation Day 15 July 2026',
    fca_url:
      'https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit',
    search_strings: [
      'klarna',
      'clearpay',
      'pay in 3',
      'pay in three',
      'buy now pay later',
      'bnpl',
      'deferred payment',
      'pay later',
      'paypal pay in 3',
      'pay in 4',
      'payl8r',
      'divido',
      'zilch',
      'openpay',
    ],
    search_mode: 'ANY',
    fix_suggestion:
      'Not applicable — if no BNPL provider is detected on this page, submit your product page ' +
      'or cart page URL instead. BNPL disclosure content typically appears on product pages ' +
      'and cart pages rather than on the checkout confirmation page itself.',
    remediation_type: 'THEME_SETTING',
    regulatory_consequence: 'If no BNPL provider is detected on this page, our engine cannot verify compliance. After 15 July 2026, operating a DPC arrangement through an unlicensed or undetected provider is a criminal offence under FSMA 2000 s.19. The FCA may require the lender to withdraw the BNPL option from your checkout until disclosures are in place.'
  },

  {
    id: 'DPC-002',
    category: 'Key Product Information — Credit Nature',
    severity: 'CRITICAL',
    requirement:
      'Before a consumer enters into a DPC agreement, the lender must provide Key Product ' +
      'Information (KPI) clearly identifying this as a form of credit or borrowing, not merely ' +
      'a payment method. This is the first named required element of KPI under PS26/1 Chapter 2. ' +
      'The merchant page must surface this lender-provided language at or before the point of ' +
      'agreement. (FCA PS26/1 Chapter 2; CONC 4.2A — KPI pre-contract disclosure)',
    fca_source:
      'FCA PS26/1 Chapter 2; CONC 4.2A — Key Product Information: credit nature disclosure',
    fca_url:
      'https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit',
    search_strings: ['credit', 'borrowing', 'loan', 'lend', 'borrow'],
    search_mode: 'ANY',
    fix_suggestion:
      'Add near the BNPL payment option: "This is a credit agreement. You are borrowing money ' +
      'which must be repaid." The words "credit" or "borrowing" must appear in close proximity ' +
      'to the BNPL option. This wording should be supplied by your BNPL provider — ask them ' +
      'for their FCA-compliant KPI disclosure template.',
    remediation_type: 'THEME_SETTING',
    regulatory_consequence: 'Failure to identify BNPL as credit means the pre-contract Key Product Information disclosure obligation under FCA PS26/1 Chapter 2 and CONC 4.2A is unmet. The FCA can direct the lender to suspend the BNPL product from your checkout. Under the Consumer Duty (FCA PS22/9), presenting BNPL as a payment method without credit identification also constitutes a foreseeable consumer harm.'
  },

  {
    id: 'DPC-003',
    category: 'Key Product Information — Repayment Schedule',
    severity: 'CRITICAL',
    requirement:
      'KPI must include the number of repayments and the amount of each repayment before the ' +
      'consumer enters into the agreement. Stating only "Pay in 3" or "Pay Later" is insufficient — ' +
      'the actual instalment amount in GBP must be stated or clearly calculable from information ' +
      'on the page. (FCA PS26/1 Chapter 2; CP25/23 para 3.12)',
    fca_source:
      'FCA PS26/1 Chapter 2; CP25/23 para 3.12 — KPI: number and amount of repayments',
    fca_url:
      'https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit',
    search_strings: [
      'instalment',
      'installment',
      'repayment',
      'payment of',
      '£',
      'per month',
      'every',
      'weeks',
      'monthly',
    ],
    search_mode: 'ANY',
    fix_suggestion:
      'Display the repayment breakdown explicitly next to the BNPL option. Example: ' +
      '"Pay in 3 interest-free instalments of £[X]. First payment today, then every 30 days." ' +
      'The instalment amount in GBP (£) must appear near the BNPL option. Your BNPL ' +
      "provider's On-Site Messaging widget typically handles this — ensure it is correctly " +
      'configured and rendering.',
    remediation_type: 'THEME_SETTING',
    regulatory_consequence: 'Absence of instalment count and GBP amounts means mandatory Key Product Information under PS26/1 Chapter 2 is incomplete. A consumer entering a DPC agreement without this information has grounds to challenge the validity of the agreement. The FCA can direct the lender to suspend the product from your checkout until KPI is complete.'
  },

  {
    id: 'DPC-004',
    category: 'Key Product Information — Interest Rate',
    severity: 'CRITICAL',
    requirement:
      'KPI must state the rate of interest. For DPC products this is 0%, but the FCA requires it ' +
      'to be stated explicitly even though the rate is zero — a consumer cannot be expected to assume ' +
      'the absence of interest. Named required field in PS26/1 Chapter 2 KPI requirements. ' +
      '(FCA PS26/1 Chapter 2; CONC 4.2A — rate of interest as required KPI element)',
    fca_source:
      'FCA PS26/1 Chapter 2; CONC 4.2A — KPI: rate of interest (must state 0% for DPC)',
    fca_url:
      'https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit',
    search_strings: [
      '0% interest',
      'interest free',
      'interest-free',
      'no interest',
      '0% apr',
      'zero interest',
      'zero percent',
    ],
    search_mode: 'ANY',
    fix_suggestion:
      'Add "0% interest" or "Interest-free" clearly near the BNPL payment option. ' +
      'This must be stated explicitly even though the rate is zero — PS26/1 requires it to ' +
      "appear in Key Product Information. Your BNPL provider's on-site messaging widget " +
      'should surface this automatically when correctly configured.',
    remediation_type: 'THEME_SETTING',
    regulatory_consequence: 'The interest rate is a named required element of Key Product Information under PS26/1 Chapter 2. Failure to state 0% explicitly means the KPI obligation is unmet. The FCA has confirmed this must appear in writing. Non-compliance after 15 July 2026 exposes the lender to supervisory action and can result in the BNPL option being suspended from your checkout.'
  },

  {
    id: 'DPC-005',
    category: 'Key Product Information — Consequences of Missed Payments',
    severity: 'CRITICAL',
    requirement:
      'KPI must include the main consequences of missing payments before the consumer enters into ' +
      'the agreement. Named required element in PS26/1 Chapter 2. PS26/1 clarified one minor change ' +
      'from CP25/23: communications do not need to explain all potential future adverse consequences — ' +
      'the main consequences are sufficient. (FCA PS26/1 Chapter 2; CP25/23 para 3.12)',
    fca_source:
      'FCA PS26/1 Chapter 2; CP25/23 para 3.12 — KPI: main consequences of missed payments',
    fca_url:
      'https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit',
    search_strings: [
      'missed payment',
      'miss a payment',
      'late payment',
      'late fee',
      'penalty',
      'credit score',
      'debt collection',
      'default',
      'consequences',
      'overdue',
    ],
    search_mode: 'ANY',
    fix_suggestion:
      'Add near the BNPL payment option: "Missing payments may result in late fees and could ' +
      'affect your credit score." This is a mandatory disclosure under FCA PS26/1 Key Product ' +
      "Information rules. Your lender's compliant KPI template should include this wording — " +
      'request it from your BNPL provider.',
    remediation_type: 'THEME_SETTING',
    regulatory_consequence: 'Consequences of missed payments is a named required element of Key Product Information under FCA PS26/1 Chapter 2. Without this disclosure, consumers cannot make an informed decision about entering the agreement. Under the Consumer Duty (PS22/9), the lender is in breach of the requirement to support informed decisions. The FCA may direct the lender to withdraw the product from your checkout.'
  },

  // ─── HIGH (7 rules — 10 points each) ──────────────────────────────────────
  //
  // IMPORTANT — DPC-006 SEVERITY CORRECTION:
  // The right to withdraw was proposed as KPI in CP25/23 but PS26/1 MOVED it
  // to Additional Product Information in the final rules. Severity is HIGH,
  // not CRITICAL. A link to terms containing this language is sufficient.
  // (Source: A&O Shearman PS26/1 analysis, Feb 2026)

  {
    id: 'DPC-006',
    category: 'Additional Product Information — Right to Withdraw',
    severity: 'HIGH',
    requirement:
      'Consumers must be informed of their right to withdraw from the DPC agreement within 14 days. ' +
      'PS26/1 MOVED this from Key Product Information (proposed in CP25/23) to Additional Product ' +
      'Information — it must be "given or made available" before the agreement. A link to linked ' +
      'terms containing this information is sufficient; it does not need to appear inline on the ' +
      'page. (FCA PS26/1 Chapter 2 — final rules; Consumer Credit Act 1974 s.66A)',
    fca_source:
      'FCA PS26/1 Chapter 2 — Additional Product Information: right to withdraw (moved from KPI in final rules); CCA 1974 s.66A',
    fca_url:
      'https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit',
    search_strings: [
      'right to withdraw',
      'withdraw within',
      '14 day',
      'fourteen day',
      'cooling off',
      'cancel within',
      'withdrawal right',
      '14-day',
    ],
    search_mode: 'ANY',
    fix_suggestion:
      "Add to the lender's linked Terms & Conditions page (accessible from your checkout): " +
      '"You have the right to withdraw from this credit agreement within 14 days without giving ' +
      'any reason." A clearly labelled link from your checkout or product page to terms containing ' +
      "this language is sufficient. Your BNPL provider's standard T&C should already contain " +
      'this under Consumer Credit Act 1974 s.66A.',
    remediation_type: 'LINKED_TERMS_ONLY',
    regulatory_consequence: null
  },

  {
    id: 'DPC-007',
    category: 'Additional Product Information — Lender Identity and FRN',
    severity: 'HIGH',
    requirement:
      'The identity of the lender must be disclosed and accessible to the consumer before the ' +
      'agreement. Full legal lender name and FCA Firm Reference Number (FRN) must appear in the ' +
      'checkout flow or in an accessible linked page. From 15 July 2026 this must reflect a ' +
      'lender that is FCA-authorised or registered under the TPR. ' +
      '(FCA PS26/1 Chapter 2 — Additional Product Information: identity of lender)',
    fca_source:
      'FCA PS26/1 Chapter 2 — Additional Product Information: lender identity and FCA FRN',
    fca_url:
      'https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit',
    search_strings: [
      // Klarna — FRN 1021834 (updated from 987816, confirmed via Klarna UK docs March 2026)
      'klarna financial services uk',
      'klarna bank ab',
      'frn 1021834',
      'frn: 1021834',
      // Clearpay — verify current FRN at register.fca.org.uk before deploying
      'clearpay finance limited',
      'clearpay finance ltd',
      'frn 900950',
      // Generic FCA authorisation language covering all providers
      'authorised by the financial conduct authority',
      'regulated by the fca',
      'authorised and regulated',
      'firm reference number',
      'firm reference',
    ],
    search_mode: 'ANY',
    fix_suggestion:
      "Add the lender's full legal name and FCA Firm Reference Number (FRN) near the BNPL " +
      'option or in your footer. ' +
      'For Klarna: "Klarna Financial Services UK Ltd, authorised by the FCA, FRN 1021834." ' +
      'For Clearpay: "Clearpay Finance Ltd, authorised by the FCA, FRN [verify at register.fca.org.uk]." ' +
      "Always verify your provider's current FRN at https://register.fca.org.uk before " +
      'publishing — FRNs can change when a firm updates its regulatory permissions.',
    remediation_type: 'COPY_CHANGE',
    regulatory_consequence: null
  },

  {
    id: 'DPC-008',
    category: 'Additional Product Information — Early Settlement',
    severity: 'HIGH',
    requirement:
      'Information about early settlement rights must be accessible to consumers before they enter ' +
      'into the agreement. Named field in PS26/1 Additional Product Information requirements. Moved ' +
      'from KPI to Additional Product Information in final PS26/1 rules (same movement as DPC-006). ' +
      'A link to terms containing this information is sufficient. (FCA PS26/1 Chapter 2)',
    fca_source:
      'FCA PS26/1 Chapter 2 — Additional Product Information: early settlement rights',
    fca_url:
      'https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit',
    search_strings: [
      'early settlement',
      'settle early',
      'pay off early',
      'early repayment',
      'repay early',
      'settle your balance',
      'pay balance early',
    ],
    search_mode: 'ANY',
    fix_suggestion:
      'Ensure your linked BNPL terms page (accessible from checkout) contains information about ' +
      'early settlement rights. Add a visible link labelled "Your payment rights" or "Full terms" ' +
      "from your checkout page to a page containing this language. Your BNPL provider's standard " +
      'terms should already include early settlement rights — link to those terms.',
    remediation_type: 'LINKED_TERMS_ONLY',
    regulatory_consequence: null
  },

  {
    id: 'DPC-009',
    category: 'Additional Product Information — Section 75 Applicability',
    severity: 'HIGH',
    requirement:
      'Information clarifying whether Section 75 of the Consumer Credit Act 1974 applies to this ' +
      'DPC agreement must be accessible. Most DPC agreements are exempt from s.75 — this must be ' +
      'stated or accessible via linked terms. PS26/1 confirms s.75 applicability is a named required ' +
      'element of Additional Product Information. (FCA PS26/1 Chapter 2)',
    fca_source:
      'FCA PS26/1 Chapter 2 — Additional Product Information: s.75 Consumer Credit Act applicability',
    fca_url:
      'https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit',
    search_strings: [
      'section 75',
      's.75',
      's75',
      'consumer credit act',
      'section75',
      'chargeback',
      'purchase protection',
      'section 75 does not apply',
      'not covered by section 75',
    ],
    search_mode: 'ANY',
    fix_suggestion:
      'Add a disclosure in linked terms clarifying whether Section 75 of the Consumer Credit Act ' +
      '1974 applies. Most BNPL/DPC agreements are exempt — if so, state: ' +
      '"This credit agreement is not covered by Section 75 of the Consumer Credit Act 1974." ' +
      "This should appear in the lender's T&C linked from your checkout page.",
    remediation_type: 'LINKED_TERMS_ONLY',
    regulatory_consequence: null
  },

  {
    id: 'DPC-010',
    category: 'Prohibited Promotional Language',
    severity: 'HIGH',
    requirement:
      'Promotional language that presents BNPL as consequence-free, encourages impulse spending, ' +
      'or obscures the credit nature of the product is prohibited under FCA CONC 3.3. PS26/1 ' +
      'Chapter 3 applies CONC financial promotions rules to DPC lenders. ' +
      'THIS IS THE ONLY INVERTED RULE: it FAILS if prohibited language is found, PASSES if absent. ' +
      '(FCA PS26/1 Chapter 3; CONC 3.3 — financial promotions: fair, clear and not misleading)',
    fca_source:
      'FCA PS26/1 Chapter 3; FCA CONC 3.3 — financial promotions must be fair, clear and not misleading',
    fca_url:
      'https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit',
    search_strings: [
      'treat yourself',
      'why wait',
      "don't wait",
      'dont wait',
      'buy now worry later',
      'no catch',
      'guilt-free',
      'guilt free',
      'splurge',
      'indulge yourself',
      'no cost to you',
      'completely free',
      'live now pay later',
      'no reason not to',
    ],
    search_mode: 'ANY',
    invert: true,
    fix_suggestion:
      'Remove promotional language that frames BNPL as consequence-free spending. Phrases like ' +
      '"treat yourself", "why wait?", or "guilt-free" are non-compliant under FCA CONC 3.3, ' +
      'which requires financial promotions to be fair, clear and not misleading. Replace with ' +
      'neutral factual descriptions: e.g. "Pay in 3 interest-free instalments with Klarna."',
    remediation_type: 'COPY_CHANGE',
    regulatory_consequence: null
  },

  {
    id: 'DPC-011',
    category: 'Additional Product Information — Terms Link',
    severity: 'HIGH',
    requirement:
      "A link to the lender's full terms and conditions or credit agreement must be accessible from " +
      'the checkout or product page. Consumers must be able to access the full credit agreement terms ' +
      'before entering into the agreement. PS26/1 Chapter 2 requires Additional Product Information ' +
      'to be "given or made available" before the agreement — a clearly labelled link satisfies this. ' +
      '(FCA PS26/1 Chapter 2 — durable medium; Additional Product Information accessible by link)',
    fca_source:
      "FCA PS26/1 Chapter 2 — Additional Product Information: link to full lender credit agreement terms",
    fca_url:
      'https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit',
    search_strings: [
      'terms and conditions',
      'terms of service',
      'full terms',
      'credit agreement',
      'loan agreement',
      'klarna.com/uk',
      'clearpay.co.uk',
      'terms & conditions',
      'read our terms',
      'terms apply',
      'legal.klarna',
    ],
    search_mode: 'ANY',
    fix_suggestion:
      "Add a clearly labelled link to the lender's full Terms and Conditions near the BNPL " +
      'payment option. Example: "By using Klarna, you agree to Klarna\'s Terms and Conditions [link]." ' +
      "The link must be functional and lead directly to the lender's current credit agreement terms.",
    remediation_type: 'COPY_CHANGE',
    regulatory_consequence: null
  },

  // ─── NEW — PS26/1 Chapter 2 final amendment (not in CP25/23) ──────────────
  // PS26/1 added a new KPI requirement: KPI must include a statement directing
  // consumers to the Additional Product Information where their rights are set out.
  // Source: A&O Shearman PS26/1 analysis (Feb 2026):
  // "there is a new requirement that the KPI must highlight to customers that
  // information about certain rights is set out in the additional product information"

  {
    id: 'DPC-015',
    category: 'Key Product Information — Rights Signpost',
    severity: 'HIGH',
    requirement:
      'PS26/1 added a NEW KPI requirement not present in CP25/23: the Key Product Information must ' +
      'include a statement directing consumers to where their additional rights (right to withdraw, ' +
      'early settlement, CPA details, FOS complaint rights) are set out in the Additional Product ' +
      'Information. Acts as a signpost from inline KPI to linked full terms. ' +
      '(FCA PS26/1 Chapter 2 — new KPI requirement: signpost to Additional Product Information)',
    fca_source:
      'FCA PS26/1 Chapter 2 — NEW in final rules (not in CP25/23): KPI must signpost to Additional Product Information',
    fca_url:
      'https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit',
    search_strings: [
      'more information',
      'full terms',
      'your rights',
      'additional information',
      'find out more',
      'see our terms',
      'learn more',
      'read more',
      'full details',
      'further information',
    ],
    search_mode: 'ANY',
    fix_suggestion:
      'Add a statement near the BNPL option directing customers to where their rights are explained. ' +
      'Example: "For information about your right to withdraw, early repayment rights, and how to ' +
      'make a complaint, see the full credit terms [link]." ' +
      'This is a new mandatory KPI requirement added in FCA PS26/1 — it must appear as part of ' +
      'the inline KPI, not only in linked terms.',
    remediation_type: 'COPY_CHANGE',
    regulatory_consequence: null
  },

  // ─── MEDIUM (5 rules — 5 points each) ─────────────────────────────────────

  {
    id: 'DPC-012',
    category: 'Additional Product Information — Continuous Payment Authority',
    severity: 'MEDIUM',
    requirement:
      'Where the lender collects repayments via Continuous Payment Authority (CPA), the page or ' +
      'linked terms must explain how automatic repayments are collected and that the customer can ' +
      'cancel CPA through their bank. CPA mechanics are a named element of Additional Product ' +
      'Information under PS26/1 Chapter 2. (FCA PS26/1 Chapter 2; Payment Services Regulations 2017)',
    fca_source:
      'FCA PS26/1 Chapter 2 — Additional Product Information: CPA disclosure; Payment Services Regulations 2017',
    fca_url:
      'https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit',
    search_strings: [
      'continuous payment authority',
      'cpa',
      'automatic payment',
      'automatic repayment',
      'recurring payment',
      'cancel through your bank',
      'cancel with your bank',
      'direct debit',
      'automatically collected',
      'auto-payment',
    ],
    search_mode: 'ANY',
    fix_suggestion:
      'Ensure your linked BNPL terms page explains how automatic repayments are collected ' +
      '(CPA or direct debit) and state that customers can cancel this authority through their ' +
      'bank at any time. This language should appear in the lender\'s credit agreement linked ' +
      'from your checkout.',
    remediation_type: 'LINKED_TERMS_ONLY',
    regulatory_consequence: null
  },

  {
    id: 'DPC-013',
    category: 'Additional Information — Free Debt Advice Signposting',
    severity: 'MEDIUM',
    requirement:
      'PS26/1 added a NEW rule not in CP25/23: lenders must provide information about free debt ' +
      'advice to DPC borrowers who have missed a repayment or are approaching financial difficulty. ' +
      'This obligation falls primarily on the lender but presence of this language on the merchant ' +
      'page signals compliance with lender obligations being surfaced at point of sale. ' +
      '(FCA PS26/1 Chapter 2 — new rule on free debt advice; not in CP25/23)',
    fca_source:
      'FCA PS26/1 Chapter 2 — NEW rule: free debt advice signposting (added in final rules, absent from CP25/23)',
    fca_url:
      'https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit',
    search_strings: [
      'moneyhelper',
      'stepchange',
      'free debt advice',
      'debt advice',
      'national debtline',
      'citizens advice',
      'debt help',
      'money helper',
      'step change',
    ],
    search_mode: 'ANY',
    fix_suggestion:
      "While primarily the lender's obligation, adding a reference to free debt advice services " +
      'demonstrates Consumer Duty compliance. Consider adding: "If you\'re struggling with payments, ' +
      'free help is available at MoneyHelper (moneyhelper.org.uk) or StepChange (stepchange.org)."',
    remediation_type: 'COPY_CHANGE',
    regulatory_consequence: null
  },

  {
    id: 'DPC-014',
    category: 'FCA Authorisation — Provider Status',
    severity: 'MEDIUM',
    requirement:
      'From 15 July 2026 (Regulation Day), entering into DPC agreements without FCA authorisation ' +
      'or TPR registration is a criminal offence under FSMA 2000 s.19. The TPR notification window ' +
      'opens 15 May 2026 and closes 1 July 2026. Merchants should confirm their BNPL provider is ' +
      'authorised or TPR-registered and surface their regulated status. (FCA PS26/1 Chapter 5)',
    fca_source:
      'FCA PS26/1 Chapter 5 — authorisation and TPR; FSMA 2000 s.19 — general prohibition',
    fca_url:
      'https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit',
    search_strings: [
      'authorised by the financial conduct authority',
      'regulated by the financial conduct authority',
      'fca authorised',
      'fca regulated',
      'temporary permissions regime',
      'authorised and regulated by the fca',
      'fca registration',
    ],
    search_mode: 'ANY',
    fix_suggestion:
      "Add a statement near the BNPL option confirming the lender's FCA authorisation. " +
      'Example: "Klarna Financial Services UK Ltd is authorised and regulated by the Financial ' +
      'Conduct Authority." Verify your provider\'s current authorisation status at ' +
      'https://register.fca.org.uk — the TPR notification window opens 15 May 2026.',
    remediation_type: 'COPY_CHANGE',
    regulatory_consequence: null
  },

  // ─── NEW — PS26/1 Chapter 2 CRA amendment ─────────────────────────────────
  // PS26/1 amended the KPI requirement on credit reference agencies from CP25/23.
  // Lenders must now indicate whether they will (if known), or may, obtain
  // information from a CRA before deciding whether to proceed with an agreement.
  // Source: A&O Shearman PS26/1 analysis (Feb 2026)

    {
    id: 'DPC-016',
    category: 'Key Product Information — Credit Reference Agency Check',
    severity: 'MEDIUM',
    requirement:
      'PS26/1 AMENDED the KPI requirement on CRAs from CP25/23. Lenders must now indicate in ' +
      'their KPI whether they will (if known), or may, obtain information from a Credit Reference ' +
      'Agency (CRA) before deciding whether to proceed with the agreement. Presence of this ' +
      'language on or linked from the merchant page satisfies this. ' +
      '(FCA PS26/1 Chapter 2 — amended KPI: CRA check indication)',
    fca_source:
      'FCA PS26/1 Chapter 2 — AMENDED KPI requirement: credit reference agency check indication',
    fca_url:
      'https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit',
    search_strings: [
      'credit check',
      'credit reference',
      'credit search',
      'credit reference agency',
      'soft search',
      'hard search',
      'credit file',
      'credit history',
      'creditworthiness',
      'affordability check',
    ],
    search_mode: 'ANY',
    fix_suggestion:
      'Ensure your linked BNPL terms or KPI information states whether a credit reference agency ' +
      'check will or may be performed before the lender proceeds with the agreement. Example: ' +
      '"We may check your credit history with a credit reference agency before approving your ' +
      'request." Your BNPL provider should supply this language as part of their compliant KPI template.',
    remediation_type: 'LENDER_CONFIG',
    regulatory_consequence: null
  },

  // ─── NEW — PS26/1 Chapter 4 DISP complaint handling ──────────────────────
  // PS26/1 Chapter 4 applies FCA DISP complaint handling rules to DPC lenders.
  // From Regulation Day, DPC consumers are entitled to escalate unresolved
  // complaints to the Financial Ombudsman Service (FOS) for the first time.

  {
    id: 'DPC-017',
    category: 'Additional Product Information — FOS Complaint Rights',
    severity: 'MEDIUM',
    requirement:
      'PS26/1 Chapter 4 applies DISP (Dispute Resolution: Complaints Sourcebook) rules to DPC ' +
      'lenders. From 15 July 2026, DPC consumers are entitled to escalate unresolved complaints to ' +
      'the Financial Ombudsman Service (FOS) for the first time. Lenders must surface their FOS ' +
      'complaint rights to consumers. Presence of a reference to complaint procedures or the FOS ' +
      'on or linked from the merchant page is a positive compliance signal. ' +
      '(FCA PS26/1 Chapter 4; DISP sourcebook — complaint handling for DPC)',
    fca_source:
      'FCA PS26/1 Chapter 4 — DISP complaint handling rules applied to DPC; Financial Ombudsman Service access',
    fca_url:
      'https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit',
    search_strings: [
      'financial ombudsman',
      'ombudsman service',
      'fos',
      'make a complaint',
      'how to complain',
      'complaint procedure',
      'complaints policy',
      'dispute resolution',
      'resolve a dispute',
    ],
    search_mode: 'ANY',
    fix_suggestion:
      'Ensure consumers can access information about their complaint rights, including the right ' +
      'to escalate to the Financial Ombudsman Service (FOS) if their complaint is unresolved. ' +
      "Add a link to your BNPL provider's complaints procedure near the BNPL option or in your " +
      'footer. Example: "Not happy? See how to make a complaint [link to lender complaints page]." ' +
      'This is a new right for DPC consumers under FCA PS26/1 Chapter 4 from 15 July 2026.',
    remediation_type: 'LINKED_TERMS_ONLY',
    regulatory_consequence: null
  },
]
