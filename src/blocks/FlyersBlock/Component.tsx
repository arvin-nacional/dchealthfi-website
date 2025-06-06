import type { Category, Flyer, FlyersBlock as FlyersBlockProps } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import FlyerCard from '@/components/FlyerCard'
import Filters from '@/components/Filters'
import LocalSearchbar from '@/components/LocalSearchBar'


type SearchParams = {
  slug?: string
  category?: string
  search?: string
  page?: string
  [key: string]: string | undefined
}

export const FlyersBlock: React.FC<
  FlyersBlockProps & { id?: string; params?: Promise<SearchParams> }
> = async ({ id, selectedDocs, limitFromProps, populateBy, categories, params }) => {
  const limit = limitFromProps || 12
  const payload = await getPayload({ config: configPromise })
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
      // Step 1: Fetch the category that matches the title
      const matchedCategory = await payload.find({
        collection: 'categories',
        where: {
          title: {
            equals: categoryTitle,
          },
        },
        limit: 1,
      })

      if (matchedCategory.docs.length > 0) {
        categoryID = matchedCategory.docs[0]?.id
      }
    }

    // Build the query based on all search parameters
    const where: Record<string, unknown> = {}

    // Filter by category if available
    if (categoryID || categories?.length) {
      where.category = {
        equals: categoryID || (categories?.length ? categories[0] : undefined),
      }
    }

    // Add search functionality if search param is provided
    if (searchQuery) {
      where.title = {
        like: searchQuery,
      }
    }

    // Step 2: Fetch flyers with all applicable filters
    const fetchedFlyers = await payload.find({
      collection: 'flyers',
      depth: 1,
      limit,
      page: pageNumber,
      where,
    })

    flyers = fetchedFlyers.docs
    totalPages = fetchedFlyers.totalPages || 1

    // Step 3: Fetch all categories for the filter UI
    const fetchedCategories = await payload.find({
      collection: 'categories',
      depth: 1,
    })

    categoriesArr = fetchedCategories.docs
  } else {
    if (selectedDocs?.length) {
      flyers = selectedDocs
        .map((flyer) => (typeof flyer.value === 'object' ? flyer.value : null))
        .filter(Boolean) as Flyer[]
    }
  }

  // Pagination information already set in the collection handling above

  return (
    <div className="my-16" id={`block-${id}`}>
      <div className="w-full flex justify-center items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          placeholder="Search flyers..."
          otherClasses="max-w-[650px] mb-8"
        />
      </div>
      <Filters categories={categoriesArr} />
      <div className="container grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
        {flyers.length > 0 ? (
          flyers.map((flyer) => <FlyerCard key={flyer.id} flyer={flyer} />)
        ) : (
          <div className="col-span-3 text-center py-12">
            <h3 className="text-xl font-medium">No flyers found</h3>
            <p className="text-muted-foreground mt-2">Try changing your search criteria</p>
          </div>
        )}
      </div>

      {/* Pagination with shadcn UI components */}
      {populateBy === 'collection' && totalPages > 1 && (
        <div className="container mt-8 flex justify-center">
          <div className="flex items-center gap-2">
            <a
              href={`?category=${categoryTitle || ''}&search=${searchQuery || ''}&page=${Math.max(1, currentPage - 1)}`}
              className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 p-0 ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
              aria-label="Go to previous page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M15 18l-6-6 6-6"></path>
              </svg>
            </a>

            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show at most 5 page numbers, centered around the current page
              const totalPageButtons = Math.min(5, totalPages)
              const halfButtons = Math.floor(totalPageButtons / 2)

              let start = Math.max(1, currentPage - halfButtons)
              const end = Math.min(start + totalPageButtons - 1, totalPages)

              if (end - start + 1 < totalPageButtons) {
                start = Math.max(1, end - totalPageButtons + 1)
              }

              const pageNum = start + i
              if (pageNum <= totalPages) {
                return (
                  <a
                    key={pageNum}
                    href={`?category=${categoryTitle || ''}&search=${searchQuery || ''}&page=${pageNum}`}
                    className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 p-0 ${pageNum === currentPage ? 'bg-blue-600 text-white' : ''}`}
                  >
                    {pageNum}
                  </a>
                )
              }
              return null
            })}

            {/* Next button */}
            <a
              href={`?category=${categoryTitle || ''}&search=${searchQuery || ''}&page=${Math.min(totalPages, currentPage + 1)}`}
              className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 p-0 ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
              aria-label="Go to next page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
