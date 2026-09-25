import mongoose from 'mongoose';

const analysisResultSchema = new mongoose.Schema(
  {
    analysisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Analysis',
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      index: true,
      default: null,
    },
    overview: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    aiExplanation: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    stepByStepExplanation: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    functions: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    variables: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    complexity: {
      timeComplexity: { type: String, default: 'O(n)' },
      spaceComplexity: { type: String, default: 'O(1)' },
      explanation: { type: String, default: '' },
      bottlenecks: { type: [String], default: [] },
    },
    qualityScore: {
      overall: { type: Number, default: 85 },
      breakdown: {
        readability: { type: Number, default: 85 },
        maintainability: { type: Number, default: 85 },
        complexity: { type: Number, default: 80 },
        documentation: { type: Number, default: 75 },
        duplication: { type: Number, default: 90 },
      },
      formula: { type: String, default: 'Weighted average of readability (25%), maintainability (25%), complexity (20%), documentation (15%), duplication (15%)' },
    },
    metrics: {
      lines: { type: Number, default: 0 },
      characters: { type: Number, default: 0 },
      functions: { type: Number, default: 0 },
      classes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      blankLines: { type: Number, default: 0 },
      cyclomaticComplexity: { type: Number, default: 1 },
      nestingDepth: { type: Number, default: 1 },
      maintainabilityIndex: { type: Number, default: 85 },
    },
    bugs: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    optimizations: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    flowchart: {
      nodes: { type: [mongoose.Schema.Types.Mixed], default: [] },
      edges: { type: [mongoose.Schema.Types.Mixed], default: [] },
      supported: { type: Boolean, default: true },
    },
    ast: {
      tree: { type: mongoose.Schema.Types.Mixed, default: {} },
      supported: { type: Boolean, default: true },
      message: { type: String, default: '' },
    },
    callGraph: {
      nodes: { type: [mongoose.Schema.Types.Mixed], default: [] },
      edges: { type: [mongoose.Schema.Types.Mixed], default: [] },
      relationships: { type: [mongoose.Schema.Types.Mixed], default: [] },
    },
    testCases: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    similarCode: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const AnalysisResult = mongoose.model('AnalysisResult', analysisResultSchema);
export default AnalysisResult;
