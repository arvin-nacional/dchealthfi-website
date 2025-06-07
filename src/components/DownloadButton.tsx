"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
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
  
  const handleDownload = async (e: React.MouseEvent) => {
    // Prevent default navigation
    e.preventDefault()
    
    if (!asset?.url) return
    
    setIsDownloading(true)
    
    try {
      // Direct XHR approach to download without page navigation
      const xhr = new XMLHttpRequest();
      xhr.open('GET', asset.url, true);
      xhr.responseType = 'blob';
      
      xhr.onload = function() {
        if (this.status === 200) {
          // Create a blob URL from the response
          const blob = new Blob([this.response]);
          const url = window.URL.createObjectURL(blob);
          
          // Create a temporary link and trigger download
          const link = document.createElement('a');
          link.style.display = 'none';
          link.href = url;
          link.download = asset.name || 'download';
          
          // Add to DOM, click and remove
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Clean up the blob URL
          window.URL.revokeObjectURL(url);
          
          // Show success toast
          toast.success(`Downloaded ${asset.name}`, {
            description: "File downloaded successfully",
          });
        }
        
        // Reset download state
        setIsDownloading(false);
      };
      
      xhr.onerror = function() {
        console.error('Download failed');
        setIsDownloading(false);
      };
      
      xhr.send();
    } catch (error) {
      console.error('Download error:', error);
      setIsDownloading(false);
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
