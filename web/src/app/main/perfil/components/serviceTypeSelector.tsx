import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { UseFormReturn } from "react-hook-form"
import type { FormValues } from "@/app/types/profile"

interface ServiceTypeSelectorProps {
  form: UseFormReturn<FormValues>
  toggleServiceType: (type: string) => void
}

export function ServiceTypeSelector({ form, toggleServiceType }: ServiceTypeSelectorProps) {
  return (
    <div>
      <Label className="mb-2 block">Tipo de Atendimento</Label>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="presencial"
            checked={(form.watch("profile.typeOfService") || []).includes("presencial")}
            onCheckedChange={() => toggleServiceType("presencial")}
          />
          <Label htmlFor="presencial" className="font-normal">
            Presencial
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="online"
            checked={(form.watch("profile.typeOfService") || []).includes("online")}
            onCheckedChange={() => toggleServiceType("online")}
          />
          <Label htmlFor="online" className="font-normal">
            Online
          </Label>
        </div>
      </div>
    </div>
  )
}

