"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import axios from "axios"
import { api } from "@/services/api"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      })

      const { access_token } = response.data

      const cookieResponse = await fetch("/api/auth/set-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ access_token }),
      })

      if (!cookieResponse.ok) throw new Error("Falha ao salvar token no cookie")

      router.push("/main/agendamentos")

    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage("Usuário ou senha inválidos")
      } else {
        setErrorMessage("Erro ao fazer login")
      }
      console.error("Login failed", error)
    }
  }


  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Entrar</h1>
        <p className="text-gray-500">Por favor, preenche suas informações</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Coloque seu email cadastrado"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <Link href="/esqueci-senha" className="text-sm text-blue-600 hover:underline">
              Esqueceu a senha?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Coloque sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && (
          <p className="text-red-500 text-sm text-center">{errorMessage}</p>
        )}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          />
          <Label htmlFor="remember" className="text-sm font-normal">
            Lembrar
          </Label>
        </div>
        <Button type="submit" className="w-full">
          Entrar
        </Button>
      </form>
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Ainda não possui uma conta?{" "}
          <Link href="/cadastro" className="text-blue-600 hover:underline">
            Crie uma conta agora
          </Link>
        </p>
      </div>
    </div>
  )
}

