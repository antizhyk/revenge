import { Button } from "@/components/ui/button"
import { LogIn, LogOut, UserPlus, User } from 'lucide-react'
import { useState } from "react";
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/auth'
import Link from "next/link";


const AuthButtons = ({openModal}) => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  console.log(user, "AuthButtons")

    const handleLogin = () => {
        // Тут ви можете додати логіку для відкриття модального вікна входу
        console.log('Opening login modal');
      };
    

  
    const logout = () => {

    }
    return (
        <>
        {!user ? (
          <>
            <>
          <Link href="/login">
            <Button variant="ghost" className="font-mono text-white">
              <LogIn className="mr-2 h-4 w-4" /> Вхід
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="ghost" className="font-mono text-white">
              <UserPlus className="mr-2 h-4 w-4" /> Реєстрація
            </Button>
          </Link>
        </>
          </>
        ) : (
          <>
          <Button variant="ghost" onClick={() => router.push('/dashboard')} className="font-mono text-white">
            <User className="mr-2 h-4 w-4" /> Особистий кабінет
          </Button>
          <Button variant="ghost" onClick={() => openModal('exit')} className="font-mono text-white">
            <LogOut className="mr-2 h-4 w-4" /> Вихід
          </Button>
        </>
        )}
      </>
    )
}

export default AuthButtons
   