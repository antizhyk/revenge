'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from '@/hooks/auth'
import { Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const validationSchema = Yup.object({
  email: Yup.string().email('Невірний формат email').required('Email обов\'язковий'),
  password: Yup.string().required('Пароль обов\'язковий'),
})

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const { login } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/',
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await login({
          email: values.email,
          password: values.password,
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
        console.log('Error:', errors)
        // toast({
        //   title: "Успіх",
        //   description: "Ви успішно увійшли в систему.",
        // })
        toast.success('Ви успішно увійшли в систему.')
        router.push('/')
      } catch (error) {
        console.error('Login failed:', error)

        // toast({
        //   title: "Помилка",
        //   description: "Не вдалося увійти. Перевірте ваші дані та спробуйте ще раз.",
        //   variant: "destructive",
        // })
        toast.error('Не вдалося увійти. Перевірте ваші дані та спробуйте ще раз.')
      } finally {
        setSubmitting(false)
      }
    },
  })


  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   setIsLoading(true)
  //   setErrors([])

  //   login({
  //     email,
  //     password,
  //     setErrors,
  //     setStatus: (status) => {
  //       if (status) {
  //         toast.success('Ви успішно увійшли в систему.')
  //         const fromSupport = localStorage.getItem('fromSupport')
  //         if (fromSupport === 'true') {
  //           localStorage.removeItem('fromSupport')
  //           router.push('/?scrollTo=subscription')
  //         } else {
  //           router.push('/')
  //         }
  //       }
  //     },
  //   })
  // }

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
        <form onSubmit={formik.handleSubmit} className="space-y-4 bg-gray-900 shadow-md rounded px-8 pt-6 pb-8 mb-4">
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
          <div className="space-y-2">
            <Label htmlFor="password" className="font-mono text-gray-300">Пароль</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...formik.getFieldProps('password')}
                className="font-mono bg-gray-800 border-gray-700 text-white"
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
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm font-mono">{formik.errors.password}</p>
            )}
          </div>
          <Button 
            type="submit" 
            className="w-full font-mono bg-primary hover:bg-primary/90"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Вхід...
              </>
            ) : (
              "Увійти"
            )}
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
      <Toaster />
    </div>
  )
}

