
import type { Metadata } from "next"
import { RegisterForm } from "./components/register-form"

export const metadata: Metadata = {
  title: "Cadastro | Sistema de Agendamento",
  description: "Crie sua conta no sistema de agendamento",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  )
}

