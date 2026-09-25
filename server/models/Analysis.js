import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema(
  {
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
    language: {
      type: String,
      required: true,
      lowercase: true,
    },
    sourceCode: {
      type: String,
      required: true,
    },
    analysisType: {
      type: String,
      enum: ['full', 'quick', 'bugs', 'metrics', 'trace', 'flowchart'],
      default: 'full',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'completed',
    },
    errorMessage: {
      type: String,
      default: null,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

analysisSchema.index({ userId: 1, createdAt: -1 });

export const Analysis = mongoose.model('Analysis', analysisSchema);
export default Analysis;
