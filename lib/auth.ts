import {betterAuth} from "better-auth"
import {prismaAdapter} from "better-auth/adapters/prisma"
import {magicLink} from "better-auth/plugins"
import {Resend} from "resend"
import {prisma} from "./db"

const resend = new Resend(process.env.RESEND_API_KEY)

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
      await resend.emails.send({
        from: "MiniStudio <onboarding@resend.dev>",
        to: user.email,
        subject: "Verify your email address",
        html: `<p>Hi ${user.name},</p><p>Click <a href="${url}">here</a> to verify your email address.</p>`,
      })
    },
    sendOnSignUp: true,
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({email, url}) => {
        await resend.emails.send({
          from: "MiniStudio <onboarding@resend.dev>",
          to: email,
          subject: "Your magic link",
          html: `<p>Click <a href="${url}">here</a> to sign in to MiniStudio.</p>`,
        })
      },
    }),
  ],
  trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"],
})

export type Session = typeof auth.$Infer.Session
