import { Share2, Network, Route, Zap, Package, GitBranch, Building2 } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardBody } from '@/components/ui/Card';

export function AboutPage() {
  return (
    <PageContainer className="py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-500/10 border border-accent-500/20">
            <Share2 className="h-6 w-6 text-accent-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-100">About ImpactGraph</h1>
        <p className="mt-2 text-sm text-gray-500 max-w-xl mx-auto">
          ImpactGraph helps you explore relationships between software repositories and packages.
        </p>
      </div>

      {/* What the graph represents */}
      <Card className="mb-6">
        <CardBody>
          <h2 className="text-base font-semibold text-gray-100 mb-4">What the Graph Represents</h2>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            The dependency network is made up of three types of entities connected by relationships:
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <EntityTypeCard
              icon={<Package className="h-5 w-5 text-accent-400" />}
              label="Packages"
              description="Published libraries like requests, fastapi, or pydantic."
            />
            <EntityTypeCard
              icon={<GitBranch className="h-5 w-5 text-emerald-400" />}
              label="Repositories"
              description="Source code repositories like zulip/zulip or fastapi/fastapi."
            />
            <EntityTypeCard
              icon={<Building2 className="h-5 w-5 text-amber-400" />}
              label="Organizations"
              description="Groups that own repositories, like Encode or the Python Software Foundation."
            />
          </div>
          <p className="mt-4 text-sm text-gray-500 leading-relaxed">
            These entities are connected by dependency relationships — one package depends on another,
            a repository depends on packages, and organizations own repositories.
          </p>
        </CardBody>
      </Card>

      {/* What you can do */}
      <Card className="mb-6">
        <CardBody>
          <h2 className="text-base font-semibold text-gray-100 mb-4">What Graph Traversal Enables</h2>
          <div className="space-y-4">
            <FeatureRow
              icon={<Network className="h-5 w-5 text-accent-400" />}
              title="Dependency Exploration"
              description="Navigate the dependency network visually — expand nodes, filter by type, and inspect connections."
            />
            <FeatureRow
              icon={<Route className="h-5 w-5 text-amber-400" />}
              title="Multi-Hop Path Tracing"
              description="Trace how two entities are connected across multiple hops, even when they aren't directly linked."
            />
            <FeatureRow
              icon={<Zap className="h-5 w-5 text-emerald-400" />}
              title="Impact Analysis"
              description="See what could be affected when a package changes — both direct and indirect dependents."
            />
          </div>
        </CardBody>
      </Card>

      {/* Note */}
      <Card>
        <CardBody>
          <p className="text-xs text-gray-600 leading-relaxed">
            ImpactGraph is a dependency investigation and visualization tool. It focuses on
            understanding graph relationships between software entities — not security
            vulnerability scanning or compliance auditing.
          </p>
        </CardBody>
      </Card>
    </PageContainer>
  );
}

function EntityTypeCard({
  icon,
  label,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-base-700 bg-base-800/50 p-4">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-base-800 border border-base-700">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-gray-100 mb-1">{label}</h3>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}

function FeatureRow({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-base-800 border border-base-700">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-100">{title}</h3>
        <p className="text-sm text-gray-500 mt-0.5">{description}</p>
      </div>
    </div>
  );
}
