'use client'

import { cn } from '@/utilities/ui'
import { formUrlQuery } from '@/lib/utils'

import { useRouter, useSearchParams } from 'next/navigation'
import { Category } from '@/payload-types'
import { Button } from '../ui/button'
interface FilterProps {
  categories: Category[]
}

const Filters: React.FC<FilterProps> = ({ categories }) => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const handleUpdateParams = (value: string) => {
    const newUrl: string = formUrlQuery({
      params: searchParams.toString(),
      key: 'category',
      value,
    })

    router.push(newUrl, { scroll: false })
  }

  const clearCategoryFilter = () => {
    const newUrl: string = formUrlQuery({
      params: searchParams.toString(),
      key: 'category',
      value: '',
    })

    router.push(newUrl, { scroll: false })
  }

  return (
    <div className="flex justify-center gap-2 mb-12">
      <Button
        className={cn(
          'transition-all duration-150 hover:bg-blue-600 hover:text-white text-white',
          !searchParams.get('category') ? 'bg-blue-600' : ''
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
              'transition-all duration-150 hover:bg-blue-600 hover:text-white text-white ' +
                (searchParams.get('category') === category.title ? 'bg-blue-600' : ''),
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
