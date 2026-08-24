import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Package as PackageIcon,
  ArrowRight,
  GitBranch,
  Network,
  Zap,
  ChevronRight,
  Layers,
  Users,
  Boxes,
} from 'lucide-react';
import { api } from '@/api/client';
import type { Package as Pkg, GraphData, EntityType, GraphNode } from '@/api/types';
import { PageContainer } from '@/components/layout/PageContainer';
import { EntityBadge } from '@/components/ui/EntityBadge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState, EmptyState } from '@/components/ui/States';
import { GraphExplorer } from '@/components/graph/GraphExplorer';

export function PackageDetailPage() {
  const { packageName } = useParams<{ packageName: string }>();
  const navigate = useNavigate();

  const [pkg, setPkg] = useState<Pkg | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [graphLoading, setGraphLoading] = useState(false);
  const [graphError, setGraphError] = useState(false);
  const [dependencies, setDependencies] = useState<Pkg[]>([]);
  const [depsLoading, setDepsLoading] = useState(false);
  const [dependents, setDependents] = useState<
    { type: EntityType; id: string; name: string; description: string; ecosystem?: string; language?: string; direct: boolean }[]
  >([]);
  const [dependentsLoading, setDependentsLoading] = useState(false);

  useEffect(() => {
    if (!packageName) return;
    setLoading(true);
    setError(false);
    api.getPackage(packageName)
      .then((p) => {
        if (p) {
          setPkg(p);
          // Load graph
          setGraphLoading(true);
          api.getGraph('package', p.id, 2)
            .then(setGraphData)
            .catch(() => setGraphError(true))
            .finally(() => setGraphLoading(false));
          // Load dependencies
          setDepsLoading(true);
          api.getPackageDependencies(p.name)
            .then(setDependencies)
            .finally(() => setDepsLoading(false));
          // Load dependents
          setDependentsLoading(true);
          api.getPackageDependents(p.name)
            .then(setDependents)
            .finally(() => setDependentsLoading(false));
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [packageName]);

  const handleRetry = () => {
    if (packageName) {
      setError(false);
      setLoading(true);
      api.getPackage(packageName)
        .then((p) => {
          if (p) setPkg(p);
          else setError(true);
        })
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    }
  };

  if (loading) {
    return (
      <PageContainer maxWidth="wide" className="py-8">
        <div className="mb-6 space-y-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
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

  if (error || !pkg) {
    return (
      <PageContainer className="py-20">
        <EmptyState
          icon={<PackageIcon className="h-7 w-7 text-gray-500" />}
          title="Package not found"
          message="We couldn't find a package matching that identifier."
          action={<Button variant="secondary" onClick={() => navigate('/explore')}>Back to Explore</Button>}
        />
      </PageContainer>
    );
  }

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <Layers className="h-3.5 w-3.5" />,
      content: <OverviewTab pkg={pkg} />,
    },
    {
      id: 'dependencies',
      label: 'Dependencies',
      icon: <ArrowRight className="h-3.5 w-3.5" />,
      content: (
        <DependenciesTab
          dependencies={dependencies}
          loading={depsLoading}
        />
      ),
    },
    {
      id: 'dependents',
      label: 'Dependents',
      icon: <Users className="h-3.5 w-3.5" />,
      content: (
        <DependentsTab
          dependents={dependents}
          loading={dependentsLoading}
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
          ) : graphError ? (
            <ErrorState
              title="Couldn't load graph"
              message="We couldn't load this dependency graph."
              onRetry={() => {
                if (pkg) {
                  setGraphLoading(true);
                  api.getGraph('package', pkg.id, 2)
                    .then(setGraphData)
                    .catch(() => setGraphError(true))
                    .finally(() => setGraphLoading(false));
                }
              }}
            />
          ) : graphData ? (
            <GraphExplorer
              initialData={graphData}
              rootEntityId={pkg.id}
              rootEntityType="package"
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
        <span className="text-gray-400">{pkg.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <EntityBadge type="package" size="md" />
        <h1 className="mt-3 text-3xl font-bold text-gray-100">{pkg.name}</h1>
        <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
          <span>{pkg.ecosystem}</span>
          <span className="text-base-600">·</span>
          <span className="font-mono">{pkg.version}</span>
          {pkg.license && (
            <>
              <span className="text-base-600">·</span>
              <span>{pkg.license}</span>
            </>
          )}
        </div>
        <p className="mt-2 text-sm text-gray-400 max-w-2xl">{pkg.description}</p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <StatCard icon={<Boxes className="h-4 w-4 text-accent-400" />} label="Direct Dependencies" value={pkg.dependencyCount} />
        <StatCard icon={<GitBranch className="h-4 w-4 text-emerald-400" />} label="Dependent Repositories" value={pkg.dependentCount} />
        <StatCard icon={<Network className="h-4 w-4 text-amber-400" />} label="Connected Packages" value={pkg.connectedRepositoryCount} />
      </div>

      {/* Actions */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Button variant="primary" onClick={() => navigate(`/packages/${pkg.name}`)}>
          <Network className="h-4 w-4" />
          Explore Graph
        </Button>
        <Button variant="secondary" onClick={() => navigate(`/impact/${pkg.name}`)}>
          <Zap className="h-4 w-4" />
          Trace Impact
        </Button>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} />
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

function OverviewTab({ pkg }: { pkg: Pkg }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardBody>
          <h3 className="text-sm font-semibold text-gray-100 mb-3">Summary</h3>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">{pkg.description}</p>
          <div className="space-y-2">
            <InfoRow label="Ecosystem" value={pkg.ecosystem} />
            <InfoRow label="Version" value={pkg.version} />
            <InfoRow label="License" value={pkg.license ?? '—'} />
            {pkg.homepage && <InfoRow label="Homepage" value={pkg.homepage} />}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h3 className="text-sm font-semibold text-gray-100 mb-3">Dependency Structure</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-base-700 bg-base-800/50 p-3">
              <span className="text-sm text-gray-400">Direct dependencies</span>
              <span className="text-lg font-semibold text-accent-300">{pkg.dependencyCount}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-base-700 bg-base-800/50 p-3">
              <span className="text-sm text-gray-400">Dependent packages</span>
              <span className="text-lg font-semibold text-emerald-300">{pkg.dependentCount}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-base-700 bg-base-800/50 p-3">
              <span className="text-sm text-gray-400">Connected repositories</span>
              <span className="text-lg font-semibold text-amber-300">{pkg.connectedRepositoryCount}</span>
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

function DependenciesTab({ dependencies, loading }: { dependencies: Pkg[]; loading: boolean }) {
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
        message="This package doesn't depend on any other packages."
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
            <div className="shrink-0 text-right">
              <div className="label-meta">Type</div>
              <div className="text-xs text-gray-400">DEPENDS_ON</div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

function DependentsTab({
  dependents,
  loading,
}: {
  dependents: { type: EntityType; id: string; name: string; description: string; ecosystem?: string; language?: string; direct: boolean }[];
  loading: boolean;
}) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (dependents.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-7 w-7 text-gray-500" />}
        title="No dependents"
        message="No packages or repositories depend on this package."
      />
    );
  }

  const direct = dependents.filter((d) => d.direct);
  const indirect = dependents.filter((d) => !d.direct);

  return (
    <div className="space-y-6">
      {direct.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="label-meta">Direct Dependents</span>
            <span className="text-xs text-gray-600">({direct.length})</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {direct.map((dep) => (
              <DependentCard key={dep.id} dep={dep} onClick={() => navigateToEntity(navigate, dep)} />
            ))}
          </div>
        </div>
      )}
      {indirect.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="label-meta">Indirect Dependents</span>
            <span className="text-xs text-gray-600">({indirect.length})</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {indirect.map((dep) => (
              <DependentCard key={dep.id} dep={dep} onClick={() => navigateToEntity(navigate, dep)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DependentCard({
  dep,
  onClick,
}: {
  dep: { type: EntityType; id: string; name: string; description: string; ecosystem?: string; language?: string; direct: boolean };
  onClick: () => void;
}) {
  return (
    <Card hoverable onClick={onClick}>
      <CardBody className="flex items-center gap-3">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
            dep.type === 'package'
              ? 'bg-accent-500/10 border-accent-500/20'
              : 'bg-emerald-500/10 border-emerald-500/20'
          }`}
        >
          {dep.type === 'package' ? (
            <PackageIcon className="h-4 w-4 text-accent-400" />
          ) : (
            <GitBranch className="h-4 w-4 text-emerald-400" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-100">{dep.name}</span>
            {dep.ecosystem && <span className="text-[10px] text-gray-600">{dep.ecosystem}</span>}
            {dep.language && <span className="text-[10px] text-gray-600">{dep.language}</span>}
          </div>
          <p className="truncate text-xs text-gray-500">{dep.description}</p>
        </div>
        <div className="shrink-0">
          <span
            className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
              dep.direct
                ? 'border-accent-500/20 bg-accent-500/10 text-accent-400'
                : 'border-base-600 bg-base-800 text-gray-500'
            }`}
          >
            {dep.direct ? 'Direct' : 'Indirect'}
          </span>
        </div>
      </CardBody>
    </Card>
  );
}

function navigateToEntity(
  navigate: (path: string) => void,
  dep: { type: EntityType; id: string; name: string },
) {
  if (dep.type === 'package') {
    navigate(`/packages/${dep.name}`);
  } else if (dep.type === 'repository') {
    const parts = dep.id.replace('repo:', '').split('/');
    if (parts.length >= 2) {
      navigate(`/repositories/${parts[0]}/${parts[1]}`);
    }
  }
}
