import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
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
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: 'Code Analysis Report',
    },
    reportType: {
      type: String,
      enum: ['PDF', 'HTML', 'JSON'],
      default: 'PDF',
    },
    filePath: {
      type: String,
      default: '',
    },
    summary: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ userId: 1, createdAt: -1 });

export const Report = mongoose.model('Report', reportSchema);
export default Report;
