import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'work' | 'personal' | 'meeting' | 'urgent';
  deadline?: Date;
  completedAt?: Date;
  estimatedTime?: number;
  actualTime?: number;
  tags?: string[];
  assigneeId?: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  subtasks?: mongoose.Types.ObjectId[];
  attachments?: mongoose.Types.ObjectId[];
  comments?: mongoose.Types.ObjectId[];
  dependencies?: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'completed'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['work', 'personal', 'meeting', 'urgent'],
    default: 'work'
  },
  deadline: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  estimatedTime: {
    type: Number, // in minutes
    min: 0
  },
  actualTime: {
    type: Number, // in minutes
    min: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  assigneeId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
  },
  subtasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }],
  attachments: [{
    type: Schema.Types.ObjectId,
    ref: 'Attachment'
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  dependencies: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
TaskSchema.index({ createdBy: 1, status: 1 });
TaskSchema.index({ assigneeId: 1, status: 1 });
TaskSchema.index({ projectId: 1 });
TaskSchema.index({ deadline: 1 });
TaskSchema.index({ category: 1 });
TaskSchema.index({ priority: 1 });
TaskSchema.index({ tags: 1 });

// Virtual for completion percentage
TaskSchema.virtual('completionPercentage').get(function() {
  if (this.status === 'completed') return 100;
  if (this.status === 'in-progress') return 50;
  return 0;
});

// Pre-save middleware
TaskSchema.pre('save', function(next) {
  if (this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  if (this.status !== 'completed' && this.completedAt) {
    this.completedAt = undefined;
  }
  next();
});

export const Task = mongoose.model<ITask>('Task', TaskSchema);
