import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { CalendarIntegrationService } from '../services/calendarIntegrationService';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// All routes are protected
router.use(authenticateToken);

// @desc    Sync with Google Calendar
// @route   POST /api/integrations/google/sync
// @access  Private
router.post('/google/sync', asyncHandler(async (req, res) => {
  const result = await CalendarIntegrationService.syncWithGoogleCalendar(
    req.user!._id.toString()
  );

  res.json({
    success: true,
    message: result.message
  });
}));

// @desc    Sync with Outlook Calendar
// @route   POST /api/integrations/outlook/sync
// @access  Private
router.post('/outlook/sync', asyncHandler(async (req, res) => {
  const result = await CalendarIntegrationService.syncWithOutlook(
    req.user!._id.toString()
  );

  res.json({
    success: true,
    message: result.message
  });
}));

// @desc    Send Slack notification
// @route   POST /api/integrations/slack/notify
// @access  Private
router.post('/slack/notify', asyncHandler(async (req, res) => {
  const { webhookUrl, message } = req.body;

  await CalendarIntegrationService.sendSlackNotification(webhookUrl, message);

  res.json({
    success: true,
    message: 'Slack notification sent successfully'
  });
}));

// @desc    Send Notion update
// @route   POST /api/integrations/notion/update
// @access  Private
router.post('/notion/update', asyncHandler(async (req, res) => {
  const { webhookUrl, data } = req.body;

  await CalendarIntegrationService.sendNotionUpdate(webhookUrl, data);

  res.json({
    success: true,
    message: 'Notion update sent successfully'
  });
}));

export default router;
