import { Button } from "@/components/ui/button"
import { LogIn, LogOut, UserPlus, User } from 'lucide-react'
import { useState } from "react";
import { useRouter } from 'next/navigation'



const AuthButtons = ({openModal}) => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const router = useRouter()

    const handleLogin = () => {
        // Тут ви можете додати логіку для відкриття модального вікна входу
        console.log('Opening login modal');
      };
    

    const user = false
    const logout = () => {

    }
    return (
        <>
        {!user ? (
          <>
                      <Button variant="ghost" onClick={() => openModal('login')} className="font-mono text-white">
            <LogIn className="mr-2 h-4 w-4" /> Вхід
          </Button>
          <Button variant="ghost" onClick={() => openModal('register')} className="font-mono text-white">
            <UserPlus className="mr-2 h-4 w-4" /> Реєстрація
          </Button>
          </>
        ) : (
          <>
          <Button variant="ghost" onClick={() => router.push('/dashboard')} className="font-mono text-white">
            <User className="mr-2 h-4 w-4" /> Особистий кабінет
          </Button>
          <Button variant="ghost" onClick={logout} className="font-mono text-white">
            <LogOut className="mr-2 h-4 w-4" /> Вихід
          </Button>
        </>
        )}
      </>
    )
}

export default AuthButtons
   