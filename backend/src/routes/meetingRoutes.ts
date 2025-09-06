import { Router } from 'express';
import {
  getMeetings,
  getMeeting,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  joinMeeting,
  respondToMeeting,
  getUpcomingMeetings,
  getMeetingsForCalendar,
  generateMeetingLink
} from '../controllers/meetingController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes are protected
router.use(authenticateToken);

// Meeting CRUD operations
router.get('/', getMeetings);
router.get('/upcoming', getUpcomingMeetings);
router.get('/calendar', getMeetingsForCalendar);
router.get('/:id', getMeeting);
router.post('/', createMeeting);
router.put('/:id', updateMeeting);
router.delete('/:id', deleteMeeting);

// Meeting actions
router.post('/:id/join', joinMeeting);
router.post('/:id/respond', respondToMeeting);
router.post('/:id/generate-link', generateMeetingLink);

export default router;
