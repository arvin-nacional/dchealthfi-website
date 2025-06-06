"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { VideoPlayer } from "./VideoPlayer"

interface VideoAsset {
  id: string
  name: string
  url: string
  type: string
  resource: any // The original media resource from Payload CMS
}

interface WatchButtonProps {
  asset: VideoAsset
}

export function WatchButton({ asset }: WatchButtonProps) {
  const [open, setOpen] = useState(false)

  const handleWatch = () => {
    setOpen(true)
    toast.info("Opening video", {
      description: `Now playing: ${asset.name}`,
    })
  }

  return (
    <>
      <Button
        onClick={handleWatch}
        size="sm"
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        <Play className="w-4 h-4 mr-2" />
        Watch Video
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black">
          <DialogHeader className="p-4">
            <DialogTitle className="text-white">{asset.name}</DialogTitle>
            <DialogDescription className="text-gray-300">
              Video preview
            </DialogDescription>
          </DialogHeader>
          <div className="w-full">
            <VideoPlayer resource={asset.resource} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
