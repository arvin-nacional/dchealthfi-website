'use client'

import { cn } from '@/utilities/ui'
import { formUrlQuery } from '@/lib/utils'

import { useRouter, useSearchParams } from 'next/navigation'
import { Category } from '@/payload-types'
import { Button } from '../ui/button'
import { useState, useEffect } from 'react'
interface FilterProps {
  categories: Category[]
}

const Filters: React.FC<FilterProps> = ({ categories }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  // Add state for active category for optimistic UI updates
  const [activeCategory, setActiveCategory] = useState<string | null>(searchParams.get('category'))

  // Initialize the active category from URL params
  useEffect(() => {
    setActiveCategory(searchParams.get('category'))
  }, [searchParams])

  const handleUpdateParams = (value: string) => {
    // Update local state immediately for optimistic UI
    setActiveCategory(value)

    // Then update the URL
    const newUrl: string = formUrlQuery({
      params: searchParams.toString(),
      key: 'category',
      value,
    })

    router.push(newUrl, { scroll: false })
  }

  const clearCategoryFilter = () => {
    // Update local state immediately for optimistic UI
    setActiveCategory(null)

    // Then update the URL
    const newUrl: string = formUrlQuery({
      params: searchParams.toString(),
      key: 'category',
      value: '',
    })

    router.push(newUrl, { scroll: false })
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
