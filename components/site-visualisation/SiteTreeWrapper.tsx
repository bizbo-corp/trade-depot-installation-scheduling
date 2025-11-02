"use client";

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import type { SiteNode } from '@/lib/site-analyzer';
import type { FilterType } from './SiteTree';

const SiteTree = dynamic(
  () => import('./SiteTree').then((mod) => ({ default: mod.SiteTree })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[600px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    ),
  }
);

interface SiteTreeWrapperProps {
  tree: SiteNode[];
  filters: Set<FilterType>;
}

export function SiteTreeWrapper({ tree, filters }: SiteTreeWrapperProps) {
  return <SiteTree tree={tree} filters={filters} />;
}

