'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useAuth } from '../hooks/auth'
import { Eye, EyeOff } from 'lucide-react'

interface LoginModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ isOpen, onOpenChange }: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false); // Додано новий стан
  const { login } = useAuth()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      await login({ 
        email,
        password,
        remember: rememberMe,
        setErrors});
      onOpenChange(false)
      toast({
        title: "Успішний вхід",
        description: "Ви успішно увійшли в систему.",
        variant: "default",
      })
      // Очистити форму після успішного входу
      setEmail('')
      setPassword('')
    } catch (error) {
      console.error('Login failed:', error)
      setErrors({ 
        login: ['Невірний email або пароль. Будь ласка, спробуйте ще раз.'] 
      })
      toast({
        title: "Помилка входу",
        description: "Не вдалося увійти. Перевірте ваші дані та спробуйте ще раз.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Увійти в аккаунт</DialogTitle>
          <DialogDescription>
            Введіть свою електронну адресу та пароль для входу.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password[0]}</p>}
          </div>
          <div className="flex justify-between items-center">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
            />
            <span>Запам'ятати мене</span>
          </label>
          <Link
            href="/forgot-password"
            className="font-mono text-right text-primary hover:text-primary/90"
            onClick={() => onOpenChange(false)}
          >
            Забули пароль?
          </Link>
          </div>
         
          {errors.login && <p className="text-red-500 text-sm">{errors.login[0]}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Вхід..." : "Увійти"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

