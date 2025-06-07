'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import FlyerCardSkeleton from '@/components/FlyerCardSkeleton'

interface ClientWrapperProps {
  children: React.ReactNode
  limit?: number
}

export default function FlyersBlockClientWrapper({ children, limit = 12 }: ClientWrapperProps) {
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  
  // Track page, category or search changes to show loading state
  const page = searchParams.get('page')
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  
  useEffect(() => {
    setIsLoading(true)
    
    // Simulate a small delay to show the loading state
    // In real-world, this would be replaced by actual data fetching
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 600)
    
    return () => clearTimeout(timer)
  }, [page, category, search])
  
  // Number of skeleton cards to show during loading - use the provided limit
  const skeletonCount = limit
  
  if (isLoading) {
    return (
      <div className="container grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4 content-center">
        {Array(skeletonCount).fill(0).map((_, index) => (
          <FlyerCardSkeleton key={index} />
        ))}
      </div>
    )
  }
  
  return <>{children}</>
}
