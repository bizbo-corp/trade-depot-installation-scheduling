"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransition } from 'react';

export function RefreshButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  async function handleRefresh() {
    startTransition(async () => {
      try {
        // Clear cache via API
        await fetch('/api/site-structure', {
          method: 'DELETE',
        });
        
        // Trigger refresh by adding timestamp to force re-render
        const params = new URLSearchParams(searchParams.toString());
        params.set('refresh', Date.now().toString());
        router.push(`/site-architecture?${params.toString()}`);
        router.refresh();
      } catch (error) {
        console.error('Failed to refresh:', error);
      }
    });
  }
  
  return (
    <Button
      onClick={handleRefresh}
      variant="outline"
      size="sm"
      disabled={isPending}
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isPending ? 'animate-spin' : ''}`} />
      Refresh Analysis
    </Button>
  );
}

