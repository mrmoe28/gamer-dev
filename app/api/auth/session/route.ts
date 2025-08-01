import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/auth-options"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
  
  return NextResponse.json({ 
    session,
    message: "Authenticated successfully" 
  })
}