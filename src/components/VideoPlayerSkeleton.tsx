'use client'

import { Play } from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoPlayerSkeletonProps {
  className?: string
  title?: string
}

export function VideoPlayerSkeleton({ className, title }: VideoPlayerSkeletonProps) {
  return (
    <div className={cn("relative w-full aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden", className)}>
      {/* YouTube-style gray loading lines */}
      <div className="absolute inset-0 flex flex-col justify-center items-center">
        {/* Animated thumbnail effect */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 flex items-center justify-center animate-pulse shadow-lg shadow-purple-500/30">
          <Play className="h-8 w-8 text-white ml-1" />
        </div>
        
        <div className="mt-4 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-md">
          <p className="text-white text-sm md:text-base font-medium">{title || 'Loading video...'}</p>
        </div>
        
        {/* Loading stripes like YouTube */}
        <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 via-purple-300 to-purple-500 animate-pulse" 
               style={{
                 width: '30%',
                 animation: 'slideRight 1.5s ease-in-out infinite',
                 backgroundSize: '200% 100%',
               }}>
          </div>
        </div>
      </div>
      
      {/* YouTube-style control bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="h-1.5 bg-gray-700/50 rounded-full w-full mb-4 overflow-hidden">
          <div className="h-full bg-purple-500 rounded-full w-0 animate-pulse"
               style={{
                 width: '15%',
                 animationDuration: '2s',
               }}>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-600/80 flex items-center justify-center animate-pulse">
              <Play className="h-4 w-4 text-white ml-0.5" />
            </div>
            <div className="w-20 h-5 bg-gray-700/50 rounded animate-pulse"></div>
          </div>
          <div className="w-8 h-8 bg-gray-700/50 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
