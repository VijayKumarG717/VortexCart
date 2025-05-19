import express from 'express';
import { protect, admin } from '../middleware/authMiddleware';
import {
  createReview,
  getProductReviews,
  getReviewById,
  updateReview,
  deleteReview,
  markReviewHelpful,
  markReviewNotHelpful,
  getUserReviews
} from '../controllers/reviewController';

const router = express.Router();

// Public routes
router.get('/product/:productId', getProductReviews);
router.get('/:id', getReviewById);

// Protected routes
router.use(protect);
router.post('/', createReview);
router.get('/user/reviews', getUserReviews);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);
router.put('/:id/helpful', markReviewHelpful);
router.put('/:id/not-helpful', markReviewNotHelpful);

export default router; 