'use client'

import { cn } from '@/utilities/ui'
import React, { useEffect, useRef } from 'react'

import type { Props as MediaProps } from '../types'

import { getMediaUrl } from '@/utilities/getMediaUrl'

export const VideoMedia: React.FC<MediaProps> = (props) => {
  const { onClick, resource, videoClassName } = props

  const videoRef = useRef<HTMLVideoElement>(null)
  // const [showFallback] = useState<boolean>()

  useEffect(() => {
    const { current: video } = videoRef
    if (video) {
      video.addEventListener('suspend', () => {
        // setShowFallback(true);
        // console.warn('Video was suspended, rendering fallback image.')
      })
    }
  }, [])

  if (resource && typeof resource === 'object') {
    // Use the full URL provided by the resource object
    // With S3 storage, resource.url will contain the full S3 URL
    const videoUrl = resource.url || ''

    return (
      <video
        className={cn('w-full h-auto', videoClassName)}
        controls={true}
        loop
        muted={false}
        onClick={onClick}
        playsInline
        ref={videoRef}
      >
        <source src={getMediaUrl(videoUrl)} />
      </video>
    )
  }

  return null
}
