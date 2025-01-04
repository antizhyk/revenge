'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Layout from '@/components/Layout'
import { useAuth } from '@/hooks/auth'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const { forgotPassword } = useAuth()
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Тут має бути логіка для відправки запиту на відновлення пароля
      // Наприклад: await sendPasswordResetEmail(email)
      await forgotPassword({ email, setErrors, setStatus })
      
      if (errors.length) {
        throw new Error('Failed to send password reset email')
      }

      setCountdown(60) // Встановлюємо 60 секунд до можливості повторної відправки
      toast.success('Перевірте вашу електронну пошту для відновлення пароля.')
    } catch (error) {
      toast.error('Не вдалося відправити посилання для відновлення пароля. Спробуйте ще раз.')
    } finally {
      setIsLoading(false)
    }
  } 

  return (
    <Layout>
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center text-white font-mono">Відновлення пароля</h1>
          <div className="bg-gray-900 shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <p className="mb-4 text-gray-300 font-mono">
              Забули пароль? Без проблем. Просто вкажіть вашу електронну адресу, і ми надішлемо вам посилання для відновлення пароля, яке дозволить вам обрати новий.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <Button 
                type="submit" 
                className="w-full font-mono bg-primary hover:bg-primary/90"
                disabled={isLoading || countdown > 0}
              >
                 {isLoading ? "Відправка..." : 
                 countdown > 0 ? `Повторна відправка можлива через ${countdown}с` : 
                 "Відправити посилання для відновлення"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

