import React from 'react'
import { Media } from '@/components/Media'
import type { PDFImagesBlock as PDFImagesBlockType } from '@/payload-types'

export const PDFImagesBlock: React.FC<PDFImagesBlockType> = ({
  title,
  description,
  images,
  backgroundColor,
  columnsCount,
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

        {/* Images grid */}
        {images && images.length > 0 ? (
          <div className={`grid ${getGridCols()} gap-6`}>
            {images.map((item, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] border border-gray-200 dark:border-gray-700"
              >
                <div>
                  <Media resource={item.image} className="max-w-full" />
                </div>
                {item.caption && (
                  <div className="p-4">
                    <p className="text-gray-800 dark:text-gray-200">{item.caption}</p>
                  </div>
                )}
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
