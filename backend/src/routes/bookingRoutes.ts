import { Router } from 'express';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import {
  getUserBookingPages,
  createBookingPage,
  updateBookingPage,
  deleteBookingPage,
  getPublicBookingPage,
  bookMeeting,
  getAvailableSlots
} from '../controllers/bookingController';

const router = Router();

// Public booking routes (no auth required)
router.get('/:slug', optionalAuth, getPublicBookingPage);
router.get('/:slug/availability', optionalAuth, getAvailableSlots);
router.post('/:slug/book', optionalAuth, bookMeeting);

// Protected routes for managing booking pages
router.use(authenticateToken);

router.get('/', getUserBookingPages);
router.post('/', createBookingPage);
router.put('/:id', updateBookingPage);
router.delete('/:id', deleteBookingPage);

export default router;
