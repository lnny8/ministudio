import {headers} from "next/headers"
import {redirect} from "next/navigation"
import {auth} from "@/lib/auth"
import {getCachedSubscriptionStatus} from "@/lib/stripe"
import EditorClient from "./editor-client"

export default async function Editor() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/sign-in")
  }

  const isDev = process.env.NODE_ENV === "development"

  if (!isDev) {
    const hasSubscription = await getCachedSubscriptionStatus(session.user.email)
    if (!hasSubscription) {
      redirect("/upgrade")
    }
  }

  return <EditorClient />
}
