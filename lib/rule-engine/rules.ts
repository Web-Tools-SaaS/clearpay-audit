import type { Rule } from './types'

export const RULES: Rule[] = [
  {
    id: 'DPC-001',
    category: 'BNPL Detection',
    severity: 'CRITICAL',
    requirement: 'Page must mention Klarna, Clearpay, Laybuy, or equivalent BNPL provider, confirming BNPL is offered.',
    fca_source: 'FCA PS26/1 (Feb 2026) — scope of DPC regulation',
    fca_url: 'https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit',
    search_strings: ['klarna', 'clearpay', 'laybuy', 'pay in 3', 'pay in three', 'buy now pay later', 'bnpl', 'deferred payment', 'pay later'],
    search_mode: 'ANY',
    fix_suggestion: 'Not applicable — if BNPL is not mentioned on this page, submit your product page or cart page URL instead.'
  },
  {
    id: 'DPC-002',
    category: 'Key Product Information — Credit Nature',
    severity: 'CRITICAL',
    requirement: 'Before a consumer enters into a DPC agreement, the lender must provide key product information clearly stating this is a form of credit or borrowing. The page must not present BNPL purely as a payment method without identifying it as credit. (FCA PS26/1, Chapter 2)',
    fca_source: 'FCA PS26/1 Chapter 2, CONC 4.2A — Key Product Information pre-contract disclosure',
    fca_url: 'https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit',
    search_strings: ['credit', 'borrowing', 'loan', 'lend', 'borrow'],
    search_mode: 'ANY',
    fix_suggestion: 'Add near the BNPL option: "This is a credit agreement. You are borrowing money which must be repaid." The word "credit" or "borrowing" must appear in proximity to the BNPL payment option.'
  },
  {
    id: 'DPC-003',
    category: 'Key Product Information — Repayment Schedule',
    severity: 'CRITICAL',
    requirement: 'Key product information must include the number of repayments and amount of each repayment before the consumer enters into the agreement. "Pay in 3" alone is insufficient — the instalment amount must be stated or clearly calculable. (FCA PS26/1, CONC 4.2A)',
    fca_source: 'FCA PS26/1 Chapter 2; FCA CP25/23 para 3.12 — amount of credit and repayment schedule',
    fca_url: 'https://www.fca.org.uk/publications/consultation-papers/cp25-23-deferred-payment-credit',
    search_strings: ['instalment', 'installment', 'repayment', 'payment of', '£', 'per month', 'every', 'weeks', 'monthly'],
    search_mode: 'ANY',
    fix_suggestion: 'Display the repayment breakdown explicitly next to the BNPL option. Example: "Pay in 3 interest-free instalments of £[X]. First payment today, then every 30 days." The instalment amount in GBP (£) must appear near the BNPL option.'
  },
  {
    id: 'DPC-004',
    category: 'Key Product Information — Interest Rate',
    severity: 'CRITICAL',
    requirement: 'Key product information must state the rate of interest, which for DPC must be stated as 0%. This is a required field under FCA PS26/1 key product information rules, even though the rate is zero. (FCA PS26/1)',
    fca_source: 'FCA PS26/1 Chapter 2; CONC 4.2A — rate of interest (0% for DPC)',
    fca_url: 'https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit',
    search_strings: ['0% interest', 'interest free', 'interest-free', 'no interest', '0% apr'],
    search_mode: 'ANY',
    fix_suggestion: 'Add "0% interest" or "Interest-free" clearly near the BNPL payment option. This must be stated explicitly even though the rate is zero — the FCA requires it to appear in key product information.'
  },
  {
    id: 'DPC-005',
    category: 'Key Product Information — Consequences of Missed Payments',
    severity: 'CRITICAL',
    requirement: 'Key product information must include the main consequences of missing payments before the consumer enters into the agreement. This is a named required element in FCA PS26/1. (FCA PS26/1 Chapter 2; CP25/23 para 3.12)',
    fca_source: 'FCA PS26/1 Chapter 2; FCA CP25/23 para 3.12 — consequences of non-payment as required KPI field',
    fca_url: 'https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit',
    search_strings: ['missed payment', 'miss a payment', 'late payment', 'late fee', 'penalty', 'credit score', 'debt collection', 'default', 'consequences'],
    search_mode: 'ANY',
    fix_suggestion: 'Add near the BNPL payment option: "Missing payments may result in late fees and could affect your credit score." This is a mandatory disclosure under FCA PS26/1 Key Product Information rules.'
  },
  {
    id: 'DPC-006',
    category: 'Key Product Information — Right to Withdraw',
    severity: 'CRITICAL',
    requirement: 'Consumers must be informed of their right to withdraw from the DPC agreement within 14 days. This is a required element of key product information under FCA PS26/1 as applied via the Consumer Credit Act withdrawal rights framework. (FCA PS26/1 Chapter 2)',
    fca_source: 'FCA PS26/1 Chapter 2; Consumer Credit Act 1974 s.66A — 14-day right of withdrawal from credit agreements',
    fca_url: 'https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit',
    search_strings: ['right to withdraw', 'withdraw within', '14 day', 'fourteen day', 'cooling off', 'cancel within', 'withdrawal right'],
    search_mode: 'ANY',
    fix_suggestion: 'Add near the BNPL option or in linked terms: "You have the right to withdraw from this credit agreement within 14 days." This is a mandatory disclosure under Consumer Credit Act 1974 s.66A as incorporated into FCA PS26/1.'
  },
  {
    id: 'DPC-007',
    category: 'Additional Product Information — Lender Identity',
    severity: 'HIGH',
    requirement: 'The identity of the lender must be disclosed and must be accessible to the consumer. Full legal lender name and FCA Firm Reference Number (FRN) must appear somewhere in the checkout flow or accessible linked page. (FCA PS26/1 Chapter 2)',
    fca_source: 'FCA PS26/1 Chapter 2 — Additional Product Information: identity of lender including FCA FRN',
    fca_url: 'https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit',
    search_strings: ['klarna financial services uk', 'klarna bank ab', 'frn 1021834', 'frn: 1021834', 'clearpay finance limited', 'clearpay finance ltd', 'frn 900950', 'laybuy uk', 'frn 926145', 'authorised by the financial conduct authority', 'regulated by the fca', 'firm reference', 'frn'],
    search_mode: 'ANY',
    fix_suggestion: 'Add the lender\'s full legal name and FCA Firm Reference Number (FRN) near the BNPL option or in your footer. For Klarna: "Klarna Financial Services UK Ltd, authorised by the FCA, FRN 1021834." For Clearpay: "Clearpay Finance Ltd, authorised by the FCA, FRN 900950." Check your lender\'s current FRN at https://register.fca.org.uk'
  },
  {
    id: 'DPC-008',
    category: 'Additional Product Information — Early Settlement',
    severity: 'HIGH',
    requirement: 'Information about early settlement rights must be accessible to consumers. This is a named field in the Additional Product Information requirements. It does not need to be immediately visible but must be reachable via a linked T&C page. (FCA PS26/1 Chapter 2)',
    fca_source: 'FCA PS26/1 Chapter 2 — Additional Product Information: early settlement',
    fca_url: 'https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit',
    search_strings: ['early settlement', 'settle early', 'pay off early', 'early repayment', 'repay early', 'settle your balance'],
    search_mode: 'ANY',
    fix_suggestion: 'Ensure your linked BNPL terms page contains information about early settlement rights. Add a visible link labelled "Your right to settle early" or include this in the lender\'s credit agreement linked from your checkout.'
  },
  {
    id: 'DPC-009',
    category: 'Additional Product Information — Section 75 Applicability',
    severity: 'HIGH',
    requirement: 'Information clarifying whether Section 75 of the Consumer Credit Act 1974 applies to this DPC agreement must be accessible. Most DPC agreements are exempt from s.75 — this must be stated or accessible. (FCA PS26/1 Chapter 2)',
    fca_source: 'FCA PS26/1 Chapter 2 — Additional Product Information: s.75 Consumer Credit Act applicability',
    fca_url: 'https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit',
    search_strings: ['section 75', 's.75', 's75', 'consumer credit act', 'section75', 'chargeback', 'purchase protection'],
    search_mode: 'ANY',
    fix_suggestion: 'Add a disclosure near the BNPL option or in linked terms clarifying whether Section 75 of the Consumer Credit Act 1974 applies. Most BNPL arrangements are exempt — if so, state: "This credit agreement is not covered by Section 75 of the Consumer Credit Act 1974."'
  },
  {
    id: 'DPC-010',
    category: 'Prohibited Promotional Language',
    severity: 'HIGH',
    requirement: 'Promotional language that presents BNPL as consequence-free, encourages impulse spending, or obscures the credit nature of the product is prohibited under FCA CONC rules on fair, clear and not misleading communications. (FCA PS26/1; CONC 3.3)',
    fca_source: 'FCA PS26/1; FCA CONC 3.3 — financial promotions must be fair, clear and not misleading',
    fca_url: 'https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit',
    search_strings: ['treat yourself', 'why wait', "don't wait", 'dont wait', 'buy now worry later', 'no catch', 'guilt-free', 'guilt free', 'splurge', 'indulge', 'no cost to you', 'completely free'],
    search_mode: 'ANY',
    invert: true,
    fix_suggestion: 'Remove promotional language that frames BNPL as consequence-free spending. Phrases like "treat yourself", "why wait", or "guilt-free" are non-compliant under FCA CONC 3.3 rules requiring financial promotions to be fair, clear and not misleading. Replace with neutral factual descriptions of the payment option.'
  },
  {
    id: 'DPC-011',
    category: 'Additional Product Information — Terms Link',
    severity: 'HIGH',
    requirement: 'A link to the lender\'s full terms and conditions or credit agreement must be accessible from the checkout or product page. Consumers must be able to access full credit agreement terms before entering into the agreement. (FCA PS26/1 Chapter 2)',
    fca_source: 'FCA PS26/1 Chapter 2 — Additional Product Information: link to full credit agreement terms',
    fca_url: 'https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit',
    search_strings: ['terms and conditions', 'terms of service', 'full terms', 'credit agreement', 'loan agreement', 'klarna.com/uk', 'clearpay.co.uk', 'laybuy.com', 'terms & conditions', 'read our terms'],
    search_mode: 'ANY',
    fix_suggestion: 'Add a clearly labelled link to the lender\'s full terms and conditions near the BNPL payment option. Example: "By using Klarna, you agree to Klarna\'s Terms and Conditions [link]." The link must be functional and lead to the lender\'s current credit agreement terms.'
  },
  {
    id: 'DPC-012',
    category: 'Continuous Payment Authority (CPA)',
    severity: 'MEDIUM',
    requirement: 'Where the lender collects repayments via Continuous Payment Authority, the page or linked terms must explain how automatic repayments are collected and that the customer can cancel CPA through their bank. (FCA PS26/1; Payment Services Regulations 2017)',
    fca_source: 'FCA PS26/1; Payment Services Regulations 2017 — CPA disclosure requirements',
    fca_url: 'https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit',
    search_strings: ['continuous payment authority', 'cpa', 'automatic payment', 'automatic repayment', 'recurring payment', 'cancel through your bank', 'cancel with your bank', 'direct debit'],
    search_mode: 'ANY',
    fix_suggestion: 'Ensure your linked BNPL terms page explains how automatic repayments are collected (CPA or direct debit) and state that customers can cancel this authority through their bank at any time. This should appear in the lender\'s credit agreement linked from your checkout.'
  },
  {
    id: 'DPC-013',
    category: 'Free Debt Advice Signposting',
    severity: 'MEDIUM',
    requirement: 'PS26/1 requires lenders to signpost consumers to free debt advice when they miss a payment. Presence of this language on the merchant page is a positive signal of compliance with lender obligations being surfaced at point of sale. (FCA PS26/1 — specific addition not in CP25/23)',
    fca_source: 'FCA PS26/1 — free debt advice signposting requirement (added in final rules, not in CP25/23 consultation)',
    fca_url: 'https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit',
    search_strings: ['moneyhelper', 'stepchange', 'free debt advice', 'debt advice', 'national debtline', 'citizens advice', 'debt help'],
    search_mode: 'ANY',
    fix_suggestion: 'While primarily the lender\'s obligation, consider adding a reference to free debt advice services near the BNPL option. Example: "If you\'re struggling with payments, free help is available at MoneyHelper (moneyhelper.org.uk) or StepChange (stepchange.org)."'
  },
  {
    id: 'DPC-014',
    category: 'FCA Authorisation — Provider Status',
    severity: 'MEDIUM',
    requirement: 'The checkout must reflect that the BNPL lender is FCA-authorised or in the Temporary Permissions Regime by July 15, 2026. Offering BNPL from an unauthorised lender after Regulation Day is a criminal offence. The merchant\'s page should show the lender\'s FCA authorisation statement. (FCA PS26/1; FSMA 2000 s.19)',
    fca_source: 'FCA PS26/1; FSMA 2000 s.19 — general prohibition on unauthorised regulated activity',
    fca_url: 'https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit',
    search_strings: ['authorised by the financial conduct authority', 'regulated by the fca', 'fca authorised', 'fca regulated', 'temporary permissions regime', 'tpr', 'fca registration'],
    search_mode: 'ANY',
    fix_suggestion: 'Add a statement near the BNPL option confirming the lender\'s FCA authorisation. Example: "Klarna Financial Services UK Ltd is authorised and regulated by the Financial Conduct Authority." Verify your provider\'s current authorisation status at https://register.fca.org.uk'
  }
]
