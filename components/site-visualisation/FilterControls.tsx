"use client";

import { Checkbox } from '@/components/ui/checkbox';
import type { FilterType } from './SiteTree';

interface FilterControlsProps {
  filters: Set<FilterType>;
  onFilterChange: (type: FilterType, checked: boolean) => void;
}

const filterOptions: { type: FilterType; label: string; color: string }[] = [
  { type: 'pages', label: 'Pages', color: '#8b5cf6' },
  { type: 'files', label: 'Files', color: '#10b981' },
  { type: 'api', label: 'API', color: '#ef4444' },
  { type: 'components', label: 'Components', color: '#f59e0b' },
];

export function FilterControls({ filters, onFilterChange }: FilterControlsProps) {
  return (
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
  );
}

