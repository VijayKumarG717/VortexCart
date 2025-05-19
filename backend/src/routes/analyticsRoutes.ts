import express from 'express';
import { protect, admin } from '../middleware/authMiddleware';
import {
  getDashboardStats,
  getSalesReport,
  getCustomerInsights
} from '../controllers/analyticsController';

const router = express.Router();

// All analytics routes are admin-only
router.use(protect, admin);

router.get('/dashboard', getDashboardStats);
router.get('/sales', getSalesReport);
router.get('/customers', getCustomerInsights);

export default router; 