import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

export const revalidateFlyers: CollectionAfterChangeHook | CollectionAfterDeleteHook = async ({
  doc,
  req,
  operation,
}: {
  doc: { slug: string; [key: string]: any }
  req: any
  operation: string
}) => {
  if (req.payload.config.serverURL && req.payload.config.clientURL) {
    try {
      const serverURL = `${req.payload.config.serverURL}`
      const res = await fetch(`${serverURL}/api/revalidate-pages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collection: 'flyers',
          slug: doc.slug,
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
