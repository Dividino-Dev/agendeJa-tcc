import { Header } from "@/components/header"
import type { Metadata } from "next"

import { useState } from "react"
import { ProfileForm } from "../components/profile-form"

export const metadata: Metadata = {
  title: "Perfil Profissional | Sistema de Agendamento",
  description: "Gerencie seu perfil profissional",
}

interface ProfilePageProps {
  params: {
    id: string;
  };
}


export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {

  const { id } = await params

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Configuração de Perfil</h1>

        </div>

        <ProfileForm id={id} />
      </main>
    </div>
  )
}

