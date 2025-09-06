import { Router } from 'express';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
  getTasksByDateRange,
  getOverdueTasks,
  getUpcomingTasks,
  getTaskStats
} from '../controllers/taskController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes are protected
router.use(authenticateToken);

// Task CRUD operations
router.get('/', getTasks);
router.get('/stats', getTaskStats);
router.get('/overdue', getOverdueTasks);
router.get('/upcoming', getUpcomingTasks);
router.get('/date-range', getTasksByDateRange);
router.get('/:id', getTask);
router.post('/', createTask);
router.put('/:id', updateTask);
router.patch('/:id/toggle', toggleTaskStatus);
router.delete('/:id', deleteTask);

export default router;
