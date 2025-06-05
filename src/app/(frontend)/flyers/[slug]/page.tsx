import type { Metadata } from 'next'

import { draftMode } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'
import Link from 'next/link'
import type { Flyer } from '@/payload-types'

import { generateMeta } from '@/utilities/generateMeta'
import { Media } from '@/components/Media'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PayloadRedirects } from '@/components/PayloadRedirects'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export async function generateStaticParams() {
  try {
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

    return flyers.docs.map(({ slug }) => {
      return { slug }
    })
  } catch (error) {
    console.error('Error generating static params for flyers:', error)
    return []
  }
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const flyer = await queryFlyerBySlug({ slug })

  return generateMeta({ doc: flyer })
}

const queryFlyerBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'flyers',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

export default async function FlyerPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const url = '/flyers/' + slug
  const flyer = await queryFlyerBySlug({ slug })

  if (!flyer) {
    return <PayloadRedirects url={url} />
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-4">
        <Link href="/flyers" className="text-blue-600 hover:underline">
          &larr; Back to flyers
        </Link>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Flyer image */}
            <div className="relative w-full h-[300px] overflow-hidden bg-slate-100">
              {flyer.flyerImage ? (
                <Media resource={flyer.flyerImage} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <span className="text-slate-400">No image available</span>
                </div>
              )}
            </div>

            {/* Flyer details */}
            <div className="p-6">
              {/* Display category badge if available */}
              {typeof flyer.category === 'object' && flyer.category?.title && (
                <Badge className="mb-2 bg-blue-600 hover:bg-blue-700 text-white">
                  {flyer.category.title}
                </Badge>
              )}

              <h1 className="text-2xl font-bold mb-4">{flyer.title}</h1>

              {/* Display last updated date */}
              <div className="text-sm text-slate-500 mt-4">
                Last updated: {new Date(flyer.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
