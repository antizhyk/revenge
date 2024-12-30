'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Parallax } from 'react-scroll-parallax'
import Image from 'next/image'

export default function HeroSection() {
  const [displayedText, setDisplayedText] = useState('')
  const [startAnimation, setStartAnimation] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const text = "ТЕХНОЛОГІЧНА МОГУТНІСТЬ ЗАХИСТУ УКРАЇНИ – ВЗВОД УДАРНИХ БПЛА, ЩО ПОЄДНУЄ ТОЧНІСТЬ, ШВИДКІСТЬ І ВІДДАНІСТЬ ДЛЯ ПЕРЕМОГИ НА ФРОНТІ."
  useEffect(() => {
    const timer = setTimeout(() => setStartAnimation(true), 500)

    return () => {
      clearTimeout(timer)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (startAnimation) {
      let index = 0
      intervalRef.current = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(prev => prev + text[index - 1])
          index++
        } else {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }
        }
      }, 50)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [startAnimation])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <Parallax speed={-20} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10"></div>
        <div className="relative w-full h-screen">
          <Image
            src="/revenge.jpeg"
            alt="Revenge Background"
            fill
            priority
            className="object-cover opacity-30"
            quality={100}
          />
        </div>
      </Parallax>
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex items-center justify-center space-x-2 mb-8"
          >
            <span className="w-8 h-px bg-gray-500"></span>
            <span className="font-mono text-gray-500">СМЕРТЬ З НЕБА</span>
            {/* <span className="w-2 h-2 bg-gray-500"></span>
            <span className="font-mono text-gray-500">STRENGTH</span> */}
            <span className="w-8 h-px bg-gray-500"></span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-4xl md:text-6xl font-mono text-center mb-8"
          >
            REVENGE GROUP
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="font-mono text-sm md:text-base text-gray-400 text-center max-w-2xl mx-auto leading-relaxed"
          >
            {displayedText}
            <span className="inline-block w-2 h-4 bg-white animate-pulse">_</span>
          </motion.p>
        </div>
      </div>
    </section>
  )
}

