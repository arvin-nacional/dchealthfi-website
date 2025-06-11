import configPromise from '@payload-config';
import { getPayload } from 'payload';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Cache for 60 seconds

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    // Parse query parameters
    const pageNumber = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const categoryTitle = searchParams.get('category');
    const searchQuery = searchParams.get('search');
    const categoryId = searchParams.get('categoryId');
    
    const payload = await getPayload({ config: configPromise });
    
    // Build query conditions
    const where: Record<string, unknown> = {
      _status: {
        equals: 'published',
      },
    };
    
    // Add category filter if available
    if (categoryTitle || categoryId) {
      let finalCategoryId = categoryId;
      
      // If we have a category title but no ID, try to find the ID
      if (categoryTitle && !categoryId) {
        const categories = await payload.find({
          collection: 'categories',
          where: {
            title: {
              equals: categoryTitle,
            },
          },
          limit: 1,
        });
        
        if (categories.docs.length > 0) {
          finalCategoryId = categories.docs[0].id;
        }
      }
      
      if (finalCategoryId) {
        where.category = {
          equals: finalCategoryId,
        };
      }
    }
    
    // Add search functionality if provided
    if (searchQuery) {
      where.title = {
        like: searchQuery,
      };
    }
    
    // Fetch flyers with optimized fields
    const fetchedFlyers = await payload.find({
      collection: 'flyers',
      depth: 1, // Just enough depth to get related data
      limit,
      page: pageNumber,
      where: where as any,
      // Only fetch fields we actually need to display
      fields: [
        'id',
        'title',
        'description', 
        'category',
        'featuredImage',
        'slug',
        'updatedAt'
      ],
    });
    
    // Set cache headers for better performance
    return NextResponse.json(fetchedFlyers, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
    
  } catch (error) {
    console.error('Error fetching flyers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flyers' },
      { status: 500 }
    );
  }
}
