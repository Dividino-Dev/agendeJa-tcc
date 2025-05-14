import { parseISO, format as formatFns } from "date-fns"
import { ptBR } from "date-fns/locale"

// Timezone do Brasil (Brasília)
export const TIMEZONE_BRASIL = "America/Sao_Paulo"

// Função para tratar datas da API que já estão em horário local mas marcadas como UTC
export function parseApiDateTime(isoString: string) {
  // Remove o 'Z' do final da string para tratar como horário local
  const localIsoString = isoString.endsWith("Z") ? isoString.substring(0, isoString.length - 1) : isoString

  return parseISO(localIsoString)
}

// Extrai apenas a data (YYYY-MM-DD) de uma string ISO
export function extractDate(isoString: string) {
  const date = parseApiDateTime(isoString)
  return formatFns(date, "yyyy-MM-dd")
}

// Formata a data para exibição amigável (Hoje, Amanhã, etc.)
export function formatDateFriendly(isoString: string) {
  const date = parseApiDateTime(isoString)
  const today = formatFns(new Date(), "yyyy-MM-dd")
  const tomorrow = formatFns(new Date(Date.now() + 86400000), "yyyy-MM-dd")
  const dateStr = formatFns(date, "yyyy-MM-dd")

  if (dateStr === today) return "Hoje"
  if (dateStr === tomorrow) return "Amanhã"

  return formatFns(date, "EEEE, d 'de' MMMM", { locale: ptBR })
}

// Formata a hora para exibição
export function formatTime(isoString: string) {
  const date = parseApiDateTime(isoString)
  return formatFns(date, "HH:mm")
}

// Formata a data completa para exibição
export function formatDateTime(isoString: string, formatString: string) {
  const date = parseApiDateTime(isoString)
  return formatFns(date, formatString, { locale: ptBR })
}
