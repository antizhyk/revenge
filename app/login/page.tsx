'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from '@/hooks/auth'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors([])

    login({
      email,
      password,
      setErrors,
      setStatus: (status) => {
        if (status) {
          toast.success('Ви успішно увійшли в систему.')
          const fromSupport = localStorage.getItem('fromSupport')
          if (fromSupport === 'true') {
            localStorage.removeItem('fromSupport')
            router.push('/?scrollTo=subscription')
          } else {
            router.push('/')
          }
        }
      },
    })
    .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    const fromSupport = localStorage.getItem('fromSupport')
    if (fromSupport === 'true') {
      toast('Будь ласка, увійдіть для продовження підтримки', { icon: 'ℹ️' })
    }
  }, [])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center text-white mb-8 hover:text-primary transition-colors">
          <ArrowLeft className="mr-2" />
          <span className="font-mono">Повернутися на головну</span>
        </Link>
        <h1 className="text-3xl font-bold mb-6 text-center text-white font-mono">Вхід</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-900 shadow-md rounded px-8 pt-6 pb-8 mb-4">
          {errors.length > 0 && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <ul className="list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="font-mono text-gray-300">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="font-mono bg-gray-800 border-gray-700 text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="font-mono text-gray-300">Пароль</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-mono bg-gray-800 border-gray-700 text-white"
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
          </div>
          <Button 
            type="submit" 
            className="w-full font-mono bg-primary hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? "Вхід..." : "Увійти"}
          </Button>
        </form>
        <div className="text-center">
          <Link href="/forgot-password" className="font-mono text-primary hover:text-primary/90">
            Забули пароль?
          </Link>
        </div>
        <div className="mt-4 text-center">
          <span className="font-mono text-gray-400">Немає аккаунту? </span>
          <Link href="/register" className="font-mono text-primary hover:text-primary/90">
            Зареєструватися
          </Link>
        </div>
      </div>
    </div>
  )
}

