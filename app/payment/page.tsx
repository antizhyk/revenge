'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const amount = searchParams.get('amount')
    if (!amount) {
      router.push('/')
      return
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

    handlePayment()
  }, [user, router, searchParams])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-center">
        <h1 className="text-3xl font-bold mb-4">Обробка платежу</h1>
        <p>Будь ласка, зачекайте. Ви будете перенаправлені на сторінку оплати.</p>
      </div>
    </div>
  )
}

