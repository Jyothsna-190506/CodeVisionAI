import React, { useState } from 'react';
import {
  GitBranch,
  Play,
  Square,
  Repeat,
  HelpCircle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Info,
  Terminal,
  Layers,
  ArrowDown,
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
  onAskAI,
}) => {
  const [selectedNode, setSelectedNode] = useState<FlowchartNode | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const nodes = flowchart?.nodes || [];
  const edges = flowchart?.edges || [];

  if (nodes.length === 0) {
    return (
      <div className="p-12 rounded-3xl border border-border-pearl bg-white text-center space-y-3 shadow-sm">
        <GitBranch className="w-10 h-10 text-secondary-text mx-auto" />
        <h4 className="text-sm font-bold text-charcoal">No Flowchart Data Generated</h4>
        <p className="text-xs text-secondary-text">Run code analysis to generate an interactive control flow diagram.</p>
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
        return <Play className="w-3.5 h-3.5 text-terracotta" />;
      case 'loop':
        return <Repeat className="w-3.5 h-3.5 text-orange-warm" />;
      case 'condition':
        return <HelpCircle className="w-3.5 h-3.5 text-amber-600" />;
      case 'io':
        return <Terminal className="w-3.5 h-3.5 text-lime-700" />;
      case 'function':
        return <Code2 className="w-3.5 h-3.5 text-terracotta" />;
      default:
        return <Square className="w-3.5 h-3.5 text-secondary-text" />;
    }
  };

  const getNodeStyles = (node: FlowchartNode, isSelected: boolean) => {
    const type = node.data?.nodeType || 'process';
    let base = 'relative transition-all duration-200 cursor-pointer ';

    if (isSelected) {
      base += 'ring-2 ring-terracotta ring-offset-2 ring-offset-ivory shadow-lg shadow-terracotta/15 scale-105 ';
    } else {
      base += 'hover:scale-[1.02] hover:shadow-md ';
    }

    switch (type) {
      case 'start':
      case 'end':
        return base + 'bg-gradient-to-r from-terracotta/10 to-orange-warm/10 border-2 border-terracotta/50 rounded-full px-6 py-3 text-charcoal';
      case 'loop':
        return base + 'bg-orange-warm/10 border-2 border-orange-warm/40 rounded-2xl px-5 py-3.5 text-charcoal';
      case 'condition':
        return base + 'bg-amber-50 border-2 border-amber-400/50 rounded-2xl px-5 py-3.5 text-charcoal';
      case 'io':
        return base + 'bg-lime-digital/15 border-2 border-lime-digital/40 rounded-2xl px-5 py-3.5 text-charcoal';
      case 'function':
        return base + 'bg-terracotta/5 border-2 border-terracotta/30 rounded-2xl px-5 py-3.5 text-charcoal';
      default:
        return base + 'bg-white border-2 border-border-pearl rounded-2xl px-5 py-3.5 text-charcoal shadow-sm';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-border-pearl shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-charcoal flex items-center gap-1.5">
            <GitBranch className="w-4 h-4 text-terracotta" /> Control Flow Diagram
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-secondary-card text-[10px] font-mono text-secondary-text font-bold">
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
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeFilter === tab.id
                  ? 'bg-terracotta text-white shadow-sm shadow-terracotta/20'
                  : 'text-secondary-text hover:text-charcoal hover:bg-secondary-card'
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
            className="p-2 rounded-xl bg-secondary-card hover:bg-border-pearl text-charcoal"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-secondary-text px-1.5 font-bold">{Math.round(zoomLevel * 100)}%</span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
            className="p-2 rounded-xl bg-secondary-card hover:bg-border-pearl text-charcoal"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-2 rounded-xl bg-secondary-card hover:bg-border-pearl text-charcoal ml-1"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Interactive Diagram Canvas */}
        <div className="lg:col-span-8 p-6 rounded-3xl border border-border-pearl bg-ivory overflow-hidden min-h-[520px] flex flex-col items-center justify-start relative shadow-sm">
          {/* Subtle Technical Grid Background */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#242321_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Diagram Flow Container */}
          <div
            className="w-full flex flex-col items-center space-y-3 transition-transform duration-200 my-4 relative z-10"
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
                        <span className="text-[10px] font-mono uppercase font-black tracking-wider opacity-85 text-charcoal">
                          {node.data?.nodeType || 'process'}
                        </span>
                      </div>
                      {node.data?.line && (
                        <span className="px-2 py-0.5 rounded-md bg-secondary-card text-[10px] font-mono text-secondary-text font-bold">
                          Line {node.data.line}
                        </span>
                      )}
                    </div>

                    <div className="mt-1.5 font-bold text-xs text-charcoal leading-snug">
                      {node.data?.label}
                    </div>

                    {node.data?.code && (
                      <div className="mt-1.5 p-2 rounded-xl bg-pearl border border-border-pearl font-mono text-[11px] text-charcoal truncate">
                        {node.data.code}
                      </div>
                    )}
                  </div>

                  {/* Connecting Flow Arrow with Label */}
                  {!isLast && (
                    <div className="flex flex-col items-center py-0.5">
                      <div className="w-0.5 h-6 bg-gradient-to-b from-terracotta to-orange-warm relative flex items-center justify-center">
                        <ArrowDown className="w-3.5 h-3.5 text-terracotta absolute -bottom-2" />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Right Node Inspector & AI Query Drawer */}
        <div className="lg:col-span-4 p-6 rounded-3xl border border-border-pearl bg-white space-y-4 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border-pearl">
              <h4 className="text-xs font-black text-charcoal flex items-center gap-1.5">
                <Info className="w-4 h-4 text-terracotta" /> Node Inspector
              </h4>
              <span className="text-[10px] font-mono text-secondary-text font-semibold">
                {selectedNode ? selectedNode.id : 'Click a node to inspect'}
              </span>
            </div>

            {selectedNode ? (
              <div className="mt-4 space-y-3.5 text-xs">
                {/* Node Metadata Card */}
                <div className="p-4 rounded-2xl bg-secondary-card/60 border border-border-pearl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-secondary-text font-bold">Type</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-terracotta/10 text-terracotta font-bold uppercase text-[10px] border border-terracotta/20">
                      {selectedNode.data?.nodeType}
                    </span>
                  </div>

                  {selectedNode.data?.line && (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-secondary-text font-bold">Source Location</span>
                      <span className="font-mono text-charcoal font-bold">Line {selectedNode.data.line}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-border-pearl">
                    <span className="text-[10px] text-secondary-text font-bold block mb-1">Execution Summary</span>
                    <p className="text-secondary-text text-[11px] leading-relaxed">
                      {selectedNode.data?.description || 'Executes runtime logic and transitions to next control step.'}
                    </p>
                  </div>
                </div>

                {/* Source Code Snippet */}
                {selectedNode.data?.code && (
                  <div>
                    <span className="text-[10px] font-mono text-secondary-text font-bold block mb-1">Source Statement</span>
                    <pre className="p-3 rounded-2xl bg-pearl border border-border-pearl font-mono text-[11px] text-charcoal whitespace-pre-wrap overflow-x-auto">
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
                    className="w-full mt-2 py-3 px-4 rounded-2xl bg-terracotta hover:bg-orange-warm text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-terracotta/20 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span>Ask AI About This Flowchart Node</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-secondary-text space-y-2">
                <Layers className="w-8 h-8 mx-auto text-secondary-text/40" />
                <p>Select any node in the diagram to inspect its execution semantics, source line, and variables.</p>
              </div>
            )}
          </div>

          {/* Flowchart Legend */}
          <div className="pt-4 border-t border-border-pearl">
            <span className="text-[10px] font-bold uppercase text-secondary-text block mb-2 font-mono">Diagram Legend</span>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="flex items-center gap-1.5 text-charcoal font-semibold">
                <div className="w-2.5 h-2.5 rounded-full bg-terracotta" /> Start / End
              </div>
              <div className="flex items-center gap-1.5 text-charcoal font-semibold">
                <div className="w-2.5 h-2.5 rounded-sm bg-orange-warm" /> Loop Iteration
              </div>
              <div className="flex items-center gap-1.5 text-charcoal font-semibold">
                <div className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Decision / Branch
              </div>
              <div className="flex items-center gap-1.5 text-charcoal font-semibold">
                <div className="w-2.5 h-2.5 rounded-sm bg-lime-digital" /> Input / Output
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
