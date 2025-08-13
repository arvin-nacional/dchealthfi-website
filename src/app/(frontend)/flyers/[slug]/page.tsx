import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'
import configPromise from '@payload-config'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { Media } from '@/components/Media'
import Link from 'next/link'
import { ArrowLeft, Eye, File, FileText, ImageIcon, Video, Star } from 'lucide-react'
// import RichText from '@/components/RichText'
import { DownloadButtonWrapper, WatchButtonWrapper } from './page.client'
import { generateMeta } from '@/utilities/generateMeta'
import { Metadata } from 'next'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { toast } from 'sonner'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const flyers = await payload.find({
    collection: 'flyers',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = flyers.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}
export default async function Flyer({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const url = '/flyers/' + slug
  const flyer = await queryFlyerBySlug({ slug })

  if (!flyer) return <PayloadRedirects url={url} />

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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <article className="pb-12">
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}
      <div className="relative mb-8 -mt-[96px]">
        <div className="w-full h-[350px] overflow-hidden">
          <div className="absolute inset-0 brightness-75">
            <Image
              src="/header-image.png"
              fill
              alt="Header image"
              priority
              className="object-cover"
            />
          </div>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white container z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-center">{flyer.title}</h1>
        </div>
      </div>

      <div className="container">
        <header className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-gray-800 hover:text-blue-400 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </header>

        {/* Tabbed Interface */}
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Product Info</TabsTrigger>
            <TabsTrigger value="video">Product Video</TabsTrigger>
            <TabsTrigger value="testimonials">Product Testimonials</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-6">
            <div className="space-y-6">
              {/* PDF Download Button */}
              {flyer.pdfFile && (
                <div className="flex justify-center">
                  <div className="mt-6">
                    <DownloadButtonWrapper
                      fileObj={typeof flyer.pdfFile === 'object' ? flyer.pdfFile : null}
                      label="Product PDF"
                    />
                  </div>
                </div>
              )}
              {/* PDF Images Section */}
              {flyer.pdfImages && flyer.pdfImages.length > 0 && (
                <div>
                  {/* <h2 className="text-2xl font-semibold mb-4">Product Images</h2> */}
                  {/* Images grid */}
                  <div
                    className={`grid ${
                      flyer.pdfImagesColumnsCount === '1'
                        ? 'grid-cols-1'
                        : flyer.pdfImagesColumnsCount === '2'
                          ? 'grid-cols-1 md:grid-cols-2'
                          : flyer.pdfImagesColumnsCount === '4'
                            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' // default to 3 columns
                    } gap-6`}
                  >
                    {flyer.pdfImages.map((item, i) => (
                      <div
                        key={i}
                        className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] border border-gray-200 dark:border-gray-700 ${flyer.pdfImagesColumnsCount === '1' ? 'max-w-3xl' : 'max-w-full'} mx-auto`}
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
              {/* Video Download Button */}
              {flyer.productVideo && (
                <div className="flex justify-center">
                  <div className="mt-6">
                    <DownloadButtonWrapper
                      fileObj={typeof flyer.productVideo === 'object' ? flyer.productVideo : null}
                      label="Product Video"
                    />
                  </div>
                </div>
              )}
              {/* <h2 className="text-2xl font-semibold mb-4">Product Video</h2> */}
              {flyer.productVideo ? (
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
                  <Media resource={flyer.productVideo} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="aspect-video w-full rounded-lg bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No product video available</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="testimonials" className="mt-6">
            <div className="space-y-6">
              {flyer.downloadableFiles && flyer.downloadableFiles.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Downloadable Files</h2>
                  <div className="space-y-2">
                    {flyer.downloadableFiles.map((fileItem) => {
                      const fileObj = typeof fileItem.file === 'object' ? fileItem.file : null
                      const mimeType = fileObj?.mimeType || ''
                      const fileName = fileObj?.filename || 'File'
                      const fileType: string = mimeType.split('/')[0] || 'unknown'

                      return (
                        <div
                          key={fileItem.id || fileName}
                          className="bg-blue-50 p-4 rounded-lg flex items-center justify-between hover:bg-blue-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`${getFileTypeColor(fileType)} p-3 rounded-lg`}>
                              {getFileIcon(fileType)}
                            </div>
                            <div>
                              <h3 className="font-medium">{fileItem.label || fileName}</h3>
                              <p className="text-sm text-gray-500">
                                {fileObj?.filesize
                                  ? `${Math.round(fileObj.filesize / 1024000)} MB`
                                  : ''}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {(fileType === 'application' || fileType === 'image') &&
                              fileObj?.url && (
                                <Link href={fileObj.url} target="_blank">
                                  <Button
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View
                                  </Button>
                                </Link>
                              )}
                            <WatchButtonWrapper fileObj={fileObj} label={fileItem.label} />
                            <DownloadButtonWrapper fileObj={fileObj} label={fileItem.label} />
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
    </article>
  )
}

// Next.js revalidation configuration to ensure content is fresh
export const revalidate = 10 // Revalidate every 10 seconds

const queryFlyerBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'flyers',
    draft,
    limit: 1,
    overrideAccess: draft, // Match the pattern from posts page
    pagination: false, // Match the pattern from posts page
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const flyer = await queryFlyerBySlug({ slug })

  return generateMeta({ doc: flyer })
}
