"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { api } from "@/services/api"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock } from "lucide-react"
import { extractDate, formatTime } from "@/app/utils/date-utils"

interface TimeSlot {
  id: string
  dateTime: string // formato ISO
  isBooked: boolean
  isBlocked: boolean
  profileId: string
}

export function HorariosDisponiveis({
  profileId,
  selectedDate,
  onSelect,
}: {
  profileId: string
  selectedDate: string
  onSelect: (slotId: string, dateTime: string) => void
}) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const buscarHorariosDisponiveis = async () => {
      if (!profileId || !selectedDate) return

      try {
        setLoading(true)

        const res = await api.get(`/timeslots/profile/${profileId}`)
        if (res.status === 200) {
          setTimeSlots(res.data)
        }
      } catch (error) {
        console.error("Erro ao buscar horários disponíveis:", error)
      } finally {
        setLoading(false)
      }
    }

    buscarHorariosDisponiveis()
  }, [profileId, selectedDate])


  const filteredSlots = timeSlots.filter((slot) => {
    const slotDate = extractDate(slot.dateTime) // Extrai a data
    return slotDate === selectedDate && (!slot.isBooked && !slot.isBlocked)
  })


  const uniqueTimeSlots = filteredSlots.reduce(
    (acc, slot) => {

      const timeKey = formatTime(slot.dateTime)


      if (!acc[timeKey]) {
        acc[timeKey] = slot
      }

      return acc
    },
    {} as Record<string, TimeSlot>,
  )


  const horariosDisponiveis = Object.values(uniqueTimeSlots)


  horariosDisponiveis.sort((a, b) => {
    return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
  })

  const handleSelectSlot = (slotId: string, dateTime: string) => {
    console.log("Reservar: ", slotId, dateTime)
    setSelectedSlot(slotId)
    onSelect(slotId, dateTime)
  }

  if (!selectedDate) {
    return <p className="text-center text-muted-foreground py-4">Selecione uma data para ver os horários disponíveis</p>
  }

  if (loading) {
    return <p className="text-center text-muted-foreground py-4">Carregando horários disponíveis...</p>
  }

  if (horariosDisponiveis.length === 0) {
    return <p className="text-center text-muted-foreground py-4">Nenhum horário disponível para esta data</p>
  }

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-medium mb-3">Selecione um horário disponível:</h3>
        <ScrollArea className="h-fit pr-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {horariosDisponiveis.map((slot) => (
              <Button
                key={slot.id}
                variant={selectedSlot === slot.id ? "default" : "outline"}
                className="flex items-center justify-center gap-2"
                onClick={() => handleSelectSlot(slot.id, slot.dateTime)}
              >
                <Clock className="h-4 w-4" />
                <span>{formatTime(slot.dateTime)}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
