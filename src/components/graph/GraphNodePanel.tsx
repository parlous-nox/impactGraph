import { useNavigate } from 'react-router-dom';
import { X, ArrowUpRight, Expand, Route, Package, GitBranch, Building2 } from 'lucide-react';
import type { GraphNode } from '@/api/types';
import { EntityBadge } from '@/components/ui/EntityBadge';
import { Button } from '@/components/ui/Button';

interface GraphNodePanelProps {
  node: GraphNode | null;
  onClose: () => void;
  onExpand: () => void;
  onTracePath: (nodeId: string) => void;
  loading?: boolean;
}

const typeIcon = {
  package: Package,
  repository: GitBranch,
  organization: Building2,
};

export function GraphNodePanel({
  node,
  onClose,
  onExpand,
  onTracePath,
  loading,
}: GraphNodePanelProps) {
  const navigate = useNavigate();

  if (!node) return null;

  const Icon = typeIcon[node.type];
  const isPackage = node.type === 'package';
  const isRepository = node.type === 'repository';

  const handleOpenDetails = () => {
    if (isPackage) {
      const name = node.id.replace('pkg:', '');
      navigate(`/packages/${name}`);
    } else if (isRepository) {
      const parts = node.id.replace('repo:', '').split('/');
      if (parts.length >= 2) {
        navigate(`/repositories/${parts[0]}/${parts[1]}`);
      }
    }
  };

  const handleTracePath = () => {
    onTracePath(node.id);
  };

  return (
    <div className="pointer-events-auto absolute right-0 top-0 z-20 flex h-full w-full max-w-sm flex-col border-l border-base-700 bg-base-850/95 backdrop-blur-xl animate-slide-in-right">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-base-700 p-4">
        <div className="min-w-0 flex-1">
          <EntityBadge type={node.type} />
          <h3 className="mt-2 truncate text-lg font-semibold text-gray-100">{node.label}</h3>
          {node.metadata?.ecosystem && (
            <p className="mt-0.5 text-xs text-gray-500">{node.metadata.ecosystem}</p>
          )}
          {node.metadata?.language && (
            <p className="mt-0.5 text-xs text-gray-500">{node.metadata.language}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="ml-3 shrink-0 rounded-lg p-1.5 text-gray-500 hover:bg-base-800 hover:text-gray-300 transition-colors"
          aria-label="Close panel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent-500 border-t-transparent" />
            Loading node details...
          </div>
        ) : (
          <>
            {node.metadata?.description && (
              <p className="text-sm text-gray-400 leading-relaxed">{node.metadata.description}</p>
            )}

            {node.metadata?.version && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="label-meta">Version</span>
                <span className="font-mono text-gray-300">{node.metadata.version}</span>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              {node.metadata?.dependencyCount !== undefined && (
                <div className="rounded-lg border border-base-700 bg-base-800/50 p-3">
                  <div className="label-meta">Dependencies</div>
                  <div className="mt-1 text-xl font-semibold text-gray-100">
                    {node.metadata.dependencyCount}
                  </div>
                </div>
              )}
              {node.metadata?.dependentCount !== undefined && (
                <div className="rounded-lg border border-base-700 bg-base-800/50 p-3">
                  <div className="label-meta">Dependents</div>
                  <div className="mt-1 text-xl font-semibold text-gray-100">
                    {node.metadata.dependentCount}
                  </div>
                </div>
              )}
              {node.metadata?.connectedRepositoryCount !== undefined && (
                <div className="rounded-lg border border-base-700 bg-base-800/50 p-3 col-span-2">
                  <div className="label-meta">Connected Repositories</div>
                  <div className="mt-1 text-xl font-semibold text-gray-100">
                    {node.metadata.connectedRepositoryCount}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              {(isPackage || isRepository) && (
                <Button variant="primary" size="md" className="w-full" onClick={handleOpenDetails}>
                  <ArrowUpRight className="h-4 w-4" />
                  Open Details
                </Button>
              )}
              <Button variant="secondary" size="md" className="w-full" onClick={onExpand}>
                <Expand className="h-4 w-4" />
                Expand Node
              </Button>
              <Button variant="outline" size="md" className="w-full" onClick={handleTracePath}>
                <Route className="h-4 w-4" />
                Trace Path
              </Button>
            </div>

            <div className="pt-2 border-t border-base-700">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Icon className="h-3 w-3" />
                <span>
                  {isPackage && 'Click Expand to load this package\'s neighbors into the graph'}
                  {isRepository && 'Click Expand to load this repository\'s dependencies'}
                  {node.type === 'organization' && 'Organization node — owns repositories in the network'}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
