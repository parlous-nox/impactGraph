export type EntityType = 'package' | 'repository' | 'organization';

export type EdgeType = 'DEPENDS_ON' | 'OWNED_BY' | 'CONTRIBUTED_TO';

export interface Package {
  id: string;
  name: string;
  version: string;
  ecosystem: string;
  description: string;
  dependencyCount: number;
  dependentCount: number;
  connectedRepositoryCount: number;
  dependencies: string[];
  dependents: string[];
  homepage?: string;
  license?: string;
}

export interface Repository {
  id: string;
  owner: string;
  name: string;
  fullName: string;
  description: string;
  primaryLanguage: string;
  totalDependencies: number;
  directDependencies: number;
  transitiveDependencies: number;
  connectedPackages: number;
  dependencyPackages: string[];
  organizationId?: string;
  stars?: number;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  repositoryCount: number;
  repositoryIds: string[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: EntityType;
  metadata?: {
    ecosystem?: string;
    version?: string;
    language?: string;
    description?: string;
    dependencyCount?: number;
    dependentCount?: number;
    connectedRepositoryCount?: number;
  };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface ImpactSummary {
  packageId: string;
  packageName: string;
  totalEntities: number;
  directDependents: number;
  indirectDependents: number;
  relatedPackages: number;
}

export interface ImpactPath {
  id: string;
  sourceId: string;
  targetId: string;
  hops: number;
  nodes: GraphNode[];
  edges: GraphEdge[];
  direction: 'dependents' | 'dependencies';
}

export interface ImpactAnalysis {
  summary: ImpactSummary;
  paths: ImpactPath[];
  affectedEntities: GraphNode[];
}

export interface DependencyPath {
  id: string;
  sourceId: string;
  targetId: string;
  hops: number;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface SearchResult {
  type: EntityType;
  id: string;
  name: string;
  description: string;
  ecosystem?: string;
  language?: string;
  owner?: string;
}
