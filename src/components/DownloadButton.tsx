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
    
    // Create a promise to track download
    const downloadPromise = new Promise<string>((resolve, reject) => {
      // Use XMLHttpRequest to get progress events
      const xhr = new XMLHttpRequest();
      xhr.open('GET', asset.url, true);
      xhr.responseType = 'blob';
      
      // Track download progress
      xhr.onprogress = (event) => {
        if (event.lengthComputable) {
          // Update the toast with progress
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          toast.loading(`Downloading: ${percentComplete}%`, { id: 'download-progress' });
        } else {
          toast.loading('Downloading...', { id: 'download-progress' });
        }
      };
      
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
          
          // Dismiss the progress toast
          toast.dismiss('download-progress');
          
          // Show success toast instead
          toast.success(`Downloaded ${asset.name}`, {
            description: "File downloaded successfully"
          });
          
          // Resolve the promise
          resolve(`success`);
        } else {
          // Dismiss the progress toast
          toast.dismiss('download-progress');
          
          // Reject on HTTP error
          reject(new Error(`Failed to download (${this.status})`));
        }
        
        // Reset download state
        setIsDownloading(false);
      };
      
      xhr.onerror = function() {
        console.error('Download failed');
        setIsDownloading(false);
        reject(new Error('Network error during download'));
      };
      
      xhr.send();
    });
    
    // Handle download error
    downloadPromise.catch((err: Error) => {
      toast.dismiss('download-progress');
      toast.error(`Download failed: ${err.message}`);
    });
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
