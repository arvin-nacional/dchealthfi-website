import { revalidatePath, revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

export const revalidateFlyers: CollectionAfterChangeHook = async ({
  doc,
  req,
  // Prefix with underscore to mark as unused
  operation: _operation,
}) => {
  // Type assertion to avoid TypeScript errors
  const typedDoc = doc as { slug: string }
  
  // Only check for serverURL as clientURL might not be available in SanitizedConfig type
  if (req.payload.config.serverURL) {
    try {
      const serverURL = `${req.payload.config.serverURL}`
      const res = await fetch(`${serverURL}/api/revalidate-pages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collection: 'flyers',
          slug: typedDoc.slug,
          secret: process.env.REVALIDATION_KEY,
        }),
      })

      if (res.ok) {
        const json = await res.json()
        req.payload.logger.info(`Revalidated paths: ${json.revalidated.join(', ')}`)
      } else {
        req.payload.logger.error(`Error revalidating: ${res.status}`)
      }
    } catch (err: unknown) {
      req.payload.logger.error(`Error hitting revalidate URL: ${err}`)
    }
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = `/flyers/${doc?.slug}`

    revalidatePath(path)
    revalidateTag('flyers-sitemap')
    revalidateTag('flyers-block') // Add revalidation for FlyersBlock component
  }

  return doc
}
