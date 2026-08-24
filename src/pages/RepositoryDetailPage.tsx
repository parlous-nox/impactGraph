import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  GitBranch,
  Network,
  Package as PackageIcon,
  ChevronRight,
  Star,
  Layers,
  Boxes,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { api } from '@/api/client';
import type { Repository as Repo, Package as Pkg, GraphData, EntityType } from '@/api/types';
import { PageContainer } from '@/components/layout/PageContainer';
import { EntityBadge } from '@/components/ui/EntityBadge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/States';
import { GraphExplorer } from '@/components/graph/GraphExplorer';
import { PathDialog } from '@/components/repositories/PathDialog';

export function RepositoryDetailPage() {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const navigate = useNavigate();

  const [repository, setRepository] = useState<Repo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [graphLoading, setGraphLoading] = useState(false);
  const [dependencies, setDependencies] = useState<Pkg[]>([]);
  const [depsLoading, setDepsLoading] = useState(false);
  const [pathDialogOpen, setPathDialogOpen] = useState(false);
  const [selectedDepForPath, setSelectedDepForPath] = useState<Pkg | null>(null);

  useEffect(() => {
    if (!owner || !repo) return;
    setLoading(true);
    setError(false);
    api.getRepository(owner, repo)
      .then((r) => {
        if (r) {
          setRepository(r);
          setGraphLoading(true);
          api.getGraph('repository', r.id, 2)
            .then(setGraphData)
            .finally(() => setGraphLoading(false));
          setDepsLoading(true);
          api.getRepositoryDependencies(r.owner, r.name)
            .then(setDependencies)
            .finally(() => setDepsLoading(false));
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [owner, repo]);

  if (loading) {
    return (
      <PageContainer maxWidth="wide" className="py-8">
        <div className="mb-6 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <Skeleton className="h-64 w-full" />
      </PageContainer>
    );
  }

  if (error || !repository) {
    return (
      <PageContainer className="py-20">
        <EmptyState
          icon={<GitBranch className="h-7 w-7 text-gray-500" />}
          title="Repository not found"
          message="We couldn't find a repository matching that identifier."
          action={<Button variant="secondary" onClick={() => navigate('/explore')}>Back to Explore</Button>}
        />
      </PageContainer>
    );
  }

  const handleWhyDependency = (dep: Pkg) => {
    setSelectedDepForPath(dep);
    setPathDialogOpen(true);
  };

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <Layers className="h-3.5 w-3.5" />,
      content: <OverviewTab repo={repository} dependencies={dependencies} />,
    },
    {
      id: 'dependencies',
      label: 'Dependencies',
      icon: <ArrowRight className="h-3.5 w-3.5" />,
      content: (
        <DependenciesTab
          dependencies={dependencies}
          loading={depsLoading}
          onWhyDependency={handleWhyDependency}
        />
      ),
    },
    {
      id: 'graph',
      label: 'Graph',
      icon: <Network className="h-3.5 w-3.5" />,
      content: (
        <div className="h-[600px]">
          {graphLoading ? (
            <LoadingState message="Building dependency graph..." />
          ) : graphData ? (
            <GraphExplorer
              initialData={graphData}
              rootEntityId={repository.id}
              rootEntityType="repository"
            />
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <PageContainer maxWidth="wide" className="py-8">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-gray-600">
        <Link to="/explore" className="hover:text-gray-400 transition-colors">Explore</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-400">{repository.fullName}</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <EntityBadge type="repository" size="md" />
        <h1 className="mt-3 text-3xl font-bold text-gray-100">{repository.fullName}</h1>
        <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
          <span>{repository.primaryLanguage}</span>
          {repository.stars !== undefined && repository.stars > 0 && (
            <>
              <span className="text-base-600">·</span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {repository.stars.toLocaleString()}
              </span>
            </>
          )}
        </div>
        <p className="mt-2 text-sm text-gray-400 max-w-2xl">{repository.description}</p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={<Boxes className="h-4 w-4 text-accent-400" />} label="Total Dependencies" value={repository.totalDependencies} />
        <StatCard icon={<ArrowRight className="h-4 w-4 text-emerald-400" />} label="Direct Dependencies" value={repository.directDependencies} />
        <StatCard icon={<Layers className="h-4 w-4 text-amber-400" />} label="Transitive" value={repository.transitiveDependencies} />
        <StatCard icon={<Network className="h-4 w-4 text-gray-400" />} label="Connected Packages" value={repository.connectedPackages} />
      </div>

      {/* Actions */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Button variant="primary" onClick={() => navigate(`/repositories/${repository.owner}/${repository.name}`)}>
          <Network className="h-4 w-4" />
          Explore Dependency Graph
        </Button>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} />

      {/* Path Dialog */}
      {selectedDepForPath && (
        <PathDialog
          open={pathDialogOpen}
          onClose={() => setPathDialogOpen(false)}
          repo={repository}
          dep={selectedDepForPath}
        />
      )}
    </PageContainer>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card>
      <CardBody className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-base-800 border border-base-700">
          {icon}
        </div>
        <div>
          <div className="label-meta">{label}</div>
          <div className="text-xl font-semibold text-gray-100">{value}</div>
        </div>
      </CardBody>
    </Card>
  );
}

function OverviewTab({ repo, dependencies }: { repo: Repo; dependencies: Pkg[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardBody>
          <h3 className="text-sm font-semibold text-gray-100 mb-3">Summary</h3>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">{repo.description}</p>
          <div className="space-y-2">
            <InfoRow label="Owner" value={repo.owner} />
            <InfoRow label="Primary Language" value={repo.primaryLanguage} />
            <InfoRow label="Stars" value={repo.stars?.toLocaleString() ?? '—'} />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h3 className="text-sm font-semibold text-gray-100 mb-3">Dependency Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-base-700 bg-base-800/50 p-3">
              <span className="text-sm text-gray-400">Direct dependencies</span>
              <span className="text-lg font-semibold text-accent-300">{repo.directDependencies}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-base-700 bg-base-800/50 p-3">
              <span className="text-sm text-gray-400">Transitive dependencies</span>
              <span className="text-lg font-semibold text-amber-300">{repo.transitiveDependencies}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-base-700 bg-base-800/50 p-3">
              <span className="text-sm text-gray-400">Connected packages</span>
              <span className="text-lg font-semibold text-emerald-300">{repo.connectedPackages}</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-300 font-mono text-xs">{value}</span>
    </div>
  );
}

function DependenciesTab({
  dependencies,
  loading,
  onWhyDependency,
}: {
  dependencies: Pkg[];
  loading: boolean;
  onWhyDependency: (dep: Pkg) => void;
}) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (dependencies.length === 0) {
    return (
      <EmptyState
        icon={<PackageIcon className="h-7 w-7 text-gray-500" />}
        title="No dependencies"
        message="This repository doesn't have any declared dependencies."
      />
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {dependencies.map((dep) => (
        <Card key={dep.id} hoverable onClick={() => navigate(`/packages/${dep.name}`)}>
          <CardBody className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-500/10 border border-accent-500/20">
              <PackageIcon className="h-4 w-4 text-accent-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-100">{dep.name}</span>
                <span className="text-[10px] font-mono text-gray-600">{dep.version}</span>
              </div>
              <p className="truncate text-xs text-gray-500">{dep.description}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onWhyDependency(dep);
              }}
              className="shrink-0 rounded-lg p-1.5 text-gray-500 hover:bg-base-800 hover:text-accent-400 transition-colors"
              title="Why is this dependency here?"
              aria-label="Why is this dependency here?"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
