import { Package, GitBranch, Building2, Maximize, RotateCcw, Expand, Layers } from 'lucide-react';
import type { EntityType } from '@/api/types';

interface GraphToolbarProps {
  depth: number;
  onDepthChange: (depth: number) => void;
  filters: Set<EntityType>;
  onToggleFilter: (type: EntityType) => void;
  onFit: () => void;
  onReset: () => void;
  onExpand: () => void;
  canExpand: boolean;
  layoutName: string;
  onLayoutChange: (name: string) => void;
}

const filterConfig: { type: EntityType; label: string; icon: typeof Package }[] = [
  { type: 'package', label: 'Packages', icon: Package },
  { type: 'repository', label: 'Repositories', icon: GitBranch },
  { type: 'organization', label: 'Organizations', icon: Building2 },
];

export function GraphToolbar({
  depth,
  onDepthChange,
  filters,
  onToggleFilter,
  onFit,
  onReset,
  onExpand,
  canExpand,
  layoutName,
  onLayoutChange,
}: GraphToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-base-700 bg-base-900/50 px-4 py-3">
      {/* Depth */}
      <div className="flex items-center gap-2">
        <span className="label-meta">Depth</span>
        <div className="flex overflow-hidden rounded-lg border border-base-700">
          {[1, 2, 3].map((d) => (
            <button
              key={d}
              onClick={() => onDepthChange(d)}
              className={`px-3 py-1 text-xs font-medium transition-colors ${
                depth === d
                  ? 'bg-accent-500 text-base-950'
                  : 'bg-base-800 text-gray-400 hover:bg-base-700'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="h-5 w-px bg-base-700" />

      {/* Filters */}
      <div className="flex items-center gap-1.5">
        {filterConfig.map(({ type, label, icon: Icon }) => {
          const active = filters.has(type);
          return (
            <button
              key={type}
              onClick={() => onToggleFilter(type)}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                active
                  ? 'border-base-600 bg-base-800 text-gray-200'
                  : 'border-base-700 bg-base-900 text-gray-600 hover:text-gray-400'
              }`}
            >
              <Icon className="h-3 w-3" />
              {label}
            </button>
          );
        })}
      </div>

      <div className="h-5 w-px bg-base-700" />

      {/* Layout */}
      <div className="flex items-center gap-2">
        <span className="label-meta flex items-center gap-1">
          <Layers className="h-3 w-3" />
          Layout
        </span>
        <select
          value={layoutName}
          onChange={(e) => onLayoutChange(e.target.value)}
          className="rounded-lg border border-base-700 bg-base-800 px-2 py-1 text-xs text-gray-200 focus:border-accent-500 focus:outline-none"
        >
          <option value="breadthfirst">Tree</option>
          <option value="concentric">Concentric</option>
          <option value="cose">Force</option>
        </select>
      </div>

      {/* Actions */}
      <div className="ml-auto flex items-center gap-1">
        <button
          onClick={onExpand}
          disabled={!canExpand}
          className="flex items-center gap-1.5 rounded-lg border border-base-700 bg-base-800 px-2.5 py-1 text-xs font-medium text-gray-300 hover:bg-base-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Expand selected node's neighbors"
        >
          <Expand className="h-3.5 w-3.5" />
          Expand
        </button>
        <button
          onClick={onFit}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-base-800 hover:text-gray-200 transition-colors"
          title="Fit graph to viewport"
          aria-label="Fit graph to viewport"
        >
          <Maximize className="h-4 w-4" />
        </button>
        <button
          onClick={onReset}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-base-800 hover:text-gray-200 transition-colors"
          title="Reset view"
          aria-label="Reset view"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
