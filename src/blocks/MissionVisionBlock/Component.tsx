import React from 'react'
import { Lightbulb, Target } from 'lucide-react'

import type { MissionVisionBlock as MissionVisionBlockType } from '@/payload-types'
import { Media } from '@/components/Media'

export const MissionVisionBlock: React.FC<MissionVisionBlockType> = ({
  heading,
  description,
  missionHeading,
  missionContent,
  visionHeading,
  visionContent,
  media,
  backgroundColor,
}) => {
  console.log(media)
  return (
    <section className={`py-20 ${backgroundColor || 'bg-slate-50'}`}>
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
          <div className="w-20 h-1 bg-red-700 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">{description}</p>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 relative" style={{ minHeight: '300px' }}>
            <Media resource={media} imgClassName="object-cover rounded-lg" priority fill />
          </div>

          <div className="flex-1 flex flex-col gap-8">
            <div className=" bg-white p-8 rounded-lg border border-red-100 hover:shadow-lg transition-all duration-300">
              <Target className="h-12 w-12 text-red-700 mb-6" />
              <h2 className="text-2xl font-bold mb-4">{missionHeading}</h2>
              <div className="w-20 h-1 bg-red-700 mb-6"></div>
              <p className="text-gray-600 dark:text-gray-300">{missionContent}</p>
            </div>
            <div className=" bg-white p-8 rounded-lg border border-red-100 hover:shadow-lg transition-all duration-300">
              <Lightbulb className="h-12 w-12 text-red-700 mb-6" />

              <h2 className="text-2xl font-bold mb-4">{visionHeading}</h2>
              <div className="w-20 h-1 bg-red-700 mb-6"></div>
              <p className="text-gray-600 dark:text-gray-300">{visionContent}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
