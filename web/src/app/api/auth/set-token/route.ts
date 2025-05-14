import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { access_token } = await req.json()

  if (!access_token) {
    return NextResponse.json({ error: "Token não fornecido" }, { status: 400 })
  }

  (await cookies()).set("access_token", access_token, {
    //httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60, // 1 hora
    path: "/",
  })

  return NextResponse.json({ success: true })
}
