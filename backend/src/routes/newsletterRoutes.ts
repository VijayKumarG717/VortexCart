import express from 'express';
import { protect, admin } from '../middleware/authMiddleware';
import {
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  updateNewsletterPreferences,
  getNewsletterSubscribers,
  deleteNewsletterSubscriber
} from '../controllers/newsletterController';

const router = express.Router();

// Public routes
router.post('/subscribe', subscribeToNewsletter);
router.put('/unsubscribe', unsubscribeFromNewsletter);

// Protected routes
router.put('/preferences', protect, updateNewsletterPreferences);

// Admin routes
router.get('/subscribers', protect, admin, getNewsletterSubscribers);
router.delete('/:id', protect, admin, deleteNewsletterSubscriber);

export default router; 