import express from 'express';
import { protect, admin } from '../middleware/authMiddleware';
import {
  processPayment,
  getPaymentById,
  getPaymentHistory,
  issueRefund,
  getAllPayments
} from '../controllers/paymentController';

const router = express.Router();

// User routes
router.post('/', protect, processPayment);
router.get('/history', protect, getPaymentHistory);
router.get('/:id', protect, getPaymentById);

// Admin routes
router.get('/', protect, admin, getAllPayments);
router.post('/:id/refund', protect, admin, issueRefund);

export default router; 