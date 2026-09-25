import mongoose from 'mongoose';

const historySchema = new mongoose.Schema(
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
      default: null,
    },
    analysisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Analysis',
      default: null,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'CREATED_PROJECT',
        'UPDATED_PROJECT',
        'DELETED_PROJECT',
        'ANALYZED_CODE',
        'GENERATED_REPORT',
        'OPTIMIZED_CODE',
        'GENERATED_TESTS',
        'EXPORTED_PDF',
      ],
    },
    language: {
      type: String,
      default: '',
    },
    qualityScore: {
      type: Number,
      default: null,
    },
    bugCount: {
      type: Number,
      default: 0,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

historySchema.index({ userId: 1, createdAt: -1 });

export const History = mongoose.model('History', historySchema);
export default History;
