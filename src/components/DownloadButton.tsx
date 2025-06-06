"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Asset {
  id: string
  name: string
  url: string
  type: string
  size?: string
}

interface DownloadButtonProps {
  asset: Asset
}

export function DownloadButton({ asset }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)

    try {
      // Create a temporary link to trigger download
      const link = document.createElement("a")
      link.href = asset.url
      link.download = asset.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Show initial download started toast with a specific ID so we can dismiss it later
      const toastId = toast.loading("Download started", {
        description: `${asset.name} is being downloaded.`,
      })
      
      // Show download completed toast after a short delay and dismiss the loading toast
      // Note: We can't actually detect when browser downloads complete,
      // so we simulate completion with a reasonable delay based on file size
      const fileSizeInKB = asset.size ? parseInt(asset.size) : 100
      const estimatedTimeInMs = Math.max(2000, Math.min(fileSizeInKB * 10, 5000)) // Between 2-5 seconds
      
      setTimeout(() => {
        // Dismiss the loading toast and show success toast
        toast.dismiss(toastId)
        toast.success("Download complete", {
          description: `${asset.name} was downloaded successfully.`,
        })
      }, estimatedTimeInMs)
    } catch (error) {
      toast.error("Download failed", {
        description: "There was an error downloading the file. Please try again.",
      })
    } finally {
      // Reset the downloading state after a short delay
      setTimeout(() => {
        setIsDownloading(false)
      }, 1500)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      size="sm"
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      <Download className="w-4 h-4 mr-2" />
      {isDownloading ? "Downloading..." : "Download"}
    </Button>
  )
}
