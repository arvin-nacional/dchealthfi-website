import { getClientSideURL } from '@/utilities/getURL'

/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  // Check if URL already has http/https protocol
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return cacheTag ? `${url}?${cacheTag}` : url
  }

  // Decode URL first to prevent double encoding
  let decodedUrl = url
  try {
    // Only decode if it appears to be encoded
    if (url.includes('%')) {
      decodedUrl = decodeURIComponent(url)
    }
  } catch (error) {
    // If decoding fails, use original URL
    console.warn('Failed to decode URL:', url, error)
    decodedUrl = url
  }

  // Otherwise prepend client-side URL
  const baseUrl = getClientSideURL()
  const fullUrl = `${baseUrl}${decodedUrl}`

  return cacheTag ? `${fullUrl}?${cacheTag}` : fullUrl
}
