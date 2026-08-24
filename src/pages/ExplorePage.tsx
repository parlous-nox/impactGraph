import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Package, GitBranch, ArrowRight, Link2, Star } from 'lucide-react';
import { api } from '@/api/client';
import type { Package as Pkg, Repository as Repo } from '@/api/types';
import { PageContainer } from '@/components/layout/PageContainer';
import { GlobalSearch } from '@/components/search/GlobalSearch';
import { Card, CardBody } from '@/components/ui/Card';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { EntityBadge } from '@/components/ui/EntityBadge';

export function ExplorePage() {
  const navigate = useNavigate();
  const [popularPackages, setPopularPackages] = useState<Pkg[]>([]);
  const [popularRepos, setPopularRepos] = useState<Repo[]>([]);
  const [chains, setChains] = useState<
    { label: string; path: { id: string; label: string; type: 'package' | 'repository' | 'organization' }[] }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getPopularPackages(), api.getPopularRepositories(), api.getInterestingChains()])
      .then(([pkgs, repos, ch]) => {
        setPopularPackages(pkgs);
        setPopularRepos(repos);
        setChains(ch);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageContainer maxWidth="wide" className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-100">Explore the dependency network</h1>
        <p className="mt-1 text-sm text-gray-500">
          Search for a package or repository to investigate its connections.
        </p>
      </div>

      {/* Search */}
      <div className="mb-10 max-w-2xl">
        <GlobalSearch variant="page" />
      </div>

      {/* Popular Packages */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <Package className="h-4 w-4 text-accent-400" />
          <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-wide">Popular Packages</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
            : popularPackages.map((pkg) => (
                <Card key={pkg.id} hoverable onClick={() => navigate(`/packages/${pkg.name}`)}>
                  <CardBody>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-accent-400" />
                        <span className="text-sm font-semibold text-gray-100">{pkg.name}</span>
                      </div>
                      <span className="text-[10px] text-gray-600 font-mono">{pkg.version}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{pkg.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <span className="text-gray-600">Depends on</span>
                        <span className="font-medium text-gray-300">{pkg.dependencyCount}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-gray-600">Used by</span>
                        <span className="font-medium text-gray-300">{pkg.dependentCount}</span>
                      </span>
                      <span className="ml-auto text-[10px] text-gray-600">{pkg.ecosystem}</span>
                    </div>
                  </CardBody>
                </Card>
              ))}
        </div>
      </section>

      {/* Popular Repositories */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-emerald-400" />
          <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-wide">Popular Repositories</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : popularRepos.map((repo) => (
                <Card key={repo.id} hoverable onClick={() => navigate(`/repositories/${repo.owner}/${repo.name}`)}>
                  <CardBody>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm font-semibold text-gray-100">{repo.fullName}</span>
                      </div>
                      {repo.stars !== undefined && repo.stars > 0 && (
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                          <Star className="h-3 w-3" />
                          {(repo.stars / 1000).toFixed(0)}k
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{repo.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <span className="text-gray-600">Dependencies</span>
                        <span className="font-medium text-gray-300">{repo.totalDependencies}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-gray-600">Language</span>
                        <span className="font-medium text-gray-300">{repo.primaryLanguage}</span>
                      </span>
                    </div>
                  </CardBody>
                </Card>
              ))}
        </div>
      </section>

      {/* Interesting Dependency Chains */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <Link2 className="h-4 w-4 text-amber-400" />
          <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-wide">Interesting Dependency Chains</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : chains.map((chain, idx) => (
                <Card key={idx} hoverable onClick={() => {
                  // Navigate to the first entity's page
                  const first = chain.path[0];
                  if (first.type === 'repository') {
                    const parts = first.id.replace('repo:', '').split('/');
                    navigate(`/repositories/${parts[0]}/${parts[1]}`);
                  } else if (first.type === 'package') {
                    navigate(`/packages/${first.label}`);
                  }
                }}>
                  <CardBody>
                    <p className="text-xs text-gray-500 mb-3">{chain.label}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {chain.path.map((node, i) => (
                        <div key={node.id} className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 rounded-lg border border-base-700 bg-base-800 px-2.5 py-1">
                            {node.type === 'package' && <Package className="h-3 w-3 text-accent-400" />}
                            {node.type === 'repository' && <GitBranch className="h-3 w-3 text-emerald-400" />}
                            <span className="text-xs font-medium text-gray-300">{node.label}</span>
                          </div>
                          {i < chain.path.length - 1 && (
                            <ArrowRight className="h-3 w-3 text-gray-700" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              ))}
        </div>
      </section>
    </PageContainer>
  );
}
