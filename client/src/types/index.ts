export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  isActive?: boolean;
  avatar?: string;
  settings?: {
    theme?: string;
    fontSize?: number;
    wordWrap?: string;
    minimap?: boolean;
    aiProvider?: string;
    aiModel?: string;
    temperature?: number;
  };
  createdAt?: string;
}

export interface Project {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  language: string;
  code: string;
  tags: string[];
  isFavorite: boolean;
  qualityScore?: number | null;
  bugCount?: number;
  lastAnalyzed?: string | null;
  latestAnalysisId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MetricData {
  lines: number;
  characters: number;
  functions: number;
  classes: number;
  comments: number;
  blankLines: number;
  cyclomaticComplexity: number;
  nestingDepth: number;
  maintainabilityIndex: number;
}

export interface QualityScore {
  overall: number;
  breakdown: {
    readability: number;
    maintainability: number;
    complexity: number;
    documentation: number;
    duplication: number;
  };
  formula: string;
}

export interface BugItem {
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
  line: number;
  category: string;
  description: string;
  whyItMatters: string;
  suggestedFix: string;
  confidence: number;
  source?: string;
}

export interface OptimizationItem {
  title: string;
  category: string;
  currentCode: string;
  optimizedCode: string;
  explanation: string;
  expectedBenefit: string;
}

export interface FlowchartNode {
  id: string;
  type?: string;
  shape?: 'pill' | 'rectangle' | 'diamond' | 'hexagon' | 'parallelogram' | 'subroutine';
  data: {
    id?: string;
    label: string;
    nodeType: 'start' | 'end' | 'process' | 'condition' | 'loop' | 'io' | 'function' | string;
    code?: string;
    line?: number | null;
    description?: string;
    variables?: string[];
  };
  position?: { x: number; y: number };
}

export interface FlowchartEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
  animated?: boolean;
  style?: Record<string, any>;
}

export interface FlowchartData {
  nodes: FlowchartNode[];
  edges: FlowchartEdge[];
  totalNodes?: number;
  totalEdges?: number;
  supported?: boolean;
}

export interface ASTNode {
  id?: string;
  type: string;
  category?: string;
  name?: string;
  loc?: { start: number; end: number; startCol?: number; endCol?: number };
  snippet?: string;
  depth?: number;
  children?: ASTNode[];
}

export interface ASTData {
  supported?: boolean;
  tree?: ASTNode;
  language?: string;
  totalNodes?: number;
  maxDepth?: number;
}

export interface CallGraphNode {
  id: string;
  label: string;
  line: number;
  type: string;
  callCount: number;
}

export interface CallGraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}

export interface TestCaseItem {
  id: string;
  type: string;
  description: string;
  input: string;
  expectedOutput: string;
  reason: string;
  codeSnippet: string;
}

export interface SimilarCodeItem {
  repository: string;
  language: string;
  functionName: string;
  similarityScore: number;
  code: string;
  explanation: string;
  category?: string;
}

export interface AIExplanationData {
  overview: string;
  howItWorks: string;
  stepByStep: Array<{ step: number; title: string; explanation: string }>;
  functions: Array<{ name: string; purpose: string; parameters: string; returnType: string; logic: string; complexity: string }>;
  variables: Array<{ name: string; purpose: string; type: string; role: string }>;
  dataStructures: string[];
  algorithm: string;
  timeComplexity: { value: string; reason: string };
  spaceComplexity: { value: string; reason: string };
  potentialIssues: string[];
  suggestions: string[];
}

export interface AnalysisOverview {
  title: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  finalResult?: string;
}

export interface AnalysisResultData {
  _id?: string;
  analysisId?: string;
  overview: AnalysisOverview;
  aiExplanation?: AIExplanationData;
  stepByStepExplanation: any[];
  complexity: {
    timeComplexity: string;
    spaceComplexity: string;
    explanation: string;
    bottlenecks: string[];
  };
  qualityScore: QualityScore;
  metrics: MetricData;
  bugs: BugItem[];
  optimizations: OptimizationItem[];
  flowchart?: FlowchartData;
  ast?: ASTData;
  callGraph: {
    nodes: CallGraphNode[];
    edges: CallGraphEdge[];
    relationships: any[];
  };
  testCases: TestCaseItem[];
  similarCode: SimilarCodeItem[];
}

export interface HistoryItem {
  _id: string;
  userId: string;
  projectId?: { _id: string; name: string; language: string };
  analysisId?: { _id: string; analysisType: string; completedAt: string };
  action: string;
  language?: string;
  qualityScore?: number;
  bugCount?: number;
  details?: any;
  createdAt: string;
}

export interface ReportItem {
  _id: string;
  title: string;
  reportType: 'PDF' | 'HTML' | 'JSON';
  projectId?: { _id: string; name: string };
  analysisId: string;
  summary?: {
    qualityScore: number;
    lines: number;
    bugsCount: number;
  };
  createdAt: string;
}
