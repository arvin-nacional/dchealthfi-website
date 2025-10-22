'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { useLanguage } from '@/providers/Language'
import { useTranslation } from '@/lib/translations'

// Dynamically import the heavy LocalSearchbar component to reduce initial bundle
const LocalSearchbar = dynamic(() => import('@/components/LocalSearchBar'), {
  loading: () => (
    <div className="w-full flex justify-center items-center">
      <div className="max-w-[650px] mb-8 h-12 bg-gray-100 rounded-md animate-pulse" />
    </div>
  ),
  ssr: false, // Disable SSR for this component to reduce hydration mismatch
})

export function FlyersSearchBar() {
  const { locale } = useLanguage()
  const { t } = useTranslation(locale)

  return (
    <div className="w-full flex justify-center items-center">
      <LocalSearchbar
        route="/flyers"
        iconPosition="left"
        placeholder={t('search') + ' flyers...'}
        otherClasses="max-w-[650px] mb-8"
      />
    </div>
  )
}
