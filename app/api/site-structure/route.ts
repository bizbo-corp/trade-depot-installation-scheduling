import { NextRequest, NextResponse } from 'next/server';
import { analyzeSiteStructure } from '@/lib/site-analyzer';
import { siteStructureCache } from '@/lib/cache';

const CACHE_KEY = 'site-structure';

/**
 * GET handler for site structure API
 * Returns cached or fresh analysis of the site architecture
 */
export async function GET(request: NextRequest) {
  // Check if feature is enabled
  const isEnabled = process.env.ENABLE_SITE_ARCHITECTURE !== 'false';
  
  if (!isEnabled) {
    return NextResponse.json(
      { error: 'Site architecture visualisation is disabled' },
      { status: 404 }
    );
  }
  
  // Check for refresh parameter
  const searchParams = request.nextUrl.searchParams;
  const refresh = searchParams.get('refresh') === 'true';
  
  // Return cached data if available and not refreshing
  if (!refresh) {
    const cached = siteStructureCache.get(CACHE_KEY);
    if (cached) {
      return NextResponse.json({
        ...cached,
        cached: true,
        cacheTimestamp: siteStructureCache.getTimestamp(CACHE_KEY),
      });
    }
  }
  
  // Perform fresh analysis
  try {
    const structure = await analyzeSiteStructure();
    
    // Cache the result
    siteStructureCache.set(CACHE_KEY, structure);
    
    return NextResponse.json({
      ...structure,
      cached: false,
      cacheTimestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error analyzing site structure:', error);
    return NextResponse.json(
      { error: 'Failed to analyze site structure', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler to clear cache
 */
export async function DELETE() {
  siteStructureCache.clear(CACHE_KEY);
  return NextResponse.json({ success: true, message: 'Cache cleared' });
}

