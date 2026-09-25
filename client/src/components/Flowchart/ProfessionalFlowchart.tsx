import React, { useState } from 'react';
import {
  GitBranch,
  Play,
  Square,
  Repeat,
  HelpCircle,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Info,
  Terminal,
  Layers,
  ArrowDown,
  CheckCircle2,
  ChevronRight,
  Code2
} from 'lucide-react';
import { FlowchartData, FlowchartNode } from '../../types';

interface ProfessionalFlowchartProps {
  flowchart?: FlowchartData;
  language?: string;
  onAskAI?: (prompt: string) => void;
}

export const ProfessionalFlowchart: React.FC<ProfessionalFlowchartProps> = ({
  flowchart,
  language = 'cpp',
  onAskAI,
}) => {
  const [selectedNode, setSelectedNode] = useState<FlowchartNode | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'vertical' | 'grid'>('vertical');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const nodes = flowchart?.nodes || [];
  const edges = flowchart?.edges || [];

  if (nodes.length === 0) {
    return (
      <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center space-y-3">
        <GitBranch className="w-10 h-10 text-slate-600 mx-auto" />
        <h4 className="text-sm font-bold text-slate-300">No Flowchart Data Generated</h4>
        <p className="text-xs text-slate-500">Run code analysis to generate an interactive control flow diagram.</p>
      </div>
    );
  }

  const filteredNodes = nodes.filter((n) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'loops') return n.data?.nodeType === 'loop';
    if (activeFilter === 'decisions') return n.data?.nodeType === 'condition';
    if (activeFilter === 'functions') return n.data?.nodeType === 'function';
    return true;
  });

  const getNodeIcon = (type = '') => {
    switch (type) {
      case 'start':
      case 'end':
        return <Play className="w-3.5 h-3.5 text-cyan-400" />;
      case 'loop':
        return <Repeat className="w-3.5 h-3.5 text-purple-400" />;
      case 'condition':
        return <HelpCircle className="w-3.5 h-3.5 text-amber-400" />;
      case 'io':
        return <Terminal className="w-3.5 h-3.5 text-emerald-400" />;
      case 'function':
        return <Code2 className="w-3.5 h-3.5 text-indigo-400" />;
      default:
        return <Square className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  const getNodeStyles = (node: FlowchartNode, isSelected: boolean) => {
    const type = node.data?.nodeType || 'process';
    let base = 'relative transition-all duration-200 cursor-pointer ';

    if (isSelected) {
      base += 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950 shadow-xl shadow-cyan-500/20 scale-105 ';
    } else {
      base += 'hover:scale-[1.02] hover:shadow-lg ';
    }

    switch (type) {
      case 'start':
      case 'end':
        return base + 'bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border-2 border-cyan-500/60 rounded-full px-6 py-3 text-cyan-200';
      case 'loop':
        return base + 'bg-gradient-to-r from-purple-950/80 to-indigo-950/80 border-2 border-purple-500/60 rounded-xl px-5 py-3.5 text-purple-200';
      case 'condition':
        return base + 'bg-gradient-to-r from-amber-950/80 to-orange-950/80 border-2 border-amber-500/60 rounded-xl px-5 py-3.5 text-amber-200';
      case 'io':
        return base + 'bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border-2 border-emerald-500/60 rounded-xl px-5 py-3.5 text-emerald-200';
      case 'function':
        return base + 'bg-gradient-to-r from-indigo-950/80 to-slate-900 border-2 border-indigo-500/60 rounded-xl px-5 py-3.5 text-indigo-200';
      default:
        return base + 'bg-slate-900/90 border-2 border-slate-700/80 rounded-xl px-5 py-3.5 text-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <GitBranch className="w-4 h-4 text-cyan-400" /> Control Flow Diagram
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono text-slate-400">
            {nodes.length} Nodes • {edges.length} Edges
          </span>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 text-[11px]">
          {[
            { id: 'all', label: 'All Nodes' },
            { id: 'loops', label: 'Loops' },
            { id: 'decisions', label: 'Decisions' },
            { id: 'functions', label: 'Functions' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                activeFilter === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Zoom & View Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-slate-400 px-1.5">{Math.round(zoomLevel * 100)}%</span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 ml-1"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Interactive Diagram Canvas */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden min-h-[520px] flex flex-col items-center justify-start relative">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Diagram Flow Container */}
          <div
            className="w-full flex flex-col items-center space-y-3 transition-transform duration-200 my-4"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
          >
            {filteredNodes.map((node, idx) => {
              const isSelected = selectedNode?.id === node.id;
              const isLast = idx === filteredNodes.length - 1;

              return (
                <React.Fragment key={node.id}>
                  {/* Flowchart Node Box */}
                  <div
                    onClick={() => setSelectedNode(node)}
                    className={`w-full max-w-md ${getNodeStyles(node, isSelected)}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {getNodeIcon(node.data?.nodeType)}
                        <span className="text-[10px] font-mono uppercase font-bold tracking-wider opacity-75">
                          {node.data?.nodeType || 'process'}
                        </span>
                      </div>
                      {node.data?.line && (
                        <span className="px-2 py-0.5 rounded bg-black/40 text-[10px] font-mono text-slate-400">
                          Line {node.data.line}
                        </span>
                      )}
                    </div>

                    <div className="mt-1.5 font-bold text-xs leading-snug">
                      {node.data?.label}
                    </div>

                    {node.data?.code && (
                      <div className="mt-1.5 p-1.5 rounded-lg bg-slate-950/80 border border-white/5 font-mono text-[11px] text-slate-300 truncate">
                        {node.data.code}
                      </div>
                    )}
                  </div>

                  {/* Connecting Flow Arrow with Label */}
                  {!isLast && (
                    <div className="flex flex-col items-center py-0.5">
                      <div className="w-0.5 h-6 bg-gradient-to-b from-indigo-500 to-cyan-500 relative flex items-center justify-center">
                        <ArrowDown className="w-3.5 h-3.5 text-cyan-400 absolute -bottom-2" />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Right Node Inspector & AI Query Drawer */}
        <div className="lg:col-span-4 glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Info className="w-4 h-4 text-cyan-400" /> Node Inspector
              </h4>
              <span className="text-[10px] font-mono text-slate-500">
                {selectedNode ? selectedNode.id : 'Click a node to inspect'}
              </span>
            </div>

            {selectedNode ? (
              <div className="mt-4 space-y-3.5 text-xs">
                {/* Node Metadata Card */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-slate-400">Type</span>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-cyan-300 font-bold uppercase text-[10px]">
                      {selectedNode.data?.nodeType}
                    </span>
                  </div>
                  {selectedNode.data?.line && (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400">Source Location</span>
                      <span className="font-mono text-slate-200">Line {selectedNode.data.line}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block mb-1">Execution Summary</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {selectedNode.data?.description || 'Executes runtime logic and transitions to next control step.'}
                    </p>
                  </div>
                </div>

                {/* Source Code Snippet */}
                {selectedNode.data?.code && (
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block mb-1">Source Statement</span>
                    <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-amber-300 whitespace-pre-wrap overflow-x-auto">
                      {selectedNode.data.code}
                    </pre>
                  </div>
                )}

                {/* Ask AI Trigger Button */}
                {onAskAI && (
                  <button
                    onClick={() => {
                      const prompt = `Explain the flowchart node: "${selectedNode.data?.label}" at line ${selectedNode.data?.line || 'N/A'}. What is its purpose and control flow role in this program?`;
                      onAskAI(prompt);
                    }}
                    className="w-full mt-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                    <span>Ask AI About This Flowchart Node</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500 space-y-2">
                <Layers className="w-8 h-8 mx-auto text-slate-700" />
                <p>Select any node in the diagram to inspect its execution semantics, source line, and variables.</p>
              </div>
            )}
          </div>

          {/* Flowchart Legend */}
          <div className="pt-4 border-t border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-2">Diagram Legend</span>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="flex items-center gap-1.5 text-cyan-300">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Start / End
              </div>
              <div className="flex items-center gap-1.5 text-purple-300">
                <div className="w-2.5 h-2.5 rounded-sm bg-purple-400" /> Loop Iteration
              </div>
              <div className="flex items-center gap-1.5 text-amber-300">
                <div className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> Decision / Branch
              </div>
              <div className="flex items-center gap-1.5 text-emerald-300">
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400" /> Input / Output
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
