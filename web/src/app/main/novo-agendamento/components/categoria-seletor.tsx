"use client"

import { useEffect, useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { api } from "@/services/api"

interface Categogory {
  id: string
  name: string
}

export function CategoriaSelector({ onSelect }: { onSelect: (value: string) => void }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [categories, setCategories] = useState<Categogory[]>([])

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await api.get("/categories")
        if (res.status === 200) {
          setCategories(res.data)
        }
      } catch (error) {
        console.error("Error fetching category data:", error)
      }
    }
    getCategories()
  }, [])


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {value ? categories.find((categoria) => categoria.id === value)?.name : "Selecione uma categoria"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Buscar categoria..." />
          <CommandList>
            <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
            <CommandGroup>
              {categories.map((categoria) => (
                <CommandItem
                  key={categoria.id}
                  value={categoria.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue)
                    onSelect(currentValue)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === categoria.name ? "opacity-100" : "opacity-0")} />
                  {categoria.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
