'use client'
import React from 'react'
import { Media } from '@/components/Media'
import type { PDFImagesBlock as PDFImagesBlockType } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { toast } from 'sonner'

export const PDFImagesBlock: React.FC<PDFImagesBlockType> = ({
  title,
  description,
  images,
  backgroundColor,
  columnsCount,
  pdfFile,
  showDownloadButton = true,
}) => {
  // Determine grid columns based on columnsCount
  const getGridCols = () => {
    switch (columnsCount) {
      case '1':
        return 'grid-cols-1'
      case '2':
        return 'grid-cols-1 md:grid-cols-2'
      case '4':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      case '3':
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }
  }

  // Get PDF file details
  const getPdfDetails = () => {
    if (!pdfFile) return null

    // Check if file object exists
    if (typeof pdfFile === 'object' && pdfFile.filename) {
      // Try to construct URL based on env variables or fall back to relative path
      let url = ''
      if (process.env.NEXT_PUBLIC_S3_URL) {
        url = `${process.env.NEXT_PUBLIC_S3_URL}${pdfFile.filename}`
      } else if (process.env.NEXT_PUBLIC_SERVER_URL) {
        url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/media/${pdfFile.id}`
      } else {
        // Last resort - try local media path
        url = `/api/media/${pdfFile.id}`
      }

      // Format file size if available
      let formattedSize = ''
      if (pdfFile.filesize && typeof pdfFile.filesize === 'number') {
        const sizeInMB = pdfFile.filesize / 1048576 // 1024 * 1024
        formattedSize =
          sizeInMB >= 1 ? `${sizeInMB.toFixed(2)} MB` : `${Math.round(pdfFile.filesize / 1024)} KB`
      }

      return {
        id: pdfFile.id || 'pdf-file',
        name: pdfFile.filename || 'document.pdf',
        url: url,
        size: formattedSize,
      }
    }
    return null
  }

  const pdfDetails = getPdfDetails()

  // Handle PDF download with progress tracking
  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (!pdfDetails?.url) return

    toast.loading('Downloading...', { id: 'pdf-download-progress' })

    try {
      // Create an XMLHttpRequest to track download progress
      const xhr = new XMLHttpRequest()
      xhr.open('GET', pdfDetails.url, true)
      xhr.responseType = 'blob'

      xhr.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100)
          toast.loading(`Downloading: ${percentComplete}%`, { id: 'pdf-download-progress' })
        }
      }

      xhr.onload = function () {
        if (this.status === 200) {
          const blob = new Blob([this.response])
          const url = window.URL.createObjectURL(blob)

          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.download = pdfDetails.name

          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          window.URL.revokeObjectURL(url)

          toast.dismiss('pdf-download-progress')
          toast.success(`Downloaded ${pdfDetails.name}`, {
            description: 'PDF downloaded successfully',
          })
        } else {
          toast.dismiss('pdf-download-progress')
          toast.error(`Download failed (${this.status})`)
        }
      }

      xhr.onerror = function () {
        toast.dismiss('pdf-download-progress')
        toast.error('Network error during download')
      }

      xhr.send()
    } catch (error) {
      toast.dismiss('pdf-download-progress')
      toast.error('Download failed. Please try again.')
    }
  }

  return (
    <div className={`py-12 ${backgroundColor || 'bg-white'}`}>
      <div className="container max-w-7xl mx-auto px-4">
        {/* Optional title and description section */}
        {(title || description) && (
          <div className="text-center mb-10">
            {title && (
              <div className="mb-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200">
                  {title}
                </h2>
                <div className="w-20 h-1 bg-red-700 mx-auto mt-4"></div>
              </div>
            )}

            {description && (
              <p className="text-lg text-gray-800 dark:text-gray-300 max-w-3xl mx-auto">
                {description}
              </p>
            )}

            {pdfDetails && showDownloadButton && (
              <Button
                onClick={handleDownload}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white w-auto"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
          </div>
        )}

        {/* Images grid */}
        {images && images.length > 0 ? (
          <div className={`grid ${getGridCols()} gap-6`}>
            {images.map((item, i) => (
              <div
                key={i}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] border border-gray-200 dark:border-gray-700 ${columnsCount === '1' ? 'max-w-6xl' : 'max-w-full'} mx-auto`}
              >
                <div>
                  <Media resource={item.image} className="max-w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>No images to display</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PDFImagesBlock
