import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { RefreshButton } from '@/components/site-visualisation/RefreshButton';
import { SiteArchitectureView } from '@/components/site-visualisation/SiteArchitectureView';
import { analyzeSiteStructure } from '@/lib/site-analyzer';
import { siteStructureCache } from '@/lib/cache';
import type { SiteStructure } from '@/lib/site-analyzer';

async function fetchSiteStructure(refresh = false): Promise<SiteStructure & { cached: boolean; cacheTimestamp: number | null }> {
  const CACHE_KEY = 'site-structure';
  
  // Check cache first if not refreshing
  if (!refresh) {
    const cached = siteStructureCache.get<SiteStructure>(CACHE_KEY);
    if (cached) {
      return {
        ...cached,
        cached: true,
        cacheTimestamp: siteStructureCache.getTimestamp(CACHE_KEY),
      };
    }
  }
  
  // Perform fresh analysis
  const structure = await analyzeSiteStructure();
  
  // Cache the result
  siteStructureCache.set(CACHE_KEY, structure);
  
  return {
    ...structure,
    cached: false,
    cacheTimestamp: Date.now(),
  };
}


async function SiteStructureContent({ refreshParam }: { refreshParam?: string }) {
  // Check if feature is enabled
  const isEnabled = process.env.ENABLE_SITE_ARCHITECTURE !== 'false';
  
  if (!isEnabled) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Site Architecture Visualisation</h1>
          <p className="text-muted-foreground">
            This feature is currently disabled. Set ENABLE_SITE_ARCHITECTURE=true to enable.
          </p>
        </div>
      </div>
    );
  }
  
  let structure: SiteStructure;
  let cached = false;
  let cacheTimestamp: number | null = null;
  
  try {
    const shouldRefresh = refreshParam !== undefined;
    const data = await fetchSiteStructure(shouldRefresh);
    structure = data;
    cached = data.cached ?? false;
    cacheTimestamp = data.cacheTimestamp ?? null;
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Site Architecture Visualisation</h1>
          <p className="text-red-500 mb-4">
            {error instanceof Error ? error.message : 'Failed to load site structure'}
          </p>
          <RefreshButton />
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Site Architecture</h1>
          <p className="text-muted-foreground">
            Interactive visualisation of pages, components, and their relationships
          </p>
          {cacheTimestamp && (
            <p className="text-sm text-muted-foreground mt-1">
              Last analyzed: {new Date(cacheTimestamp).toLocaleString()}
              {cached && ' (cached)'}
            </p>
          )}
        </div>
        <RefreshButton />
      </div>
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-bold text-green-600">{structure.pages.length}</div>
          <div className="text-sm text-muted-foreground">Pages & Layouts</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-bold text-amber-600">{structure.components.length}</div>
          <div className="text-sm text-muted-foreground">Components</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-bold text-red-600">{structure.uiComponents.length}</div>
          <div className="text-sm text-muted-foreground">UI Components</div>
        </div>
      </div>
      
      <SiteArchitectureView tree={structure.tree} />
    </div>
  );
}

export default function SiteArchitecturePage({
  searchParams,
}: {
  searchParams: Promise<{ refresh?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      }
    >
      <SiteStructureContentWrapper searchParams={searchParams} />
    </Suspense>
  );
}

async function SiteStructureContentWrapper({
  searchParams,
}: {
  searchParams: Promise<{ refresh?: string }>;
}) {
  const params = await searchParams;
  return <SiteStructureContent refreshParam={params.refresh} />;
}

