"use client"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/user-avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CalendarIcon, PlusIcon } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function Header() {
  const [user, setUser] = useState<{ name: string, avatar: string, sub: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/me", {
        method: "GET",
        credentials: "include", // garante envio do cookie
      })

      if (res.ok) {
        const data = await res.json()
        setUser(data)
      }
    }

    fetchUser()
  }, [])

  const pathname = usePathname()
  const isLoggedIn = !!user?.name

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    router.push("/login")
  }

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Logo />

        {isLoggedIn && (
          <nav className="ml-auto flex items-center gap-4 sm:gap-6">
            <Link href="/main/agendamentos" className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              <span>Agendamentos</span>
            </Link>
            <Button asChild variant="default">
              <Link href="/main/novo-agendamento">
                <PlusIcon className="mr-2 h-4 w-4" />
                Novo Agendamento
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="cursor-pointer">
                  <UserAvatar name={user.name} image={user.avatar} id={user.sub} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href={`/main/perfil/${user.sub}`}>Perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        )}

        {!isLoggedIn && (
          <div className="ml-auto flex items-center gap-4">
            <Button asChild variant="outline">
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild>
              <Link href="/cadastro">Cadastrar</Link>
            </Button>
          </div>
        )}
      </div>
    </header >
  )
}
