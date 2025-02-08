'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from '@/hooks/auth'
import { Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import parseErrors from '@/assets/parseErrors'
import { signInWithGoogle } from '@/lib/firebase/auth'

interface User {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  uid: string;
  accessToken: string;
}


const validationSchema = Yup.object({
  name: Yup.string().required('Ім\'я обов\'язкове'),
  email: Yup.string().email('Невірний формат email').required('Email обов\'язковий'),
  password: Yup.string().min(8, 'Пароль повинен містити мінімум 8 символів').required('Пароль обов\'язковий'),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref('password')], 'Паролі повинні співпадати')
    .required('Підтвердження пароля обов\'язкове'),
})

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const { register, googleLogin } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/verify-registration',
  })

  const googleAuth =  async () => {
    const user = await signInWithGoogle();
    if (user) {
      try{
 //@ts-ignore
 await googleLogin({
  name: user.displayName,
  email: user.email,
  localId: user.localId
})
router.push('/');
      }catch (error) {
        console.error('Login failed:', error);
        toast.error('Не вдалося увійти. Перевірте ваші дані та спробуйте ще раз.');
      }
     
    }
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const errors = await register({
          name: values.name,
          email: values.email,
          password: values.password,
          password_confirmation: values.passwordConfirmation,
          setErrors
        })

        // toast({
        //   title: "Успіх",
        //   description: "Ви успішно зареєструвалися.",
        // })
        if (errors) {
          toast.error('Не вдалося зареєструватися. Перевірте ваші дані та спробуйте ще раз.')
          setErrors(parseErrors(errors))
        } else {
        window.localStorage.setItem('emailForVerify', values.email)
        toast.success('Ви успішно зареєструвалися.')
        router.push('/verify-registration')
        }
      } catch (error) {
        console.error('Registration failed:', error)
        // toast({
        //   title: "Помилка",
        //   description: "Не вдалося зареєструватися. Спробуйте ще раз.",
        //   variant: "destructive",
        // })
        toast.error('Не вдалося зареєструватися. Спробуйте ще раз.')
      } finally {
        setSubmitting(false)
      }
    },
  })


  useEffect(() => {
    const fromSupport = localStorage.getItem('fromSupport')
    if (fromSupport === 'true') {
      toast('Будь ласка, зареєструйтесь або увійдіть для продовження', { icon: 'ℹ️' })
      localStorage.removeItem('fromSupport')
    }
  }, [])

  return (
<div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center text-white mb-8 hover:text-primary transition-colors">
          <ArrowLeft className="mr-2" />
          <span className="font-mono">Повернутися на головну</span>
        </Link>
        <h1 className="text-3xl font-bold mb-6 text-center text-white font-mono">Реєстрація</h1>
        <form onSubmit={formik.handleSubmit} className="space-y-4 bg-gray-900 shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {errors.length > 0 && (
  <div className="text-red-500 text-sm font-mono space-y-1">
    {errors.map((error, index) => (
      <p key={index}>{error}</p>
    ))}
  </div>
)}
          <div className="space-y-2">
            <Label htmlFor="name" className="font-mono text-gray-300">Ім'я</Label>
            <Input
              id="name"
              type="text"
              placeholder="Ваше ім'я"
              {...formik.getFieldProps('name')}
              className="font-mono bg-gray-800 border-gray-700 text-white"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm font-mono">{formik.errors.name}</p>
            )}
          </div>
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
          <div className="space-y-2">
            <Label htmlFor="passwordConfirmation" className="font-mono text-gray-300">Підтвердіть пароль</Label>
            <div className="relative">
              <Input
                id="passwordConfirmation"
                type={showConfirmPassword ? "text" : "password"}
                {...formik.getFieldProps('passwordConfirmation')}
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
            {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation && (
              <p className="text-red-500 text-sm font-mono">{formik.errors.passwordConfirmation}</p>
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
                Реєстрація...
              </>
            ) : (
              "Зареєструватися"
            )}
          </Button>
          <Button
            type="button"
            className="w-full font-mono bg-red-500 hover:bg-red-500/90"
            onClick={googleAuth}
          >
            Увійти за допомогою Google
          </Button>
        </form>
        <div className="text-center">
          <span className="font-mono text-gray-400">Вже маєте аккаунт? </span> 
          <Link href="/login" className="font-mono text-primary hover:text-primary/90">
            Увійти
          </Link>
        </div>
      </div>
    </div>
  )
}
