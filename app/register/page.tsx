import { redirect } from "next/navigation"
import RegisterForm from "@/components/register-form"
import { getCurrentUser } from "@/lib/auth"

export default async function RegisterPage() {
  // Redirigir si el usuario ya está autenticado
  const user = await getCurrentUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Crear Cuenta</h1>
        <RegisterForm />
      </div>
    </div>
  )
}

