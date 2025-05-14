import { Suspense } from "react"
import { ConfirmacaoAgendamentoContent } from "./components/confirmacao-agendamento-content"
import { Loader2 } from "lucide-react"

export default function ConfirmacaoAgendamento() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Carregando detalhes do agendamento...</p>
        </div>
      }
    >
      <ConfirmacaoAgendamentoContent />
    </Suspense>
  )
}
