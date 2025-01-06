'use client'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Layout from '@/components/Layout'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/auth'

const validationSchema = Yup.object({
  password: Yup.string().min(8, 'Пароль повинен містити мінімум 8 символів').required('Пароль обов\'язковий'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Паролі повинні співпадати')
    .required('Підтвердження пароля обов\'язкове'),
})

export default function PasswordResetPage({ params }: { params: { token: string } }) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [email, setEmail] = useState('')
  const {resetPassword} = useAuth()
  const [errors, setErrors] = useState(null)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const emailParam = urlParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [])

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Тут має бути логіка для відправки нового пароля на сервер
        // await resetPassword(params.token, email, values.password)
        const token = params.token
        await resetPassword({
          token,
          email,
          password: values.password,
          password_confirmation: values.confirmPassword,
          setErrors,
          setStatus,
      })
        // toast({
        //   title: "Успіх",
        //   description: "Ваш пароль успішно змінено",
        // })
        toast.success('Ваш пароль успішно змінено')
        router.push('/login')
      } catch (error) {
        // toast({
        //   title: "Помилка",
        //   description: "Не вдалося змінити пароль. Спробуйте ще раз.",
        //   variant: "destructive",
        // })
        toast.error('Не вдалося змінити пароль. Спробуйте ще раз.')
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
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-mono text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  className="font-mono bg-gray-800 border-gray-700 text-white"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-mono text-gray-300">Новий пароль</Label>
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
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-mono text-gray-300">Підтвердіть новий пароль</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...formik.getFieldProps('confirmPassword')}
                    className="font-mono bg-gray-800 border-gray-700 text-white"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <p className="text-red-500 text-sm font-mono">{formik.errors.confirmPassword}</p>
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
                    Зміна пароля...
                  </>
                ) : (
                  "Змінити пароль"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout> 
  )
}

