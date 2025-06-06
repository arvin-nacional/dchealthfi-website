"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Maximize, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Media } from "@/components/Media"
import { cn } from "@/lib/utils"

interface VideoPlayerProps {
  resource: any
  className?: string
}

export function VideoPlayer({ resource, className }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const [isMuted, setIsMuted] = useState(false)

  // Handle getting reference to the video element rendered by Media
  useEffect(() => {
    if (containerRef.current) {
      const videoElement = containerRef.current.querySelector('video')
      if (videoElement) {
        videoRef.current = videoElement
        
        // Override autoplay and controls from Media component settings
        videoElement.autoplay = false
        videoElement.loop = false
        videoElement.muted = isMuted
        videoElement.controls = false
        
        // Add event listeners for time and duration
        videoElement.addEventListener('loadedmetadata', () => {
          setDuration(videoElement.duration)
        })
        
        videoElement.addEventListener('timeupdate', () => {
          setCurrentTime(videoElement.currentTime)
        })
        
        videoElement.addEventListener('play', () => {
          setIsPlaying(true)
        })
        
        videoElement.addEventListener('pause', () => {
          setIsPlaying(false)
        })

        videoElement.addEventListener('volumechange', () => {
          setIsMuted(videoElement.muted)
        })
      }
    }
  }, [isMuted])

  // Play/pause toggle
  const togglePlayPause = () => {
    if (!videoRef.current) return
    
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
  }
  
  // Toggle mute state
  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setIsMuted(!isMuted)
  }
  
  // Handle seeking to a specific position in the video
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || duration === 0) return
    
    const progressBar = e.currentTarget
    const rect = progressBar.getBoundingClientRect()
    const clickPosition = (e.clientX - rect.left) / rect.width
    const seekTime = clickPosition * duration
    
    videoRef.current.currentTime = seekTime
    setCurrentTime(seekTime)
  }
  
  // Format time display
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }
  
  // Enter fullscreen
  const enterFullscreen = () => {
    if (!videoRef.current) return
    
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen()
    }
  }

  return (
    <div className="relative w-full h-full" ref={containerRef}>
      {/* Use the existing Media component to render the video */}
      <Media 
        resource={resource}
        className="w-full h-full"
      />
      
      {/* Custom video controls overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        {/* Progress bar - now clickable for seeking */}
        <div 
          className="relative w-full h-2 bg-gray-500/50 mb-3 rounded cursor-pointer"
          onClick={handleSeek}
        >
          <div
            className="absolute top-0 left-0 h-full bg-primary rounded"
            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
          />
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
              onClick={togglePlayPause}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
              onClick={toggleMute}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </Button>
            
            <span className="text-white text-xs">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
            onClick={enterFullscreen}
            title="Fullscreen"
          >
            <Maximize size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}
