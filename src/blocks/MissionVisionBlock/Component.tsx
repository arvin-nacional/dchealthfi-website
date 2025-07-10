import React from 'react'
import { Lightbulb, Target } from 'lucide-react'

import type { MissionVisionBlock as MissionVisionBlockType } from '@/payload-types'

export const MissionVisionBlock: React.FC<MissionVisionBlockType> = ({
  heading,
  description,
  missionHeading,
  missionContent,
  visionHeading,
  visionContent,

  backgroundColor,
}) => {
  return (
    <section className={`py-20 ${backgroundColor || 'bg-slate-50'}`}>
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl text-gray-800 md:text-4xl font-bold mb-4">{heading}</h2>
          <div className="w-20 h-1 bg-red-700 mx-auto mb-6"></div>
          <p className="text-lg text-gray-800 dark:text-gray-300">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className=" bg-white p-8 rounded-lg border border-red-100 hover:shadow-lg transition-all duration-300">
            <Target className="h-12 w-12 text-red-700 mb-6" />
            <h2 className="text-2xl text-gray-800 md:text-4xl font-bold mb-4">{missionHeading}</h2>
            <div className="w-20 h-1 bg-red-700 mb-6"></div>
            <p className="text-gray-800 dark:text-gray-300">{missionContent}</p>
          </div>
          <div className=" bg-white p-8 rounded-lg border border-red-100 hover:shadow-lg transition-all duration-300">
            <Lightbulb className="h-12 w-12 text-red-700 mb-6" />

            <h2 className="text-2xl text-gray-800 md:text-4xl font-bold mb-4">{visionHeading}</h2>
            <div className="w-20 h-1 bg-red-700 mb-6"></div>
            <p className="text-gray-800 dark:text-gray-300">{visionContent}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
