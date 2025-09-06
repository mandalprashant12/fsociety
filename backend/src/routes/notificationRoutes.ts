import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { NotificationService } from '../services/notificationService';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// All routes are protected
router.use(authenticateToken);

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
router.get('/', asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;
  const notifications = await NotificationService.getUserNotifications(
    req.user!._id.toString(),
    Number(limit)
  );

  res.json({
    success: true,
    data: { notifications }
  });
}));

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
router.patch('/:id/read', asyncHandler(async (req, res) => {
  const notification = await NotificationService.markAsRead(
    req.params.id,
    req.user!._id.toString()
  );

  if (!notification) {
    res.status(404).json({
      success: false,
      message: 'Notification not found'
    });
    return;
  }

  res.json({
    success: true,
    message: 'Notification marked as read',
    data: { notification }
  });
}));

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
router.patch('/read-all', asyncHandler(async (req, res) => {
  await NotificationService.markAllAsRead(req.user!._id.toString());

  res.json({
    success: true,
    message: 'All notifications marked as read'
  });
}));

// @desc    Send test notification
// @route   POST /api/notifications/test
// @access  Private
router.post('/test', asyncHandler(async (req, res) => {
  const { title, body } = req.body;

  const notification = await NotificationService.sendToUser(
    req.user!._id.toString(),
    {
      title: title || 'Test Notification',
      body: body || 'This is a test notification',
      icon: '/icons/notification-icon.png'
    }
  );

  res.json({
    success: true,
    message: 'Test notification sent',
    data: { notification }
  });
}));

export default router;
