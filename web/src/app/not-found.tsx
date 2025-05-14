"use client"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"

export default function NotFound() {

  const router = useRouter()

  const handleBack = () => {
    router.push("/")
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto w-[600px] h-[400px] max-w-sm lg:max-w-none">
          <img
            src="/images/error.png"
            alt="Dashboard Preview"
            className="aspect-video overflow-hidden rounded-xl object-cover"
          />
        </div>
        <h1 className="text-4xl font-bold">Erro</h1>
        <p className="mt-4 text-lg">Ocorreu um erro inesperado. Tente novamente mais tarde.</p>
        <Button className="mt-6" variant="outline" onClick={handleBack}>Voltar</Button>
      </div>
    </div>
  )
}