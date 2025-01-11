'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from "@/components/ui/button"
import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/navigation'

export default function SubscriptionSection() {
  const [amount, setAmount] = useState<string>('')
  const [isTyping, setIsTyping] = useState(false)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { user } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleQuickAmount = (value: number) => {
   console.log('value', value)
   //set value to input
    setAmount(value.toString())
  }

  const handleSupport = () => {
    if (!amount) {
      setError('Введіть суму')
      return
    }
    if (!user) {
      localStorage.setItem('fromSupport', 'true')
      localStorage.setItem('supportAmount', amount)
      router.push('/register')
    } else {
      handlePayment()
    }
  }

  const handlePayment = async () => {
    try {
      const response = await fetch('https://api.monobank.ua/api/merchant/invoice/create', {
        method: 'POST',
        headers: {
          'X-Token': 'uq70g5yXNurYCh3y0AH3bCGzTx8F7VUGAcllbwbQ4R_c',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseInt(amount) * 100,
          ccy: 980,
          merchantPaymInfo: {
            reference: `payment-${Date.now()}`,
            destination: "Підтримка місії",
          },
          redirectUrl: window.location.origin + '/dashboard',
          webHookUrl: window.location.origin + '/api/webhook/mono',
          saveCardData: {
            saveCard: true,
            walletId: `wallet-${Date.now()}`
          }
        }),
      })

      const data = await response.json()
      
      await fetch('/api/save-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
          saveCardData: {
            saveCard: true,
            walletId: `wallet-${Date.now()}`
          }
        })
      })
      
      if (data.pageUrl) {
        window.location.href = data.pageUrl
      }
    } catch (error) {
      console.error('Помилка створення платежу:', error)
      alert('Помилка при створенні платежу')
    }
  }

  // useEffect(() => {
  //   if (inputRef.current) {
  //     inputRef.current.focus()
  //   }

  //   return () => {
  //     if (typingTimeoutRef.current) {
  //       clearTimeout(typingTimeoutRef.current)
  //     }
  //   }
  // }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setAmount(value)
    setIsTyping(false)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
  }

  return (
    <section id="subscription" ref={ref} className="py-20 bg-black border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-3xl mb-8 text-center text-white"
          >
            {user?.isSubscribed ? "ДЯКУЄМО ЗА ВАШУ ПІДТРИМКУ" : "ПІДТРИМКА МІСІЇ"}
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {user?.isSubscribed ? (
              <div className="text-center">
                <p className="font-mono text-lg mb-8 text-gray-300">
                  Ваша підтримка допомагає нам захищати Україну та її громадян. 
                  Ми вдячні за вашу щомісячну допомогу.
                </p>
                <Button 
                  onClick={() => router.push('/dashboard')}
                  className="font-mono bg-primary hover:bg-primary/90"
                >
                  Керувати підпискою
                </Button>
              </div>
            ) : (
              <>
                <p className="font-mono text-lg mb-8 text-center text-gray-300">
                  Ваша підтримка допомагає нам захищати Україну та її громадян. 
                  Кожен внесок наближає нас до перемоги.
                </p>
                {error && (
                  <div className="text-red-500 text-sm font-mono">{error}</div>
                )}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative flex-grow group">
                    <input
                      ref={inputRef}
                      type="text"
                      inputMode="numeric"
                      value={amount}
                      onChange={handleInputChange}
                      className="w-full bg-black/30 backdrop-blur-sm border border-gray-700 rounded-md px-4 py-2 text-white font-mono text-lg focus:outline-none focus:ring-1 focus:ring-gray-500 shadow-[0_0_15px_rgba(255,255,255,0.1)] pl-6"
                      style={{ textShadow: '0 0 5px rgba(255,255,255,0.5)' }}
                    />
                  </div>
                  <Button 
                    onClick={handleSupport}
                    className="bg-white hover:bg-gray-200 text-black font-mono transition-colors duration-300"
                  >
                    ПІДТРИМАТИ
                  </Button>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  {[10, 20, 50, 100].map((value) => (
                    <Button
                      key={value}
                      variant="outline"
                      className="font-mono border-gray-600 text-white bg-[#1A1A1A] hover:bg-gray-800 transition-colors duration-300"
                      onClick={() => handleQuickAmount(value)}
                    >
                      {value} UAH
                    </Button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

