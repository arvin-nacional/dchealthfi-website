import React from 'react'

import type { Page } from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const MediumImpactHero: React.FC<Page['hero']> = ({ media, richText }) => {
  return (
    <div
      className="relative -mt-[6rem] flex items-center justify-center text-white"
      data-theme="dark"
    >
      <div className="container mb-8 z-10 relative flex items-center justify-center">
        <div className="text-center">
          <h1 className="max-sm:text-3xl text-6xl font-bold mb-6 mt-12">
            {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}
          </h1>
        </div>
      </div>
      <div className="min-h-[40vh] select-none">
        {media && typeof media === 'object' && (
          <Media fill imgClassName="-z-10 object-cover" priority resource={media} />
        )}
      </div>
    </div>
  )
}
