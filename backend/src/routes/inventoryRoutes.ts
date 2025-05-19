import express, { Request, Response } from 'express';
import { protect, admin } from '../middleware/authMiddleware';
import {
  getInventoryItems,
  getInventoryByProductId,
  createOrUpdateInventory,
  receiveStock,
  shipStock,
  reserveStock,
  getLowStockAlerts,
  getInventoryTransactions
} from '../controllers/inventoryController';

const router = express.Router();

// All inventory routes need authentication
router.use(protect);

// Regular authenticated routes (for reserving stock during checkout)
router.route('/reserve').put(reserveStock);

// Admin only routes
router.route('/')
  .get(admin, getInventoryItems)
  .post(admin, createOrUpdateInventory);

router.route('/alerts').get(admin, getLowStockAlerts);
router.route('/product/:productId').get(admin, getInventoryByProductId);
router.route('/:id/transactions').get(admin, getInventoryTransactions);
router.route('/:id/receive').put(admin, receiveStock);
router.route('/:id/ship').put(admin, shipStock);

export default router; 