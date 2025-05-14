"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { api } from "@/services/api"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { extractDate, formatDateFriendly, parseApiDateTime } from "@/app/utils/date-utils"

interface TimeSlot {
  id: string
  dateTime: string // formato ISO
  isBooked: boolean
  isBlocked: boolean
  profileId: string
}

export function DiasDisponiveis({
  profileId,
  onSelect,
}: {
  profileId: string
  onSelect: (data: string) => void
}) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const buscarDiasDisponiveis = async () => {
      console.log("Buscando dias...", profileId)
      if (!profileId) return

      try {
        setLoading(true)

        const res = await api.get(`/timeslots/profile/${profileId}`)
        if (res.status === 200) {
          setTimeSlots(res.data)

        }
      } catch (error) {
        console.error("Erro ao buscar dias disponíveis:", error)
      } finally {
        setLoading(false)
      }
    }

    buscarDiasDisponiveis()
  }, [profileId])


  const groupedByDate = timeSlots.reduce(
    (acc, slot) => {

      if (slot.isBooked || slot.isBlocked) return acc

      const dateOnly = extractDate(slot.dateTime)

      if (!acc[dateOnly]) {
        acc[dateOnly] = []
      }

      acc[dateOnly].push(slot)
      return acc
    },
    {} as Record<string, TimeSlot[]>,
  )

  const uniqueDates = Object.keys(groupedByDate).sort()

  const handleSelectDate = (data: string) => {
    setSelectedDate(data)
    onSelect(data)
  }

  if (loading) {
    return <p className="text-center text-muted-foreground py-4">Carregando dias disponíveis...</p>
  }

  if (uniqueDates.length === 0) {
    return <p className="text-center text-muted-foreground py-4">Nenhum dia disponível para este profissional</p>
  }

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-medium mb-3">Selecione uma data disponível:</h3>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {uniqueDates.map((dateStr) => {
              const slotsCount = groupedByDate[dateStr].length

              const firstSlotDateTime = groupedByDate[dateStr][0].dateTime

              return (
                <Button
                  key={dateStr}
                  variant={selectedDate === dateStr ? "default" : "outline"}
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => handleSelectDate(dateStr)}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{formatDateFriendly(firstSlotDateTime)}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(parseApiDateTime(firstSlotDateTime), "dd/MM/yyyy")} • {slotsCount}{" "}
                      {slotsCount === 1 ? "horário disponível" : "horários disponíveis"}
                    </span>
                  </div>
                </Button>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
