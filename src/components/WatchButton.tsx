'use client'

import { useState, useRef, useEffect } from 'react'
import { Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Media } from './Media'

interface VideoAsset {
  id: string
  name: string
  url: string
  type: string
  resource: any // The original media resource from Payload CMS
}

interface WatchButtonProps {
  asset: VideoAsset
}

export function WatchButton({ asset }: WatchButtonProps) {
  const [open, setOpen] = useState(false)
  const videoPlayerRef = useRef<HTMLDivElement | null>(null)

  // Effect to handle video playback when dialog opens
  useEffect(() => {
    if (open && videoPlayerRef.current) {
      // Short timeout to ensure DOM is ready
      const timer = setTimeout(() => {
        const videoElement = videoPlayerRef.current?.querySelector('video')
        if (videoElement) {
          const playPromise = videoElement.play()
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.error('Error auto-playing video:', error)
            })
          }
        }
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [open])

  const handleWatch = () => {
    setOpen(true)
  }

  return (
    <>
      <Button
        onClick={handleWatch}
        size="sm"
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        <Play className="w-4 h-4 mr-2" />
        Watch Video
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black">
          <DialogHeader className="p-4">
            <DialogTitle className="text-white">{asset.name}</DialogTitle>
          </DialogHeader>
          <div className="w-full" ref={videoPlayerRef}>
            <Media
              resource={asset.resource}
              size="full"
              className="w-full h-auto rounded-lg overflow-hidden"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
