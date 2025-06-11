'use client'

import { useState, useRef, useEffect } from 'react'
import { Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { Media } from './Media'

interface VideoAsset {
  id: string
  name: string
  url: string
  type: string
  resource: {
    id?: string
    url?: string
    mimeType?: string
    filename?: string
    [key: string]: unknown
  } // The original media resource from Payload CMS
}

interface WatchButtonProps {
  asset: VideoAsset
}

export function WatchButton({ asset }: WatchButtonProps) {
  const [open, setOpen] = useState(false)
  // isLoading state is used in the useEffect below
  const [_isLoading, setIsLoading] = useState(true)
  const videoPlayerRef = useRef<HTMLDivElement | null>(null)

  // Effect to handle video playback when dialog opens
  useEffect(() => {
    if (open && videoPlayerRef.current) {
      setIsLoading(true)

      // Short timeout to ensure DOM is ready
      const timer = setTimeout(() => {
        const videoElement = videoPlayerRef.current?.querySelector('video')
        if (videoElement) {
          // Add events for loading state
          const handleCanPlay = () => {
            setIsLoading(false)
          }

          videoElement.addEventListener('canplay', handleCanPlay)

          // Set a fallback timeout in case the canplay event doesn't fire
          const fallbackTimer = setTimeout(() => {
            setIsLoading(false)
          }, 3000)

          // Attempt to play
          const playPromise = videoElement.play()
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.error('Error auto-playing video:', error)
            })
          }

          return () => {
            videoElement.removeEventListener('canplay', handleCanPlay)
            clearTimeout(fallbackTimer)
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
        <DialogContent className="max-w-4xl p-0 bg-black">
          <DialogHeader className="p-4">
            <DialogTitle className="text-white">{asset.name}</DialogTitle>
          </DialogHeader>
          <div className="w-full" ref={videoPlayerRef}>
            <Media
              // @ts-expect-error Media component expects a different resource type
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
