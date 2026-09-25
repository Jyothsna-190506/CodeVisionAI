import React, { useState } from 'react';
import {
  Binary,
  ChevronDown,
  ChevronRight,
  Search,
  Sparkles,
  Copy,
  Info,
  FolderTree,
} from 'lucide-react';
import { ASTData, ASTNode } from '../../types';

interface ProfessionalASTExplorerProps {
  ast?: ASTData;
  language?: string;
  onAskAI?: (prompt: string) => void;
}

export const ProfessionalASTExplorer: React.FC<ProfessionalASTExplorerProps> = ({
  ast,
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
      <div className="p-12 rounded-3xl border border-border-pearl bg-white text-center space-y-3 shadow-sm">
        <FolderTree className="w-10 h-10 text-secondary-text mx-auto" />
        <h4 className="text-sm font-bold text-charcoal">No AST Tree Available</h4>
        <p className="text-xs text-secondary-text">Run code analysis to generate the hierarchical syntax tree.</p>
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
      return 'bg-terracotta/10 text-terracotta border-terracotta/30';
    }
    if (category === 'Iteration' || type.includes('For') || type.includes('While') || type.includes('Loop')) {
      return 'bg-orange-warm/15 text-orange-warm border-orange-warm/30';
    }
    if (category === 'Declaration' || type.includes('Variable') || type.includes('Class')) {
      return 'bg-amber-100 text-amber-800 border-amber-300';
    }
    if (category === 'ControlFlow' || type.includes('If') || type.includes('Return')) {
      return 'bg-terracotta/15 text-terracotta border-terracotta/40';
    }
    if (category === 'Expression' || type.includes('Call') || type.includes('Binary')) {
      return 'bg-lime-digital/25 text-lime-800 border-lime-digital/40';
    }
    return 'bg-secondary-card text-charcoal border-border-pearl';
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(tree, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top AST Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-border-pearl shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black text-charcoal flex items-center gap-1.5">
            <FolderTree className="w-4 h-4 text-terracotta" /> Abstract Syntax Tree (AST)
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-secondary-card text-[10px] font-mono text-terracotta font-bold">
            {ast?.totalNodes || 14} Syntax Nodes
          </span>
          {ast?.maxDepth && (
            <span className="px-2.5 py-0.5 rounded-md bg-secondary-card text-[10px] font-mono text-orange-warm font-bold">
              Depth: {ast.maxDepth} Levels
            </span>
          )}
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-secondary-text absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search AST nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-[#D5CEBF] text-xs text-charcoal placeholder-secondary-text focus:outline-none focus:border-terracotta shadow-sm w-44 font-medium"
            />
          </div>

          <button
            onClick={handleExpandAll}
            className="px-3 py-1.5 rounded-xl bg-secondary-card hover:bg-border-pearl text-charcoal text-[11px] font-bold transition-all cursor-pointer"
          >
            Expand All
          </button>
          <button
            onClick={handleCollapseAll}
            className="px-3 py-1.5 rounded-xl bg-secondary-card hover:bg-border-pearl text-charcoal text-[11px] font-bold transition-all cursor-pointer"
          >
            Collapse
          </button>

          <div className="flex items-center bg-secondary-card border border-border-pearl rounded-xl p-0.5 ml-2">
            <button
              onClick={() => setViewFormat('tree')}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                viewFormat === 'tree' ? 'bg-terracotta text-white shadow-sm' : 'text-secondary-text hover:text-charcoal'
              }`}
            >
              Tree View
            </button>
            <button
              onClick={() => setViewFormat('json')}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                viewFormat === 'json' ? 'bg-terracotta text-white shadow-sm' : 'text-secondary-text hover:text-charcoal'
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
        <div className="lg:col-span-8 p-6 rounded-3xl border border-border-pearl bg-ivory min-h-[500px] max-h-[620px] overflow-y-auto shadow-sm">
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
                className="absolute top-2 right-2 px-3 py-1.5 rounded-xl bg-white border border-border-pearl hover:bg-pearl text-charcoal text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
              <pre className="p-4 rounded-2xl bg-pearl border border-border-pearl font-mono text-xs text-charcoal whitespace-pre-wrap overflow-x-auto">
                {JSON.stringify(tree, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Right Node Inspector & AI Assistant Hook */}
        <div className="lg:col-span-4 p-6 rounded-3xl border border-border-pearl bg-white space-y-4 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border-pearl">
              <h4 className="text-xs font-black text-charcoal flex items-center gap-1.5">
                <Info className="w-4 h-4 text-terracotta" /> AST Node Inspector
              </h4>
              <span className="text-[10px] font-mono text-secondary-text font-bold">
                {selectedNode ? selectedNode.type : 'Select node'}
              </span>
            </div>

            {selectedNode ? (
              <div className="mt-4 space-y-3.5 text-xs">
                {/* Node Identity Card */}
                <div className="p-4 rounded-2xl bg-secondary-card/60 border border-border-pearl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono text-secondary-text font-bold">Node Type</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold font-mono ${getNodeBadgeColor(
                        selectedNode.type,
                        selectedNode.category
                      )}`}
                    >
                      {selectedNode.type}
                    </span>
                  </div>

                  {selectedNode.name && (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono text-secondary-text font-bold">Identifier / Value</span>
                      <span className="font-mono text-charcoal font-bold truncate max-w-[180px]">
                        {selectedNode.name}
                      </span>
                    </div>
                  )}

                  {selectedNode.loc && (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono text-secondary-text font-bold">Source Range</span>
                      <span className="font-mono text-secondary-text font-semibold">
                        Line {selectedNode.loc.start} → {selectedNode.loc.end}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono text-secondary-text font-bold">Child Branches</span>
                    <span className="font-mono text-terracotta font-bold">
                      {selectedNode.children ? selectedNode.children.length : 0} Direct Sub-Nodes
                    </span>
                  </div>
                </div>

                {/* Source Code Snippet */}
                {selectedNode.snippet && (
                  <div>
                    <span className="text-[10px] font-mono text-secondary-text font-bold block mb-1">Source Statement</span>
                    <pre className="p-3 rounded-2xl bg-pearl border border-border-pearl font-mono text-[11px] text-charcoal whitespace-pre-wrap overflow-x-auto">
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
                    className="w-full mt-2 py-3 px-4 rounded-2xl bg-terracotta hover:bg-orange-warm text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-terracotta/20 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span>Ask AI About This AST Node</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-secondary-text space-y-2">
                <Binary className="w-8 h-8 mx-auto text-secondary-text/40" />
                <p>Click any node in the AST hierarchy to inspect its syntax type, attributes, and source tokens.</p>
              </div>
            )}
          </div>

          {/* AST Categorization Legend */}
          <div className="pt-4 border-t border-border-pearl">
            <span className="text-[10px] font-bold uppercase text-secondary-text block mb-2 font-mono">AST Node Categories</span>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="flex items-center gap-1.5 text-charcoal font-semibold">
                <div className="w-2.5 h-2.5 rounded-sm bg-terracotta" /> Functions
              </div>
              <div className="flex items-center gap-1.5 text-charcoal font-semibold">
                <div className="w-2.5 h-2.5 rounded-sm bg-orange-warm" /> Iteration / Loops
              </div>
              <div className="flex items-center gap-1.5 text-charcoal font-semibold">
                <div className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Declarations
              </div>
              <div className="flex items-center gap-1.5 text-charcoal font-semibold">
                <div className="w-2.5 h-2.5 rounded-sm bg-lime-digital" /> Expressions
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
            ? 'bg-terracotta/15 border border-terracotta/40 text-charcoal font-bold shadow-sm'
            : 'hover:bg-white text-charcoal border border-transparent'
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
            className="p-0.5 hover:bg-secondary-card rounded text-secondary-text"
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        ) : (
          <div className="w-4 h-4 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-border-pearl" />
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
          <span className="text-charcoal font-semibold text-[11px] truncate max-w-[260px]">
            {node.name}
          </span>
        )}

        {/* Line indicator */}
        {node.loc && (
          <span className="text-[10px] text-secondary-text font-mono ml-auto">
            L{node.loc.start}{node.loc.end !== node.loc.start ? `-${node.loc.end}` : ''}
          </span>
        )}
      </div>

      {/* Render Children Recursively */}
      {hasChildren && isExpanded && (
        <div className="border-l border-border-pearl ml-4">
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
