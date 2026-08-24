import { useEffect, useRef } from 'react';
import cytoscape, { type Core, type ElementDefinition } from 'cytoscape';
import type { GraphData, EntityType } from '@/api/types';

interface CytoscapeGraphProps {
  data: GraphData;
  selectedNodeId?: string | null;
  pathNodeIds?: string[];
  onNodeSelect?: (nodeId: string) => void;
  onCanvasClick?: () => void;
  filters?: Set<EntityType>;
  layoutName?: string;
  fitSignal?: number;
  resetSignal?: number;
}

const nodeColorMap: Record<EntityType, string> = {
  package: '#22d3ee',
  repository: '#34d399',
  organization: '#fbbf24',
};

const nodeShapeMap: Record<EntityType, string> = {
  package: 'round-rectangle',
  repository: 'diamond',
  organization: 'hexagon',
};

export function CytoscapeGraph({
  data,
  selectedNodeId,
  pathNodeIds,
  onNodeSelect,
  onCanvasClick,
  filters,
  layoutName = 'breadthfirst',
  fitSignal = 0,
  resetSignal = 0,
}: CytoscapeGraphProps) {
  const cyRef = useRef<Core | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Cytoscape once
  useEffect(() => {
    if (!containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      wheelSensitivity: 0.3,
      minZoom: 0.2,
      maxZoom: 3,
      style: [
        {
          selector: 'node',
          style: {
            label: 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': '10px',
            'font-family': 'Inter, sans-serif',
            'font-weight': 500,
            color: '#e5e7eb',
            'text-wrap': 'wrap',
            'text-max-width': '80px',
            width: 'data(width)',
            height: 'data(width)',
            'background-color': 'data(bg)',
            'border-color': 'data(border)',
            'border-width': 2,
            shape: 'data(shape)' as any,
            'text-margin-y': 2,
            'text-outline-color': '#0a0b0d',
            'text-outline-width': 2,
            'text-outline-opacity': 0.8,
          },
        },
        {
          selector: 'node:selected',
          style: {
            'border-color': '#22d3ee',
            'border-width': 4,
            'background-color': '#0e7490',
            'font-size': '11px',
            'font-weight': 600,
            color: '#ecfeff',
          },
        },
        {
          selector: 'node.dimmed',
          style: {
            opacity: 0.2,
          },
        },
        {
          selector: 'node.path-highlight',
          style: {
            'border-color': '#fbbf24',
            'border-width': 3,
            'background-color': 'data(bg)',
            opacity: 1,
          },
        },
        {
          selector: 'edge',
          style: {
            width: 1.5,
            'line-color': '#2a2f37',
            'target-arrow-color': '#3a4250',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'arrow-scale': 0.8,
            opacity: 0.6,
          },
        },
        {
          selector: 'edge.path-highlight',
          style: {
            width: 3,
            'line-color': '#fbbf24',
            'target-arrow-color': '#fbbf24',
            opacity: 1,
          },
        },
        {
          selector: 'edge.dimmed',
          style: {
            opacity: 0.1,
          },
        },
      ],
      elements: [],
    });

    cyRef.current = cy;

    cy.on('tap', 'node', (evt) => {
      onNodeSelect?.(evt.target.id());
    });

    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        onCanvasClick?.();
      }
    });

    return () => {
      cy.destroy();
      cyRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle fit signal
  useEffect(() => {
    if (fitSignal > 0 && cyRef.current) {
      cyRef.current.fit(undefined, 40);
    }
  }, [fitSignal]);

  // Handle reset signal
  useEffect(() => {
    if (resetSignal > 0 && cyRef.current) {
      cyRef.current.fit(undefined, 40);
    }
  }, [resetSignal]);

  // Update elements when data or filters change
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.elements().remove();

    const elements: ElementDefinition[] = [];

    for (const node of data.nodes) {
      if (filters && filters.size > 0 && !filters.has(node.type)) continue;

      const baseSize = node.type === 'organization' ? 40 : node.type === 'repository' ? 50 : 45;
      const isSelected = node.id === selectedNodeId;

      elements.push({
        data: {
          id: node.id,
          label: node.label.length > 20 ? node.label.slice(0, 18) + '...' : node.label,
          bg: isSelected ? '#0e7490' : `${nodeColorMap[node.type]}22`,
          border: nodeColorMap[node.type],
          shape: nodeShapeMap[node.type],
          width: baseSize,
        },
      });
    }

    for (const edge of data.edges) {
      const sourceFiltered = filters && filters.size > 0 && !filters.has(
        data.nodes.find((n) => n.id === edge.source)?.type ?? 'package',
      );
      const targetFiltered = filters && filters.size > 0 && !filters.has(
        data.nodes.find((n) => n.id === edge.target)?.type ?? 'package',
      );
      if (sourceFiltered || targetFiltered) continue;

      elements.push({
        data: {
          id: edge.id,
          source: edge.source,
          target: edge.target,
        },
      });
    }

    cy.add(elements);

    // Apply layout
    const layoutConfig: Record<string, any> = {
      breadthfirst: {
        name: 'breadthfirst',
        directed: true,
        padding: 30,
        spacingFactor: 1.2,
        circle: false,
        animate: true,
        animationDuration: 300,
      },
      concentric: {
        name: 'concentric',
        directed: true,
        padding: 30,
        animate: true,
        animationDuration: 300,
        concentric: (node: any) => {
          if (node.id() === selectedNodeId) return 10;
          return 1;
        },
      },
      cose: {
        name: 'cose',
        directed: true,
        padding: 30,
        animate: true,
        animationDuration: 300,
        nodeRepulsion: 8000,
        idealEdgeLength: 100,
      },
    };

    cy.layout(layoutConfig[layoutName] ?? layoutConfig.breadthfirst).run();

    // Fit after layout
    setTimeout(() => {
      cy.fit(undefined, 40);
    }, 350);
  }, [data, filters, layoutName, selectedNodeId]);

  // Update selection highlight and path highlighting
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.$('node').removeClass('dimmed path-highlight');
    cy.$('edge').removeClass('dimmed path-highlight');

    // Path highlighting
    if (pathNodeIds && pathNodeIds.length > 0) {
      const pathSet = new Set(pathNodeIds);
      cy.$('node').forEach((node) => {
        if (!pathSet.has(node.id())) {
          node.addClass('dimmed');
        } else {
          node.addClass('path-highlight');
        }
      });
      cy.$('edge').forEach((edge) => {
        if (pathSet.has(edge.source().id()) && pathSet.has(edge.target().id())) {
          edge.addClass('path-highlight');
        } else {
          edge.addClass('dimmed');
        }
      });
    } else if (selectedNodeId) {
      const selected = cy.$(`#${selectedNodeId}`);
      selected.select();
      cy.$('node').not(selected).addClass('dimmed');
      cy.$('edge').not(selected.connectedEdges()).addClass('dimmed');
    }
  }, [selectedNodeId, pathNodeIds]);

  return <div ref={containerRef} className="h-full w-full" />;
}
