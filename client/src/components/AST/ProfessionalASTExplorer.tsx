import React, { useState } from 'react';
import {
  Binary,
  ChevronDown,
  ChevronRight,
  Search,
  Sparkles,
  Layers,
  Code2,
  Maximize2,
  Minimize2,
  Copy,
  Info,
  ExternalLink,
  FolderTree,
  Tag
} from 'lucide-react';
import { ASTData, ASTNode } from '../../types';

interface ProfessionalASTExplorerProps {
  ast?: ASTData;
  language?: string;
  onAskAI?: (prompt: string) => void;
}

export const ProfessionalASTExplorer: React.FC<ProfessionalASTExplorerProps> = ({
  ast,
  language = 'cpp',
  onAskAI,
}) => {
  const [selectedNode, setSelectedNode] = useState<ASTNode | null>(ast?.tree || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    root_program: true,
  });
  const [viewFormat, setViewFormat] = useState<'tree' | 'json'>('tree');
  const [copied, setCopied] = useState(false);

  const tree = ast?.tree;

  if (!tree) {
    return (
      <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center space-y-3">
        <FolderTree className="w-10 h-10 text-slate-600 mx-auto" />
        <h4 className="text-sm font-bold text-slate-300">No AST Tree Available</h4>
        <p className="text-xs text-slate-500">Run code analysis to generate the hierarchical syntax tree.</p>
      </div>
    );
  }

  const toggleExpand = (nodeId: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const handleExpandAll = () => {
    const allIds: Record<string, boolean> = {};
    const traverse = (node: ASTNode) => {
      if (!node) return;
      if (node.id) allIds[node.id] = true;
      if (node.children) node.children.forEach(traverse);
    };
    traverse(tree);
    setExpandedNodes(allIds);
  };

  const handleCollapseAll = () => {
    setExpandedNodes({ root_program: true });
  };

  const getNodeBadgeColor = (type = '', category = '') => {
    if (category === 'Function' || type.includes('Function')) {
      return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
    }
    if (category === 'Iteration' || type.includes('For') || type.includes('While') || type.includes('Loop')) {
      return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    }
    if (category === 'Declaration' || type.includes('Variable') || type.includes('Class')) {
      return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    }
    if (category === 'ControlFlow' || type.includes('If') || type.includes('Return')) {
      return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
    if (category === 'Expression' || type.includes('Call') || type.includes('Binary')) {
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(tree, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top AST Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <FolderTree className="w-4 h-4 text-indigo-400" /> Abstract Syntax Tree (AST)
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono text-cyan-300">
            {ast?.totalNodes || 14} Syntax Nodes
          </span>
          {ast?.maxDepth && (
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono text-purple-300">
              Depth: {ast.maxDepth} Levels
            </span>
          )}
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search AST nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-44"
            />
          </div>

          <button
            onClick={handleExpandAll}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium"
          >
            Expand All
          </button>
          <button
            onClick={handleCollapseAll}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium"
          >
            Collapse
          </button>

          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 ml-2">
            <button
              onClick={() => setViewFormat('tree')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                viewFormat === 'tree' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tree View
            </button>
            <button
              onClick={() => setViewFormat('json')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                viewFormat === 'json' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              JSON
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Split Tree Explorer and Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Tree Explorer Canvas */}
        <div className="lg:col-span-8 glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/60 min-h-[500px] max-h-[620px] overflow-y-auto">
          {viewFormat === 'tree' ? (
            <div className="space-y-1 font-mono text-xs">
              <TreeNodeItem
                node={tree}
                depth={0}
                searchQuery={searchQuery.toLowerCase()}
                expandedNodes={expandedNodes}
                selectedNode={selectedNode}
                onToggleExpand={toggleExpand}
                onSelectNode={setSelectedNode}
                getNodeBadgeColor={getNodeBadgeColor}
              />
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={handleCopyJSON}
                className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-300 whitespace-pre-wrap overflow-x-auto">
                {JSON.stringify(tree, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Right Node Inspector & AI Assistant Hook */}
        <div className="lg:col-span-4 glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Info className="w-4 h-4 text-indigo-400" /> AST Node Inspector
              </h4>
              <span className="text-[10px] font-mono text-slate-500">
                {selectedNode ? selectedNode.type : 'Select node'}
              </span>
            </div>

            {selectedNode ? (
              <div className="mt-4 space-y-3 text-xs">
                {/* Node Identity Card */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono text-slate-400">Node Type</span>
                    <span
                      className={`px-2 py-0.5 rounded-md border text-[10px] font-bold font-mono ${getNodeBadgeColor(
                        selectedNode.type,
                        selectedNode.category
                      )}`}
                    >
                      {selectedNode.type}
                    </span>
                  </div>

                  {selectedNode.name && (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono text-slate-400">Identifier / Value</span>
                      <span className="font-mono text-cyan-300 font-bold truncate max-w-[180px]">
                        {selectedNode.name}
                      </span>
                    </div>
                  )}

                  {selectedNode.loc && (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono text-slate-400">Source Range</span>
                      <span className="font-mono text-slate-300">
                        Line {selectedNode.loc.start} → {selectedNode.loc.end}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono text-slate-400">Child Branches</span>
                    <span className="font-mono text-purple-300">
                      {selectedNode.children ? selectedNode.children.length : 0} Direct Sub-Nodes
                    </span>
                  </div>
                </div>

                {/* Source Code Snippet */}
                {selectedNode.snippet && (
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block mb-1">Source Statement</span>
                    <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-amber-300 whitespace-pre-wrap overflow-x-auto">
                      {selectedNode.snippet}
                    </pre>
                  </div>
                )}

                {/* Ask AI Trigger Button */}
                {onAskAI && (
                  <button
                    onClick={() => {
                      const prompt = `Explain the AST Node: [${selectedNode.type}] "${selectedNode.name || ''}" located at line ${selectedNode.loc?.start || 'N/A'}. What is its syntax role and semantic behavior in this program?`;
                      onAskAI(prompt);
                    }}
                    className="w-full mt-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                    <span>Ask AI About This AST Node</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500 space-y-2">
                <Binary className="w-8 h-8 mx-auto text-slate-700" />
                <p>Click any node in the AST hierarchy to inspect its syntax type, attributes, and source tokens.</p>
              </div>
            )}
          </div>

          {/* AST Categorization Legend */}
          <div className="pt-4 border-t border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-2">AST Node Categories</span>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="flex items-center gap-1.5 text-indigo-300">
                <div className="w-2.5 h-2.5 rounded-sm bg-indigo-500" /> Functions
              </div>
              <div className="flex items-center gap-1.5 text-purple-300">
                <div className="w-2.5 h-2.5 rounded-sm bg-purple-500" /> Iteration / Loops
              </div>
              <div className="flex items-center gap-1.5 text-cyan-300">
                <div className="w-2.5 h-2.5 rounded-sm bg-cyan-500" /> Declarations
              </div>
              <div className="flex items-center gap-1.5 text-amber-300">
                <div className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Control Flow
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Recursive Tree Node Item
interface TreeNodeItemProps {
  node: ASTNode;
  depth: number;
  searchQuery: string;
  expandedNodes: Record<string, boolean>;
  selectedNode: ASTNode | null;
  onToggleExpand: (id: string) => void;
  onSelectNode: (node: ASTNode) => void;
  getNodeBadgeColor: (type?: string, category?: string) => string;
}

const TreeNodeItem: React.FC<TreeNodeItemProps> = ({
  node,
  depth,
  searchQuery,
  expandedNodes,
  selectedNode,
  onToggleExpand,
  onSelectNode,
  getNodeBadgeColor,
}) => {
  if (!node) return null;

  const nodeId = node.id || `node_${node.type}_${depth}_${node.name}`;
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes[nodeId] ?? (depth < 2);
  const isSelected = selectedNode?.id === node.id;

  const matchesSearch =
    !searchQuery ||
    node.type?.toLowerCase().includes(searchQuery) ||
    node.name?.toLowerCase().includes(searchQuery) ||
    node.snippet?.toLowerCase().includes(searchQuery);

  return (
    <div className={`space-y-0.5 ${matchesSearch ? 'opacity-100' : 'opacity-30'}`}>
      <div
        onClick={() => onSelectNode(node)}
        className={`flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl cursor-pointer transition-all ${
          isSelected
            ? 'bg-indigo-600/30 border border-indigo-500/50 text-white font-bold'
            : 'hover:bg-slate-900/80 text-slate-300 border border-transparent'
        }`}
        style={{ paddingLeft: `${Math.max(10, depth * 20)}px` }}
      >
        {/* Expand / Collapse Chevron */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(nodeId);
            }}
            className="p-0.5 hover:bg-slate-800 rounded text-slate-400"
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        ) : (
          <div className="w-4 h-4 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
          </div>
        )}

        {/* Node Type Badge */}
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold border font-mono ${getNodeBadgeColor(
            node.type,
            node.category
          )}`}
        >
          {node.type}
        </span>

        {/* Node Name / Value */}
        {node.name && (
          <span className="text-cyan-300 font-semibold text-[11px] truncate max-w-[260px]">
            {node.name}
          </span>
        )}

        {/* Line indicator */}
        {node.loc && (
          <span className="text-[10px] text-slate-500 font-mono ml-auto">
            L{node.loc.start}{node.loc.end !== node.loc.start ? `-${node.loc.end}` : ''}
          </span>
        )}
      </div>

      {/* Render Children Recursively */}
      {hasChildren && isExpanded && (
        <div className="border-l border-slate-800/80 ml-4">
          {node.children!.map((child, idx) => (
            <TreeNodeItem
              key={child.id || `${nodeId}_child_${idx}`}
              node={child}
              depth={depth + 1}
              searchQuery={searchQuery}
              expandedNodes={expandedNodes}
              selectedNode={selectedNode}
              onToggleExpand={onToggleExpand}
              onSelectNode={onSelectNode}
              getNodeBadgeColor={getNodeBadgeColor}
            />
          ))}
        </div>
      )}
    </div>
  );
};
