import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/', '/login', '/cadastro', '/esqueci-senha', '/public']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar se há o cookie access_token
  const token = request.cookies.get('access_token')?.value

  if (token && pathname === '/login') {
    const agendamentoUrl = new URL('/main/agendamentos', request.url)
    return NextResponse.redirect(agendamentoUrl)
  }

  // Permitir acesso livre às rotas públicas
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next()
  }



  if (!token) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Onde o middleware será aplicado
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|gif)).*)',
  ],
}
