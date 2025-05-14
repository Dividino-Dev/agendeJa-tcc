"use client"

import { Check, Calendar, Clock, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDateTime, formatTime } from "@/app/utils/date-utils"
import Link from "next/link"

interface ResumoAgendamentoProps {
  profissionalNome: string
  dataAgendamento: string
  horarioAgendamento: string
}

export function ResumoAgendamento({
  profissionalNome,
  dataAgendamento,
  horarioAgendamento,
}: ResumoAgendamentoProps) {
  const formatarData = (dataISO: string) => {
    if (!dataISO) return ""
    return formatDateTime(dataISO, "d 'de' MMMM 'de' yyyy")
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl">Agendamento</CardTitle>
          <CardDescription>Informações do agendamento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="font-medium">Profissional:</span>
                </div>
                <p className="text-lg">{profissionalNome}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="font-medium">Data:</span>
                </div>
                <p className="text-lg">{formatarData(`${dataAgendamento}T00:00:00`)}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="font-medium">Horário:</span>
                </div>
                <p className="text-lg">{formatTime(horarioAgendamento)}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-between">
            <Link href="/main/agendamentos" className="sm:flex-1">
              <Button className="w-full">Página Inicial</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
