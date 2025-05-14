"use client"

import { Label } from "@/components/ui/label"
import type { UseFormReturn } from "react-hook-form"
import type { FormValues } from "@/app/types/profile"

interface DaysOfWeekSelectorProps {
  form: UseFormReturn<FormValues>
  toggleDay: (day: string) => void
}

export function DaysOfWeekSelector({ form, toggleDay }: DaysOfWeekSelectorProps) {
  const days = [
    { value: "1", label: "Seg" },
    { value: "2", label: "Ter" },
    { value: "3", label: "Qua" },
    { value: "4", label: "Qui" },
    { value: "5", label: "Sex" },
    { value: "6", label: "Sáb" },
    { value: "7", label: "Dom" },
  ]

  return (
    <div>
      <Label className="mb-2 block">Dias de Trabalho</Label>
      <div className="flex flex-wrap gap-2">
        {days.map((day) => {
          const daysOfWeek = form.watch("profile.daysOfWeekWorked") || []
          const isSelected = daysOfWeek.includes(day.value)

          return (
            <button
              type="button"
              key={day.value}
              className={`px-4 py-2 rounded-md ${isSelected ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                }`}
              onClick={() => toggleDay(day.value)}
            >
              {day.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

