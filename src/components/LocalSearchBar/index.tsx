'use client'

import { Input } from '@/components/ui/input'

import React, { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils'
import { Search } from 'lucide-react'

interface CustomInputProps {
  route: string
  iconPosition: string
  placeholder: string
  otherClasses?: string
}

const LocalSearchbar = ({ route, iconPosition, placeholder, otherClasses }: CustomInputProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const query = searchParams.get('search')

  const [search, setSearch] = useState(query || '')

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'search',
          value: search,
        })

        router.push(newUrl, { scroll: false })
      } else {
        console.log(route, pathname)
        if (pathname === route) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ['search'],
          })

          router.push(newUrl, { scroll: false })
        }
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [search, route, pathname, router, searchParams, query])

  return (
    <div
      className={`bg-gray-200 flex min-h-[50px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses} mb-5 mx-5`}
    >
      {iconPosition === 'left' && <Search className="cursor-pointer w-5 h-5 text-blue-500" />}

      <Input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="paragraph-regular placeholder text-gray-600 border-none bg-transparent shadow-none outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-offset-0"
      />

      {iconPosition === 'right' && <Search className="cursor-pointer w-5 h-5" />}
    </div>
  )
}

export default LocalSearchbar
