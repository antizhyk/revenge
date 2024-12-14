'use client'

import { useState, useRef } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Play, Pause, Maximize } from 'lucide-react'

interface VideoPlayerProps {
  src: string
  className?: string
}

export default function VideoPlayer({ src, className }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="relative group">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className={`${className} cursor-pointer`}
        onClick={togglePlay}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="bg-black/50 hover:bg-black/70"
          onClick={togglePlay}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-black/50 hover:bg-black/70"
          onClick={() => setIsModalOpen(true)}
        >
          <Maximize size={16} />
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl w-[90vw] p-0 bg-black">
          <div className="relative aspect-video">
            <video
              controls
              className="w-full h-full"
              autoPlay
              src={src}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 