"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { api } from "@/services/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Professional {
  userId: string
  name: string
  photo?: string // Adicionado campo para foto
  categoryId: string
  daysOfWeekWorked: string[]
  typeOfService: string[]
  startTime: Date
  endTime: Date
  serviceDuration: Date
  isActive: boolean
  user: {
    id: string
    name: string
  }
}

export function ProfissionaisList({
  categoria,
  onSelect,
}: {
  categoria: string
  onSelect: (id: string, nome: string) => void
}) {
  const [selectedProfissional, setSelectedProfissional] = useState("")
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getProfessionals = async () => {
      try {
        setLoading(true)

        const res = await api.get("/profiles")
        if (res.status === 200) {
          setProfessionals(res.data)
        }
      } catch (error) {
        console.error("Error fetching professionals data:", error)
      } finally {
        setLoading(false)
      }
    }
    getProfessionals()
  }, [])


  const profissionaisFiltrados = professionals.filter((prof) => prof.categoryId === categoria && prof.isActive)

  const handleSelect = (id: string, nome: string) => {
    setSelectedProfissional(id)
    onSelect(id, nome)
  }

  if (!categoria) {
    return (
      <p className="text-center text-muted-foreground py-4">
        Selecione uma categoria para ver os profissionais disponíveis
      </p>
    )
  }

  if (loading) {
    return <p className="text-center text-muted-foreground py-4">Carregando profissionais...</p>
  }

  if (profissionaisFiltrados.length === 0) {
    return <p className="text-center text-muted-foreground py-4">Nenhum profissional encontrado</p>
  }

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-medium mb-3">Selecione um profissional:</h3>
        <ScrollArea className="h-[300px] pr-4">
          <RadioGroup value={selectedProfissional} className="space-y-3">
            {profissionaisFiltrados.map((profissional) => (
              <div key={profissional.userId} className="flex items-center space-x-3 border rounded-md p-3 hover:bg-accent">
                <RadioGroupItem
                  value={profissional.userId}
                  id={`profissional-${profissional.userId}`}
                  onClick={() => handleSelect(profissional.userId, profissional.user.name)}
                />
                <Avatar className="bg-white  rounded-full">
                  <AvatarImage src={`${process.env.NEXT_PUBLIC_API_URL}/static/uploads/${profissional.userId}.png`} alt={profissional?.user.name} className="bg-gray-200 object-fit rounded-full w-[40px] h-[40px]" />
                  <AvatarFallback className="text-xl">
                    {profissional?.user.name
                      ? profissional.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .substring(0, 2)
                      : ""}
                  </AvatarFallback>
                </Avatar>
                <Label htmlFor={`profissional-${profissional.userId}`} className="cursor-pointer">
                  {profissional.user.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
