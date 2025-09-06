import { Response } from 'express';
import { Task, ITask } from '../models/Task';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
export const getTasks = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { 
    status, 
    priority, 
    category, 
    assignee, 
    project, 
    search, 
    sortBy = 'createdAt', 
    sortOrder = 'desc',
    page = 1,
    limit = 10
  } = req.query;

  const query: any = { createdBy: req.user!._id };

  // Apply filters
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (category) query.category = category;
  if (assignee) query.assigneeId = assignee;
  if (project) query.projectId = project;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search as string, 'i')] } }
    ];
  }

  const sort: any = {};
  sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

  const tasks = await Task.find(query)
    .populate('assigneeId', 'name email avatar')
    .populate('projectId', 'name color')
    .populate('subtasks', 'title status priority')
    .sort(sort)
    .limit(Number(limit) * 1)
    .skip((Number(page) - 1) * Number(limit));

  const total = await Task.countDocuments(query);

  res.json({
    success: true,
    data: {
      tasks,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      }
    }
  });
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const task = await Task.findOne({
    _id: req.params.id,
    createdBy: req.user!._id
  })
    .populate('assigneeId', 'name email avatar')
    .populate('projectId', 'name color')
    .populate('subtasks', 'title status priority')
    .populate('attachments', 'filename url')
    .populate('comments', 'content authorName createdAt')
    .populate('dependencies', 'title status priority');

  if (!task) {
    res.status(404).json({
      success: false,
      message: 'Task not found'
    });
    return;
  }

  res.json({
    success: true,
    data: { task }
  });
});

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const taskData = {
    ...req.body,
    createdBy: req.user!._id
  };

  const task = await Task.create(taskData);

  await task.populate([
    { path: 'assigneeId', select: 'name email avatar' },
    { path: 'projectId', select: 'name color' }
  ]);

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: { task }
  });
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user!._id },
    req.body,
    { new: true, runValidators: true }
  )
    .populate('assigneeId', 'name email avatar')
    .populate('projectId', 'name color')
    .populate('subtasks', 'title status priority');

  if (!task) {
    res.status(404).json({
      success: false,
      message: 'Task not found'
    });
    return;
  }

  res.json({
    success: true,
    message: 'Task updated successfully',
    data: { task }
  });
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user!._id
  });

  if (!task) {
    res.status(404).json({
      success: false,
      message: 'Task not found'
    });
    return;
  }

  res.json({
    success: true,
    message: 'Task deleted successfully'
  });
});

// @desc    Toggle task status
// @route   PATCH /api/tasks/:id/toggle
// @access  Private
export const toggleTaskStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const task = await Task.findOne({
    _id: req.params.id,
    createdBy: req.user!._id
  });

  if (!task) {
    res.status(404).json({
      success: false,
      message: 'Task not found'
    });
    return;
  }

  // Toggle status
  if (task.status === 'completed') {
    task.status = 'todo';
    task.completedAt = undefined;
  } else if (task.status === 'todo') {
    task.status = 'in-progress';
  } else {
    task.status = 'completed';
    task.completedAt = new Date();
  }

  await task.save();

  res.json({
    success: true,
    message: 'Task status updated successfully',
    data: { task }
  });
});

// @desc    Get tasks by date range
// @route   GET /api/tasks/date-range
// @access  Private
export const getTasksByDateRange = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    res.status(400).json({
      success: false,
      message: 'Start date and end date are required'
    });
    return;
  }

  const tasks = await Task.find({
    createdBy: req.user!._id,
    deadline: {
      $gte: new Date(startDate as string),
      $lte: new Date(endDate as string)
    }
  })
    .populate('assigneeId', 'name email avatar')
    .populate('projectId', 'name color')
    .sort({ deadline: 1 });

  res.json({
    success: true,
    data: { tasks }
  });
});

// @desc    Get overdue tasks
// @route   GET /api/tasks/overdue
// @access  Private
export const getOverdueTasks = asyncHandler(async (req: AuthRequest, res: Response) => {
  const tasks = await Task.find({
    createdBy: req.user!._id,
    deadline: { $lt: new Date() },
    status: { $ne: 'completed' }
  })
    .populate('assigneeId', 'name email avatar')
    .populate('projectId', 'name color')
    .sort({ deadline: 1 });

  res.json({
    success: true,
    data: { tasks }
  });
});

// @desc    Get upcoming tasks
// @route   GET /api/tasks/upcoming
// @access  Private
export const getUpcomingTasks = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { days = 7 } = req.query;
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + Number(days));

  const tasks = await Task.find({
    createdBy: req.user!._id,
    deadline: {
      $gte: new Date(),
      $lte: futureDate
    },
    status: { $ne: 'completed' }
  })
    .populate('assigneeId', 'name email avatar')
    .populate('projectId', 'name color')
    .sort({ deadline: 1 });

  res.json({
    success: true,
    data: { tasks }
  });
});

// @desc    Get task statistics
// @route   GET /api/tasks/stats
// @access  Private
export const getTaskStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const stats = await Task.aggregate([
    { $match: { createdBy: req.user!._id } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const priorityStats = await Task.aggregate([
    { $match: { createdBy: req.user!._id } },
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 }
      }
    }
  ]);

  const categoryStats = await Task.aggregate([
    { $match: { createdBy: req.user!._id } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      statusStats: stats,
      priorityStats,
      categoryStats
    }
  });
});
