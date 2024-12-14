'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function MissionSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section id="місія" ref={ref} className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <motion.h2
          variants={variants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-8 text-center text-white"
        >
          Наша Місія
        </motion.h2>
        <motion.div
          variants={variants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-xl mb-6 text-gray-300">
            Revenge Group присвячена захисту суверенітету та територіальної цілісності України. 
            Ми стоїмо як оплот проти агресії, використовуючи передову тактику та непохитну 
            рішучість для захисту нашої нації та її народу.
          </p>
          <p className="text-xl text-gray-300">
            Наша місія виходить за рамки простого захисту – ми прагнемо надихати надію, 
            виховувати стійкість та прокладати шлях до вільної та процвітаючої України. 
            Кожна операція, кожна стратегія і кожна жертва здійснюється з цим баченням.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

