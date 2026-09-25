import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: 500,
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
      default: 'python',
      lowercase: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    qualityScore: {
      type: Number,
      default: null,
    },
    bugCount: {
      type: Number,
      default: 0,
    },
    lastAnalyzed: {
      type: Date,
      default: null,
    },
    latestAnalysisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Analysis',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ userId: 1, updatedAt: -1 });

export const Project = mongoose.model('Project', projectSchema);
export default Project;
