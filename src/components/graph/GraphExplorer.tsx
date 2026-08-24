import { useState, useCallback, useEffect } from 'react';
import type { GraphData, GraphNode, EntityType } from '@/api/types';
import { api } from '@/api/client';
import { CytoscapeGraph } from './CytoscapeGraph';
import { GraphToolbar } from './GraphToolbar';
import { GraphNodePanel } from './GraphNodePanel';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/States';
import { Network } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface GraphExplorerProps {
  initialData: GraphData;
  rootEntityId: string;
  rootEntityType: EntityType;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function GraphExplorer({
  initialData,
  rootEntityId,
  rootEntityType,
  loading = false,
  error = null,
  onRetry,
}: GraphExplorerProps) {
  const [graphData, setGraphData] = useState<GraphData>(initialData);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [depth, setDepth] = useState(2);
  const [filters, setFilters] = useState<Set<EntityType>>(new Set(['package', 'repository', 'organization']));
  const [layoutName, setLayoutName] = useState('breadthfirst');
  const [panelLoading, setPanelLoading] = useState(false);
  const [expanding, setExpanding] = useState(false);
  const [pathNodeIds, setPathNodeIds] = useState<string[] | undefined>(undefined);
  const [showPanel, setShowPanel] = useState(false);

  // Ref to trigger Cytoscape fit/reset externally
  const [fitSignal, setFitSignal] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);

  useEffect(() => {
    setGraphData(initialData);
    setSelectedNode(null);
    setShowPanel(false);
    setPathNodeIds(undefined);
  }, [initialData]);

  const handleNodeSelect = useCallback((nodeId: string) => {
    const node = graphData.nodes.find((n) => n.id === nodeId);
    if (node) {
      setSelectedNode(node);
      setShowPanel(true);
      setPanelLoading(false);
      setPathNodeIds(undefined);
    }
  }, [graphData.nodes]);

  const handleCanvasClick = useCallback(() => {
    setSelectedNode(null);
    setShowPanel(false);
    setPathNodeIds(undefined);
  }, []);

  const handleToggleFilter = (type: EntityType) => {
    setFilters((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        if (next.size > 1) next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const handleExpand = async () => {
    if (!selectedNode || expanding) return;
    setExpanding(true);
    try {
      const { nodes: newNodes, edges: newEdges } = await api.getNodeNeighbors(selectedNode.id);
      setGraphData((prev) => {
        const nodeMap = new Map(prev.nodes.map((n) => [n.id, n]));
        const edgeMap = new Map(prev.edges.map((e) => [e.id, e]));
        for (const n of newNodes) nodeMap.set(n.id, n);
        for (const e of newEdges) edgeMap.set(e.id, e);
        return {
          nodes: Array.from(nodeMap.values()),
          edges: Array.from(edgeMap.values()),
        };
      });
    } finally {
      setExpanding(false);
    }
  };

  const handleTracePath = async (targetId: string) => {
    setPanelLoading(true);
    try {
      const path = await api.findDependencyPath(rootEntityId, targetId);
      if (path) {
        setPathNodeIds(path.nodes.map((n) => n.id));
        // Also add path nodes to graph if not present
        setGraphData((prev) => {
          const nodeMap = new Map(prev.nodes.map((n) => [n.id, n]));
          const edgeMap = new Map(prev.edges.map((e) => [e.id, e]));
          for (const n of path.nodes) nodeMap.set(n.id, n);
          for (const e of path.edges) edgeMap.set(e.id, e);
          return {
            nodes: Array.from(nodeMap.values()),
            edges: Array.from(edgeMap.values()),
          };
        });
      }
    } finally {
      setPanelLoading(false);
    }
  };

  const handleFit = () => setFitSignal((s) => s + 1);
  const handleReset = () => {
    setGraphData(initialData);
    setSelectedNode(null);
    setShowPanel(false);
    setPathNodeIds(undefined);
    setResetSignal((s) => s + 1);
  };

  if (loading) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center rounded-xl border border-base-700 bg-base-900/30">
        <LoadingState message="Building dependency graph..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center rounded-xl border border-base-700 bg-base-900/30">
        <EmptyState
          icon={<Network className="h-7 w-7 text-gray-500" />}
          title="Couldn't load graph"
          message={error}
          action={onRetry && <Button variant="secondary" size="sm" onClick={onRetry}>Try Again</Button>}
        />
      </div>
    );
  }

  if (graphData.nodes.length === 0) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center rounded-xl border border-base-700 bg-base-900/30">
        <EmptyState
          icon={<Network className="h-7 w-7 text-gray-500" />}
          title="No dependency relationships found"
          message="This entity doesn't have any connections in the network yet."
        />
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[400px] overflow-hidden rounded-xl border border-base-700 bg-base-900/30">
      <GraphToolbar
        depth={depth}
        onDepthChange={setDepth}
        filters={filters}
        onToggleFilter={handleToggleFilter}
        onFit={handleFit}
        onReset={handleReset}
        onExpand={handleExpand}
        canExpand={!!selectedNode && !expanding}
        layoutName={layoutName}
        onLayoutChange={setLayoutName}
      />

      <div className="relative h-[calc(100%-52px)]">
        <CytoscapeGraph
          data={graphData}
          selectedNodeId={selectedNode?.id ?? null}
          pathNodeIds={pathNodeIds}
          onNodeSelect={handleNodeSelect}
          onCanvasClick={handleCanvasClick}
          filters={filters}
          layoutName={layoutName}
          fitSignal={fitSignal}
          resetSignal={resetSignal}
        />

        {expanding && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg border border-base-700 bg-base-850 px-4 py-2 text-xs text-gray-400 shadow-xl animate-fade-in">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-accent-500 border-t-transparent" />
              Expanding graph...
            </span>
          </div>
        )}

        {showPanel && selectedNode && (
          <>
            {/* Mobile backdrop */}
            <div
              className="absolute inset-0 z-10 bg-black/40 md:hidden"
              onClick={() => setShowPanel(false)}
            />
            <GraphNodePanel
              node={selectedNode}
              onClose={() => setShowPanel(false)}
              onExpand={handleExpand}
              onTracePath={handleTracePath}
              loading={panelLoading}
            />
          </>
        )}
      </div>
    </div>
  );
}
