'use client'

import toast, { Toaster } from 'react-hot-toast'

export default function TestComponent() {
  // Стан для відстеження процесу завантаження платежу

  // Функція для обробки створення платежу
  const handlePayment = async () => {

    try {
      // Відправляємо запит до API Monobank для створення рахунку
      const response = await fetch('https://api.monobank.ua/api/merchant/invoice/create', {
        method: 'POST',
        headers: {
          'X-Token': 'uq70g5yXNurYCh3y0AH3bCGzTx8F7VUGAcllbwbQ4R_c', // Токен для автентифікації
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 1000, // Сума в копійках (10 грн)
          ccy: 980, // Код валюти (980 - UAH)
          merchantPaymInfo: {
            reference: `test-payment-${Date.now()}`, // Унікальний ідентифікатор платежу
            destination: "Тестовий платіж", // Призначення платежу
          },
          redirectUrl: window.location.origin + '/test', // URL для повернення після оплати
          // webHookUrl: '/api/webhook/mono', // URL для отримання статусу платежу
          webHookUrl: 'http://91.239.233.45:8000/api/subscriptions/create',
          saveCardData: {
            saveCard: true,
            walletId: `wallet-${Date.now()}` // Унікальний ідентифікатор гаманця
          }
        }),
      })

      const data = await response.json()
      
      // Зберігаємо відповідь через API route
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
      
      // Якщо отримали URL платіжної сторінки - перенаправляємо користувача
      if (data.pageUrl) {
        window.location.href = data.pageUrl
      }
    } catch (error) {
      console.error('Помилка створення платежу:', error)
      alert('Помилка при створенні платежу')
    } finally {

      
    }
  }

  const callToast = () => {
    console.log('click', toast.success)
    toast.success('Тестове повідомлення')
  }

  return (
    <div className="p-4 border rounded-lg mt-4">
      <h2 className="text-xl mb-4">Тестовий платіж Monobank</h2>
      <button 
        onClick={handlePayment}

        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
      >
        {true ? 'Створення платежу...' : 'Сплатити 10 грн'}
      </button>
      <button onClick={callToast}>click</button>
      <Toaster />
    </div>
  )
}
