'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  //DialogTrigger, // Removed as per update 4
} from './ui/dialog'
import { useAuth } from '../hooks/auth'
import { Eye, EyeOff } from 'lucide-react'

interface RegisterModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RegisterModal({ isOpen, onOpenChange }: RegisterModalProps) {
  // const [isOpen, setIsOpen] = useState(false) // Removed as per update 2
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const { register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await register({ email, password, setErrors })
      onOpenChange(false) // Changed as per update 2
      // Очистити форму після успішної реєстрації
      setEmail('')
      setPassword('')
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {/*
      <DialogTrigger asChild>
        <Button variant="ghost" className="font-mono text-white">Реєстрація</Button>
      </DialogTrigger>
      */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Створити аккаунт</DialogTitle>
          <DialogDescription>
            Введіть свою електронну адресу та пароль для реєстрації.
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
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password[0]}</p>}
          </div>
          <Button type="submit" className="w-full">Зареєструватися</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
