// lib/payment.ts
// Payment provider abstraction. Current state: no payment gate (all audits marked 'paid' for testing).
// To integrate a payment provider:
// 1. Set PAYMENT_PROVIDER env var to 'lemonsqueezy' or 'dodopayments'
// 2. Implement the createCheckoutSession function for your chosen provider
// 3. Add webhook handler at /api/webhooks/payment
// 4. Remove the hardcoded payment_status: 'paid' from create-audit/route.ts
//
// Provider URLs:
// Lemon Squeezy: https://api.lemonsqueezy.com/v1/
// Dodo Payments: https://api.dodopayments.com/v1/ (verify current docs at dodopayments.com)

export type PaymentProvider = 'lemonsqueezy' | 'dodopayments' | 'none'

export function getPaymentProvider(): PaymentProvider {
  const provider = process.env.PAYMENT_PROVIDER
  if (provider === 'lemonsqueezy') return 'lemonsqueezy'
  if (provider === 'dodopayments') return 'dodopayments'
  return 'none'
}
