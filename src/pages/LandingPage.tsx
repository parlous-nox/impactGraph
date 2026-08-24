import { useNavigate } from 'react-router-dom';
import { Share2, ArrowRight, Compass, Route, Zap, Package, GitBranch } from 'lucide-react';
import { GlobalSearch } from '@/components/search/GlobalSearch';
import { PageContainer } from '@/components/layout/PageContainer';

const exampleSearches = ['requests', 'fastapi', 'pydantic', 'zulip/zulip'];

const stats = [
  { label: 'Repositories', value: '150+' },
  { label: 'Packages', value: '320+' },
  { label: 'Relationships', value: '1,800+' },
];

const features = [
  {
    icon: Compass,
    title: 'Explore',
    description: 'Navigate the dependency network visually.',
  },
  {
    icon: Route,
    title: 'Trace',
    description: 'Understand how two entities are connected.',
  },
  {
    icon: Zap,
    title: 'Analyze impact',
    description: 'See what could be affected by a dependency.',
  },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent-500/5 via-transparent to-transparent" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 transform">
          <div className="h-[400px] w-[600px] rounded-full bg-accent-500/10 blur-[120px]" />
        </div>

        <PageContainer className="relative pt-20 pb-16 sm:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            {/* Logo */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-500/10 border border-accent-500/20">
                <Share2 className="h-7 w-7 text-accent-400" />
              </div>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-50 sm:text-5xl">
              ImpactGraph
            </h1>
            <p className="mt-3 text-lg text-gray-400">
              Understand how software dependencies connect.
            </p>
            <p className="mx-auto mt-4 max-w-xl text-sm text-gray-500 leading-relaxed">
              Explore repositories, packages, and dependency paths. Trace relationships across
              multiple hops and understand what could be affected when a dependency changes.
            </p>

            {/* Search */}
            <div className="mx-auto mt-8 max-w-xl">
              <GlobalSearch variant="hero" autoFocus />
            </div>

            {/* Example searches */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-gray-600">Try searching for</span>
              {exampleSearches.map((q) => (
                <button
                  key={q}
                  onClick={() => navigate(q.includes('/') ? `/repositories/${q}` : `/packages/${q}`)}
                  className="rounded-full border border-base-700 bg-base-800/50 px-3 py-1 text-xs text-gray-400 hover:border-accent-500/30 hover:text-accent-300 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Stats */}
      <section className="border-y border-base-800 bg-base-900/30">
        <PageContainer>
          <div className="grid grid-cols-3 gap-4 py-10">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-gray-100 sm:text-3xl">{stat.value}</div>
                <div className="mt-1 label-meta">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="pb-4 text-center">
            <span className="text-[11px] text-gray-700">Demo data — illustrative network statistics</span>
          </div>
        </PageContainer>
      </section>

      {/* Features */}
      <section className="py-16">
        <PageContainer>
          <div className="grid gap-5 sm:grid-cols-3">
            {features.map((feature, idx) => (
              <div
                key={feature.title}
                className="card p-6 card-hover animate-slide-up"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500/10 border border-accent-500/20">
                  <feature.icon className="h-5 w-5 text-accent-400" />
                </div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-600">{idx + 1}</span>
                  <h3 className="text-base font-semibold text-gray-100">{feature.title}</h3>
                </div>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Graph preview */}
      <section className="pb-20">
        <PageContainer>
          <div className="card overflow-hidden">
            <div className="border-b border-base-700 p-5">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-accent-400" />
                <h3 className="text-sm font-semibold text-gray-100">Dependency Graph Preview</h3>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                A sample of how packages connect in the network
              </p>
            </div>
            <div className="p-6">
              <div className="flex flex-col items-center gap-3">
                {/* Simple visual preview */}
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 rounded-lg border border-accent-500/30 bg-accent-500/10 px-4 py-2">
                    <Package className="h-4 w-4 text-accent-400" />
                    <span className="text-sm font-medium text-accent-300">requests</span>
                  </div>
                  <div className="h-6 w-px bg-base-600" />
                  <div className="flex gap-6">
                    {['urllib3', 'certifi', 'idna'].map((pkg) => (
                      <div key={pkg} className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2 rounded-lg border border-base-600 bg-base-800 px-3 py-1.5">
                          <Package className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-xs font-medium text-gray-300">{pkg}</span>
                        </div>
                        <div className="h-4 w-px bg-base-700" />
                        <div className="flex items-center gap-1.5 rounded-lg border border-base-700 bg-base-850 px-2.5 py-1">
                          <GitBranch className="h-3 w-3 text-emerald-400" />
                          <span className="text-[11px] text-gray-500">project</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => navigate('/explore')}
                  className="mt-6 flex items-center gap-1.5 text-sm text-accent-400 hover:text-accent-300 transition-colors"
                >
                  Explore the full network
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>
    </div>
  );
}
