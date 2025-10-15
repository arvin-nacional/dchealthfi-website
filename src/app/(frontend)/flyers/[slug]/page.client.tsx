'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'
import { DownloadButton } from '@/components/DownloadButton'
import { WatchButton } from '@/components/WatchButton'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { useLanguage } from '@/providers/Language'
import {
  useTranslation,
  getLocalizedTitle,
  getLocalizedImage,
  getLocalizedField,
} from '@/lib/translations'
import { Media } from '@/components/Media'
import Link from 'next/link'
import { ArrowLeft, Eye, File, FileText, ImageIcon, Video, Star } from 'lucide-react'
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'

const PageClient: React.FC = () => {
  /* Always set the header theme to light mode */
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])
  return <React.Fragment />
}

interface PdfDownloadButtonWrapperProps {
  pdfFile: {
    id?: string
    url?: string | null
    filename?: string | null
    filesize?: number | null
  } | null
}

interface DownloadButtonWrapperProps {
  fileObj: {
    id?: string
    url?: string | null
    mimeType?: string | null
    filename?: string | null
    filesize?: number | null
  } | null
  label?: string
}

export function DownloadButtonWrapper({ fileObj, label }: DownloadButtonWrapperProps) {
  // Handle null/undefined fileObj or missing URL
  if (!fileObj || !fileObj.url) return null

  // Safely extract file type from mimeType if available
  let fileType = 'unknown'
  if (fileObj.mimeType && typeof fileObj.mimeType === 'string') {
    fileType = fileObj.mimeType.split('/')[0] || 'unknown'
  }

  // Safely format file size if available
  let formattedSize = ''
  if (fileObj.filesize && typeof fileObj.filesize === 'number') {
    formattedSize = `${Math.round(fileObj.filesize / 1024)} KB`
  }

  // Create asset with fallbacks for all properties
  const asset = {
    id: fileObj.id || 'file-id',
    name: fileObj.filename || label || 'file',
    url: fileObj.url,
    type: fileType,
    size: formattedSize,
  }

  return <DownloadButton asset={asset} />
}

interface WatchButtonWrapperProps {
  fileObj: {
    id?: string
    url?: string | null
    mimeType?: string | null
    filename?: string | null
    filesize?: number | null
  } | null
  label?: string
}

export function WatchButtonWrapper({ fileObj, label }: WatchButtonWrapperProps) {
  // Handle null/undefined fileObj or missing URL
  if (!fileObj || !fileObj.url) return null

  // Check if this is a video file
  const isVideo =
    fileObj.mimeType && typeof fileObj.mimeType === 'string' && fileObj.mimeType.includes('video')
  if (!isVideo) return null

  // Create video asset for the watch button
  const videoAsset = {
    id: fileObj.id || 'video-id',
    name: fileObj.filename || label || 'Video',
    url: fileObj.url,
    type: 'video',
    resource: fileObj, // Pass the original resource to the VideoPlayer
  }
  // @ts-expect-error
  return <WatchButton asset={videoAsset} />
}

interface TestimonialVideoWatchButtonWrapperProps {
  fileObj: {
    id?: string
    url?: string | null
    mimeType?: string | null
    filename?: string | null
    filesize?: number | null
  } | null
  label?: string
}

export function TestimonialVideoWatchButtonWrapper({
  fileObj,
  label,
}: TestimonialVideoWatchButtonWrapperProps) {
  // Handle null/undefined fileObj or missing URL
  if (!fileObj || !fileObj.url) return null

  // Check if this is a video file
  const isVideo =
    fileObj.mimeType && typeof fileObj.mimeType === 'string' && fileObj.mimeType.includes('video')
  if (!isVideo) return null

  // Create video asset for the watch button
  const videoAsset = {
    id: fileObj.id || 'testimonial-video-id',
    name: fileObj.filename || label || 'Testimonial Video',
    url: fileObj.url,
    type: 'video',
    resource: fileObj, // Pass the original resource to the VideoPlayer
  }
  // @ts-expect-error
  return <WatchButton asset={videoAsset} />
}

interface LocalizedFlyerWrapperProps {
  flyer: any
}

export function LocalizedFlyerWrapper({ flyer }: LocalizedFlyerWrapperProps) {
  const { locale } = useLanguage()
  const { t } = useTranslation(locale)

  // Get localized content
  const title = getLocalizedTitle(flyer, locale)
  const flyerImage = getLocalizedImage(flyer, 'flyerImage', locale)
  const pdfFile = getLocalizedField(flyer, 'pdfFile', locale)
  const pdfImages = getLocalizedField(flyer, 'pdfImages', locale) || []
  const productVideos = getLocalizedField(flyer, 'productVideos', locale) || []
  const testimonialVideos = getLocalizedField(flyer, 'testimonialVideos', locale) || []
  const testimonialPdfFile = getLocalizedField(flyer, 'testimonialPdfFile', locale)
  const testimonialPdfImages = getLocalizedField(flyer, 'testimonialPdfImages', locale) || []
  const downloadableFiles = getLocalizedField(flyer, 'downloadableFiles', locale) || []

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-5 h-5" />
      case 'video':
        return <Video className="w-5 h-5" />
      case 'pdf':
        return <FileText className="w-5 h-5" />
      default:
        return <File className="w-5 h-5" />
    }
  }

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'image':
        return 'bg-blue-600 text-white'
      case 'video':
        return 'bg-purple-600 text-white'
      case 'pdf':
        return 'bg-red-600 text-white'
      default:
        return 'bg-slate-600 text-white'
    }
  }

  return (
    <>
      <div className="relative mb-8 -mt-[96px]">
        <div className="w-full h-[350px] overflow-hidden">
          <div className="absolute inset-0 brightness-75">
            {flyerImage ? (
              <Media resource={flyerImage} className="w-full h-full object-cover" />
            ) : (
              <Image
                src="/header-image.png"
                fill
                alt="Header image"
                priority
                className="object-cover"
              />
            )}
          </div>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white container z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-center">{title}</h1>
        </div>
      </div>

      <div className="container">
        <header className="mb-8">
          <Link
            href="/flyers"
            className="inline-flex items-center gap-2 text-sm text-gray-800 hover:text-blue-400 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            {locale === 'zh' ? '返回产品' : 'Back to Products'}
          </Link>
        </header>

        {/* Tabbed Interface */}
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto md:h-10">
            <TabsTrigger value="info" className="text-xs md:text-sm px-2 py-2 md:py-1.5">
              {t('productInfo')}
            </TabsTrigger>
            <TabsTrigger value="video" className="text-xs md:text-sm px-2 py-2 md:py-1.5">
              {t('productVideo')}
            </TabsTrigger>
            <TabsTrigger
              value="testimonial-video"
              className="text-xs md:text-sm px-2 py-2 md:py-1.5"
            >
              {t('testimonialVideo')}
            </TabsTrigger>
            <TabsTrigger value="downloads" className="text-xs md:text-sm px-2 py-2 md:py-1.5">
              {t('testimonials')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-6">
            <div className="space-y-6">
              {/* PDF Download Button */}
              {pdfFile && (
                <div className="flex justify-center">
                  <div className="mt-6">
                    <DownloadButtonWrapper
                      fileObj={typeof pdfFile === 'object' ? pdfFile : null}
                      label={t('downloadPDF')}
                    />
                  </div>
                </div>
              )}
              {/* PDF Images Section */}
              {pdfImages && pdfImages.length > 0 && (
                <div>
                  <div
                    className={`grid ${
                      flyer.pdfImagesColumnsCount === '1'
                        ? 'grid-cols-1'
                        : flyer.pdfImagesColumnsCount === '2'
                          ? 'grid-cols-1 md:grid-cols-2'
                          : flyer.pdfImagesColumnsCount === '4'
                            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    } gap-6`}
                  >
                    {pdfImages.map((item: any, i: number) => (
                      <div
                        key={i}
                        className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] border border-gray-200 dark:border-gray-700 ${
                          flyer.pdfImagesColumnsCount === '1' ? 'max-w-6xl' : 'max-w-full'
                        } mx-auto`}
                      >
                        <div>
                          <Media resource={item.image} className="max-w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="video" className="mt-6">
            <div className="space-y-6">
              {productVideos && productVideos.length > 0 ? (
                <div className="space-y-4">
                  {productVideos.map((videoItem: any, index: number) => {
                    const videoObj = typeof videoItem.video === 'object' ? videoItem.video : null
                    if (!videoObj) return null

                    const fileName = videoObj?.filename || 'Video'
                    let formattedSize = ''
                    if (videoObj.filesize && typeof videoObj.filesize === 'number') {
                      const sizeInMB = videoObj.filesize / 1048576
                      formattedSize =
                        sizeInMB >= 1
                          ? `${sizeInMB.toFixed(2)} MB`
                          : `${Math.round(videoObj.filesize / 1024)} KB`
                    }
                    return (
                      <Card key={index} className="overflow-hidden bg-white dark:bg-gray-800">
                        <CardContent className="p-4">
                          <div className="flex flex-col space-y-3 md:hidden">
                            <div className="flex items-center gap-3">
                              <div className="bg-purple-600 text-white p-2 rounded-lg flex-shrink-0">
                                <Video className="w-5 h-5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-medium text-sm leading-tight text-gray-800 dark:text-white">
                                  {videoItem.label || fileName}
                                </h3>
                                {formattedSize && (
                                  <p className="text-xs text-gray-500 mt-1">{formattedSize}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <WatchButtonWrapper fileObj={videoObj} label={videoItem.label} />
                              <DownloadButtonWrapper fileObj={videoObj} label={videoItem.label} />
                            </div>
                          </div>
                          <div className="hidden md:flex md:items-center md:justify-between">
                            <div className="flex items-center gap-3">
                              <div className="bg-purple-600 text-white p-3 rounded-lg flex-shrink-0">
                                <Video className="w-5 h-5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-medium text-gray-800 dark:text-white">
                                  {videoItem.label || fileName}
                                </h3>
                                {formattedSize && (
                                  <p className="text-sm text-gray-500">{formattedSize}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <WatchButtonWrapper fileObj={videoObj} label={videoItem.label} />
                              <DownloadButtonWrapper fileObj={videoObj} label={videoItem.label} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <div className="aspect-video w-full rounded-lg bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>{locale === 'zh' ? '没有产品视频' : 'No product videos available'}</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="testimonial-video" className="mt-6">
            <div className="space-y-6">
              {testimonialVideos && testimonialVideos.length > 0 ? (
                <div className="space-y-4">
                  {testimonialVideos.map((videoItem: any, index: number) => {
                    const videoObj = typeof videoItem.video === 'object' ? videoItem.video : null
                    if (!videoObj) return null

                    const fileName = videoObj?.filename || 'Video'
                    let formattedSize = ''
                    if (videoObj.filesize && typeof videoObj.filesize === 'number') {
                      const sizeInMB = videoObj.filesize / 1048576
                      formattedSize =
                        sizeInMB >= 1
                          ? `${sizeInMB.toFixed(2)} MB`
                          : `${Math.round(videoObj.filesize / 1024)} KB`
                    }
                    return (
                      <Card key={index} className="overflow-hidden bg-white dark:bg-gray-800">
                        <CardContent className="p-4">
                          <div className="flex flex-col space-y-3 md:hidden">
                            <div className="flex items-center gap-3">
                              <div className="bg-green-600 text-white p-2 rounded-lg flex-shrink-0">
                                <Star className="w-5 h-5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-medium text-sm leading-tight text-gray-800 dark:text-white">
                                  {videoItem.label || fileName}
                                </h3>
                                {formattedSize && (
                                  <p className="text-xs text-gray-500 mt-1">{formattedSize}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <WatchButtonWrapper fileObj={videoObj} label={videoItem.label} />
                              <DownloadButtonWrapper fileObj={videoObj} label={videoItem.label} />
                            </div>
                          </div>
                          <div className="hidden md:flex md:items-center md:justify-between">
                            <div className="flex items-center gap-3">
                              <div className="bg-green-600 text-white p-3 rounded-lg flex-shrink-0">
                                <Star className="w-5 h-5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-medium text-gray-800 dark:text-white">
                                  {videoItem.label || fileName}
                                </h3>
                                {formattedSize && (
                                  <p className="text-sm text-gray-500">{formattedSize}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <WatchButtonWrapper fileObj={videoObj} label={videoItem.label} />
                              <DownloadButtonWrapper fileObj={videoObj} label={videoItem.label} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <div className="aspect-video w-full rounded-lg bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Star className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>
                      {locale === 'zh' ? '没有客户评价视频' : 'No testimonial videos available'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="downloads" className="mt-6">
            <div className="space-y-6">
              {testimonialPdfFile && (
                <div className="flex justify-center">
                  <div className="mt-6">
                    <DownloadButtonWrapper
                      fileObj={typeof testimonialPdfFile === 'object' ? testimonialPdfFile : null}
                      label={locale === 'zh' ? '客户评价PDF' : 'Testimonial PDF'}
                    />
                  </div>
                </div>
              )}
              {testimonialPdfImages && testimonialPdfImages.length > 0 && (
                <div>
                  <div
                    className={`grid ${
                      flyer.testimonialPdfImagesColumnsCount === '1'
                        ? 'grid-cols-1'
                        : flyer.testimonialPdfImagesColumnsCount === '2'
                          ? 'grid-cols-1 md:grid-cols-2'
                          : flyer.testimonialPdfImagesColumnsCount === '4'
                            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    } gap-6`}
                  >
                    {testimonialPdfImages.map((item: any, i: number) => (
                      <div
                        key={i}
                        className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] border border-gray-200 dark:border-gray-700 ${
                          flyer.testimonialPdfImagesColumnsCount === '1'
                            ? 'max-w-6xl'
                            : 'max-w-full'
                        } mx-auto`}
                      >
                        <div>
                          <Media resource={item.image} className="max-w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {downloadableFiles && downloadableFiles.length > 0 && (
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold mb-4">{t('additionalFiles')}</h2>
                  <div className="space-y-3 md:space-y-2">
                    {downloadableFiles.map((fileItem: any) => {
                      const fileObj = typeof fileItem.file === 'object' ? fileItem.file : null
                      const mimeType = fileObj?.mimeType || ''
                      const fileName = fileObj?.filename || 'File'
                      const fileType: string = mimeType.split('/')[0] || 'unknown'

                      return (
                        <div
                          key={fileItem.id || fileName}
                          className="bg-blue-50 p-3 md:p-4 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <div className="flex flex-col space-y-3 md:hidden">
                            <div className="flex items-center gap-3">
                              <div
                                className={`${getFileTypeColor(fileType)} p-2 rounded-lg flex-shrink-0`}
                              >
                                {getFileIcon(fileType)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-medium text-sm leading-tight">
                                  {fileItem.label || fileName}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">
                                  {fileObj?.filesize
                                    ? `${Math.round(fileObj.filesize / 1024000)} MB`
                                    : ''}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-2">
                              {(fileType === 'application' || fileType === 'image') &&
                                fileObj?.url && (
                                  <Link href={fileObj.url} target="_blank">
                                    <Button
                                      size="sm"
                                      className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                      <Eye className="w-4 h-4 md:mr-2" />
                                      <span className="hidden md:inline">
                                        {locale === 'zh' ? '查看文件' : 'View File'}
                                      </span>
                                    </Button>
                                  </Link>
                                )}
                              <div className="flex gap-2 items-start">
                                <WatchButtonWrapper fileObj={fileObj} label={fileItem.label} />
                                <DownloadButtonWrapper fileObj={fileObj} label={fileItem.label} />
                              </div>
                            </div>
                          </div>
                          <div className="hidden md:flex md:items-center md:justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`${getFileTypeColor(fileType)} p-3 rounded-lg flex-shrink-0`}
                              >
                                {getFileIcon(fileType)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-medium">{fileItem.label || fileName}</h3>
                                <p className="text-sm text-gray-500">
                                  {fileObj?.filesize
                                    ? `${Math.round(fileObj.filesize / 1024000)} MB`
                                    : ''}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              {(fileType === 'application' || fileType === 'image') &&
                                fileObj?.url && (
                                  <Link href={fileObj.url} target="_blank">
                                    <Button
                                      size="sm"
                                      className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                      <Eye className="w-4 h-4 md:mr-2" />
                                      <span className="hidden md:inline">
                                        {locale === 'zh' ? '查看' : 'View'}
                                      </span>
                                    </Button>
                                  </Link>
                                )}
                              <WatchButtonWrapper fileObj={fileObj} label={fileItem.label} />
                              <DownloadButtonWrapper fileObj={fileObj} label={fileItem.label} />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

export default PageClient
