'use client'

import React from 'react'
import { Download, File, FileText, ImageIcon, Video, Play } from 'lucide-react'
import type { DownloadBlock as DownloadBlockType } from '@/payload-types'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { WatchButton } from '@/components/WatchButton'

interface Asset {
  id: string
  name: string
  url: string
  type: string
  size?: string
}

interface VideoAsset {
  id: string
  name: string
  url: string
  type: string
  resource: any // The original media resource
}

export const DownloadBlock: React.FC<DownloadBlockType> = ({
  title,
  description,
  fileGroups,
  backgroundColor = 'default',
  layout = 'list',
}) => {
  const getBackgroundColor = () => {
    switch (backgroundColor) {
      case 'light':
        return 'bg-slate-100'
      case 'dark':
        return 'bg-slate-800 text-white'
      default:
        return 'bg-white'
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-5 h-5" />
      case 'video':
        return <Video className="w-5 h-5" />
      case 'application':
        if (type.includes('pdf')) {
          return <FileText className="w-5 h-5" />
        }
        return <File className="w-5 h-5" />
      default:
        return <File className="w-5 h-5" />
    }
  }

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'image':
        return 'bg-blue-600 text-white'
      case 'video':
        return 'bg-purple-600 text-white'
      case 'application':
        if (type.includes('pdf')) {
          return 'bg-red-600 text-white'
        }
        return 'bg-slate-600 text-white'
      default:
        return 'bg-slate-600 text-white'
    }
  }

  const handleDownload = async (asset: Asset, e: React.MouseEvent) => {
    e.preventDefault()

    if (!asset?.url) return

    toast.loading('Downloading...', { id: 'download-progress' })

    try {
      // Create an XMLHttpRequest to track download progress
      const xhr = new XMLHttpRequest()
      xhr.open('GET', asset.url, true)
      xhr.responseType = 'blob'

      xhr.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100)
          toast.loading(`Downloading: ${percentComplete}%`, { id: 'download-progress' })
        }
      }

      xhr.onload = function () {
        if (this.status === 200) {
          const blob = new Blob([this.response])
          const url = window.URL.createObjectURL(blob)

          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.download = asset.name

          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          window.URL.revokeObjectURL(url)

          toast.dismiss('download-progress')
          toast.success(`Downloaded ${asset.name}`, {
            description: 'File downloaded successfully',
          })
        } else {
          toast.dismiss('download-progress')
          toast.error(`Download failed (${this.status})`)
        }
      }

      xhr.onerror = function () {
        toast.dismiss('download-progress')
        toast.error('Network error during download')
      }

      xhr.send()
    } catch (error) {
      toast.dismiss('download-progress')
      toast.error('Download failed. Please try again.')
    }
  }

  return (
    <div className={`py-8 ${getBackgroundColor()}`}>
      <div className="container">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        {description && <p className="mb-6">{description}</p>}

        <div className="space-y-8">
          {(fileGroups || []).map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-4">
              <h3 className="text-xl font-medium border-b pb-2">{group.groupTitle}</h3>
              
              <div className={`${layout === 'grid' ? 'grid md:grid-cols-2 gap-4' : 'space-y-4'}`}>
                {(group.downloadableFiles || []).map((fileItem, i) => {
                  const fileObj = typeof fileItem.file === 'object' ? fileItem.file : null
                  if (!fileObj) return null

                  const mimeType = fileObj?.mimeType || ''
                  const fileName = fileObj?.filename || 'File'
                  const fileType = mimeType.split('/')[0] || 'unknown'

                  // Format file size
                  let formattedSize = ''
                  if (fileObj.filesize && typeof fileObj.filesize === 'number') {
                    const sizeInMB = fileObj.filesize / 1048576 // 1024 * 1024
                    formattedSize =
                      sizeInMB >= 1
                        ? `${sizeInMB.toFixed(2)} MB`
                        : `${Math.round(fileObj.filesize / 1024)} KB`
                  }

                  // Create asset object
                  const asset: Asset = {
                    id: fileObj.id || `file-${groupIndex}-${i}`,
                    name: fileObj.filename || fileItem.label || 'file',
                    url: fileObj.url || '',
                    type: fileType,
                    size: formattedSize,
                  }

                  return (
                    <Card key={`${groupIndex}-${i}`} className="overflow-hidden">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`${getFileTypeColor(fileType)} p-3 rounded-lg`}>
                            {getFileIcon(fileType)}
                          </div>
                          <div>
                            <h3 className="font-medium">{fileItem.label || fileName}</h3>
                            {formattedSize && <p className="text-sm text-gray-500">{formattedSize}</p>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {fileType === 'video' && (
                            <WatchButton
                              asset={{
                                id: fileObj.id || `video-${groupIndex}-${i}`,
                                name: fileObj.filename || fileItem.label || 'Video',
                                url: fileObj.url || '',
                                type: 'video',
                                resource: fileObj // Pass the original resource
                              }}
                            />
                          )}
                          <Button
                            onClick={(e) => handleDownload(asset, e)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
