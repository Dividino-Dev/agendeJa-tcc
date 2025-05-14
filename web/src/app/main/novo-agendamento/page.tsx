"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check, ChevronLeft, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDateTime, formatTime } from "@/app/utils/date-utils"
import { CategoriaSelector } from "./components/categoria-seletor"
import { ProfissionaisList } from "./components/profissionais-list"
import { DiasDisponiveis } from "./components/dias-disponiveis"
import { HorariosDisponiveis } from "./components/horarios-disponiveis"
import { ResumoAgendamento } from "./confirmacao-agendamento/components/resumo-agendamento"
import { api } from "@/services/api"
import { Header } from "@/components/header"


export default function NovoAgendamento() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [categoria, setCategoria] = useState("")
  const [profissionalId, setProfissionalId] = useState("")
  const [profissionalNome, setProfissionalNome] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedSlotId, setSelectedSlotId] = useState("")
  const [selectedDateTime, setSelectedDateTime] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [agendamentoId, setAgendamentoId] = useState<string | null>(null)

  const handleSelectProfissional = (id: string, nome: string) => {
    setProfissionalId(id)
    setProfissionalNome(nome)
    setStep(2)
  }

  const handleSelectDate = (date: string) => {
    setSelectedDate(date)
    setStep(3)
  }

  const handleSelectSlot = (slotId: string, dateTime: string) => {

    setSelectedSlotId(slotId)
    setSelectedDateTime(dateTime)
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      console.log("Submit: ", selectedSlotId)


      const response = await api.patch("/timeslots/booked", {
        id: selectedSlotId
      })

      if (response.status === 200) {
        const data = await response.data
        setAgendamentoId(data.id)
        setShowConfirmation(true)
      } else {
        alert("Erro ao realizar agendamento. Tente novamente.")
      }

    } catch (error) {
      console.error("Erro ao enviar agendamento:", error)
      alert("Erro ao realizar agendamento. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }


  const formatarData = (dataISO: string) => {
    if (!dataISO) return ""
    return formatDateTime(dataISO, "dd 'de' MMMM 'de' yyyy")
  }

  const formatarHora = (dateTimeISO: string) => {
    if (!dateTimeISO) return ""
    return formatTime(dateTimeISO)
  }


  if (showConfirmation) {
    return (
      <section className="container px-4 py-8">
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
            profissionalNome={profissionalNome}
            dataAgendamento={selectedDate}
            horarioAgendamento={selectedDateTime}
          />
        </div>
      </section>
    )
  }

  return (
    <>
      <Header />

      <section className="container px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Novo Agendamento</h1>

        <div className="max-w-4xl mx-auto">
          {/* Indicador de progresso */}
          <div className="flex justify-between mb-8">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                1
              </div>
              <span className="text-sm mt-1">Profissional</span>
            </div>
            <div className="flex-1 flex items-center">
              <div className={`h-1 w-full ${step >= 2 ? "bg-primary" : "bg-muted"}`}></div>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                2
              </div>
              <span className="text-sm mt-1">Data</span>
            </div>
            <div className="flex-1 flex items-center">
              <div className={`h-1 w-full ${step >= 3 ? "bg-primary" : "bg-muted"}`}></div>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                3
              </div>
              <span className="text-sm mt-1">Horário</span>
            </div>
          </div>

          {/* Resumo do agendamento */}
          {(profissionalId || selectedDate || selectedDateTime) && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Resumo do Agendamento</CardTitle>
                <CardDescription>Informações selecionadas até o momento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {profissionalId && (
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="font-medium">Profissional:</span>
                      <span className="ml-2">{profissionalNome}</span>
                    </div>
                  )}
                  {selectedDate && (
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="font-medium">Data:</span>
                      <span className="ml-2">{formatarData(`${selectedDate}T00:00:00`)}</span>
                    </div>
                  )}
                  {selectedDateTime && (
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="font-medium">Horário:</span>
                      <span className="ml-2">{formatarHora(selectedDateTime)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Etapa 1: Seleção de Profissional */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Selecione a categoria e o profissional</h2>
                <div className="mb-4">
                  <CategoriaSelector onSelect={setCategoria} />
                </div>
                {categoria && (
                  <ProfissionaisList categoria={categoria} onSelect={(id, nome) => handleSelectProfissional(id, nome)} />
                )}
              </div>
            </div>
          )}

          {/* Etapa 2: Seleção de Data */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <Button variant="ghost" onClick={() => setStep(1)} className="p-0 h-8 mr-2">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-semibold">Selecione uma data disponível</h2>
              </div>
              <DiasDisponiveis profileId={profissionalId} onSelect={handleSelectDate} />
            </div>
          )}

          {/* Etapa 3: Seleção de Horário */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <Button variant="ghost" onClick={() => setStep(2)} className="p-0 h-8 mr-2">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-semibold">Selecione um horário disponível</h2>
              </div>
              <HorariosDisponiveis profileId={profissionalId} selectedDate={selectedDate} onSelect={handleSelectSlot} />

              <div className="flex justify-end mt-6">
                <Button
                  onClick={handleSubmit}
                  disabled={!profissionalId || !selectedDate || !selectedSlotId || isSubmitting}
                  className="px-8"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Confirmar Agendamento"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
