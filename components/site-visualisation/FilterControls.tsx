"use client";

import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { FilterType } from './SiteTree';

interface FilterControlsProps {
  filters: Set<FilterType>;
  onFilterChange: (type: FilterType, checked: boolean) => void;
  showRelationships: boolean;
  onShowRelationshipsChange: (show: boolean) => void;
  relationshipDepth: number;
  onRelationshipDepthChange: (depth: number) => void;
  activeRelationshipCount: number;
  onClearRelationships: () => void;
}

const filterOptions: { type: FilterType; label: string; color: string }[] = [
  { type: 'pages', label: 'Pages', color: '#8b5cf6' },
  { type: 'files', label: 'Files', color: '#10b981' },
  { type: 'api', label: 'API', color: '#ef4444' },
  { type: 'components', label: 'Components', color: '#f59e0b' },
];

export function FilterControls({ 
  filters, 
  onFilterChange,
  showRelationships,
  onShowRelationshipsChange,
  relationshipDepth,
  onRelationshipDepthChange,
  activeRelationshipCount,
  onClearRelationships
}: FilterControlsProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-4">
        <h2 className="text-xl font-semibold mb-4">Filter by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filterOptions.map((option) => (
            <div key={option.type} className="flex items-center gap-2">
              <Checkbox
                id={`filter-${option.type}`}
                checked={filters.has(option.type)}
                onCheckedChange={(checked) => onFilterChange(option.type, checked === true)}
              />
              <label
                htmlFor={`filter-${option.type}`}
                className="flex items-center gap-2 cursor-pointer text-sm"
              >
                <div
                  className="w-4 h-4 rounded border-2 flex-shrink-0"
                  style={{ borderColor: option.color }}
                />
                <span>{option.label}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="rounded-lg border bg-card p-4">
        <h2 className="text-xl font-semibold mb-4">Relationship Visualisation</h2>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="show-relationships"
              checked={showRelationships}
              onCheckedChange={(checked) => onShowRelationshipsChange(checked === true)}
            />
            <label
              htmlFor="show-relationships"
              className="flex items-center gap-2 cursor-pointer text-sm"
            >
              <div className="w-4 h-4 rounded border-2 flex-shrink-0 border-cyan-500 bg-gradient-to-br from-cyan-400/20 to-cyan-600/20" />
              <span>Show Relationships</span>
            </label>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm">Depth:</span>
            <Select 
              value={relationshipDepth.toString()} 
              onValueChange={(value) => onRelationshipDepthChange(parseInt(value, 10))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Level</SelectItem>
                <SelectItem value="2">2 Levels</SelectItem>
                <SelectItem value="3">3 Levels</SelectItem>
                <SelectItem value="10">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {activeRelationshipCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {activeRelationshipCount} node{activeRelationshipCount !== 1 ? 's' : ''} active
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onClearRelationships}
              >
                Clear All
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

