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

type Args = {
  params: Promise<{
    slug?: string
  }>
}
export default async function Flyer({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const url = '/flyers/' + slug

  const flyer = await queryFlyerBySlug({ slug })

  if (!flyer) return <PayloadRedirects url={url} />

  console.log(flyer)

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
    <div className="container">
      <div className="flex flex-col items-center gap-4">
        <div className="w-full">
          <header className="">
            <div className="container mx-auto px-4 py-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-gray-800 hover:text-blue-400"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to flyers
              </Link>
            </div>
          </header>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
            <div className="px-6">
              <Media
                resource={flyer.flyerImage}
                size="full"
                className="w-full h-auto rounded-lg overflow-hidden"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-4">{flyer.title}</h1>
              {flyer.description && <RichText data={flyer.description} enableGutter={false} />}
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <p className="text-sm text-gray-600">
                    {flyer.downloadableFiles?.length} file
                    {flyer.downloadableFiles?.length !== 1 ? 's' : ''}
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
                      key={fileItem.id}
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
      </div>
    </div>
  )
}

const queryFlyerBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'flyers',
    draft,
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0]
})
