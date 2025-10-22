'use client'

import { cn } from '@/utilities/ui'
import { formUrlQuery } from '@/lib/utils'

import { useRouter, useSearchParams } from 'next/navigation'
import { Category } from '@/payload-types'
import { Button } from '../ui/button'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useLanguage } from '@/providers/Language'
import { useTranslation } from '@/lib/translations'

interface FilterProps {
  categories: Category[]
}

const Filters: React.FC<FilterProps> = ({ categories }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { locale } = useLanguage()
  const { t } = useTranslation(locale)

  // Function to translate category names
  const translateCategoryName = (categoryTitle: string) => {
    // Convert category title to lowercase and remove spaces and hyphens for translation key
    const key = categoryTitle
      .toLowerCase()
      .replace(/[\s-]+/g, '') as keyof typeof import('@/lib/translations').translations.en

    // Try to get translation, fallback to original title if not found
    const translated = t(key)
    return translated !== key ? translated : categoryTitle
  }

  // Memoize the active category to prevent unnecessary re-renders
  const activeCategory = useMemo(() => searchParams.get('category'), [searchParams])

  // Use useCallback to prevent function recreation on every render
  const handleUpdateParams = useCallback(
    (value: string) => {
      const newUrl: string = formUrlQuery({
        params: searchParams.toString(),
        key: 'category',
        value,
      })

      router.push(newUrl, { scroll: false })
    },
    [searchParams, router],
  )

  const clearCategoryFilter = useCallback(() => {
    const newUrl: string = formUrlQuery({
      params: searchParams.toString(),
      key: 'category',
      value: '',
    })

    router.push(newUrl, { scroll: false })
  }, [searchParams, router])

  // Early return if no categories to prevent unnecessary rendering
  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <div className="flex justify-center gap-2 mb-12 w-full flex-wrap">
      <Button
        className={cn(
          'transition-all duration-150 bg-gray-200 hover:bg-blue-600 hover:text-white text-gray-700',
          !activeCategory ? 'bg-blue-600 text-white' : '',
        )}
        onClick={clearCategoryFilter}
      >
        {t('allCategories')}
      </Button>
      {categories.map((category) => {
        return (
          <Button
            key={category.id}
            className={cn(
              'transition-all duration-150 bg-gray-200 hover:bg-blue-600 hover:text-white text-gray-700',
              activeCategory === category.title ? 'bg-blue-600 text-white' : '',
            )}
            onClick={() => handleUpdateParams(category.title)}
          >
            {translateCategoryName(category.title)}
          </Button>
        )
      })}
    </div>
  )
}

export default Filters
