import type { Category, Flyer, FlyersBlock as FlyersBlockProps } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'
import FlyerCard from '@/components/FlyerCard'
import Filters from '@/components/Filters'
import LocalSearchbar from '@/components/LocalSearchBar'
import PaginationQuery from '@/components/PaginationQuery'
// Next.js revalidation configuration for this component

// Set a revalidation time similar to the flyers slug page
export const revalidate = 10 // Revalidate every 10 seconds

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
    limit = 1000,
    categoryID,
    searchQuery,
    categoryFilter,
  }: {
    pageNumber: number
    limit: number
    categoryID?: string
    searchQuery?: string
    categoryFilter?: string[]
  }) => {
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

    // Fetch flyers with all applicable filters
    const fetchedFlyers = await payload.find({
      collection: 'flyers',
      depth: 1,
      limit,
      page: pageNumber,
      where: where as any,
    })

    // Revalidation is handled by the export const revalidate and hooks

    return fetchedFlyers
  },
)

// Cache the categories fetch function
const getCategories = cache(async () => {
  const payload = await getPayload({ config: configPromise })

  // Fetch all categories for the filter UI
  const fetchedCategories = await payload.find({
    collection: 'categories',
    depth: 1,
  })

  // Revalidation is handled by the export const revalidate and hooks

  return fetchedCategories.docs
})

export const FlyersBlock: React.FC<
  FlyersBlockProps & { id?: string; params?: Promise<SearchParams> }
> = async ({ id, selectedDocs, limitFromProps, populateBy, categories, params }) => {
  const limit = limitFromProps || 12
  const searchParams = await params

  // Extract all possible search parameters
  const categoryTitle = searchParams?.category // e.g., "Technology"
  const searchQuery = searchParams?.search
  const pageNumber = searchParams?.page ? parseInt(searchParams.page, 10) : 1

  let flyers: Flyer[] = []
  let categoriesArr: Category[] = []
  let totalPages = 1
  const currentPage = pageNumber || 1

  if (populateBy === 'collection') {
    let categoryID: string | undefined

    if (categoryTitle) {
      // Get category ID from title if needed
      const allCategories = await getCategories()
      const matchedCategory = allCategories.find((cat) => cat.title === categoryTitle)
      if (matchedCategory) {
        categoryID = matchedCategory.id
      }
    }

    // Use the cached function to fetch flyers
    const fetchedFlyers = await getFlyers({
      pageNumber: currentPage,
      limit,
      categoryID,
      searchQuery,
      categoryFilter: categories
        ? (categories.map((c) => (typeof c === 'string' ? c : c.id)).filter(Boolean) as string[])
        : undefined,
    })

    flyers = fetchedFlyers.docs
    totalPages = fetchedFlyers.totalPages || 1

    // Use the cached function to fetch categories
    categoriesArr = await getCategories()
  } else {
    if (selectedDocs?.length) {
      flyers = selectedDocs
        .map((flyer) => (typeof flyer.value === 'object' ? flyer.value : null))
        .filter(Boolean) as Flyer[]
    }
  }

  // Pagination information already set in the collection handling above

  return (
    <div className="my-16 " id={`block-${id}`}>
      <div className="w-full flex justify-center items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          placeholder="Search flyers..."
          otherClasses="max-w-[650px] mb-8"
        />
      </div>
      <Filters categories={categoriesArr} />
      <div className="container grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4 content-center">
        {flyers.length > 0 ? (
          flyers.map((flyer) => <FlyerCard key={flyer.id} flyer={flyer} />)
        ) : (
          <div className="col-span-full text-center py-12 flex flex-col items-center justify-center w-full">
            <h3 className="text-xl font-medium">No flyers found</h3>
            <p className="text-muted-foreground mt-2">Try changing your search criteria</p>
          </div>
        )}
      </div>

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
