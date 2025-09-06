import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { AIService } from '../services/aiService';
import { asyncHandler } from '../middleware/errorHandler';
import { Meeting } from '../models/Meeting';
import { Task } from '../models/Task';

const router = Router();

// All routes are protected
router.use(authenticateToken);

// @desc    Generate meeting summary
// @route   POST /api/ai/meeting-summary
// @access  Private
router.post('/meeting-summary', asyncHandler(async (req, res) => {
  const { meetingId, notes } = req.body;

  let meeting;
  if (meetingId) {
    meeting = await Meeting.findOne({
      _id: meetingId,
      $or: [
        { createdBy: req.user!._id },
        { 'attendees.id': req.user!._id }
      ]
    });
  }

  const attendees = meeting?.attendees.map(a => a.name) || [];
  const meetingNotes = notes || meeting?.notes || '';

  const summary = await AIService.generateMeetingSummary(meetingNotes, attendees);

  res.json({
    success: true,
    data: { summary }
  });
}));

// @desc    Generate task summary
// @route   POST /api/ai/task-summary
// @access  Private
router.post('/task-summary', asyncHandler(async (req, res) => {
  const { taskIds, dateRange } = req.body;

  let query: any = { createdBy: req.user!._id };
  
  if (taskIds && taskIds.length > 0) {
    query._id = { $in: taskIds };
  }
  
  if (dateRange) {
    query.createdAt = {
      $gte: new Date(dateRange.start),
      $lte: new Date(dateRange.end)
    };
  }

  const tasks = await Task.find(query).limit(50);
  const summary = await AIService.generateTaskSummary(tasks);

  res.json({
    success: true,
    data: { summary }
  });
}));

// @desc    Get smart suggestions
// @route   POST /api/ai/suggestions
// @access  Private
router.post('/suggestions', asyncHandler(async (req, res) => {
  const { context } = req.body;

  const suggestions = await AIService.generateSmartSuggestions(
    req.user!._id.toString(),
    context || 'general productivity'
  );

  res.json({
    success: true,
    data: { suggestions }
  });
}));

export default router;
