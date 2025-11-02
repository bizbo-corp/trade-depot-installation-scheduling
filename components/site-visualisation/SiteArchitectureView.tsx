"use client";

import { useState } from 'react';
import { SiteTreeWrapper } from './SiteTreeWrapper';
import { FilterControls } from './FilterControls';
import type { FilterType } from './SiteTree';
import type { SiteNode } from '@/lib/site-analyzer';

interface SiteArchitectureViewProps {
  tree: SiteNode[];
  importMap: [string, string[]][];  // Serialized version of Map<string, Set<string>>
}

const defaultFilters: FilterType[] = [
  'pages',     // Visible by default (Purple) - directories under app/
  'files',     // Visible by default (Green) - all .tsx files
  'api',       // Visible by default (Red) - app/api and descendants
  'components', // Visible by default (Amber) - components and descendants
];

export function SiteArchitectureView({ tree, importMap }: SiteArchitectureViewProps) {
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

  // Relationship state lifted from SiteTree
  const [showRelationships, setShowRelationships] = useState<boolean>(false);
  const [activeRelationshipNodes, setActiveRelationshipNodes] = useState<Set<string>>(new Set());
  const [relationshipDepth, setRelationshipDepth] = useState<number>(1);

  const handleClearRelationships = () => {
    setActiveRelationshipNodes(new Set());
  };

  return (
    <>
      <div className="mb-6">
        <FilterControls 
          filters={filters} 
          onFilterChange={handleFilterChange}
          showRelationships={showRelationships}
          onShowRelationshipsChange={setShowRelationships}
          relationshipDepth={relationshipDepth}
          onRelationshipDepthChange={setRelationshipDepth}
          activeRelationshipCount={activeRelationshipNodes.size}
          onClearRelationships={handleClearRelationships}
        />
      </div>
      
      <div className="rounded-lg border bg-card p-4">
        <h2 className="text-xl font-semibold mb-4">Site Structure Tree</h2>
        <SiteTreeWrapper 
          tree={tree} 
          filters={filters} 
          importMap={importMap}
          showRelationships={showRelationships}
          activeRelationshipNodes={activeRelationshipNodes}
          onRelationshipToggle={(nodePath) => {
            setActiveRelationshipNodes(prev => {
              const next = new Set(prev);
              if (next.has(nodePath)) {
                next.delete(nodePath);
              } else {
                next.add(nodePath);
              }
              return next;
            });
          }}
          relationshipDepth={relationshipDepth}
        />
      </div>
    </>
  );
}

