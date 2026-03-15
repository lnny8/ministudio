import {NextResponse} from "next/server"
import {headers} from "next/headers"
import {auth} from "@/lib/auth"
import {stripe, getCheckoutConfig} from "@/lib/stripe"

export async function POST() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401})
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    ...getCheckoutConfig(),
    customer_email: session.user.email,
    success_url: `${process.env.BETTER_AUTH_URL}/editor`,
    cancel_url: `${process.env.BETTER_AUTH_URL}/upgrade`,
  })

  return NextResponse.json({url: checkoutSession.url})
}
