// lib/rule-engine/provider-fixes.ts
//
// Step-by-step portal instructions per rule per BNPL provider.
// Sources: Klarna Merchant Portal (docs.klarna.com, March 2026),
// Clearpay Merchant Dashboard (developers.clearpay.co.uk, March 2026),
// PayPal Business Help Center (developer.paypal.com, March 2026).
//
// These are action steps for merchants — not legal text.

const GENERIC_PROVIDER_FIXES = [
  'Log in to your BNPL provider\'s merchant portal.',
  'Review the provider\'s current UK merchant documentation for this disclosure or configuration requirement.',
  'Apply the provider\'s recommended change on the relevant product, cart, or checkout surface.',
  'Preview the customer-facing page and confirm the update is visible and accurate.',
];

export const PROVIDER_FIXES: Record<string, Record<string, string[]>> = {
  'DPC-001': {
    klarna: [
      'Log in to the Klarna Merchant Portal at portal.klarna.com.',
      'Navigate to Merchant Tools → On-Site Messaging.',
      'Confirm that the On-Site Messaging (OSM) placement is enabled for your product pages.',
      'If OSM is not enabled, click "Get started" and follow the integration guide for your platform (Shopify app: Klarna On-Site Messaging app from the Shopify App Store).',
      'Place the Klarna placement tag or Shopify block at a point on the page where BNPL is visible to the customer before checkout.',
      'Preview your product page and confirm the Klarna badge or message renders correctly.',
    ],
    clearpay: [
      'Log in to the Clearpay Merchant Dashboard.',
      'Navigate to Widgets & Integration.',
      'Confirm that the Clearpay site badge or instalment widget is active for your product pages.',
      'For Shopify merchants: install or update the Clearpay app from the Shopify App Store. Enable the product page badge in the app settings.',
      'Place the Clearpay widget in your product page theme, adjacent to the price or the Add to Cart button.',
      'Preview your product page and confirm the Clearpay badge renders correctly.',
    ],
    paypal: GENERIC_PROVIDER_FIXES,
    other: GENERIC_PROVIDER_FIXES,
  },

  'DPC-002': {
    klarna: [
      'Log in to the Klarna Merchant Portal at portal.klarna.com.',
      'Navigate to Merchant Tools → On-Site Messaging → Placements.',
      'Select the product page placement. Ensure the placement type is set to "Klarna Credit Promotion" or equivalent, not just a logo badge.',
      'The Klarna On-Site Messaging widget automatically includes credit nature wording when correctly configured. If it does not, enable the "informational" placement type.',
      'Alternatively, add this text manually to your product page theme adjacent to the Klarna option: "Klarna is a form of credit. By selecting Klarna you are entering into a credit agreement."',
      'Preview your product page and confirm the credit nature statement is visible.',
    ],
    clearpay: [
      'Log in to the Clearpay Merchant Dashboard.',
      'Navigate to Widgets & Integration → Widget Settings.',
      'Ensure the widget type is set to display instalment information, not just a logo. The Clearpay widget with instalment breakdown includes a credit indicator when correctly configured.',
      'If your widget only shows a logo, switch to the "instalment widget" type which shows payment breakdown and a credit disclosure.',
      'Alternatively, add this text to your product page theme adjacent to the Clearpay option: "Clearpay is a form of credit. By selecting Clearpay you are entering into a credit agreement."',
      'Preview your product page and confirm the credit disclosure is visible.',
    ],
    paypal: GENERIC_PROVIDER_FIXES,
    other: GENERIC_PROVIDER_FIXES,
  },

  'DPC-003': {
    klarna: [
      'Log in to the Klarna Merchant Portal at portal.klarna.com.',
      'Navigate to Merchant Tools → On-Site Messaging → Placements.',
      'Select the product page placement. Set the placement type to "Klarna On-Site Messaging" which dynamically calculates and displays the per-instalment amount based on the product price.',
      'The OSM widget pulls the product price from your page and displays "3 interest-free payments of £[X]" automatically.',
      'If the widget is not displaying amounts, check that your product page price element uses the correct CSS selector that Klarna\'s script targets. Refer to the OSM integration guide at docs.klarna.com/klarna-payments/on-site-messaging/',
      'For Shopify: the official Klarna On-Site Messaging Shopify app handles this automatically. Install it from the Shopify App Store if not already installed.',
      'Preview your product page and confirm the per-instalment GBP amount is displayed.',
    ],
    clearpay: [
      'Log in to the Clearpay Merchant Dashboard.',
      'Navigate to Widgets & Integration → Widget Settings.',
      'Ensure you are using the Clearpay "Instalment Widget" not the logo-only badge. The instalment widget dynamically reads the product price and displays "4 payments of £[X]".',
      'For Shopify: the Clearpay Shopify app includes the instalment widget. In the app settings, enable "Product Page Widget" and set widget type to "Instalment".',
      'Check that the widget is placed adjacent to the product price so it can calculate the per-payment amount correctly.',
      'Preview your product page and confirm the per-instalment GBP amount is displayed.',
    ],
    paypal: GENERIC_PROVIDER_FIXES,
    other: GENERIC_PROVIDER_FIXES,
  },

  'DPC-004': {
    klarna: GENERIC_PROVIDER_FIXES,
    clearpay: GENERIC_PROVIDER_FIXES,
    paypal: GENERIC_PROVIDER_FIXES,
    other: GENERIC_PROVIDER_FIXES,
  },

  'DPC-005': {
    klarna: [
      'The Klarna On-Site Messaging widget does not always display missed payment consequences inline — this typically requires explicit merchant-side addition.',
      'Add the following text adjacent to the Klarna payment option on your product or cart page: "Missing a Klarna payment may result in a late fee and could affect your credit score."',
      'For Shopify: add this text as a custom liquid block in your theme, placed adjacent to the Klarna widget block.',
      'Alternatively, ask Klarna merchant support (merchant.support@klarna.com) for their FCA-compliant KPI disclosure block which includes consequences of missed payment language.',
      'Preview the product page and confirm missed payment consequences are visible to the customer before checkout.',
    ],
    clearpay: [
      'Add the following text adjacent to the Clearpay payment option: "Missing a Clearpay payment may result in a late fee of up to £6 and could affect your credit score."',
      'For Shopify: add this as a custom liquid block adjacent to the Clearpay widget block.',
      'Clearpay\'s full missed payment policy (late fee capped at £24 or 25% of order value) should also appear in the linked Clearpay Terms.',
      'Contact Clearpay merchant support for their FCA-compliant KPI block which includes this language.',
      'Preview the product page and confirm missed payment consequences are visible.',
    ],
    paypal: GENERIC_PROVIDER_FIXES,
    other: GENERIC_PROVIDER_FIXES,
  },

  'DPC-006': {
    klarna: [
      'Klarna\'s standard Terms and Conditions already include the 14-day right to withdraw under Consumer Credit Act 1974 s.66A.',
      'Ensure a clearly labelled link to Klarna\'s Terms and Conditions is visible on your product or checkout page adjacent to the Klarna option.',
      'Add this text with a hyperlink: "By using Klarna, you agree to Klarna\'s Terms and Conditions — including your 14-day right to withdraw from this credit agreement." Link to: klarna.com/uk/legal/terms-and-conditions/',
      'Preview the page and confirm the link is functional and visible.',
    ],
    clearpay: [
      'Clearpay\'s standard Terms of Service already include the 14-day right to withdraw.',
      'Ensure a clearly labelled link to Clearpay\'s Terms of Service is visible on your product or checkout page adjacent to the Clearpay option.',
      'Add this text with a hyperlink: "By using Clearpay, you agree to Clearpay\'s Terms of Service — including your 14-day right to withdraw." Link to: clearpay.co.uk/en-GB/terms-of-service',
      'Preview the page and confirm the link is functional and visible.',
    ],
    paypal: GENERIC_PROVIDER_FIXES,
    other: GENERIC_PROVIDER_FIXES,
  },

  'DPC-007': {
    klarna: [
      'Add the following text to your product page footer or adjacent to the Klarna payment option:',
      '"Credit provided by Klarna Financial Services UK Ltd, authorised and regulated by the Financial Conduct Authority (FRN 1021834)."',
      'Verify this FRN at register.fca.org.uk before publishing — search for "Klarna Financial Services UK".',
      'Do not abbreviate or alter the legal entity name.',
      'Preview the page and confirm the lender name and FRN are visible.',
    ],
    clearpay: [
      'Add the following text to your product page footer or adjacent to the Clearpay payment option:',
      '"Credit provided by Clearpay Finance Ltd, authorised and regulated by the Financial Conduct Authority (FRN 900950)."',
      'Verify this FRN at register.fca.org.uk before publishing — search for "Clearpay Finance".',
      'Do not abbreviate or alter the legal entity name.',
      'Preview the page and confirm the lender name and FRN are visible.',
    ],
    paypal: GENERIC_PROVIDER_FIXES,
    other: GENERIC_PROVIDER_FIXES,
  },

  'DPC-008': {
    klarna: GENERIC_PROVIDER_FIXES,
    clearpay: GENERIC_PROVIDER_FIXES,
    paypal: GENERIC_PROVIDER_FIXES,
    other: GENERIC_PROVIDER_FIXES,
  },

  'DPC-009': {
    klarna: GENERIC_PROVIDER_FIXES,
    clearpay: GENERIC_PROVIDER_FIXES,
    paypal: GENERIC_PROVIDER_FIXES,
    other: GENERIC_PROVIDER_FIXES,
  },

  'DPC-010': {
    klarna: GENERIC_PROVIDER_FIXES,
    clearpay: GENERIC_PROVIDER_FIXES,
    paypal: GENERIC_PROVIDER_FIXES,
    other: GENERIC_PROVIDER_FIXES,
  },

  'DPC-011': {
    klarna: [
      'Add a hyperlink to Klarna\'s Terms and Conditions adjacent to the Klarna payment option on your product or checkout page.',
      'Link text: "Klarna Terms and Conditions"',
      'Link URL: https://www.klarna.com/uk/legal/terms-and-conditions/',
      'The link must be functional and open in a new tab.',
      'Preview the page and confirm the link renders and opens the correct destination.',
    ],
    clearpay: [
      'Add a hyperlink to Clearpay\'s Terms of Service adjacent to the Clearpay payment option.',
      'Link text: "Clearpay Terms of Service"',
      'Link URL: https://www.clearpay.co.uk/en-GB/terms-of-service',
      'The link must be functional and open in a new tab.',
      'Preview the page and confirm the link renders and opens the correct destination.',
    ],
    paypal: GENERIC_PROVIDER_FIXES,
    other: GENERIC_PROVIDER_FIXES,
  },

  'DPC-012': {
    klarna: GENERIC_PROVIDER_FIXES,
    clearpay: GENERIC_PROVIDER_FIXES,
    paypal: GENERIC_PROVIDER_FIXES,
    other: GENERIC_PROVIDER_FIXES,
  },

  'DPC-013': {
    klarna: GENERIC_PROVIDER_FIXES,
    clearpay: GENERIC_PROVIDER_FIXES,
    paypal: GENERIC_PROVIDER_FIXES,
    other: GENERIC_PROVIDER_FIXES,
  },

  'DPC-014': {
    klarna: GENERIC_PROVIDER_FIXES,
    clearpay: GENERIC_PROVIDER_FIXES,
    paypal: GENERIC_PROVIDER_FIXES,
    other: GENERIC_PROVIDER_FIXES,
  },

  'DPC-015': {
    klarna: GENERIC_PROVIDER_FIXES,
    clearpay: GENERIC_PROVIDER_FIXES,
    paypal: GENERIC_PROVIDER_FIXES,
    other: GENERIC_PROVIDER_FIXES,
  },

  'DPC-016': {
    klarna: GENERIC_PROVIDER_FIXES,
    clearpay: GENERIC_PROVIDER_FIXES,
    paypal: GENERIC_PROVIDER_FIXES,
    other: GENERIC_PROVIDER_FIXES,
  },

  'DPC-017': {
    klarna: GENERIC_PROVIDER_FIXES,
    clearpay: GENERIC_PROVIDER_FIXES,
    paypal: GENERIC_PROVIDER_FIXES,
    other: GENERIC_PROVIDER_FIXES,
  },
};
