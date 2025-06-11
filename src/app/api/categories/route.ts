import configPromise from '@payload-config';
import { getPayload } from 'payload';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache categories for longer (1 hour) since they change less frequently

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise });
    
    // Fetch all categories - they're typically small in number
    const categories = await payload.find({
      collection: 'categories',
      limit: 100, // Reasonable upper limit
      // Only fetch fields we need
      fields: ['id', 'title'],
    });
    
    return NextResponse.json(categories, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
