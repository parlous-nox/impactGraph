import type {
  Package,
  Repository,
  Organization,
  GraphData,
  GraphNode,
  GraphEdge,
  ImpactAnalysis,
  DependencyPath,
  SearchResult,
  EntityType,
} from './types';
import { mockApi } from './mockApi';

/**
 * API client abstraction layer.
 *
 * Components call these functions — they never touch mock data directly.
 * To switch to a real FastAPI backend, replace the implementations in mockApi.ts
 * with fetch() calls to the corresponding REST endpoints. The function signatures
 * stay identical, so no component code needs to change.
 */

export const api = {
  searchEntities: (query: string): Promise<SearchResult[]> => mockApi.searchEntities(query),

  getPackage: (name: string): Promise<Package | null> => mockApi.getPackage(name),

  getRepository: (owner: string, name: string): Promise<Repository | null> =>
    mockApi.getRepository(owner, name),

  getOrganization: (id: string): Promise<Organization | null> =>
    mockApi.getOrganization(id),

  getGraph: (entityType: EntityType, entityId: string, depth: number): Promise<GraphData> =>
    mockApi.getGraph(entityType, entityId, depth),

  getDependencies: (entityId: string): Promise<GraphNode[]> =>
    mockApi.getDependencies(entityId),

  getDependents: (entityId: string): Promise<GraphNode[]> =>
    mockApi.getDependents(entityId),

  runImpactAnalysis: (
    packageName: string,
    depth: number,
    direction: 'dependents' | 'dependencies' = 'dependents',
  ): Promise<ImpactAnalysis | null> => mockApi.runImpactAnalysis(packageName, depth, direction),

  findDependencyPath: (sourceId: string, targetId: string): Promise<DependencyPath | null> =>
    mockApi.findDependencyPath(sourceId, targetId),

  getPopularPackages: (): Promise<Package[]> => mockApi.getPopularPackages(),

  getPopularRepositories: (): Promise<Repository[]> => mockApi.getPopularRepositories(),

  getInterestingChains: () => mockApi.getInterestingChains(),

  getPackageDependencies: (packageName: string): Promise<Package[]> =>
    mockApi.getPackageDependencies(packageName),

  getPackageDependents: (packageName: string): Promise<
    { type: EntityType; id: string; name: string; description: string; ecosystem?: string; language?: string; direct: boolean }[]
  > => mockApi.getPackageDependents(packageName),

  getRepositoryDependencies: (owner: string, name: string): Promise<Package[]> =>
    mockApi.getRepositoryDependencies(owner, name),

  getNodeNeighbors: (nodeId: string): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> =>
    mockApi.getNodeNeighbors(nodeId),
};

export type { Package, Repository, Organization, GraphData, GraphNode, ImpactAnalysis, DependencyPath, SearchResult, EntityType };
