'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Layout from '@/components/Layout'
import { useAuth } from '@/hooks/auth'
import toast from 'react-hot-toast'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Loader2 } from 'lucide-react'
import parseErrors from '@/assets/parseErrors'

const validationSchema = Yup.object({
  email: Yup.string().email('Невірний формат email').required('Email обов\'язковий'),
})

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const { forgotPassword } = useAuth()
  const [errors, setErrors] = useState([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Тут має бути логіка для відправки запиту на відновлення пароля
        // await sendPasswordResetEmail(values.email)
        const errors = await forgotPassword({ email: values.email, setErrors, setStatus })
      
        // toast({
        //   title: "Успіх",
        //   description: "Перевірте вашу електронну пошту для відновлення пароля.",
        // })
        if (errors) {
          toast.error('Не вдалося відправити посилання для відновлення пароля. Спробуйте ще раз.')
          setErrors(parseErrors(errors));
        }else{
        toast.success('Перевірте вашу електронну пошту для відновлення пароля.')
        setCountdown(60) // Встановлюємо 60 секунд до можливості повторної відправки

        }
      } catch (error) {
        // toast({
        //   title: "Помилка",
        //   description: "Не вдалося відправити посилання для відновлення пароля. Спробуйте ще раз.",
        //   variant: "destructive",
        // })
        toast.error('Не вдалося відправити посилання для відновлення пароля. Спробуйте ще раз.')
      } finally {
        setSubmitting(false)
      }
    },
  })


  return (
    <Layout>
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center text-white font-mono">Відновлення пароля</h1>
          <div className="bg-gray-900 shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <p className="mb-4 text-gray-300 font-mono">
              Забули пароль? Без проблем. Просто вкажіть вашу електронну адресу, і ми надішлемо вам посилання для відновлення пароля, яке дозволить вам обрати новий.
            </p>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
            {errors.length > 0 && (
  <div className="text-red-500 text-sm font-mono space-y-1">
    {errors.map((error, index) => (
      <p key={index}>{error}</p>
    ))}
  </div>
)}
              <div className="space-y-2">
                <Label htmlFor="email" className="font-mono text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...formik.getFieldProps('email')}
                  className="font-mono bg-gray-800 border-gray-700 text-white"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-sm font-mono">{formik.errors.email}</p>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full font-mono bg-primary hover:bg-primary/90"
                disabled={formik.isSubmitting || countdown > 0}
              >
                {formik.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Відправка...
                  </>
                ) : countdown > 0 ? (
                  `Повторна відправка через ${countdown}с`
                ) : (
                  "Відправити посилання для відновлення"
                )}
              </Button>
            </form>
            {countdown > 0 && (
              <p className="mt-4 text-sm text-gray-400 font-mono text-center">
                Ви зможете повторно відправити лист через {countdown} секунд
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

