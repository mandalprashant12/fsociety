import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes are protected
router.use(authenticateToken);

router.get('/profile', (req, res) => {
  res.json({ message: 'Get user profile - to be implemented' });
});

router.put('/profile', (req, res) => {
  res.json({ message: 'Update user profile - to be implemented' });
});

router.get('/availability', (req, res) => {
  res.json({ message: 'Get user availability - to be implemented' });
});

router.put('/availability', (req, res) => {
  res.json({ message: 'Update user availability - to be implemented' });
});

export default router;
