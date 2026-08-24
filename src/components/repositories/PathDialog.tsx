import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Package, GitBranch, Route } from 'lucide-react';
import type { Repository, Package as Pkg, DependencyPath } from '@/api/types';
import { api } from '@/api/client';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/States';

interface PathDialogProps {
  open: boolean;
  onClose: () => void;
  repo: Repository;
  dep: Pkg;
}

export function PathDialog({ open, onClose, repo, dep }: PathDialogProps) {
  const navigate = useNavigate();
  const [path, setPath] = useState<DependencyPath | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setNotFound(false);
    api.findDependencyPath(repo.id, dep.id)
      .then((p) => {
        if (p) setPath(p);
        else setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [open, repo.id, dep.id]);

  return (
    <Dialog open={open} onClose={onClose} title="Why is this dependency here?" maxWidth="max-w-xl">
      {loading ? (
        <LoadingState message="Tracing dependency path..." />
      ) : notFound ? (
        <EmptyState
          icon={<Route className="h-7 w-7 text-gray-500" />}
          title="No path found"
          message="No dependency path exists between this repository and this package."
        />
      ) : path ? (
        <div className="space-y-4">
          <div>
            <div className="label-meta mb-2">Dependency Path</div>
            <div className="flex items-center gap-2 flex-wrap">
              {path.nodes.map((node, i) => (
                <div key={node.id} className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-lg border border-base-700 bg-base-800 px-3 py-1.5">
                    {node.type === 'package' && <Package className="h-3.5 w-3.5 text-accent-400" />}
                    {node.type === 'repository' && <GitBranch className="h-3.5 w-3.5 text-emerald-400" />}
                    <span className="text-sm font-medium text-gray-200">{node.label}</span>
                  </div>
                  {i < path.nodes.length - 1 && <ArrowRight className="h-4 w-4 text-gray-600" />}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-base-700 bg-base-800/50 px-3 py-2">
            <span className="label-meta">Connection</span>
            <span className="text-sm text-gray-300">{path.hops}-hop connection</span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onClose();
                navigate(`/repositories/${repo.owner}/${repo.name}`);
              }}
            >
              <Route className="h-3.5 w-3.5" />
              Explore Path
            </Button>
          </div>
        </div>
      ) : null}
    </Dialog>
  );
}
