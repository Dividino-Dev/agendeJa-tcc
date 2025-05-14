import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function GET() {
  const token = (await cookies()).get("access_token")?.value

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    return NextResponse.json({
      sub: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
      avatar: decoded.avatar,
    })
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}
