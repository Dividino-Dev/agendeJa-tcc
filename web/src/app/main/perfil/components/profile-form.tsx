"use client"
import { Button } from "@/components/ui/button"
import { api } from "@/services/api"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { formatInTimeZone } from "date-fns-tz"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Form } from "@/components/ui/form"
import { type FormValues, type User, type Profile, type Category, formSchema } from "@/app/types/profile"
import { ProfessionalSettingsCard } from "./professionalSettingsCard"
import { UserInfoCard } from "./userInfoCard"

interface ProfileFormProps {
  id: string
}

export function ProfileForm({ id }: ProfileFormProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [hasProfile, setHasProfile] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: {
        name: "",
        email: "",
        phone: "",
        address: "",
      },
      profile: {
        bio: "",
        categoryId: "",
        serviceDuration: 0,
        daysOfWeekWorked: [],
        typeOfService: [],
        startTime: "00:00",
        endTime: "00:00",
        isActive: false,
      },
    },
  })


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


  useEffect(() => {
    const getUserById = async () => {
      try {
        const res = await api.get("/users/" + id)

        if (res.status === 200) {
          const userData = res.data
          setUser(userData)
          setHasProfile(userData.isProfessional)


          form.setValue("user", {
            name: userData.name,
            email: userData.email,
            phone: userData.phone || "",
            address: userData.address || "",
          })

          if (userData.isProfessional) {
            try {
              const profileRes = await api.get("/profiles/me")
              if (profileRes.status === 200) {
                const profileData = profileRes.data
                setProfile(profileData)


                form.setValue("profile", {
                  bio: profileData.bio || "",
                  categoryId: profileData.categoryId,
                  serviceDuration: profileData.serviceDuration,
                  daysOfWeekWorked: profileData.daysOfWeekWorked || [],
                  typeOfService: profileData.typeOfService || [],
                  startTime: convertHour(profileData.startTime),
                  endTime: convertHour(profileData.endTime),
                  isActive: profileData.isActive,
                })
              }
            } catch (profileError) {
              console.error("Error fetching profile:", profileError)
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error)
        router.push("/not-found")
      }
    }
    getUserById()
  }, [id, form, router])

  function convertHour(dateTime: string | Date | undefined) {
    if (!dateTime) {
      return "00:00"
    }

    const date = new Date(dateTime)
    const hour = formatInTimeZone(date, "UTC", "HH:mm")

    return hour
  }

  const toggleDay = (day: string) => {
    const currentDays = form.getValues("profile.daysOfWeekWorked") || []

    if (currentDays.includes(day)) {
      form.setValue(
        "profile.daysOfWeekWorked",
        currentDays.filter((d: string) => d !== day),
      )
    } else {
      form.setValue("profile.daysOfWeekWorked", [...currentDays, day])
    }
  }

  const toggleServiceType = (type: string) => {
    const currentTypes = form.getValues("profile.typeOfService") || []

    if (currentTypes.includes(type)) {
      form.setValue(
        "profile.typeOfService",
        currentTypes.filter((t: string) => t !== type),
      )
    } else {
      form.setValue("profile.typeOfService", [...currentTypes, type])
    }
  }

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)
    try {

      console.log("User data to update:", data.user)
      const userResponse = await api.patch(`/users/${id}`, {
        phone: data.user.phone || null,
        address: data.user.address || null,
      })

      if (userResponse.status === 200) {
        if (hasProfile && data.profile) {
          const profileData = {
            ...data.profile,
          }
          console.log("Profile data to update:", profileData)
          const profileResponse = await api.patch(`/profiles/${profile?.userId}`, {
            ...profileData,
            startTime: new Date(`1970-01-01T${profileData.startTime}:00Z`),
            endTime: new Date(`1970-01-01T${profileData.endTime}:00Z`),
            categoryId: profileData.categoryId || null,
          })

          if (profileResponse.status !== 200) {
            throw new Error("Failed to update profile")
          }
        }

        toast.success("Perfil atualizado", {
          description: "Suas informações foram atualizadas com sucesso.",
        })
        router.refresh()
      } else {
        throw new Error("Failed to update user")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Erro", {
        description: "Ocorreu um erro ao atualizar seu perfil.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createProfile = async () => {
    setIsLoading(true)
    try {
      const response = await api.post("/profiles", {
        userId: id,
        isActive: true,
      })

      if (response.status === 201) {
        const responseUser = await api.patch(`/users/${id}`, {
          isProfessional: true,
        })
        if (responseUser.status !== 200) {
          throw new Error("Failed to update user to professional")
        }
        setHasProfile(true)
        toast.success("Perfil criado", {
          description: "Seu perfil profissional foi criado com sucesso.",
        })

        router.refresh()
      } else {
        throw new Error("Failed to create profile")
      }
    } catch (error) {
      console.error("Error creating profile:", error)
      toast.error("Erro", {
        description: "Ocorreu um erro ao criar seu perfil profissional.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <UserInfoCard
            form={form}
            user={user}
            hasProfile={hasProfile}
            isLoading={isLoading}
            avatarUrl={`${process.env.NEXT_PUBLIC_API_URL}/static/uploads/${id}.png`}


          />

          {hasProfile && (
            <ProfessionalSettingsCard
              form={form}
              categories={categories}
              toggleDay={toggleDay}
              toggleServiceType={toggleServiceType}
              profileId={id}
            />
          )}

          {!hasProfile && (
            <Button type="button" onClick={createProfile} disabled={isLoading} className="md:col-span-2">
              {isLoading ? "Criando..." : "Criar perfil profissional"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}

