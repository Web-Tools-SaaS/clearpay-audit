// lib/rule-engine/compliant-wording.ts
//
// Compliant disclosure wording per rule per BNPL provider.
// Source: FCA PS26/1 Chapter 2 (11 Feb 2026), CONC 4.2A, provider legal pages.
// These are ready-to-paste strings. Merchants should place them adjacent to
// the BNPL payment option on their product or checkout page.
//
// Providers: klarna | clearpay | paypal | other
// Rules not in this file: DPC-010 (remove text), DPC-012, DPC-015, DPC-016,
// DPC-017 (all require T&C or lender-side action, not inline copy).

const GENERIC_DEBT_ADVICE_WORDING =
  'If you are struggling with debt or repayments, free advice is available from MoneyHelper at moneyhelper.org.uk (0800 138 7777) or StepChange Debt Charity at stepchange.org (0800 138 1111).';

export const COMPLIANT_WORDING: Record<string, Record<string, string>> = {
  'DPC-001': {
    klarna:
      'Klarna is available as a payment option on this page. Klarna is a regulated credit provider. Selecting Klarna means you are entering into a credit agreement.',
    clearpay:
      'Clearpay is available as a payment option on this page. Clearpay is a regulated credit provider. Selecting Clearpay means you are entering into a credit agreement.',
    paypal:
      'PayPal Pay in 3 is available as a payment option on this page. PayPal Pay in 3 is a regulated credit product. Selecting Pay in 3 means you are entering into a credit agreement.',
    other:
      'Buy Now Pay Later is available as a payment option on this page. BNPL is a regulated credit product. Selecting this option means you are entering into a credit agreement.',
  },

  'DPC-002': {
    klarna:
      'Klarna is a form of credit, not just a payment method. By selecting Klarna, you are borrowing money under a credit agreement with Klarna Financial Services UK Ltd. This credit must be repaid in instalments.',
    clearpay:
      'Clearpay is a form of credit, not just a payment method. By selecting Clearpay, you are borrowing money under a credit agreement with Clearpay Finance Ltd. This credit must be repaid in instalments.',
    paypal:
      'PayPal Pay in 3 is a form of credit, not just a payment method. By selecting Pay in 3, you are borrowing money under a credit agreement with PayPal (Europe) S.à r.l. et Cie, S.C.A. This credit must be repaid in instalments.',
    other:
      'This Buy Now Pay Later option is a form of credit, not just a payment method. By selecting it, you are borrowing money under a credit agreement which must be repaid.',
  },

  'DPC-003': {
    klarna:
      'Pay in 3 interest-free instalments with Klarna. Your first payment is made today; the remaining two payments are collected automatically every 30 days. Each instalment is one third of your order total. Example: a £90 order = 3 payments of £30.',
    clearpay:
      'Pay in 4 interest-free fortnightly instalments with Clearpay. Your first payment is made today; the remaining three payments are collected automatically every two weeks. Each instalment is one quarter of your order total. Example: a £80 order = 4 payments of £20.',
    paypal:
      'Pay in 3 interest-free monthly instalments with PayPal Pay in 3. Your first payment is made today; the remaining two payments are collected automatically every month. Each instalment is one third of your order total. Example: a £90 order = 3 payments of £30.',
    other:
      'Pay in interest-free instalments. Your first payment is made today; remaining payments are collected automatically. The instalment amount is your order total divided equally by the number of payments.',
  },

  'DPC-004': {
    klarna:
      '0% interest. Klarna charges no interest on Pay in 3 agreements. The total amount you repay equals the purchase price. No APR applies.',
    clearpay:
      '0% interest. Clearpay charges no interest on Pay in 4 agreements. The total amount you repay equals the purchase price. No APR applies.',
    paypal:
      '0% interest. PayPal Pay in 3 charges no interest. The total amount you repay equals the purchase price. No APR applies.',
    other:
      '0% interest. No interest is charged on this credit agreement. The total amount you repay equals the purchase price.',
  },

  'DPC-005': {
    klarna:
      "Missing a Klarna payment may result in a late fee charged by Klarna and could negatively affect your credit score. Klarna may refer overdue amounts to a debt collection agency. You can find full details of Klarna's missed payment consequences in Klarna's terms and conditions.",
    clearpay:
      'Missing a Clearpay payment may result in a late fee and could negatively affect your credit score. Missed payments may be reported to credit reference agencies. See Clearpay\'s Terms of Service for full details of missed payment consequences including applicable fee amounts.',
    paypal:
      "Missing a PayPal Pay in 3 payment may result in your account being referred for debt recovery and could negatively affect your credit score. PayPal may carry out a soft credit check before approving Pay in 3. Full details are in PayPal's credit agreement.",
    other:
      "Missing a payment on this credit agreement may result in late fees and could negatively affect your credit score. Overdue amounts may be referred to a debt collection agency. Please refer to the lender's terms for full details of missed payment consequences.",
  },

  'DPC-006': {
    klarna:
      "You have the right to withdraw from this Klarna credit agreement within 14 days of entering into it, without giving any reason. To exercise this right, contact Klarna directly. Full details are in Klarna's Terms and Conditions.",
    clearpay:
      "You have the right to withdraw from this Clearpay credit agreement within 14 days of entering into it, without giving any reason. To exercise this right, contact Clearpay directly. Full details are in Clearpay's Terms and Conditions.",
    paypal:
      "You have the right to withdraw from this PayPal Pay in 3 credit agreement within 14 days of entering into it, without giving any reason. To exercise this right, contact PayPal directly. Full details are in PayPal's credit agreement.",
    other:
      "You have the right to withdraw from this credit agreement within 14 days of entering into it, without giving any reason. To exercise this right, contact the lender directly. Full details are in the lender's Terms and Conditions.",
  },

  'DPC-007': {
    klarna:
      'Credit provided by Klarna Financial Services UK Ltd, authorised and regulated by the Financial Conduct Authority, Firm Reference Number 1021834. Verify current details at register.fca.org.uk.',
    clearpay:
      'Credit provided by Clearpay Finance Ltd, authorised and regulated by the Financial Conduct Authority, Firm Reference Number 900950. Verify current details at register.fca.org.uk.',
    paypal:
      'Credit provided by PayPal (Europe) S.à r.l. et Cie, S.C.A., 22-24 Boulevard Royal, L-2449 Luxembourg. Authorised by the Luxembourg Commission de Surveillance du Secteur Financier (CSSF) and deemed authorised by the Prudential Regulation Authority. Subject to regulation by the Financial Conduct Authority and limited regulation by the Prudential Regulation Authority. Details of the Temporary Permissions Regime are on the FCA website at register.fca.org.uk.',
    other:
      "Credit is provided by [Lender legal name], authorised and regulated by the Financial Conduct Authority, Firm Reference Number [FRN]. Verify the lender's current FCA authorisation at register.fca.org.uk.",
  },

  'DPC-008': {
    klarna:
      "You have the right to repay your Klarna credit early at any time, in full or in part, without penalty. Early settlement will reduce or eliminate remaining instalments. See Klarna's Terms and Conditions for full details of your early settlement rights.",
    clearpay:
      "You have the right to repay your Clearpay credit early at any time, in full or in part, without penalty. Contact Clearpay to arrange early settlement. See Clearpay's Terms and Conditions for full details.",
    paypal:
      "You have the right to repay your PayPal Pay in 3 credit early at any time without penalty. See your PayPal credit agreement for full details of early settlement rights.",
    other:
      "You have the right to repay this credit early at any time, in full or in part, without penalty. See the lender's Terms and Conditions for full details of your early settlement rights.",
  },

  'DPC-009': {
    klarna:
      'Section 75 of the Consumer Credit Act 1974 does not apply to Klarna Pay in 3 agreements. You may have chargeback rights through your card issuer if you paid your first instalment by debit or credit card.',
    clearpay:
      'Section 75 of the Consumer Credit Act 1974 does not apply to Clearpay agreements. You may have chargeback rights through your card issuer if you paid your first instalment by debit or credit card.',
    paypal:
      "Section 75 of the Consumer Credit Act 1974 does not apply to PayPal Pay in 3 agreements. PayPal Buyer Protection may apply to eligible purchases — see PayPal's terms for details.",
    other:
      "Section 75 of the Consumer Credit Act 1974 does not apply to this credit agreement. Please refer to the lender's Terms and Conditions for information about your purchase protection rights.",
  },

  'DPC-011': {
    klarna:
      "By selecting Klarna, you agree to Klarna's Terms and Conditions. Read Klarna's full terms at klarna.com/uk/legal/terms-and-conditions/",
    clearpay:
      "By selecting Clearpay, you agree to Clearpay's Terms and Conditions. Read Clearpay's full terms at clearpay.co.uk/en-GB/terms-of-service",
    paypal:
      "By selecting PayPal Pay in 3, you agree to PayPal's Pay in 3 Credit Agreement. Read the full terms at paypal.com/uk/webapps/mpp/pay-in-3-terms",
    other:
      "By selecting this payment option, you agree to the lender's Terms and Conditions. A link to the full credit agreement terms must be displayed here.",
  },

  'DPC-013': {
    klarna:
      'If you are struggling to make your Klarna payments, free debt advice is available from MoneyHelper at moneyhelper.org.uk (0800 138 7777) or StepChange Debt Charity at stepchange.org (0800 138 1111).',
    clearpay:
      'If you are struggling to make your Clearpay payments, free debt advice is available from MoneyHelper at moneyhelper.org.uk (0800 138 7777) or StepChange Debt Charity at stepchange.org (0800 138 1111).',
    paypal:
      'If you are struggling to make your PayPal Pay in 3 payments, free debt advice is available from MoneyHelper at moneyhelper.org.uk (0800 138 7777) or StepChange Debt Charity at stepchange.org (0800 138 1111).',
    other: GENERIC_DEBT_ADVICE_WORDING,
  },

  'DPC-014': {
    klarna:
      "Klarna Financial Services UK Ltd is authorised and regulated by the Financial Conduct Authority (FRN 1021834). Klarna's FCA registration can be verified at register.fca.org.uk.",
    clearpay:
      "Clearpay Finance Ltd is authorised and regulated by the Financial Conduct Authority (FRN 900950). Clearpay's FCA registration can be verified at register.fca.org.uk.",
    paypal:
      'PayPal (Europe) S.à r.l. et Cie, S.C.A. is authorised by the Luxembourg CSSF and operates in the UK under the Temporary Permissions Regime, regulated by the Financial Conduct Authority. Verify at register.fca.org.uk.',
    other:
      'This BNPL provider is authorised and regulated by the Financial Conduct Authority. Verify the provider\'s authorisation at register.fca.org.uk before 15 July 2026.',
  },
};
