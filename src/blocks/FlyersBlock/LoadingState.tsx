'use client'

import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export function FlyersLoadingState() {
  return (
    <div className="container grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4 content-center">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex flex-col space-y-3">
          <Skeleton className="h-[180px] w-full rounded-md" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  )
}
