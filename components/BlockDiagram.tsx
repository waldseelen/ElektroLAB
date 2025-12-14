import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BlockDiagramData, BlockNode } from '../types';

interface BlockDiagramProps {
  data: BlockDiagramData;
  activeModuleId?: string | null;
}

const BlockDiagram: React.FC<BlockDiagramProps> = ({ data, activeModuleId }) => {
  const navigate = useNavigate();

  // Simple layout logic:
  // Source -> x: 50
  // Process -> x: 250
  // Control -> x: 450
  // Actuator/Sensor -> x: 650
  
  // Group nodes by type to determine Y position
  const typeMap: Record<string, number> = { source: 0, process: 1, control: 2, actuator: 3, sensor: 3 };
  const typeX: Record<string, number> = { source: 50, process: 250, control: 450, actuator: 650, sensor: 650 };
  
  const nodesByType: Record<string, BlockNode[]> = { source: [], process: [], control: [], actuator: [], sensor: [] };
  data.nodes.forEach(node => {
    if (nodesByType[node.type]) nodesByType[node.type].push(node);
  });

  // Calculate coordinates
  const nodeCoords: Record<string, { x: number, y: number }> = {};
  const CANVAS_HEIGHT = 500;
  
  Object.keys(nodesByType).forEach(type => {
    const nodes = nodesByType[type];
    const x = typeX[type];
    const step = CANVAS_HEIGHT / (nodes.length + 1);
    nodes.forEach((node, idx) => {
      nodeCoords[node.id] = { x, y: step * (idx + 1) };
    });
  });

  const getNodeColor = (node: BlockNode) => {
    if (activeModuleId && node.moduleId === activeModuleId) return "fill-accent stroke-accent text-white";
    if (node.type === 'source') return "fill-slate-200 stroke-slate-400";
    if (node.type === 'control') return "fill-purple-100 stroke-purple-400";
    if (node.type === 'actuator') return "fill-emerald-100 stroke-emerald-400";
    if (node.type === 'sensor') return "fill-amber-100 stroke-amber-400";
    return "fill-white stroke-slate-300";
  };

  return (
    <div className="w-full overflow-x-auto border border-slate-200 rounded-lg bg-white p-4 shadow-sm">
      <svg width="800" height={CANVAS_HEIGHT} className="min-w-[800px]">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
          </marker>
        </defs>

        {/* Edges */}
        {data.edges.map((edge, idx) => {
          const start = nodeCoords[edge.from];
          const end = nodeCoords[edge.to];
          if (!start || !end) return null;

          return (
            <g key={idx}>
              <line 
                x1={start.x + 60} y1={start.y + 20} 
                x2={end.x - 60} y2={end.y + 20} 
                stroke="#94a3b8" 
                strokeWidth="2" 
                markerEnd="url(#arrowhead)" 
              />
              <text 
                x={(start.x + end.x) / 2} 
                y={(start.y + end.y) / 2 + 30} 
                className="text-[10px] fill-slate-500 font-mono text-center"
                textAnchor="middle"
              >
                {edge.label}
              </text>
            </g>
          );
        })}

        {/* Nodes */}
        {data.nodes.map((node) => {
          const coords = nodeCoords[node.id];
          if (!coords) return null;
          const isActive = activeModuleId && node.moduleId === activeModuleId;
          const styleClass = getNodeColor(node);

          return (
            <g 
              key={node.id} 
              transform={`translate(${coords.x - 60}, ${coords.y})`}
              className="cursor-pointer transition-opacity hover:opacity-80"
              onClick={() => node.moduleId && navigate(`/modules/${node.moduleId}`)}
            >
              <rect 
                width="120" 
                height="40" 
                rx="6" 
                className={`${styleClass} transition-colors duration-300 stroke-2`}
              />
              <text 
                x="60" 
                y="20" 
                dominantBaseline="middle" 
                textAnchor="middle" 
                className={`text-xs font-semibold pointer-events-none ${isActive ? 'fill-white' : 'fill-slate-700'}`}
              >
                {node.label}
              </text>
              {node.moduleId && (
                <text x="60" y="55" textAnchor="middle" className="text-[10px] fill-slate-400 font-mono">
                  [{node.moduleId}]
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="text-xs text-slate-400 mt-2 text-center">
        Modül detayına gitmek için kutulara tıklayın.
      </div>
    </div>
  );
};

export default BlockDiagram;
