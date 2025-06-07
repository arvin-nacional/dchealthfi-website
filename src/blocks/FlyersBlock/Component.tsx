import type { Category, Flyer, FlyersBlock as FlyersBlockProps } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import FlyerCard from '@/components/FlyerCard'
import Filters from '@/components/Filters'
import LocalSearchbar from '@/components/LocalSearchBar'
import PaginationQuery from '@/components/PaginationQuery'

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
    const where: Record<string, unknown> = {
      // Only show published flyers
      _status: {
        equals: 'published',
      },
    }

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
      where: where as any,
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
          />
        </div>
      )}
    </div>
  )
}
