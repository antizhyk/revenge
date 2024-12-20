'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from "@/components/ui/button"

export default function SubscriptionSection() {
  const [amount, setAmount] = useState<string>('')
  const [isTyping, setIsTyping] = useState(false)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleQuickAmount = (value: number) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    setAmount('')
    setIsTyping(true)
    
    const digits = value.toString().split('')
    let currentIndex = 0
    
    const typeNextDigit = () => {
      if (currentIndex < digits.length) {
        setAmount(prev => prev + digits[currentIndex])
        currentIndex++
        typingTimeoutRef.current = setTimeout(typeNextDigit, 100)
      } else {
        setIsTyping(false)
      }
    }
    
    typeNextDigit()
  }

  const handleSupport = () => {
    console.log(`Підтримка на суму ${amount} UAH`)
  }

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

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
            ПІДТРИМКА МІСІЇ
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-mono text-lg mb-8 text-center text-gray-300"
          >
            Ваша підтримка допомагає нам захищати Україну та її громадян. 
            Кожен внесок наближає нас до перемоги.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative flex-grow group">
                <span className="absolute left-0 top-0 h-full flex items-center pl-4 pointer-events-none">
                  {(isTyping || amount === '') && (
                    <span 
                      className="inline-block w-[1px] h-5 bg-white opacity-75"
                      style={{ 
                        boxShadow: '0 0 5px rgba(255,255,255,0.7), 0 0 10px rgba(255,255,255,0.5), 0 0 15px rgba(255,255,255,0.3)',
                        animation: 'blink 1s step-end infinite'
                      }}
                    />
                  )}
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  onChange={handleInputChange}
                  className="w-full bg-black/30 backdrop-blur-sm border border-gray-700 rounded-md px-4 py-2 text-white font-mono text-lg focus:outline-none focus:ring-1 focus:ring-gray-500 shadow-[0_0_15px_rgba(255,255,255,0.1)] caret-transparent pl-6"
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
          </motion.div>
        </div>
      </div>
    </section>
  )
}

