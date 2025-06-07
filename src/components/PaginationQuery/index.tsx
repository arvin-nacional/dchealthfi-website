'use client'

import { Button } from '@/components/ui/button'
import { formUrlQuery } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'

interface Props {
  pageNumber: number
  isNext: boolean
  totalPages?: number
}

const PaginationQuery = ({ pageNumber, isNext, totalPages = 1 }: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleNavigation = (page: number) => {
    // Don't navigate if clicking current page
    if (page === pageNumber) return
    
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'page',
      value: page.toString(),
    })

    router.push(newUrl, { scroll: false })
  }

  if (totalPages <= 1) return null

  // Calculate which page numbers to show (max 3)
  const getVisiblePages = () => {
    // If we have 3 or fewer total pages, show all of them
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    
    // Otherwise, try to show current page with one on either side when possible
    if (pageNumber === 1) {
      return [1, 2, 3]
    } else if (pageNumber === totalPages) {
      return [totalPages - 2, totalPages - 1, totalPages]
    } else {
      return [pageNumber - 1, pageNumber, pageNumber + 1]
    }
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="flex w-full items-center justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        disabled={pageNumber === 1}
        onClick={() => handleNavigation(pageNumber - 1)}
        className="h-8 w-8"
      >
        <span className="sr-only">Previous page</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </Button>
      
      {visiblePages.map((page) => (
        <Button
          key={page}
          variant={page === pageNumber ? "default" : "outline"}
          size="icon"
          onClick={() => handleNavigation(page)}
          className="h-8 w-8"
        >
          {page}
        </Button>
      ))}
      
      <Button
        variant="outline"
        size="icon"
        disabled={!isNext}
        onClick={() => handleNavigation(pageNumber + 1)}
        className="h-8 w-8"
      >
        <span className="sr-only">Next page</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </Button>
    </div>
  )
}

export default PaginationQuery
