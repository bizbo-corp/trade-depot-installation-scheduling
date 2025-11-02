"use client";

import { useState } from 'react';
import { SiteTreeWrapper } from './SiteTreeWrapper';
import { FilterControls } from './FilterControls';
import type { FilterType } from './SiteTree';
import type { SiteNode } from '@/lib/site-analyzer';

interface SiteArchitectureViewProps {
  tree: SiteNode[];
}

const defaultFilters: FilterType[] = [
  'pages',     // Visible by default (Purple) - directories under app/
  'files',     // Visible by default (Green) - all .tsx files
  'api',       // Visible by default (Red) - app/api and descendants
  'components', // Visible by default (Amber) - components and descendants
];

export function SiteArchitectureView({ tree }: SiteArchitectureViewProps) {
  const [filters, setFilters] = useState<Set<FilterType>>(
    new Set(defaultFilters)
  );

  const handleFilterChange = (type: FilterType, checked: boolean) => {
    setFilters((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(type);
      } else {
        next.delete(type);
      }
      return next;
    });
  };

  return (
    <>
      <div className="mb-6">
        <FilterControls filters={filters} onFilterChange={handleFilterChange} />
      </div>
      
      <div className="rounded-lg border bg-card p-4">
        <h2 className="text-xl font-semibold mb-4">Site Structure Tree</h2>
        <SiteTreeWrapper tree={tree} filters={filters} />
      </div>
    </>
  );
}

