import express from 'express';
import { protect, admin } from '../middleware/authMiddleware';
import {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  applyCoupon
} from '../controllers/couponController';

const router = express.Router();

// Admin routes
router.route('/')
  .post(protect, admin, createCoupon)
  .get(protect, admin, getCoupons);

router.route('/:id')
  .get(protect, admin, getCouponById)
  .put(protect, admin, updateCoupon)
  .delete(protect, admin, deleteCoupon);

// Customer routes
router.post('/validate', protect, validateCoupon);
router.put('/apply/:id', protect, applyCoupon);

export default router; 