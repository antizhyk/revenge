'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Layout from '@/components/Layout'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/auth'
import axios from '@/lib/axios'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Loader2 } from 'lucide-react'

// Функція для форматування часу
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

const validationSchema = Yup.object({
  code: Yup.string()
    .matches(/^[A-Z0-9]{6}$/, 'Код повинен містити 6 символів (літери та цифри)')
    .required('Код підтвердження обов\'язковий'),
})

export default function VerifyRegistrationPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(120) // 2 minutes in seconds
  const  {resendEmailVerification} = useAuth()

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer)
          return 0
        }
        return prevCountdown - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])


  async function verifyRegistrationCode(code: string) {
    // /verify-email

    const email = localStorage.getItem('emailForVerify')
    // localStorage.removeItem('emailForVerify')
    await axios
        .post('/api/verify-email', { code, email })
        .then((response) => {
            console.log('response', response)
            if (response.status === 200) {
                console.log('response', response)
                // router.push('/dashboard')
                const fromSupport = localStorage.getItem('fromSupport')
           
                   if (fromSupport === 'true') {
                   localStorage.removeItem('fromSupport')
                   router.push('/?scrollTo=subscription')
                   } else {
                   router.push('/dashboard')
                   }
            }
        })
        .catch((error) => {
          console.error('error', error)
          toast.error('Невірний код. Спробуйте ще раз.')
          throw error
        })
  }



  const formik = useFormik({
    initialValues: {
      code: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Тут має бути логіка для відправки коду на сервер
        await verifyRegistrationCode(values.code)
        
        // toast({
        //   title: "Успіх",
        //   description: "Реєстрацію підтверджено успішно!",
        // })
        toast.success('Реєстрацію підтверджено успішно!')
        // router.push('/dashboard') // Перенаправлення на дашборд після успішної верифікації
      } catch (error) {
        // toast({
        //   title: "Помилка",
        //   description: "Невірний код. Спробуйте ще раз.",
        //   variant: "destructive",
        // })
        // toast.error('Невірний код. Спробуйте ще раз.')
      } finally {
        setSubmitting(false)
      }
    },
  })


  const handleResendCode = async () => {
    if (countdown > 0) return

    setIsLoading(true)
    try {
      await resendEmailVerification()
      
      toast.success('Новий код відправлено на вашу електронну пошту.')
      setCountdown(120) // Скидаємо таймер
    } catch (error) {
      toast.error('Не вдалося відправити новий код. Спробуйте пізніше.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center text-white font-mono">Підтвердження реєстрації</h1>
          <div className="bg-gray-900 shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <p className="mb-4 text-gray-300 font-mono text-center">
              Будь ласка, введіть 6-значний код (літери та цифри), який ми відправили на вашу електронну пошту.
            </p>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <Input
                type="text"
                id="code"
                maxLength={6}
                {...formik.getFieldProps('code')}
                className="font-mono bg-gray-800 border-gray-700 text-white text-center text-2xl tracking-widest"
                placeholder="000000"
              />
              {formik.touched.code && formik.errors.code && (
                <p className="text-red-500 text-sm font-mono text-center">{formik.errors.code}</p>
              )}
              <Button 
                type="submit" 
                className="w-full font-mono bg-primary hover:bg-primary/90"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Перевірка...
                  </>
                ) : (
                  "Підтвердити"
                )}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-gray-400 font-mono mb-2">
                Не отримали код?
              </p>
              <Button
                onClick={handleResendCode}
                variant="outline"
                className="font-mono"
                disabled={countdown > 0}
              >
                {countdown > 0 ? `Відправити повторно через ${formatTime(countdown)}` : "Відправити повторно"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

