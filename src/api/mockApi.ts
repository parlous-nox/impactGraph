import type {
  Package,
  Repository,
  Organization,
  GraphData,
  GraphNode,
  GraphEdge,
  ImpactAnalysis,
  ImpactPath,
  DependencyPath,
  SearchResult,
  EntityType,
} from './types';
import {
  packages,
  repositories,
  organizations,
  allNodes,
  allEdges,
  getNodeById,
  getPackageById,
  getPackageByName,
  getRepositoryByOwnerName,
  getRepositoryById,
  getOrganizationById,
  traverseGraph,
  findPath,
  findAllPaths,
  getOutgoingNeighbors,
  getIncomingNeighbors,
} from './mockData';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay(): Promise<void> {
  return delay(200 + Math.random() * 300);
}

function packageToSearchResult(pkg: Package): SearchResult {
  return {
    type: 'package',
    id: pkg.id,
    name: pkg.name,
    description: pkg.description,
    ecosystem: pkg.ecosystem,
  };
}

function repoToSearchResult(repo: Repository): SearchResult {
  return {
    type: 'repository',
    id: repo.id,
    name: repo.fullName,
    description: repo.description,
    language: repo.primaryLanguage,
    owner: repo.owner,
  };
}

export const mockApi = {
  async searchEntities(query: string): Promise<SearchResult[]> {
    await randomDelay();
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    const results: SearchResult[] = [];

    for (const pkg of packages) {
      if (pkg.name.toLowerCase().includes(q) || pkg.description.toLowerCase().includes(q)) {
        results.push(packageToSearchResult(pkg));
      }
    }

    for (const repo of repositories) {
      if (
        repo.fullName.toLowerCase().includes(q) ||
        repo.description.toLowerCase().includes(q)
      ) {
        results.push(repoToSearchResult(repo));
      }
    }

    return results.slice(0, 12);
  },

  async getPackage(name: string): Promise<Package | null> {
    await randomDelay();
    return getPackageByName(name) ?? null;
  },

  async getRepository(owner: string, name: string): Promise<Repository | null> {
    await randomDelay();
    return getRepositoryByOwnerName(owner, name) ?? null;
  },

  async getOrganization(id: string): Promise<Organization | null> {
    await randomDelay();
    return getOrganizationById(id) ?? null;
  },

  async getGraph(
    entityType: EntityType,
    entityId: string,
    depth: number,
  ): Promise<GraphData> {
    await randomDelay();
    const { nodes, edges } = traverseGraph(entityId, depth, 'both');
    return { nodes, edges };
  },

  async getDependencies(entityId: string): Promise<GraphNode[]> {
    await randomDelay();
    const depIds = getOutgoingNeighbors(entityId);
    return depIds.map((id) => getNodeById(id)).filter(Boolean) as GraphNode[];
  },

  async getDependents(entityId: string): Promise<GraphNode[]> {
    await randomDelay();
    const depIds = getIncomingNeighbors(entityId);
    return depIds.map((id) => getNodeById(id)).filter(Boolean) as GraphNode[];
  },

  async runImpactAnalysis(
    packageName: string,
    depth: number,
    direction: 'dependents' | 'dependencies' = 'dependents',
  ): Promise<ImpactAnalysis | null> {
    await delay(600 + Math.random() * 400);

    const pkg = getPackageByName(packageName);
    if (!pkg) return null;

    const { nodes, edges } = traverseGraph(
      pkg.id,
      depth,
      direction === 'dependents' ? 'incoming' : 'outgoing',
    );

    // Separate direct vs indirect
    const directNeighborIds =
      direction === 'dependents'
        ? getIncomingNeighbors(pkg.id)
        : getOutgoingNeighbors(pkg.id);

    const directNodes = nodes.filter((n) => directNeighborIds.includes(n.id));
    const indirectNodes = nodes.filter(
      (n) => n.id !== pkg.id && !directNeighborIds.includes(n.id),
    );

    const relatedPackages = nodes.filter((n) => n.type === 'package' && n.id !== pkg.id);

    // Build impact paths
    const allPaths = findAllPaths(pkg.id, depth, direction);
    const impactPaths: ImpactPath[] = allPaths.slice(0, 15).map((p, idx) => ({
      id: `impact-path-${idx}`,
      sourceId: p.nodes[0].id,
      targetId: p.nodes[p.nodes.length - 1].id,
      hops: p.nodes.length - 1,
      nodes: p.nodes,
      edges: p.edges,
      direction,
    }));

    return {
      summary: {
        packageId: pkg.id,
        packageName: pkg.name,
        totalEntities: nodes.length - 1,
        directDependents: directNodes.length,
        indirectDependents: indirectNodes.length,
        relatedPackages: relatedPackages.length,
      },
      paths: impactPaths,
      affectedEntities: nodes.filter((n) => n.id !== pkg.id),
    };
  },

  async findDependencyPath(
    sourceId: string,
    targetId: string,
  ): Promise<DependencyPath | null> {
    await randomDelay();
    return findPath(sourceId, targetId);
  },

  async getPopularPackages(): Promise<Package[]> {
    await delay(150);
    const popularNames = ['requests', 'fastapi', 'pydantic', 'urllib3', 'starlette'];
    return popularNames
      .map((name) => getPackageByName(name))
      .filter(Boolean) as Package[];
  },

  async getPopularRepositories(): Promise<Repository[]> {
    await delay(150);
    const popularFullNames = [
      'zulip/zulip',
      'fastapi/fastapi',
      'pydantic/pydantic',
      'encode/starlette',
    ];
    return popularFullNames
      .map((fullName) => {
        const [owner, name] = fullName.split('/');
        return getRepositoryByOwnerName(owner, name);
      })
      .filter(Boolean) as Repository[];
  },

  async getInterestingChains(): Promise<
    { label: string; path: { id: string; label: string; type: EntityType }[] }[]
  > {
    await delay(200);
    return [
      {
        label: 'zulip/zulip → fastapi → starlette',
        path: [
          { id: 'repo:zulip/zulip', label: 'zulip/zulip', type: 'repository' },
          { id: 'pkg:fastapi', label: 'fastapi', type: 'package' },
          { id: 'pkg:starlette', label: 'starlette', type: 'package' },
        ],
      },
      {
        label: 'project-alpha → fastapi → pydantic',
        path: [
          { id: 'repo:project-alpha/project-alpha', label: 'project-alpha', type: 'repository' },
          { id: 'pkg:fastapi', label: 'fastapi', type: 'package' },
          { id: 'pkg:pydantic', label: 'pydantic', type: 'package' },
        ],
      },
      {
        label: 'ansible/ansible → ansible-core → jinja2 → markupsafe',
        path: [
          { id: 'repo:ansible/ansible', label: 'ansible/ansible', type: 'repository' },
          { id: 'pkg:ansible-core', label: 'ansible-core', type: 'package' },
          { id: 'pkg:jinja2', label: 'jinja2', type: 'package' },
          { id: 'pkg:markupsafe', label: 'markupsafe', type: 'package' },
        ],
      },
      {
        label: 'project-gamma → botocore → urllib3 → certifi',
        path: [
          { id: 'repo:project-gamma/project-gamma', label: 'project-gamma', type: 'repository' },
          { id: 'pkg:botocore', label: 'botocore', type: 'package' },
          { id: 'pkg:urllib3', label: 'urllib3', type: 'package' },
          { id: 'pkg:certifi', label: 'certifi', type: 'package' },
        ],
      },
    ];
  },

  async getPackageDependencies(packageName: string): Promise<Package[]> {
    await randomDelay();
    const pkg = getPackageByName(packageName);
    if (!pkg) return [];
    return pkg.dependencies
      .map((id) => getPackageById(id))
      .filter(Boolean) as Package[];
  },

  async getPackageDependents(packageName: string): Promise<{ type: EntityType; id: string; name: string; description: string; ecosystem?: string; language?: string; direct: boolean }[]> {
    await randomDelay();
    const pkg = getPackageByName(packageName);
    if (!pkg) return [];

    const results: { type: EntityType; id: string; name: string; description: string; ecosystem?: string; language?: string; direct: boolean }[] = [];

    // Direct dependents (packages)
    for (const depId of pkg.dependents) {
      const depPkg = getPackageById(depId);
      if (depPkg) {
        results.push({
          type: 'package',
          id: depPkg.id,
          name: depPkg.name,
          description: depPkg.description,
          ecosystem: depPkg.ecosystem,
          direct: true,
        });
      }
    }

    // Direct dependents (repositories that list this package)
    for (const repo of repositories) {
      if (repo.dependencyPackages.includes(pkg.id)) {
        results.push({
          type: 'repository',
          id: repo.id,
          name: repo.fullName,
          description: repo.description,
          language: repo.primaryLanguage,
          direct: true,
        });
      }
    }

    // Indirect dependents — traverse incoming two hops
    const indirectIds = new Set<string>();
    for (const depId of pkg.dependents) {
      const depPkg = getPackageById(depId);
      if (depPkg) {
        for (const indirectId of depPkg.dependents) {
          if (indirectId !== pkg.id && !pkg.dependents.includes(indirectId)) {
            indirectIds.add(indirectId);
          }
        }
      }
    }

    for (const indirectId of indirectIds) {
      const indirectPkg = getPackageById(indirectId);
      if (indirectPkg) {
        results.push({
          type: 'package',
          id: indirectPkg.id,
          name: indirectPkg.name,
          description: indirectPkg.description,
          ecosystem: indirectPkg.ecosystem,
          direct: false,
        });
      }
    }

    // Indirect repositories — repos that depend on packages that depend on this package
    for (const repo of repositories) {
      if (repo.dependencyPackages.includes(pkg.id)) continue;
      for (const depId of pkg.dependents) {
        if (repo.dependencyPackages.includes(depId)) {
          results.push({
            type: 'repository',
            id: repo.id,
            name: repo.fullName,
            description: repo.description,
            language: repo.primaryLanguage,
            direct: false,
          });
          break;
        }
      }
    }

    return results;
  },

  async getRepositoryDependencies(owner: string, name: string): Promise<Package[]> {
    await randomDelay();
    const repo = getRepositoryByOwnerName(owner, name);
    if (!repo) return [];
    return repo.dependencyPackages
      .map((id) => getPackageById(id))
      .filter(Boolean) as Package[];
  },

  async getNodeNeighbors(nodeId: string): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
    await randomDelay();
    const { nodes, edges } = traverseGraph(nodeId, 1, 'both');
    return { nodes: nodes.filter((n) => n.id !== nodeId), edges };
  },

  getAllNodes(): GraphNode[] {
    return allNodes;
  },

  getAllEdges(): GraphEdge[] {
    return allEdges;
  },
};
