'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/auth'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Layout from '@/components/Layout'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Mail, Lock, Loader2 } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import toast from 'react-hot-toast'


const validationSchema = Yup.object({
  // email: Yup.string().email('Невірний формат email').required('Email обов\'язковий'),
  currentPassword: Yup.string().required('Поточний пароль обов\'язковий'),
  newPassword: Yup.string().min(8, 'Пароль повинен містити мінімум 8 символів').required('Новий пароль обов\'язковий'),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Паролі повинні співпадати')
    .required('Підтвердження пароля обов\'язкове'),
})


export default function DashboardPage() {
  const { user, updatePassword, getUserSubscription, cancelSubscription } = useAuth({
    middleware: 'auth',
  })

  const updateEmail = (email) => {
    console.log(email)
  }
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [status, setStatus] = useState<string | null>(null)
  const [subscription, setSubscription] = useState(null)

  

  // Приклад дат для демонстрації
  // const lastPaymentDate = new Date(2024, 0, 15) // 15 січня 2024
  // const nextPaymentDate = new Date(2024, 1, 15) // 15 лютого 2024

  const formik = useFormik({
    initialValues: {
      // email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      console.log("onSubmit", values)
      try {
        // if (values.email !== user?.email) {
        //   await updateEmail(values.email)
        //   // toast({
        //   //   title: "Email оновлено",
        //   //   description: "Ваш email успішно змінено.",
        //   // })
        //   toast.success('Ваш email успішно змінено.')
        // }
        
        if (values.newPassword) {
         const errors = await updatePassword(
            {
            setErrors,
            setStatus,
            password_confirmation: values.confirmNewPassword,
            password: values.newPassword,
            current_password: values.currentPassword,
            
            }
          )

          if (errors) {
            // toast.error('Не вдалося увійти. Перевірте ваші дані та спробуйте ще раз.');
            toast.error('Не вдалося оновити дані. Спробуйте ще раз.')
            // setErrors(parseErrors(errors));
          } else {
            // Успішний вхід
            toast.success('Ваш пароль успішно змінено.')
          }
        }
        resetForm()
      } catch (error) {
        // toast({
        //   title: "Помилка",
        //   description: "Не вдалося оновити дані. Спробуйте ще раз.",
        //   variant: "destructive",
        // })
        console.error('Update failed:', error)
        toast.error('Не вдалося оновити дані. Спробуйте ще раз.')
      } finally {
        setSubmitting(false)
      }
    },
  })

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateEmail(email)
    } catch (error) {

    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {

      return
    }
    try {
      //@ts-ignore
      await updatePassword(password)

      setPassword('')
      setConfirmPassword('')
    } catch (error) {

    }
  }

  const handleUnsubscribe = async () => {
    try {
      await cancelSubscription()
      setSubscription(null)
      // toast.success('', { id: 'login-success' });
      toast.success('Ви успішно відписались від щомісячного донату.')
    } catch (error) {
      console.error('Unsubscribe failed:', error)
      toast.error('Не вдалося відписатись від щомісячного донату.')
     
    } finally {
      setShowCancelDialog(false)
    }
  }

  // used useEffect and async function to get user subscription
  useEffect(() => {
    const fetchData = async () => {
      const subscription = await getUserSubscription()
          // create const subscriptionDayPay subscription.end_date in formate "2025-02-28T00:00:00.000000Z" + 1 day
    let subscriptionDayPay = new Date(subscription.end_date)
    let subscriptionLastPaymentDate = new Date(subscription.end_date)
    subscriptionDayPay.setDate(subscriptionDayPay.getDate() + 1)
    subscriptionLastPaymentDate.setMonth(subscriptionLastPaymentDate.getMonth() - 1)
    subscription.subscriptionDayPay = subscriptionDayPay
    subscription.subscriptionLastPaymentDate = subscriptionLastPaymentDate
    
    console.log('subscriptionDayPay', subscriptionDayPay)
      setSubscription(subscription)
    }
    fetchData()

  }, [])

  console.log('subscription', subscription)

  return (
    <Layout>
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8 font-mono text-white">Особистий кабінет</h1>
          <div className="grid gap-8 md:grid-cols-2">
            {/* Картка редагування профілю */}
            <Card className="border-gray-800 bg-gray-900/50 backdrop-blur">
              {/* <CardHeader className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-primary" />
                  <CardTitle className="font-mono text-xl text-white">Безпека</CardTitle>
                </div>
                <CardDescription>Оновіть ваші облікові дані</CardDescription>
              </CardHeader> */}
              <CardContent className="space-y-6">
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                  {/* Email форма */}
                  {/* <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-primary" />
                      <h3 className="font-mono text-lg text-white">Email адреса</h3>
                    </div>
                    <Separator className="bg-gray-800" />
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-mono text-gray-400">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...formik.getFieldProps('email')}
                        className="font-mono bg-gray-800 border-gray-700 text-white"
                      />
                      {formik.touched.email && formik.errors.email && (
                        <p className="text-red-500 text-sm font-mono">{formik.errors.email}</p>
                      )}
                    </div>
                  </div> */}

                  {/* Пароль форма */}
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-primary" />
                      <h3 className="font-mono text-lg text-white">Зміна паролю</h3>
                    </div>
                    <Separator className="bg-gray-800" />
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="font-mono text-gray-400">
                        Поточний пароль
                      </Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        {...formik.getFieldProps('currentPassword')}
                        className="font-mono bg-gray-800 border-gray-700 text-white"
                      />
                      {formik.touched.currentPassword && formik.errors.currentPassword && (
                        <p className="text-red-500 text-sm font-mono">{formik.errors.currentPassword}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="font-mono text-gray-400">
                        Новий пароль
                      </Label>
                      <Input
                        id="newPassword"
                        type="password"
                        {...formik.getFieldProps('newPassword')}
                        className="font-mono bg-gray-800 border-gray-700 text-white"
                      />
                      {formik.touched.newPassword && formik.errors.newPassword && (
                        <p className="text-red-500 text-sm font-mono">{formik.errors.newPassword}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmNewPassword" className="font-mono text-gray-400">
                        Підтвердіть новий пароль
                      </Label>
                      <Input
                        id="confirmNewPassword"
                        type="password"
                        {...formik.getFieldProps('confirmNewPassword')}
                        className="font-mono bg-gray-800 border-gray-700 text-white"
                      />
                      {formik.touched.confirmNewPassword && formik.errors.confirmNewPassword && (
                        <p className="text-red-500 text-sm font-mono">{formik.errors.confirmNewPassword}</p>
                      )}
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full font-mono bg-primary hover:bg-primary/90"
                    disabled={formik.isSubmitting}
                  >
                    {formik.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Оновлення...
                      </>
                    ) : (
                      "Оновити дані"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>


            {/* Картка підписки */}
            <Card className="border-gray-800 bg-gray-900/50 backdrop-blur">
              <CardHeader className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <CardTitle className="font-mono text-xl text-white">Управління вашою підпискою</CardTitle>
                </div>
                {/* <CardDescription>Управління вашою підпискою</CardDescription> */}
              </CardHeader>
              <CardContent>
                {subscription ? (
                  <div className="space-y-6">
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="font-mono text-lg text-white mb-4">
                        Дякуємо що підписались на щомісячний донат у розмірі:
                      </p>
                      <p className="font-mono text-3xl text-primary font-bold">
                        {subscription?.amount / 100} грн
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="font-mono text-sm text-gray-400">
                            Останній платіж
                          </p>
                          <p className="font-mono text-white">
                            {format(subscription.subscriptionLastPaymentDate, 'd MMMM yyyy', { locale: uk })}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="font-mono text-sm text-gray-400">
                            Наступний платіж
                          </p>
                          <p className="font-mono text-white">
                            {format(subscription?.subscriptionDayPay, 'd MMMM yyyy', { locale: uk })}
                          </p>
                        </div>
                      </div>
                      <Separator className="bg-gray-800" />
                      <Button 
                        variant="destructive" 
                        onClick={() => setShowCancelDialog(true)}
                        className="font-mono w-full"
                      >
                        Відмінити підписку
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <p className="font-mono text-lg text-white mb-2">
                        Ви можете підтримати наш підрозділ підписавшись на щомісячний донат
                      </p>
                      <p className="font-mono text-sm text-gray-400">
                        Ваша підтримка допомагає нам захищати Україну
                      </p>
                    </div>
                    <Button 
                      onClick={() => window.location.href = '/#subscription'}
                      className="font-mono w-full bg-primary hover:bg-primary/90"
                    >
                      Оформити підписку
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Модальне вікно підтвердження відміни підписки */}
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent className="bg-gray-900 border-gray-800">
            <DialogHeader>
              <DialogTitle className="font-mono text-white">Відміна підписки</DialogTitle>
              <DialogDescription className="font-mono">
                Ви дійсно хочете відписатися від щомісячного донату?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowCancelDialog(false)}
                className="font-mono border-gray-700 hover:bg-gray-800"
              >
                Ні
              </Button>
              <Button
                variant="destructive"
                onClick={handleUnsubscribe}
                className="font-mono"
              >
                Так
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}

