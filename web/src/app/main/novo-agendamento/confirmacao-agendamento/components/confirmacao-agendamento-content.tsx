"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { api } from "@/services/api"
import { Loader2, Check } from "lucide-react"
import { ResumoAgendamento } from "./resumo-agendamento"

interface Agendamento {
  id: string
  profileId: string
  profileName: string
  dateTime: string
  createdAt: string
}

export function ConfirmacaoAgendamentoContent() {
  const searchParams = useSearchParams()
  const agendamentoId = searchParams.get("id")

  const [agendamento, setAgendamento] = useState<Agendamento | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const buscarAgendamento = async () => {
      if (!agendamentoId) {
        setError("ID do agendamento não fornecido")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const res = await api.get(`/agendamentos/${agendamentoId}`)
        if (res.status === 200) {
          setAgendamento(res.data)
        }
      } catch (error) {
        console.error("Erro ao buscar agendamento:", error)
        setError("Não foi possível carregar os detalhes do agendamento")
      } finally {
        setLoading(false)
      }
    }

    buscarAgendamento()
  }, [agendamentoId])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Carregando detalhes do agendamento...</p>
      </div>
    )
  }

  if (error || !agendamento) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-4 max-w-md">
          <p className="font-medium">Erro ao carregar agendamento</p>
          <p className="text-sm">{error || "Agendamento não encontrado"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Agendamento Confirmado!</h1>
          <p className="text-muted-foreground">
            Seu agendamento foi realizado com sucesso. Abaixo estão os detalhes do seu agendamento.
          </p>
        </div>

        <ResumoAgendamento
          profissionalNome={agendamento.profileName}
          dataAgendamento={agendamento.dateTime.split("T")[0]}
          horarioAgendamento={agendamento.dateTime}
        />
      </div>
    </div>
  )
}
