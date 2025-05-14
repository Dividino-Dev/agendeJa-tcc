"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

interface UserAvatarProps {
  id: string
  name: string
  image?: string
}

export function UserAvatar({ name, image, id }: UserAvatarProps) {
  const router = useRouter()
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  return (
    <Avatar className="cursor-pointer" onClick={() => router.push("/main/perfil")}>
      <AvatarImage src={`${process.env.NEXT_PUBLIC_API_URL}/static/uploads/${id}.png`} alt={name} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  )
}

