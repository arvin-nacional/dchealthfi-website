'use client'

import React from 'react'
import LocalSearchbar from '@/components/LocalSearchBar'

export function FlyersSearchBar() {
  return (
    <div className="w-full flex justify-center items-center">
      <LocalSearchbar
        route="/products"
        iconPosition="left"
        placeholder="Search products..."
        otherClasses="max-w-[650px] mb-8"
      />
    </div>
  )
}
