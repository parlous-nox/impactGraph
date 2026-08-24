import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Zap,
  ChevronRight,
  Package as PackageIcon,
  GitBranch,
  ArrowRight,
  Route,
  Layers,
  Users,
  Boxes,
} from 'lucide-react';
import { api } from '@/api/client';
import type { ImpactAnalysis, Package as Pkg, DependencyPath, EntityType, GraphNode } from '@/api/types';
import { PageContainer } from '@/components/layout/PageContainer';
import { EntityBadge } from '@/components/ui/EntityBadge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/States';
import { PathGraph } from '@/components/graph/PathGraph';
import { Dialog } from '@/components/ui/Dialog';

export function ImpactPage() {
  const { packageName } = useParams<{ packageName: string }>();
  const navigate = useNavigate();

  const [pkg, setPkg] = useState<Pkg | null>(null);
  const [depth, setDepth] = useState(3);
  const [direction, setDirection] = useState<'dependents' | 'dependencies'>('dependents');
  const [analysis, setAnalysis] = useState<ImpactAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [pkgLoading, setPkgLoading] = useState(true);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [pathDialog, setPathDialog] = useState<DependencyPath | null>(null);

  useEffect(() => {
    if (!packageName) return;
    setPkgLoading(true);
    api.getPackage(packageName).then((p) => {
      setPkg(p);
      setPkgLoading(false);
    });
  }, [packageName]);

  const runAnalysis = async () => {
    if (!packageName) return;
    setLoading(true);
    setHasAnalyzed(true);
    setAnalysis(null);
    const result = await api.runImpactAnalysis(packageName, depth, direction);
    setAnalysis(result);
    setLoading(false);
  };

  const handlePathClick = (path: { nodes: GraphNode[]; edges: any[] }) => {
    const depPath: DependencyPath = {
      id: `path:${path.nodes[0].id}->${path.nodes[path.nodes.length - 1].id}`,
      sourceId: path.nodes[0].id,
      targetId: path.nodes[path.nodes.length - 1].id,
      hops: path.nodes.length - 1,
      nodes: path.nodes,
      edges: path.edges,
    };
    setPathDialog(depPath);
  };

  if (pkgLoading) {
    return (
      <PageContainer maxWidth="wide" className="py-8">
        <div className="mb-6 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-64 w-full" />
      </PageContainer>
    );
  }

  if (!pkg) {
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

  return (
    <PageContainer maxWidth="wide" className="py-8">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-gray-600">
        <Link to="/explore" className="hover:text-gray-400 transition-colors">Explore</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to={`/packages/${pkg.name}`} className="hover:text-gray-400 transition-colors">{pkg.name}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-400">Impact Analysis</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-400" />
          <h1 className="text-2xl font-bold text-gray-100">Impact Analysis</h1>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Understand what could be affected by changes to this package.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <EntityBadge type="package" />
          <span className="text-sm font-medium text-gray-200">{pkg.name}</span>
          <span className="text-xs text-gray-600">{pkg.ecosystem}</span>
        </div>
      </div>

      {/* Controls */}
      <Card className="mb-6">
        <CardBody>
          <div className="flex flex-wrap items-end gap-6">
            {/* Depth */}
            <div>
              <div className="label-meta mb-2">Traversal Depth</div>
              <div className="flex overflow-hidden rounded-lg border border-base-700">
                {[1, 2, 3, 4].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDepth(d)}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
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

            {/* Direction */}
            <div>
              <div className="label-meta mb-2">Impact Direction</div>
              <div className="flex overflow-hidden rounded-lg border border-base-700">
                <button
                  onClick={() => setDirection('dependents')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    direction === 'dependents'
                      ? 'bg-accent-500 text-base-950'
                      : 'bg-base-800 text-gray-400 hover:bg-base-700'
                  }`}
                >
                  Dependents
                </button>
                <button
                  onClick={() => setDirection('dependencies')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    direction === 'dependencies'
                      ? 'bg-accent-500 text-base-950'
                      : 'bg-base-800 text-gray-400 hover:bg-base-700'
                  }`}
                >
                  Dependencies
                </button>
              </div>
            </div>

            <Button variant="primary" onClick={runAnalysis} loading={loading}>
              <Zap className="h-4 w-4" />
              Analyze Impact
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Results */}
      {loading && (
        <LoadingState message="Traversing dependency graph..." />
      )}

      {!loading && !hasAnalyzed && (
        <EmptyState
          icon={<Zap className="h-7 w-7 text-gray-500" />}
          title="Ready to analyze"
          message="Configure the depth and direction, then click Analyze Impact to see what could be affected."
        />
      )}

      {!loading && hasAnalyzed && analysis && (
        <div className="space-y-6 animate-fade-in">
          {/* Summary */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-lg font-semibold text-gray-100">{analysis.summary.packageName}</span>
              <span className="text-sm text-gray-500">
                {analysis.summary.totalEntities} potentially connected entities
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <SummaryCard
                icon={<Users className="h-4 w-4 text-accent-400" />}
                label="Direct Dependents"
                value={analysis.summary.directDependents}
              />
              <SummaryCard
                icon={<Layers className="h-4 w-4 text-amber-400" />}
                label="Indirect Dependents"
                value={analysis.summary.indirectDependents}
              />
              <SummaryCard
                icon={<Boxes className="h-4 w-4 text-emerald-400" />}
                label="Related Packages"
                value={analysis.summary.relatedPackages}
              />
            </div>
          </div>

          {/* Direct Impact */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="label-meta">Direct Impact</span>
            </div>
            <Card>
              <CardBody>
                <p className="text-sm text-gray-400">
                  <span className="font-semibold text-gray-200">{analysis.summary.directDependents}</span>{' '}
                  {direction === 'dependents' ? 'repositories directly depend on' : 'packages are direct dependencies of'}{' '}
                  <span className="font-medium text-accent-300">{analysis.summary.packageName}</span>.
                </p>
              </CardBody>
            </Card>
          </div>

          {/* Indirect Impact */}
          {analysis.summary.indirectDependents > 0 && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="label-meta">Indirect Impact</span>
              </div>
              <Card>
                <CardBody>
                  <p className="text-sm text-gray-400">
                    <span className="font-semibold text-gray-200">{analysis.summary.indirectDependents}</span>{' '}
                    {direction === 'dependents' ? 'repositories are connected through' : 'packages are connected through'}{' '}
                    additional dependency hops.
                  </p>
                </CardBody>
              </Card>
            </div>
          )}

          {/* Dependency Paths */}
          {analysis.paths.length > 0 && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Route className="h-4 w-4 text-amber-400" />
                <span className="label-meta">Dependency Paths</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {analysis.paths.map((path, idx) => (
                  <Card key={path.id} hoverable onClick={() => handlePathClick(path)}>
                    <CardBody>
                      <div className="flex items-center gap-2 flex-wrap">
                        {path.nodes.map((node, i) => (
                          <div key={node.id} className="flex items-center gap-1.5">
                            <div className="flex items-center gap-1 rounded-lg border border-base-700 bg-base-800 px-2 py-0.5">
                              {node.type === 'package' && <PackageIcon className="h-3 w-3 text-accent-400" />}
                              {node.type === 'repository' && <GitBranch className="h-3 w-3 text-emerald-400" />}
                              <span className="text-xs font-medium text-gray-300">{node.label}</span>
                            </div>
                            {i < path.nodes.length - 1 && <ArrowRight className="h-3 w-3 text-gray-700" />}
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-xs text-gray-600">
                        {path.hops}-hop {direction === 'dependents' ? 'dependent' : 'dependency'} path
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!loading && hasAnalyzed && !analysis && (
        <EmptyState
          icon={<Zap className="h-7 w-7 text-gray-500" />}
          title="No impact found"
          message="No connected entities were found for this analysis configuration."
        />
      )}

      {/* Path visualization dialog */}
      <Dialog
        open={!!pathDialog}
        onClose={() => setPathDialog(null)}
        title="Dependency Path"
        maxWidth="max-w-3xl"
      >
        {pathDialog && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              {pathDialog.nodes.map((node, i) => (
                <div key={node.id} className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-lg border border-base-700 bg-base-800 px-3 py-1.5">
                    {node.type === 'package' && <PackageIcon className="h-3.5 w-3.5 text-accent-400" />}
                    {node.type === 'repository' && <GitBranch className="h-3.5 w-3.5 text-emerald-400" />}
                    <span className="text-sm font-medium text-gray-200">{node.label}</span>
                  </div>
                  {i < pathDialog.nodes.length - 1 && <ArrowRight className="h-4 w-4 text-gray-600" />}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="label-meta">Hops</span>
              <span className="text-gray-300">{pathDialog.hops}</span>
            </div>
            <div className="h-[300px] rounded-lg border border-base-700 bg-base-900/30">
              <PathGraph path={pathDialog} />
            </div>
          </div>
        )}
      </Dialog>
    </PageContainer>
  );
}

function SummaryCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card>
      <CardBody className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-base-800 border border-base-700">
          {icon}
        </div>
        <div>
          <div className="label-meta">{label}</div>
          <div className="text-2xl font-bold text-gray-100">{value}</div>
        </div>
      </CardBody>
    </Card>
  );
}
