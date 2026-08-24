import { useEffect, useRef } from 'react';
import cytoscape, { type Core } from 'cytoscape';
import type { DependencyPath } from '@/api/types';

interface PathGraphProps {
  path: DependencyPath;
}

const nodeColorMap = {
  package: '#22d3ee',
  repository: '#34d399',
  organization: '#fbbf24',
};

const nodeShapeMap = {
  package: 'round-rectangle',
  repository: 'diamond',
  organization: 'hexagon',
};

export function PathGraph({ path }: PathGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);

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
            'font-size': '11px',
            'font-family': 'Inter, sans-serif',
            'font-weight': 600,
            color: '#e5e7eb',
            'text-wrap': 'wrap',
            'text-max-width': '100px',
            width: 55,
            height: 55,
            'background-color': 'data(bg)',
            'border-color': 'data(border)',
            'border-width': 3,
            shape: 'data(shape)' as any,
            'text-margin-y': 2,
            'text-outline-color': '#0a0b0d',
            'text-outline-width': 2,
            'text-outline-opacity': 0.8,
          },
        },
        {
          selector: 'edge',
          style: {
            width: 3,
            'line-color': '#fbbf24',
            'target-arrow-color': '#fbbf24',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'arrow-scale': 1.2,
            opacity: 0.8,
          },
        },
      ],
      elements: [
        ...path.nodes.map((n) => ({
          data: {
            id: n.id,
            label: n.label.length > 22 ? n.label.slice(0, 20) + '...' : n.label,
            bg: `${nodeColorMap[n.type]}22`,
            border: nodeColorMap[n.type],
            shape: nodeShapeMap[n.type],
          },
        })),
        ...path.edges.map((e) => ({
          data: { id: e.id, source: e.source, target: e.target },
        })),
      ],
    });

    cyRef.current = cy;

    cy.layout({
      name: 'breadthfirst',
      directed: true,
      padding: 40,
      spacingFactor: 1.5,
      animate: true,
      animationDuration: 400,
    } as any).run();

    setTimeout(() => cy.fit(undefined, 50), 450);

    return () => {
      cy.destroy();
      cyRef.current = null;
    };
  }, [path]);

  return <div ref={containerRef} className="h-full w-full" />;
}
