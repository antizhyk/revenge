'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const images = [
  { src: '/gallery1.jpg', alt: 'Gallery Image 1' },
  { src: '/gallery2.jpg', alt: 'Gallery Image 2' },
  { src: '/gallery3.jpg', alt: 'Gallery Image 3' },
  { src: '/gallery4.jpg', alt: 'Gallery Image 4' },
  { src: '/gallery5.jpg', alt: 'Gallery Image 5' },
  { src: '/gallery6.jpg', alt: 'Gallery Image 6' },
]

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-12 text-center text-white"
        >
          ГАЛЕРЕЯ ОПЕРАЦІЙ
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative aspect-square cursor-pointer"
              onClick={() => setSelectedImage(image.src)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover rounded-lg"
              />
            </motion.div>
          ))}
        </div>
      </div>
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-4xl aspect-video">
            <Image
              src={selectedImage}
              alt="Selected Image"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </section>
  )
}

