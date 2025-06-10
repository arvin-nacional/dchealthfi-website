'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'
import { DownloadButton } from '@/components/DownloadButton'
import { WatchButton } from '@/components/WatchButton'

const PageClient: React.FC = () => {
  /* Always set the header theme to light mode */
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])
  return <React.Fragment />
}

interface DownloadButtonWrapperProps {
  fileObj: {
    id?: string
    url?: string | null
    mimeType?: string | null
    filename?: string | null
    filesize?: number | null
  } | null
  label?: string
}

export function DownloadButtonWrapper({ fileObj, label }: DownloadButtonWrapperProps) {
  // Handle null/undefined fileObj or missing URL
  if (!fileObj || !fileObj.url) return null

  // Safely extract file type from mimeType if available
  let fileType = 'unknown'
  if (fileObj.mimeType && typeof fileObj.mimeType === 'string') {
    fileType = fileObj.mimeType.split('/')[0] || 'unknown'
  }

  // Safely format file size if available
  let formattedSize = ''
  if (fileObj.filesize && typeof fileObj.filesize === 'number') {
    formattedSize = `${Math.round(fileObj.filesize / 1024)} KB`
  }

  // Create asset with fallbacks for all properties
  const asset = {
    id: fileObj.id || 'file-id',
    name: fileObj.filename || label || 'file',
    url: fileObj.url,
    type: fileType,
    size: formattedSize,
  }

  return <DownloadButton asset={asset} />
}

interface WatchButtonWrapperProps {
  fileObj: {
    id?: string
    url?: string | null
    mimeType?: string | null
    filename?: string | null
    filesize?: number | null
  } | null
  label?: string
}

export function WatchButtonWrapper({ fileObj, label }: WatchButtonWrapperProps) {
  // Handle null/undefined fileObj or missing URL
  if (!fileObj || !fileObj.url) return null

  // Check if this is a video file
  const isVideo =
    fileObj.mimeType && typeof fileObj.mimeType === 'string' && fileObj.mimeType.includes('video')
  if (!isVideo) return null

  // Create video asset for the watch button
  const videoAsset = {
    id: fileObj.id || 'video-id',
    name: fileObj.filename || label || 'Video',
    url: fileObj.url,
    type: 'video',
    resource: fileObj, // Pass the original resource to the VideoPlayer
  }
  // @ts-ignore
  return <WatchButton asset={videoAsset} />
}

export default PageClient
