"use client"

import type React from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import { CameraIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { UseFormReturn } from "react-hook-form"
import type { FormValues } from "@/app/types/profile"
import { useEffect, useRef, useState } from "react"
import { api } from "@/services/api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface UserInfoCardProps {
  form: UseFormReturn<FormValues>
  user: {
    name?: string
    id?: string
  } | null
  hasProfile: boolean
  isLoading: boolean
  avatarUrl: string
}

export function UserInfoCard({ form, user, hasProfile, isLoading, avatarUrl }: UserInfoCardProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatar, setAvatar] = useState(avatarUrl)

  const router = useRouter()

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!validTypes.includes(file.type)) {
      toast.error("Formato inválido", {
        description: "Por favor, selecione uma imagem (JPG, PNG, GIF, WEBP)",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Arquivo muito grande", {
        description: "O tamanho máximo permitido é 5MB",
      })
      return
    }

    try {
      setIsUploading(true)

      const formData = new FormData()
      formData.append("file", file)

      const response = await api.post(`/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      console.log("Upload response:", response)
      if (response.status === 201) {
        setAvatar(`${process.env.NEXT_PUBLIC_API_URL}${response.data.url}?t=${Date.now()}`)
        toast.success("Avatar atualizado", {
          description: "Sua foto de perfil foi atualizada com sucesso",
        })
      } else {
        throw new Error("Failed to upload avatar")
      }
    } catch (error) {
      console.error("Error uploading avatar:", error)
      toast.error("Erro ao fazer upload", {
        description: "Não foi possível atualizar sua foto de perfil",
      })
    } finally {
      setIsUploading(false)

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  useEffect(() => {
    setAvatar(avatarUrl)
  }, [avatarUrl])

  return (
    <Card className="md:col-span-1">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <Avatar className="bg-white  rounded-full">
                <AvatarImage src={avatar} alt={user?.name} className="bg-gray-200 object-fill rounded-full w-[120px] h-[120px]" />
                <AvatarFallback className="text-3xl">
                  {user?.name
                    ? user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .substring(0, 2)
                    : ""}
                </AvatarFallback>
              </Avatar>
            </div>
            <button
              type="button"
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full disabled:opacity-50"
              onClick={handleAvatarClick}
              disabled={isUploading}
            >
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CameraIcon className="h-4 w-4 cursor-pointer" />}
            </button>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </div>
          <p className="text-sm text-gray-500">{isUploading && "Enviando..."}</p>
        </div>

        <div className="space-y-4 mt-6">
          <FormField
            control={form.control}
            name="user.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="user.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="user.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {hasProfile && (
            <FormField
              control={form.control}
              name="user.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço de Atendimento</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

