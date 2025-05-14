import { z } from "zod"

export const userSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .refine((val) => val.trim().split(" ").length >= 2, {
      message: "Informe nome e sobrenome",
    }),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  address: z.string().optional(),
})

export const profileSchema = z.object({
  bio: z.string().optional(),
  categoryId: z.string(),
  daysOfWeekWorked: z.array(z.string()).optional(),
  serviceDuration: z.number().optional(),
  typeOfService: z.array(z.string()).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  isActive: z.boolean().optional(),
})


export const formSchema = z.object({
  user: userSchema,
  profile: profileSchema.optional(),
})

export type FormValues = z.infer<typeof formSchema>

export interface User {
  name: string
  email: string
  phone?: string
  avatar?: string
  address?: string
  isProfessional: boolean
}

export interface Profile {
  id: string
  userId: string
  bio?: string
  categoryId?: string
  daysOfWeekWorked?: string[]
  typeOfService?: string[]
  startTime?: Date
  endTime?: Date
  serviceDuration?: Date
  isActive: boolean
}

export interface Category {
  id: string
  name: string
  description: string
}

