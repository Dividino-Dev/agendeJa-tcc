"use client"

import { formatDateFriendly, formatTime } from "@/app/utils/date-utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { api } from "@/services/api"
import { AlertCircle, Trash2Icon } from "lucide-react"
import { useEffect, useState } from "react"

interface Scheduling {
  id: string
  dateHour: string
  status: string
  client: {
    name: string
    id: string
  }
  professional: {
    userId: string
    user: {
      name: string
    }
    category: {
      name: string
    }
  }
}

export function AppointmentListProfessional() {
  const [schedulings, setSchedulings] = useState<Scheduling[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [schedulingToDelete, setSchedulingToDelete] = useState<Scheduling | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)


  useEffect(() => {
    const getSchedulings = async () => {
      try {
        setLoading(true)
        const res = await api.get("/schedulings/professional")
        if (res.status === 200) {

          const sortedSchedulings = [...res.data].sort((a, b) => {
            return new Date(a.dateHour).getTime() - new Date(b.dateHour).getTime()
          })
          setSchedulings(sortedSchedulings)
        }
      } catch (error) {
        console.error("Error fetching scheduling data:", error)
      } finally {
        setLoading(false)
      }
    }
    getSchedulings()
  }, [])


  const confirmDelete = (scheduling: Scheduling) => {
    setSchedulingToDelete(scheduling)
    setDeleteDialogOpen(true)
  }


  const handleDelete = async () => {
    if (!schedulingToDelete) return

    try {
      setIsDeleting(true)
      const res = await api.delete(`/schedulings/${schedulingToDelete.id}/professional`)
      if (res.status === 200) {

        setSchedulings((prev) => prev.filter((scheduling) => scheduling.id !== schedulingToDelete.id))
        setDeleteDialogOpen(false)
      }
    } catch (error) {
      console.error("Error deleting scheduling:", error)
      alert("Não foi possível excluir o agendamento. Tente novamente.")
    } finally {
      setIsDeleting(false)
      setSchedulingToDelete(null)
    }
  }

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Carregando agendamentos...</div>
  }

  if (schedulings.length === 0) {
    return <div className="text-center py-10 text-gray-500">Você não possui agendamentos</div>
  }


  const now = new Date()
  const futureSchedulings = schedulings.filter((s) => new Date(s.dateHour) >= now)
  const pastSchedulings = schedulings.filter((s) => new Date(s.dateHour) < now)

  return (
    <>
      <div className="space-y-6 mt-4">
        {futureSchedulings.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-gray-500">Próximos Agendamentos</h3>
            {futureSchedulings.map((scheduling) => (
              <div key={scheduling.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage
                      src={`${process.env.NEXT_PUBLIC_API_URL}/static/uploads/${scheduling.client.id}.png`}
                      alt={scheduling.client.name}
                      className="bg-gray-200 rounded-full"
                    />
                    <AvatarFallback>
                      {scheduling.client.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{scheduling.client.name}</h3>
                    <p className="text-sm text-gray-500">{scheduling.professional.category.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-end flex-col">
                    <small className="font-medium">{formatDateFriendly(scheduling.dateHour)}</small>
                    <small>{formatTime(scheduling.dateHour)}</small>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => confirmDelete(scheduling)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2Icon className="h-5 w-5" />
                    <span className="sr-only">Excluir</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {pastSchedulings.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-gray-500">Agendamentos Anteriores</h3>
            {pastSchedulings.map((scheduling) => (
              <div
                key={scheduling.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg border opacity-70"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage
                      src={`${process.env.NEXT_PUBLIC_API_URL}/static/uploads/${scheduling.client.id}.png`}
                      alt={scheduling.client.name}
                      className="bg-gray-200 rounded-full"
                    />
                    <AvatarFallback>
                      {scheduling.client.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{scheduling.client.name}</h3>
                    <p className="text-sm text-gray-500">{scheduling.professional.category.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-end flex-col">
                    <small className="font-medium">{formatDateFriendly(scheduling.dateHour)}</small>
                    <small>{formatTime(scheduling.dateHour)}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Confirmar cancelamento
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar o agendamento com{" "}
              <span className="font-medium">{schedulingToDelete?.client.name}</span> para{" "}
              <span className="font-medium">
                {schedulingToDelete && formatDateFriendly(schedulingToDelete.dateHour)}
              </span>{" "}
              às <span className="font-medium">{schedulingToDelete && formatTime(schedulingToDelete.dateHour)}</span>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Voltar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Cancelando..." : "Sim, cancelar agendamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
