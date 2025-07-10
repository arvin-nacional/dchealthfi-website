import React from 'react'

import { Media } from '@/components/Media'

import { AboutBlock as AboutBlockType } from '@/payload-types'

export const AboutBlock: React.FC<AboutBlockType> = ({
  heading,
  description,
  images,
  backgroundColor,
}) => {
  return (
    <div className={`py-16 ${backgroundColor || 'bg-slate-100'}`}>
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl text-gray-800 md:text-4xl font-bold mb-4">{heading}</h2>
          <div className="w-20 h-1 bg-red-700 mx-auto mb-6"></div>
          <p className="text-lg text-gray-800 dark:text-gray-300">{description}</p>
        </div>
        <div className="flex justify-center items-center">
          <div className="flex flex-wrap gap-12 items-center justify-center">
            {images.map((image, i: number) => (
              <div key={i} className="w-36">
                <Media
                  resource={image.image}
                  className="max-h-full max-w-full object-contain"
                  fill={false}
                  imgClassName="rounded-md"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
