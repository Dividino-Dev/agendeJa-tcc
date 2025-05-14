import type React from "react"
import { Header } from "@/components/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Metadata } from "next"
import { AppointmentList } from "./components/appointment-list"
import { AppointmentListProfessional } from "./components/appointment-list-professional"

export const metadata: Metadata = {
  title: "Agendamentos | Sistema de Agendamento",
  description: "Gerencie seus agendamentos",
}

export default function AppointmentsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Agenda</h1>
          <div className="flex items-center gap-2">

          </div>
        </div>

        <Tabs defaultValue="my-appointments">
          <TabsList>
            <TabsTrigger value="my-appointments">Meus Agendamentos</TabsTrigger>
            <TabsTrigger value="professional-schedule">Agenda do Profissional</TabsTrigger>
          </TabsList>
          <TabsContent value="my-appointments">
            <AppointmentList />
          </TabsContent>
          <TabsContent value="professional-schedule">
            <AppointmentListProfessional />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function Button({
  children,
  variant = "default",
}: {
  children: React.ReactNode
  variant?: "default" | "outline"
}) {
  const baseClasses = "px-4 py-2 rounded-md font-medium text-sm"
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 hover:bg-gray-50",
  }

  return <button className={`${baseClasses} ${variantClasses[variant]}`}>{children}</button>
}

