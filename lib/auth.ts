import {betterAuth} from "better-auth"
import {prismaAdapter} from "better-auth/adapters/prisma"
import {PrismaClient} from "@prisma/client"
import {stripe} from "@better-auth/stripe"
import {magicLink} from "better-auth/plugins"
import Stripe from "stripe"

const prisma = new PrismaClient()

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2025-04-30.basil",
})

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({user, url}) => {
      // TODO: Replace with Resend when API key is set
      console.log(`[Auth] Verification email for ${user.email}: ${url}`)
    },
    sendOnSignUp: true,
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({email, url}) => {
        // TODO: Replace with Resend when API key is set
        console.log(`[Auth] Magic link for ${email}: ${url}`)
      },
    }),
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: [
          {
            name: "pro",
            priceId: "price_TODO", // Replace with your Stripe price ID
          },
        ],
      },
    }),
  ],
  trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"],
})

export type Session = typeof auth.$Infer.Session
