import React from 'react'
import { Award, Shield, Lightbulb, Users, Clock } from 'lucide-react'

import type { AdvantagesBlock as AdvantagesBlockType } from '@/payload-types'

export const AdvantagesBlock: React.FC<AdvantagesBlockType> = ({
  heading,
  description,
  advantages,
}) => {
  // Function to render the correct icon based on the value type
  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case 'award':
        return <Award className="h-12 w-12 text-red-700" />
      case 'shield':
        return <Shield className="h-12 w-12 text-red-700" />
      case 'lightbulb':
        return <Lightbulb className="h-12 w-12 text-red-700" />
      case 'users':
        return <Users className="h-12 w-12 text-red-700" />
      case 'clock':
        return <Clock className="h-12 w-12 text-red-700" />
      case 'chart':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-red-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        )
      default:
        return <Award className="h-12 w-12 text-red-700" />
    }
  }

  return (
    <section className="py-20 dark:bg-[#0a1a3a] bg-slate-100">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
          <div className="w-20 h-1 bg-red-700 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">{description}</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {advantages?.map((advantage, index) => (
            <div
              key={index}
              className="dark:bg-[#0c2252] bg-white p-8 rounded-xl hover:shadow-lg transition-all duration-300 border border-red-100 flex flex-col items-center"
            >
              {renderIcon(advantage.icon)}

              <h3 className="text-xl font-bold mb-3 mt-4 text-gray-800">{advantage.title}</h3>
              <p className="text-gray-600 text-center">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
