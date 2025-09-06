import { Router } from 'express';
import {
  register,
  login,
  refreshToken,
  getMe,
  logout,
  updateProfile,
  changePassword,
  getGoogleAuthUrl,
  handleGoogleCallback,
  verifyGoogleToken
} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);

// Google OAuth routes
router.get('/google/url', getGoogleAuthUrl);
router.post('/google/callback', handleGoogleCallback);
router.post('/google/verify', verifyGoogleToken);

// Protected routes
router.get('/me', authenticateToken, getMe);
router.post('/logout', authenticateToken, logout);
router.put('/profile', authenticateToken, updateProfile);
router.put('/change-password', authenticateToken, changePassword);

export default router;
