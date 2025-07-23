'use client'
import React, { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import type { PDFImagesBlock as PDFImagesBlockType } from '@/payload-types'
import { Button } from '@/components/ui/button'

// Set the worker source for react-pdf
// This is required for react-pdf to work correctly
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

export const PDFImagesBlock: React.FC<PDFImagesBlockType> = ({
  title,
  description,
  pdfFile,
  backgroundColor,
  showDownloadButton,
}) => {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState<number>(1)

  // Function to handle successful document loading
  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setPageNumber(1)
  }

  // Functions to navigate between pages
  function goToPrevPage() {
    setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1)
  }

  function goToNextPage() {
    setPageNumber(pageNumber + 1 >= (numPages || 1) ? numPages || 1 : pageNumber + 1)
  }

  // Get the PDF URL from the media object
  const getPdfUrl = () => {
    if (!pdfFile) return null

    // Check if filename exists
    if (typeof pdfFile === 'object' && pdfFile.filename) {
      // Try to construct URL based on env variables or fall back to relative path
      if (process.env.NEXT_PUBLIC_S3_URL) {
        return `${process.env.NEXT_PUBLIC_S3_URL}${pdfFile.filename}`
      } else if (process.env.NEXT_PUBLIC_SERVER_URL) {
        return `${process.env.NEXT_PUBLIC_SERVER_URL}/api/media/${pdfFile.id}`
      } else {
        // Last resort - try local media path
        return `/api/media/${pdfFile.id}`
      }
    }
    return null
  }

  const pdfUrl = getPdfUrl()

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
          </div>
        )}

        {/* PDF Viewer */}
        {pdfUrl ? (
          <div className="flex flex-col items-center">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 max-w-4xl w-full">
              {/* PDF Document */}
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                error={
                  <p className="text-center text-red-600 py-10">
                    Error loading PDF. Please try again.
                  </p>
                }
                loading={<p className="text-center py-10">Loading PDF...</p>}
                className="flex justify-center"
              >
                <Page
                  pageNumber={pageNumber}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-md"
                  scale={1.2}
                />
              </Document>

              {/* Navigation controls */}
              <div className="flex justify-between items-center mt-4">
                <Button
                  onClick={goToPrevPage}
                  disabled={pageNumber <= 1}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>

                <p className="text-sm text-center">
                  Page {pageNumber} of {numPages || '--'}
                </p>

                <Button
                  onClick={goToNextPage}
                  disabled={pageNumber >= (numPages || 0)}
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
              </div>

              {/* Download button */}
              {showDownloadButton && (
                <div className="mt-4 flex justify-center">
                  <a
                    href={pdfUrl}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <span>Download PDF</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>No PDF file to display</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PDFImagesBlock
