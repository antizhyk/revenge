'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useInView } from 'react-intersection-observer'

const schema = z.object({
  amount: z.number().min(1),
  frequency: z.enum(['one-time', 'monthly']),
  cardNumber: z.string().regex(/^\d{16}$/),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/),
  cvv: z.string().regex(/^\d{3}$/),
})

type DonationFormData = z.infer<typeof schema>

export default function DonationForm() {
  const [customAmount, setCustomAmount] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<DonationFormData>({
    resolver: zodResolver(schema),
  })

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  }

  const onSubmit = (data: DonationFormData) => {
    // Implement donation logic
    console.log(data)
  }

  return (
    <section id="підтримка" ref={ref} className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.h2
          variants={variants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-8 text-center text-white"
        >
          Підтримайте Нашу Місію
        </motion.h2>
        <motion.form
          variants={variants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-md mx-auto bg-gray-800 p-8 rounded-lg shadow-lg"
        >
          <div className="mb-6">
            <Label htmlFor="amount" className="block mb-2 text-white">Сума</Label>
            <div className="grid grid-cols-3 gap-4 mb-2">
              {[100, 500, 1000].map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant={!customAmount && register('amount').value === amount ? "default" : "outline"}
                  onClick={() => {
                    setCustomAmount(false)
                    register('amount').onChange(amount)
                  }}
                >
                  {amount} ₴
                </Button>
              ))}
            </div>
            <Button
              type="button"
              variant={customAmount ? "default" : "outline"}
              className="w-full"
              onClick={() => setCustomAmount(true)}
            >
              Інша Сума
            </Button>
            {customAmount && (
              <Input
                type="number"
                {...register('amount', { valueAsNumber: true })}
                className="w-full mt-2 p-2 border rounded bg-gray-700 text-white"
                placeholder="Введіть суму"
              />
            )}
            {errors.amount && <p className="text-red-500 mt-1">{errors.amount.message}</p>}
          </div>

          <div className="mb-6">
            <Label className="block mb-2 text-white">Періодичність</Label>
            <RadioGroup defaultValue="one-time">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="one-time" id="one-time" />
                <Label htmlFor="one-time">Одноразово</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly">Щомісячно</Label>
              </div>
            </RadioGroup>
            {errors.frequency && <p className="text-red-500 mt-1">{errors.frequency.message}</p>}
          </div>

          <div className="mb-6">
            <Label htmlFor="cardNumber" className="block mb-2 text-white">Номер Картки</Label>
            <Input
              type="text"
              {...register('cardNumber')}
              className="w-full bg-gray-700 text-white"
              placeholder="1234 5678 9012 3456"
            />
            {errors.cardNumber && <p className="text-red-500 mt-1">{errors.cardNumber.message}</p>}
          </div>

          <div className="flex mb-6">
            <div className="w-1/2 mr-2">
              <Label htmlFor="expiryDate" className="block mb-2 text-white">Термін Дії</Label>
              <Input
                type="text"
                {...register('expiryDate')}
                className="w-full bg-gray-700 text-white"
                placeholder="MM/РР"
              />
              {errors.expiryDate && <p className="text-red-500 mt-1">{errors.expiryDate.message}</p>}
            </div>
            <div className="w-1/2 ml-2">
              <Label htmlFor="cvv" className="block mb-2 text-white">CVV</Label>
              <Input
                type="text"
                {...register('cvv')}
                className="w-full bg-gray-700 text-white"
                placeholder="123"
              />
              {errors.cvv && <p className="text-red-500 mt-1">{errors.cvv.message}</p>}
            </div>
          </div>

          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white transition-transform hover:scale-105">
            Підтримати
          </Button>
        </motion.form>
      </div>
    </section>
  )
}

