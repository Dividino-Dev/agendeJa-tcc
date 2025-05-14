"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { UseFormReturn } from "react-hook-form"
import type { FormValues } from "@/app/types/profile"
import { DaysOfWeekSelector } from "./daysOfWeek"
import { ServiceTypeSelector } from "./serviceTypeSelector"
import { Button } from "@/components/ui/button"
import { Calendar, Clock } from "lucide-react"
import { useState } from "react"
import TimeslotTable from "./timeslot-table"


import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/custom-dialog"

interface ProfessionalSettingsCardProps {
  form: UseFormReturn<FormValues>
  categories: Array<{ id: string; name: string; description: string }>
  toggleDay: (day: string) => void
  toggleServiceType: (type: string) => void
  profileId: string
}

export function ProfessionalSettingsCard({
  form,
  categories,
  toggleDay,
  toggleServiceType,
  profileId,
}: ProfessionalSettingsCardProps) {
  const [isTimeslotModalOpen, setIsTimeslotModalOpen] = useState(false)

  const currentProfileId = profileId

  return (
    <>
      <Card className="md:col-span-2">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Configurações de Trabalho</h2>
            <Button
              variant="outline"
              type="button"
              onClick={(e) => {
                e.preventDefault()
                setIsTimeslotModalOpen(true)
              }}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              <span>Gerenciar Horários</span>
            </Button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2 grid grid-cols-2">
              <FormField
                control={form.control}
                name="profile.categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria de Trabalho</FormLabel>
                    <Select value={field.value || ""} onValueChange={field.onChange} required>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profile.isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>{field.value ? "Desativar Profissional" : "Ativar Profissional"}</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <DaysOfWeekSelector form={form} toggleDay={toggleDay} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="profile.startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário de Início</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profile.endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário de Término</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profile.serviceDuration"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Duração Atendimento (em minutos)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={value === undefined ? "" : value}
                        onChange={(e) => {
                          const val = e.target.value === "" ? undefined : Number(e.target.value)
                          onChange(val)
                        }}
                        {...fieldProps}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center gap-3">
              <p>Agenda programada até: 15/09/2025</p>
              <Button
                variant="ghost"
                type="button"
                size="sm"
                className="flex items-center gap-1 text-primary"
                onClick={(e) => {
                  e.preventDefault()
                  setIsTimeslotModalOpen(true)
                }}
              >
                <Clock className="h-4 w-4" />
                <span>Ver horários</span>
              </Button>
            </div>

            <ServiceTypeSelector form={form} toggleServiceType={toggleServiceType} />

            <FormField
              control={form.control}
              name="profile.bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apresentação Profissional</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={8}
                      className="h-[120px]"
                      value={field.value || ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Modal para o TimeslotTable usando o Dialog personalizado */}
      <Dialog open={isTimeslotModalOpen} onOpenChange={setIsTimeslotModalOpen}>
        <DialogContent size="full" className="overflow-hidden">
          <DialogHeader>
            <DialogTitle>Gerenciamento de Horários</DialogTitle>
          </DialogHeader>
          <div className="mt-2 overflow-y-auto h-[calc(90vh-120px)]">
            <TimeslotTable profileId={profileId} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
