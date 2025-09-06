import { Router, Request, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { CalendarIntegrationService } from '../services/calendarIntegrationService';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// All routes are protected
router.use(authenticateToken);

// @desc    Get Google OAuth URL
// @route   GET /api/integrations/google/auth-url
// @access  Private
router.get('/google/auth-url', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { userId } = req.query;
  const targetUserId = userId ? userId as string : (req.user as any)._id.toString();
  const authUrl = CalendarIntegrationService.getGoogleAuthUrl();
  
  res.json({
    success: true,
    authUrl,
    userId: targetUserId
  });
}));

// @desc    Handle Google OAuth callback
// @route   POST /api/integrations/google/callback
// @access  Private
router.post('/google/callback', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { code, userId } = req.body;
  const targetUserId = userId || (req.user as any)._id.toString();
  const result = await CalendarIntegrationService.handleGoogleCallback(
    code,
    targetUserId
  );

  res.json(result);
}));

// @desc    Disconnect Google Calendar
// @route   DELETE /api/integrations/google/disconnect
// @access  Private
router.delete('/google/disconnect', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { userId } = req.body;
  const targetUserId = userId || (req.user as any)._id.toString();
  const result = await CalendarIntegrationService.disconnectGoogleCalendar(
    targetUserId
  );

  res.json(result);
}));

// @desc    Get Google Calendar events
// @route   GET /api/integrations/google/events
// @access  Private
router.get('/google/events', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { timeMin, timeMax, userId } = req.query;
  const targetUserId = userId ? userId as string : (req.user as any)._id.toString();
  const result = await CalendarIntegrationService.getGoogleEvents(
    targetUserId,
    timeMin as string,
    timeMax as string
  );

  res.json(result);
}));

// @desc    Create Google Calendar event
// @route   POST /api/integrations/google/events
// @access  Private
router.post('/google/events', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { userId, ...eventData } = req.body;
  const targetUserId = userId || (req.user as any)._id.toString();
  const result = await CalendarIntegrationService.createGoogleEvent(
    targetUserId,
    eventData
  );

  res.json(result);
}));

// @desc    Update Google Calendar event
// @route   PUT /api/integrations/google/events/:eventId
// @access  Private
router.put('/google/events/:eventId', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { eventId } = req.params;
  const { userId, ...eventData } = req.body;
  const targetUserId = userId || (req.user as any)._id.toString();
  const result = await CalendarIntegrationService.updateGoogleEvent(
    targetUserId,
    eventId,
    eventData
  );

  res.json(result);
}));

// @desc    Delete Google Calendar event
// @route   DELETE /api/integrations/google/events/:eventId
// @access  Private
router.delete('/google/events/:eventId', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { eventId } = req.params;
  const { userId } = req.body;
  const targetUserId = userId || (req.user as any)._id.toString();
  const result = await CalendarIntegrationService.deleteGoogleEvent(
    targetUserId,
    eventId
  );

  res.json(result);
}));

// @desc    Sync with Google Calendar
// @route   POST /api/integrations/google/sync
// @access  Private
router.post('/google/sync', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { userId } = req.body;
  const targetUserId = userId || (req.user as any)._id.toString();
  const result = await CalendarIntegrationService.syncWithGoogleCalendar(
    targetUserId
  );

  res.json({
    success: true,
    message: result.message
  });
}));

// @desc    Sync with Outlook Calendar
// @route   POST /api/integrations/outlook/sync
// @access  Private
router.post('/outlook/sync', asyncHandler(async (req: AuthRequest, res: Response) => {
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
router.post('/slack/notify', asyncHandler(async (req: AuthRequest, res: Response) => {
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
router.post('/notion/update', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { webhookUrl, data } = req.body;

  await CalendarIntegrationService.sendNotionUpdate(webhookUrl, data);

  res.json({
    success: true,
    message: 'Notion update sent successfully'
  });
}));

export default router;
