import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Logo />
          <div className="flex items-center gap-4">
            <Button asChild variant="outline">
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild>
              <Link href="/cadastro">Cadastrar</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Agende Já - Sua agenda de trabalho simplificada
                </h1>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Gerencie seus agendamentos de forma eficiente. Conecte-se com clientes e profissionais em uma única
                  plataforma.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/cadastro">Comece agora</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/sobre">Saiba mais</Link>
                  </Button>
                </div>
              </div>
              <div className="mx-auto w-full max-w-sm lg:max-w-none">
                <img
                  src="/images/banner.png"
                  alt="Dashboard Preview"
                  className="aspect-video overflow-hidden rounded-xl object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Recursos</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Conheça os principais recursos da nossa plataforma
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
              {[
                {
                  title: "Agendamento Simplificado",
                  description: "Agende consultas e serviços com poucos cliques",
                },
                {
                  title: "Perfil Profissional",
                  description: "Gerencie seu perfil e disponibilidade de forma eficiente",
                },
                {
                  title: "Notificações",
                  description: "Receba lembretes e atualizações sobre seus compromissos",
                },
              ].map((feature, index) => (
                <div key={index} className="flex flex-col items-center space-y-2 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <span className="text-xl font-bold">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-8">
        <div className="container mx-auto flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <Logo />
            <p className="text-sm text-gray-500">© 2025 Agende Já. Todos os direitos reservados.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/termos" className="text-sm text-gray-500 hover:underline">
              Termos de Uso
            </Link>
            <Link href="/privacidade" className="text-sm text-gray-500 hover:underline">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

