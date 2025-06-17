import React from 'react'

import { Media } from '@/components/Media'
import type { TitleBlock as TitleBlockType } from '@/payload-types'

export const TitleBlock: React.FC<TitleBlockType> = ({
  heading,
  description,
  media,
  backgroundColor,
}) => {
  return (
    <div className={`py-20 ${backgroundColor || 'bg-slate-50'}`}>
      <div className="max-w-3xl mx-auto text-center mb-16">
        {media && (
          <div className="w-36 mx-auto mb-6">
            <Media resource={media} className="max-h-full max-w-full object-contain" fill={false} />
          </div>
        )}

        <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
        <div className="w-20 h-1 bg-red-700 mx-auto mb-6"></div>
        <p className="text-lg text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </div>
  )
}
