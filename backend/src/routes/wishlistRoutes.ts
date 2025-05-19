import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist
} from '../controllers/wishlistController';

const router = express.Router();

// All wishlist routes are protected
router.use(protect);

router.route('/')
  .get(getWishlist)
  .post(addToWishlist)
  .delete(clearWishlist);

router.delete('/:productId', removeFromWishlist);

export default router; 