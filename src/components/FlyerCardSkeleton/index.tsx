'use client'

import { Skeleton } from "@/components/ui/skeleton"

export default function FlyerCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-background shadow">
      {/* Image skeleton */}
      <Skeleton className="aspect-[3/2] w-full" />
      
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title skeleton */}
        <Skeleton className="h-6 w-3/4" />
        
        {/* Category skeleton */}
        <Skeleton className="h-4 w-1/3" />

        {/* Button skeleton */}
        <div className="pt-2">
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
      </div>
    </div>
  )
}
