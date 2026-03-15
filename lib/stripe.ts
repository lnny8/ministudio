import Stripe from "stripe"
import {unstable_cache} from "next/cache"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export function getCheckoutConfig() {
  const priceId = process.env.STRIPE_PRICE_ID
  const currency = (process.env.STRIPE_CURRENCY ?? "eur").toLowerCase()
  const amount = Number.parseInt(process.env.STRIPE_MONTHLY_PRICE_CENTS ?? "1000", 10)
  const productName = process.env.STRIPE_PRODUCT_NAME ?? "MiniStudio Pro"

  if (priceId) {
    return {
      line_items: [{price: priceId, quantity: 1}],
      mode: "subscription" as const,
    }
  }

  return {
    line_items: [
      {
        price_data: {
          currency,
          product_data: {name: productName},
          recurring: {interval: "month" as const},
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: "subscription" as const,
  }
}

export async function checkSubscription(email: string): Promise<boolean> {
  const customers = await stripe.customers.list({
    email,
    limit: 10,
  })

  if (customers.data.length === 0) {
    return false
  }

  for (const customer of customers.data) {
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
      limit: 1,
    })

    if (subscriptions.data.length > 0) {
      return true
    }
  }

  return false
}

export const getCachedSubscriptionStatus = unstable_cache(
  async (email: string) => checkSubscription(email),
  ["subscription-status"],
  {revalidate: 300}
)
