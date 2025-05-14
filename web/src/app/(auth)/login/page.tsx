import { Logo } from "@/components/logo"
import type { Metadata } from "next"
import { LoginForm } from "./components/login-form"
import Link from "next/link"


export const metadata: Metadata = {
  title: "Login | Sistema de Agendamento",
  description: "Faça login na sua conta",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex md:w-1/2 bg-blue-600 text-white flex-col items-center justify-center p-10">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-4">
            <div className="bg-white/10 p-4 rounded-lg inline-block">
              <Logo />
            </div>
          </div>
          <p className="text-lg">Bem Vindo! Faça seu login para entrar no sistema</p>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

