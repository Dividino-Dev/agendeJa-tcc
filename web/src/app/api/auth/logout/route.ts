import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  (await cookies()).delete('access_token')
  return NextResponse.json({ success: true })
}
