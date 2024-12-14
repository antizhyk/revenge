'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'

interface DescriptionItem {
  title: string
  description: string
  image: string
  width: number
  height: number
}

const descriptions: DescriptionItem[] = [
  {
    title: "ТАКТИЧНА ПЕРЕВАГА",
    description: "Наші оперативники володіють передовими тактичними навичками, що дозволяє нам ефективно виконувати найскладніші місії в будь-яких умовах.",
    image: "/saper.jpeg",
    width: 600,
    height: 400
  },
  {
    title: "ТЕХНОЛОГІЧНА ПЕРЕВАГА",
    description: "Ми використовуємо найсучасніше обладнання та технології, що дає нам значну перевагу на полі бою та під час розвідувальних операцій.",
    image: "/smoke.jpeg",
    width: 500,
    height: 500
  },
  {
    title: "ПІДГОТОВКА СВІТОВОГО РІВНЯ",
    description: "Кожен член нашого підрозділу проходить інтенсивну підготовку за міжнародними стандартами, що гарантує найвищий рівень професіоналізму.",
    image: "/smoke2.jpeg",
    width: 700,
    height: 350
  }
]

export default function DescriptionSection() {
  const [animatedItems, setAnimatedItems] = useState<number[]>([])

  const handleInView = (index: number, inView: boolean) => {
    if (inView && !animatedItems.includes(index)) {
      setAnimatedItems(prev => [...prev, index])
    }
  }

  return (
    <section className="py-12 md:py-20 bg-black">
      <div className="container mx-auto px-4">
        {descriptions.map((item, index) => {
          const [ref, inView] = useInView({
            triggerOnce: true,
            threshold: 0.1,
          })

          useEffect(() => {
            handleInView(index, inView)
          }, [inView])

          return (
            <motion.div
              key={index}
              ref={ref}
              initial={{ opacity: 0, y: 50 }}
              animate={animatedItems.includes(index) ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } items-center mb-12 md:mb-20 last:mb-0 gap-8 lg:gap-12`}
            >
              <div className="w-full lg:w-1/2">
                <div className="relative rounded-lg overflow-hidden" 
                     style={{ paddingBottom: `${(item.height / item.width) * 100}%` }}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
              <div className="w-full lg:w-1/2 px-0 md:px-6">
                <h3 className="text-xl md:text-2xl font-bold mb-4 font-mono text-white">{item.title}</h3>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed font-mono">{item.description}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

