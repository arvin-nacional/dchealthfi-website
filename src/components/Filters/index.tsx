'use client'

import { cn } from '@/utilities/ui'
import { formUrlQuery } from '@/lib/utils'

import { useRouter, useSearchParams } from 'next/navigation'
import { Category } from '@/payload-types'
import { Button } from '../ui/button'
import { useState, useEffect, useCallback, useMemo } from 'react'

interface FilterProps {
  categories: Category[]
}

const Filters: React.FC<FilterProps> = ({ categories }) => {
  const searchParams = useSearchParams()
  const router = useRouter()

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
        All
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
            {category.title}
          </Button>
        )
      })}
    </div>
  )
}

export default Filters
