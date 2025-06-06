import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'
import configPromise from '@payload-config'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { Media } from '@/components/Media'
import Link from 'next/link'
import { ArrowLeft, File, FileText, ImageIcon, Video } from 'lucide-react'
import RichText from '@/components/RichText'
import { DownloadButtonWrapper, WatchButtonWrapper } from './page.client'
import { generateMeta } from '@/utilities/generateMeta'
import { Metadata } from 'next'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import Image from 'next/image'

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
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-800 hover:text-blue-400 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </header>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <div className="flex justify-center w-full items-center">
            <Media resource={flyer.flyerImage} className="w-full rounded-lg object-cover" />
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-4">{flyer.title}</h1>
            {flyer.description && <RichText data={flyer.description} enableGutter={false} />}

            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                {/* <p className="text-sm text-gray-600">
                  Category: <span className="font-medium">{flyer.category?.title || ''}</span>
                </p> */}
                <p className="text-sm text-gray-600">
                  {flyer.downloadableFiles?.length || 0} file
                  {(flyer.downloadableFiles?.length || 0) !== 1 ? 's' : ''}
                </p>
                <p className="text-sm text-gray-600">
                  Updated{' '}
                  {new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(
                    new Date(flyer.updatedAt),
                  )}
                </p>
              </div>

              {flyer.downloadableFiles?.map((fileItem) => {
                // Check if file is an object with mimeType (Media type) or a string
                const fileObj = typeof fileItem.file === 'object' ? fileItem.file : null
                const mimeType = fileObj?.mimeType || ''
                const fileName = fileObj?.filename || 'File'

                // Determine file type from mimeType
                const fileType = mimeType.split('/')[0] || 'unknown'

                return (
                  <div
                    key={fileItem.id || fileName}
                    className="bg-blue-50 p-4 rounded-lg flex items-center justify-between hover:bg-blue-100 transition-colors mb-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`${getFileTypeColor(fileType)} p-3 rounded-lg`}>
                        {getFileIcon(fileType)}
                      </div>
                      <div>
                        <h3 className="font-medium">{fileItem.label || fileName}</h3>
                        <p className="text-sm text-gray-500">
                          {fileObj?.filesize ? `${Math.round(fileObj.filesize / 1024)} KB` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <WatchButtonWrapper fileObj={fileObj} label={fileItem.label} />
                      <DownloadButtonWrapper fileObj={fileObj} label={fileItem.label} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
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
    pagination: false,     // Match the pattern from posts page
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
