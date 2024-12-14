'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function AboutSection() {
  const [isFirstVisit, setIsFirstVisit] = useState(true)
  const [startAnimation, setStartAnimation] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const text = `REVENGE GROUP - ЕЛІТНИЙ ВІЙСЬКОВИЙ ПІДРОЗДІЛ ДЛЯ ЗАХИСТУ УКРАЇНИ. МИ ПРОВЕЛИ ПОНАД 200 УСПІШНИХ ОПЕРАЦІЙ, ДЕМОНСТРУЮЧИ НЕПЕРЕВЕРШЕНУ ЕФЕКТИВНІСТЬ. НАША СИЛА - В ПОЄДНАННІ ПЕРЕДОВИХ ТЕХНОЛОГІЙ ТА ПРОФЕСІОНАЛІЗМУ. КОЖЕН ЧЛЕН КОМАНДИ ПРОХОДИТЬ ІНТЕНСИВНУ ПІДГОТОВКУ. МИ - СИМВОЛ НЕЗЛАМНОСТІ УКРАЇНСЬКОГО ДУХУ ТА ЗАХИСТУ ГРОМАДЯН.`

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedAbout')
    if (hasVisited) {
      setIsFirstVisit(false)
      setDisplayedText(text)
    } else {
      localStorage.setItem('hasVisitedAbout', 'true')
    }
    const timer = setTimeout(() => setStartAnimation(true), 500)

    return () => {
      clearTimeout(timer)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isFirstVisit && startAnimation) {
      let index = 0
      intervalRef.current = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(prev => prev + text[index])
          index++
        } else {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }
        }
      }, 30) // Зменшено інтервал з 50 до 30 мс для збільшення швидкості
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isFirstVisit, startAnimation])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
        <div className="relative w-full h-screen">
          <Image
            src="/smoke2.jpeg"
            alt="Smoke Background"
            fill
            priority
            className="object-cover"
            quality={100}
          />
        </div>
      </div>
      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto bg-black bg-opacity-70 p-8 rounded-lg"
        >
          <p className="font-mono text-sm md:text-base leading-relaxed text-gray-300 text-center" style={{ whiteSpace: 'pre-wrap' }}>
            {displayedText}
            <span className="inline-block w-2 h-4 bg-white animate-pulse">_</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

