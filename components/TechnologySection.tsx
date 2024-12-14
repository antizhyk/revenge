'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import VideoPlayer from './VideoPlayer'
import Link from 'next/link'
import Image from 'next/image'

interface TechnologyCardProps {
  title: string
  description: string
  videoSrc: string
  index: number
}

function TechnologyCard({ title, description, videoSrc, index }: TechnologyCardProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="w-full max-w-md"
    >
      <h3 className="font-mono text-white text-xl mb-4 tracking-wider">{title}</h3>
      <div className="relative aspect-video mb-4 overflow-hidden rounded-sm">
        <VideoPlayer
          src={videoSrc}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="font-mono text-sm text-gray-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}

export default function TechnologySection() {
  const technologies = [
    {
      title: "HYDROGEN",
      description: "Our next-gen water electrolysis and core-cycle grid system produce cheap and abundant hydrogen.",
      videoSrc: "/1.MP4"
    },
    {
      title: "INDUSTRIAL ELECTRIC",
      description: "Gigasites will be home to a wide variety of location agnostic industrial needs, diverging data centers, green steel, and sustainable polymers from the traditional grid model.",
      videoSrc: "/2.MP4"
    },
    {
      title: "SYNTHETIC FUEL",
      description: "Combining our green hydrogen with captured CO2 from coal/natural gas plants, DAC and other point capture sources, we create a wide spectrum of clean-tech solutions via a modified Fischer-Tropsch process.",
      videoSrc: "/3.MP4"
    }
  ]

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="bg-black py-24 relative">
      <div className="hidden lg:block absolute right-0 top-0 w-1/3 h-full">
        <Image
          src="/person.jpeg"
          alt="Background Person"
          fill
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="lg:w-2/3">
          <div className="grid gap-16 md:gap-24">
            {technologies.map((tech, index) => (
              <TechnologyCard
                key={tech.title}
                {...tech}
                index={index}
              />
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-16"
          >
            <Link 
              href="https://t.me/revengegroup" 
              target="_blank"
              className="inline-flex items-center font-mono text-gray-400 hover:text-white transition-colors duration-300"
            >
              Більше відео у нашому телеграм каналі
              <svg 
                className="ml-2 w-5 h-5" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.858-.921 3.935-1.302 5.222-.16.537-.262.941-.492 1.246-.23.306-.458.35-.718.367-.615.04-1.08-.404-1.674-.793-.93-.619-1.457-.999-2.356-1.604-1.043-.703-.367-1.089.227-1.719.156-.164 2.864-2.725 2.915-2.959.007-.029.012-.138-.051-.195-.062-.058-.154-.038-.22-.022-.092.022-1.565 1.033-4.417 3.033-.418.299-.798.445-1.139.436-.375-.01-1.096-.221-1.631-.402-.659-.223-1.184-.341-1.138-.723.024-.2.285-.407.783-.622 3.068-1.384 5.115-2.301 6.142-2.75 2.925-1.29 3.532-1.514 3.927-1.521.087-.002.283.02.41.121.106.084.136.197.142.291.015.265-.023.773-.202 1.594z"/>
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

