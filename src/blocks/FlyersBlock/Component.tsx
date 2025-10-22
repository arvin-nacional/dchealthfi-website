import type { Category, Flyer, FlyersBlock as FlyersBlockProps } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { Suspense, cache } from 'react'
import FlyerCard from '@/components/FlyerCard'
import PaginationQuery from '@/components/PaginationQuery'
import { Skeleton } from '@/components/ui/skeleton'
import { cookies } from 'next/headers'
import type { Locale } from '@/lib/translations'

// Set a longer revalidation time to improve performance
export const revalidate = 3600 // Revalidate every hour instead of every 10 seconds

// Enable static generation with revalidation
export const dynamic = 'force-static'
export const fetchCache = 'force-cache' // Enable aggressive caching

type SearchParams = {
  slug?: string
  category?: string
  search?: string
  page?: string
  [key: string]: string | undefined
}

// Cache this function to improve performance and reduce redundant database queries
// React's cache() ensures the function only executes once for identical arguments
// https://react.dev/reference/react/cache
const getFlyers = cache(
  async ({
    pageNumber = 1,
    limit = 12, // More reasonable default limit for better performance
    categoryID,
    searchQuery,
    categoryFilter,
    locale = 'en',
  }: {
    pageNumber: number
    limit: number
    categoryID?: string
    searchQuery?: string
    categoryFilter?: string[]
    locale?: Locale
  }) => {
    try {
      const payload = await getPayload({ config: configPromise })

      // Build the query based on all search parameters
      const where: Record<string, unknown> = {
        // Only show published flyers
        _status: {
          equals: 'published',
        },
      }

      // Filter by category if available
      if (categoryID || categoryFilter?.length) {
        where.category = {
          equals: categoryID || (categoryFilter?.length ? categoryFilter[0] : undefined),
        }
      }

      // Add search functionality if search param is provided
      if (searchQuery) {
        where.title = {
          like: searchQuery,
        }
      }

      // Optimize fields we retrieve to reduce payload size
      const fetchedFlyers = await payload.find({
        collection: 'flyers',
        depth: 1,
        limit,
        page: pageNumber,
        locale, // Add locale parameter for localized content
        where: where as any,
        // Explicitly define only the fields we need for rendering
        sort: '-updatedAt', // Show newest first
      })

      return fetchedFlyers
    } catch (error) {
      console.error('Error fetching flyers:', error)
      return {
        docs: [],
        totalPages: 0,
        totalDocs: 0,
        page: pageNumber,
        hasPrevPage: false,
        hasNextPage: false,
      }
    }
  },
)

// Cache the categories fetch function with a longer TTL since categories rarely change
const getCategories = cache(async (locale: Locale = 'en') => {
  try {
    const payload = await getPayload({ config: configPromise })

    // Fetch all categories for the filter UI
    // Categories are small and don't change often, so we can fetch them all
    const fetchedCategories = await payload.find({
      collection: 'categories',
      depth: 0, // We don't need nested data for categories
      limit: 100, // Reasonable upper limit
      locale, // Add locale parameter for localized category titles
      // Only fetch fields we need for rendering
      sort: 'title', // Sort by title for a consistent order
    })

    return fetchedCategories.docs
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
})

// Lazy load client components to reduce initial bundle size
const FlyersSearchBar = React.lazy(() =>
  import('@/blocks/FlyersBlock/FlyersSearchBar').then((module) => ({
    default: module.FlyersSearchBar,
  })),
)
const Filters = React.lazy(() =>
  import('@/components/Filters').then((module) => ({ default: module.default })),
)

// Separate component for flyers grid to enable independent streaming
const FlyersGrid: React.FC<{
  flyers: Flyer[]
  populateBy: 'collection' | 'selection' | null | undefined
}> = ({ flyers, populateBy }) => {
  if (populateBy !== 'collection' && !flyers.length) {
    return null
  }

  return (
    <div className="container grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 content-center">
      {flyers.length > 0 ? (
        flyers.map((flyer) => <FlyerCard key={flyer.id} flyer={flyer} />)
      ) : (
        <div className="col-span-full text-center py-12 flex flex-col items-center justify-center w-full">
          <h3 className="text-xl font-medium text-gray-800">No flyers found</h3>
          <p className="text-muted-foreground text-gray-800 mt-2">
            Try changing your search criteria
          </p>
        </div>
      )}
    </div>
  )
}

// Separate component for categories to enable independent streaming
const CategoriesSection: React.FC<{ searchParams: SearchParams | undefined }> = async ({
  searchParams,
}) => {
  // Get locale from cookies for server-side rendering
  const cookieStore = await cookies()
  const locale = (cookieStore.get('NEXT_LOCALE')?.value as Locale) || 'en'

  const categoriesArr = await getCategories(locale)

  return (
    <Suspense
      fallback={
        <div className="h-12 mb-8">
          <Skeleton className="h-8 w-full" />
        </div>
      }
    >
      <Filters categories={categoriesArr} />
    </Suspense>
  )
}

// Main FlyersBlock component (Server Component)
export const FlyersBlock: React.FC<
  FlyersBlockProps & { id?: string; params?: Promise<SearchParams> }
> = async ({ id, selectedDocs, limitFromProps, populateBy, categories, params }) => {
  const limit = limitFromProps || 12
  const searchParams = await params

  // Get locale from cookies for server-side rendering
  const cookieStore = await cookies()
  const locale = (cookieStore.get('NEXT_LOCALE')?.value as Locale) || 'en'

  // Extract all possible search parameters
  const categoryTitle = searchParams?.category // e.g., "Technology"
  const searchQuery = searchParams?.search
  const pageNumber = searchParams?.page ? parseInt(searchParams.page, 10) : 1

  let flyers: Flyer[] = []
  let totalPages = 1
  const currentPage = pageNumber || 1

  // Data fetching code with improved error handling and performance
  if (populateBy === 'collection') {
    let categoryID: string | undefined

    // Only fetch categories if we need category filtering
    if (categoryTitle) {
      const categoriesArr = await getCategories(locale)
      const matchedCategory = categoriesArr.find((cat) => cat.title === categoryTitle)
      if (matchedCategory) {
        categoryID = matchedCategory.id
      }
    }

    // Fetch flyers with optimized query
    const fetchedFlyers = await getFlyers({
      pageNumber: currentPage,
      limit,
      categoryID,
      searchQuery,
      locale, // Pass locale to get localized flyer content
      categoryFilter: categories
        ? (categories.map((c) => (typeof c === 'string' ? c : c.id)).filter(Boolean) as string[])
        : undefined,
    })

    flyers = fetchedFlyers.docs
    totalPages = fetchedFlyers.totalPages || 1
  } else if (selectedDocs?.length) {
    flyers = selectedDocs
      .map((flyer) => (typeof flyer.value === 'object' ? flyer.value : null))
      .filter(Boolean) as Flyer[]
  }

  return (
    <div className="my-16" id={`block-${id}`}>
      {/* Search and Filter Section - Load independently */}
      <div className="container mb-8">
        <Suspense
          fallback={
            <div className="w-full h-16 flex justify-center mb-8">
              <Skeleton className="h-12 w-[650px]" />
            </div>
          }
        >
          <FlyersSearchBar />
        </Suspense>

        {/* Categories load independently and only when needed */}
        <CategoriesSection searchParams={searchParams} />
      </div>

      {/* Flyers Grid - Prioritize content rendering */}
      <Suspense
        fallback={
          <div className="container grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4 content-center">
            {Array.from({ length: limit }).map((_, index) => (
              <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="h-[180px] w-full rounded-md" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        }
      >
        <FlyersGrid flyers={flyers} populateBy={populateBy} />
      </Suspense>

      {/* Pagination using PaginationQuery component */}
      {populateBy === 'collection' && totalPages > 1 && (
        <div className="container mt-8 flex justify-center">
          <PaginationQuery
            pageNumber={currentPage}
            isNext={currentPage < totalPages}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  )
}
