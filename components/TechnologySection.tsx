'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import VideoPlayer from './VideoPlayer'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef } from 'react'

interface TechnologyCardProps {
  title: string
  description: string
  videoSrc: string
  index: number
}

function TechnologyCard({ title, description, videoSrc, index }: TechnologyCardProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
        setIsPlaying(true)
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="w-full max-w-md"
    >
      <h3 className="font-mono text-white text-xl mb-4 tracking-wider uppercase">{title}</h3>
      <div className="relative aspect-video mb-4 overflow-hidden rounded-sm cursor-pointer" onClick={handleVideoClick}>
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
        {!isPlaying && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white text-4xl">▶</span>
          </div>
        )}
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
      title: "Злагоджена підготовка – гарантований результат",
      description: "Підготовка, налаштування та точність забезпечують ефективне виявлення та ліквідацію ворога.",
      videoSrc: "/1.MP4"
    },
    {
      title: "Точність у кожному русі: нейтралізація ворога",
      description: "Ми завжд на крок попереду. Кожен крок підготовки, кожен удар – це результат високої майстерності та стратегічного підходу. ",
      videoSrc: "/2.mp4"
    },
    {
      title: "Відсіч ворогу",
      description: "Кожен удар – це відповідь на агресію. Ворог не уникне покарання за свої злочини. Ми забезпечуємо справедливу відсіч, гарантуючи, що кожен напад матиме свої наслідки.",
      videoSrc: "/3.mp4"
    }
  ]

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="bg-black py-24 relative" id='our-works'>
      <div className="hidden lg:block absolute left-[30%] top-0 right-0 h-full">
        <Image
          src="/big_logo.jpg"
          alt="Background Person"
          fill
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
      </div>

      <div className="max-w-[1080px] mx-auto px-4 relative">
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

