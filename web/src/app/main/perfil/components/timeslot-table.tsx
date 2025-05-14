"use client"
import { formatDateFriendly, formatTime } from "@/app/utils/date-utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { api } from "@/services/api"
import {
  Edit,
  Save,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CalendarIcon,
  PlusCircle,
} from "lucide-react"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

type TimeSlot = {
  id: string
  profileId: string
  dateTime: string
  isBooked: boolean
  isBlocked: boolean
  note?: string | null
}

type TimeSlotTableProps = {
  profileId: string
}

export default function TimeslotTable({ profileId }: TimeSlotTableProps) {
  const [timeslots, setTimeslots] = useState<TimeSlot[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentTimeslot, setCurrentTimeslot] = useState<TimeSlot | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [editNote, setEditNote] = useState("")
  const [editIsBlocked, setEditIsBlocked] = useState(false)

  const [isAddDaysDialogOpen, setIsAddDaysDialogOpen] = useState(false)
  const [daysToAdd, setDaysToAdd] = useState(7)
  const [isAddingDays, setIsAddingDays] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [filteredTimeslots, setFilteredTimeslots] = useState<TimeSlot[]>([])

  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterMonth, setFilterMonth] = useState<string>("all")

  const months = [
    { value: "all", label: "Todos os meses" },
    { value: "0", label: "Janeiro" },
    { value: "1", label: "Fevereiro" },
    { value: "2", label: "Março" },
    { value: "3", label: "Abril" },
    { value: "4", label: "Maio" },
    { value: "5", label: "Junho" },
    { value: "6", label: "Julho" },
    { value: "7", label: "Agosto" },
    { value: "8", label: "Setembro" },
    { value: "9", label: "Outubro" },
    { value: "10", label: "Novembro" },
    { value: "11", label: "Dezembro" },
  ]


  useEffect(() => {
    const currentMonth = new Date().getMonth().toString()
    setFilterMonth(currentMonth)
  }, [])

  useEffect(() => {
    fetchTimeslots()
  }, [])

  useEffect(() => {

    let filtered = [...timeslots]


    if (filterStatus === "booked") {
      filtered = filtered.filter((slot) => slot.isBooked)
    } else if (filterStatus === "blocked") {
      filtered = filtered.filter((slot) => slot.isBlocked)
    } else if (filterStatus === "available") {
      filtered = filtered.filter((slot) => !slot.isBooked && !slot.isBlocked)
    }


    if (filterMonth !== "all") {
      filtered = filtered.filter((slot) => {
        const date = new Date(slot.dateTime)
        return date.getMonth().toString() === filterMonth
      })
    }

    setTotalItems(filtered.length)
    setFilteredTimeslots(filtered)
    setCurrentPage(1)
  }, [timeslots, filterStatus, filterMonth])

  const fetchTimeslots = async () => {
    try {
      setIsLoading(true)
      const res = await api.get(`/timeslots/profile/${profileId}/all`)

      if (res.status === 200) {

        const sortedTimeslots = res.data.sort(
          (a: TimeSlot, b: TimeSlot) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
        )
        setTimeslots(sortedTimeslots)
        setTotalItems(sortedTimeslots.length)
      }
    } catch (error) {
      console.error("Error fetching timeslot data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditClick = (slot: TimeSlot) => {
    setCurrentTimeslot(slot)
    setEditNote(slot.note || "")
    setEditIsBlocked(slot.isBlocked)
    setIsDialogOpen(true)
  }

  const handleSaveChanges = async () => {
    if (!currentTimeslot) return

    try {
      setIsLoading(true)
      const updatedTimeslot = {
        ...currentTimeslot,
        isBlocked: editIsBlocked,
        note: editNote,
      }

      const res = await api.patch(`/timeslots/blocked`, {
        id: currentTimeslot.id,
        isBlocked: editIsBlocked,
        note: editNote
      })

      if (res.status === 200) {
        setTimeslots(timeslots.map((slot) => (slot.id === currentTimeslot.id ? updatedTimeslot : slot)))
        setIsDialogOpen(false)
      }
    } catch (error) {
      console.error("Error updating timeslot:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddDays = async () => {
    if (daysToAdd <= 0) return

    try {
      setIsAddingDays(true)

      const lastDate = getLastTimeslotDate()

      const payload = {
        days: daysToAdd,
      }


      const res = await api.post("/timeslots/", payload)

      if (res.status === 200 || res.status === 201) {

        await fetchTimeslots()
        setIsAddDaysDialogOpen(false)
      }
    } catch (error) {
      console.error("Error adding new timeslots:", error)
    } finally {
      setIsAddingDays(false)
    }
  }

  // Paginação
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredTimeslots.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  // Função para obter estatísticas dos horários
  const getStats = () => {
    const total = timeslots.length
    const booked = timeslots.filter((slot) => slot.isBooked).length
    const blocked = timeslots.filter((slot) => slot.isBlocked).length
    const available = timeslots.filter((slot) => !slot.isBooked && !slot.isBlocked).length

    return { total, booked, blocked, available }
  }

  // Função para obter a última data dos timeslots
  const getLastTimeslotDate = () => {
    if (timeslots.length === 0) return new Date()

    // Encontrar o timeslot com a data mais recente
    const dates = timeslots.map((slot) => new Date(slot.dateTime))
    const lastDate = new Date(Math.max(...dates.map((date) => date.getTime())))

    // Adicionar um dia para começar do dia seguinte
    lastDate.setDate(lastDate.getDate() + 1)

    return lastDate
  }

  // Formatar a última data para exibição
  const formatLastDate = () => {
    if (timeslots.length === 0) return "Nenhuma data disponível"

    const lastDate = getLastTimeslotDate()
    lastDate.setDate(lastDate.getDate() - 1) // Voltar um dia para mostrar a última data atual

    return format(lastDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
  }

  const stats = getStats()

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold">Meus Horários</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={fetchTimeslots} disabled={isLoading}>
            Atualizar
          </Button>
        </div>
      </div>

      {/* Informações sobre a última data e botão para adicionar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border rounded-lg bg-muted/20">
        <div>
          <p className="text-sm text-muted-foreground">Última data disponível:</p>
          <p className="font-medium">{formatLastDate()}</p>
        </div>
        <Button onClick={() => setIsAddDaysDialogOpen(true)} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Adicionar mais dias
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-background border rounded-lg p-3 text-center">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total de horários</div>
        </div>
        <div className="bg-background border rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.available}</div>
          <div className="text-sm text-muted-foreground">Disponíveis</div>
        </div>
        <div className="bg-background border rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.booked}</div>
          <div className="text-sm text-muted-foreground">Agendados</div>
        </div>
        <div className="bg-background border rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.blocked}</div>
          <div className="text-sm text-muted-foreground">Bloqueados</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Label htmlFor="month-filter" className="text-sm mb-1 block">
            Mês
          </Label>
          <Select value={filterMonth} onValueChange={setFilterMonth}>
            <SelectTrigger className="w-full">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Selecione o mês" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Label htmlFor="status-filter" className="text-sm mb-1 block">
            Status
          </Label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="available">Disponíveis</SelectItem>
              <SelectItem value="booked">Agendados</SelectItem>
              <SelectItem value="blocked">Bloqueados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border px-4 py-2 text-left">Data</th>
              <th className="border px-4 py-2 text-left">Horário</th>
              <th className="border px-4 py-2 text-center">Agendado</th>
              <th className="border px-4 py-2 text-center">Bloqueado</th>
              <th className="border px-4 py-2 text-left">Nota</th>
              <th className="border px-4 py-2 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((slot) => (
              <tr key={slot.id} className={slot.isBlocked ? "bg-muted/50" : ""}>
                <td className="border px-4 py-2">{formatDateFriendly(slot.dateTime)}</td>
                <td className="border px-4 py-2">{formatTime(slot.dateTime)}</td>
                <td className="border px-4 py-2 text-center">
                  <Switch checked={slot.isBooked} disabled />
                </td>
                <td className="border px-4 py-2 text-center">
                  <Switch checked={slot.isBlocked} disabled />
                </td>
                <td className="border px-4 py-2">
                  {slot.note ? (
                    <div className="max-w-xs truncate" title={slot.note}>
                      {slot.note}
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic">Sem anotações</span>
                  )}
                </td>
                <td className="border px-4 py-2 text-center">
                  <Button variant="ghost" size="sm" onClick={() => handleEditClick(slot)} disabled={isLoading}>
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-muted-foreground">
                  {isLoading ? "Carregando horários..." : "Nenhum horário encontrado com os filtros selecionados"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} de {totalItems} horários
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(1)}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronsLeft className="h-4 w-4" />
              <span className="sr-only">Primeira página</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Página anterior</span>
            </Button>

            <div className="flex items-center">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {

                let pageNum = currentPage
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <Button
                    key={i}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="icon"
                    onClick={() => paginate(pageNum)}
                    className="h-8 w-8 mx-1"
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Próxima página</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronsRight className="h-4 w-4" />
              <span className="sr-only">Última página</span>
            </Button>
          </div>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(Number(value))
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="10 por página" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 por página</SelectItem>
              <SelectItem value="10">10 por página</SelectItem>
              <SelectItem value="20">20 por página</SelectItem>
              <SelectItem value="50">50 por página</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Modal para editar timeslot */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Horário</DialogTitle>
          </DialogHeader>

          {currentTimeslot && (
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <div className="font-medium">
                  {formatDateFriendly(currentTimeslot.dateTime)} às {formatTime(currentTimeslot.dateTime)}
                </div>
                {currentTimeslot.isBooked && (
                  <div className="text-sm text-yellow-600 font-medium">
                    Este horário já está agendado e não pode ser modificado.
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="blocked">Bloquear este horário</Label>
                  <Switch
                    id="blocked"
                    checked={editIsBlocked}
                    onCheckedChange={setEditIsBlocked}
                    disabled={currentTimeslot.isBooked || isLoading}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Horários bloqueados não ficam disponíveis para agendamento.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Anotação</Label>
                <Textarea
                  id="note"
                  placeholder="Adicione uma anotação para este horário"
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  disabled={isLoading}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveChanges}
              disabled={isLoading || (currentTimeslot?.isBooked && editIsBlocked !== currentTimeslot?.isBlocked)}
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para adicionar dias */}
      <Dialog open={isAddDaysDialogOpen} onOpenChange={setIsAddDaysDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Mais Dias</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="days-to-add">Quantos dias deseja adicionar?</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="days-to-add"
                  type="number"
                  min="1"
                  max="90"
                  value={daysToAdd}
                  onChange={(e) => setDaysToAdd(Number.parseInt(e.target.value) || 7)}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">dias</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Novos horários serão adicionados a partir de {formatLastDate()}.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDaysDialogOpen(false)} disabled={isAddingDays}>
              Cancelar
            </Button>
            <Button onClick={handleAddDays} disabled={isAddingDays || daysToAdd <= 0}>
              {isAddingDays ? (
                <>Adicionando...</>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Adicionar {daysToAdd} dias
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
