'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/auth'
import SubscriptionSectionView from '@/components/SubscriptionSection/SubscriptionSectionView'

export default function SubscriptionSection() {
  const [amount, setAmount] = useState<string>('')
  const [isTyping, setIsTyping] = useState(false)
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setAmount(value)
    setIsTyping(false)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
  }

  return (
    <SubscriptionSectionView
      amount={amount}
      isTyping={isTyping}
      inputRef={inputRef}
      user={user}
      error={error}
      handleQuickAmount={handleQuickAmount}
      handleSupport={handleSupport}
      handleInputChange={handleInputChange}
    />
  )
}