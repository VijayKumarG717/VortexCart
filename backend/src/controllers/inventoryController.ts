import { Request, Response } from 'express';
import Inventory from '../models/Inventory';
import Product from '../models/Product';

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private/Admin
export const getInventoryItems = async (req: Request, res: Response) => {
  try {
    const { lowStock, sortBy, limit = 50, page = 1 } = req.query;
    
    let query = {};
    let sort = { createdAt: -1 };
    
    // Filter for low stock items
    if (lowStock === 'true') {
      query = { 
        $expr: { 
          $lte: ['$availableQuantity', '$reorderPoint'] 
        } 
      };
    }
    
    // Sort options
    if (sortBy === 'sku') sort = { sku: 1 };
    if (sortBy === 'quantity') sort = { quantity: -1 };
    if (sortBy === 'lowStock') sort = { availableQuantity: 1 };
    
    const numLimit = Number(limit);
    const numPage = Number(page);
    const skip = (numPage - 1) * numLimit;
    
    const count = await Inventory.countDocuments(query);
    const inventory = await Inventory.find(query)
      .sort(sort)
      .limit(numLimit)
      .skip(skip)
      .populate('product', 'name image price');
    
    res.json({
      inventory,
      page: numPage,
      pages: Math.ceil(count / numLimit),
      total: count
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get inventory item by product ID
// @route   GET /api/inventory/product/:productId
// @access  Private/Admin
export const getInventoryByProductId = async (req: Request, res: Response) => {
  try {
    const inventory = await Inventory.findOne({ product: req.params.productId })
      .populate('product', 'name image price')
      .populate('transactions.performedBy', 'name');
    
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory record not found' });
    }
    
    res.json(inventory);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update inventory item
// @route   POST /api/inventory
// @access  Private/Admin
export const createOrUpdateInventory = async (req: Request, res: Response) => {
  try {
    const { 
      productId, 
      sku, 
      quantity, 
      reorderPoint, 
      reorderQuantity, 
      location, 
      costPerUnit 
    } = req.body;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if inventory already exists for this product
    let inventory = await Inventory.findOne({ product: productId });
    
    if (inventory) {
      // Update existing inventory
      const previousStock = inventory.quantity;
      
      // Update inventory fields
      inventory.sku = sku || inventory.sku;
      inventory.reorderPoint = reorderPoint !== undefined ? reorderPoint : inventory.reorderPoint;
      inventory.reorderQuantity = reorderQuantity !== undefined ? reorderQuantity : inventory.reorderQuantity;
      inventory.location = location !== undefined ? location : inventory.location;
      inventory.costPerUnit = costPerUnit !== undefined ? costPerUnit : inventory.costPerUnit;
      
      // Handle stock adjustment if quantity is provided
      if (quantity !== undefined) {
        inventory.quantity = quantity;
        
        // Add transaction record for the adjustment
        inventory.transactions.push({
          product: productId,
          type: 'adjusted',
          quantity: quantity - previousStock,
          previousStock,
          currentStock: quantity,
          notes: 'Manual inventory adjustment',
          performedBy: req.user._id,
        });
        
        // Update product countInStock
        product.countInStock = quantity;
        await product.save();
      }
      
      const updatedInventory = await inventory.save();
      
      res.json({
        message: 'Inventory updated successfully',
        inventory: updatedInventory
      });
    } else {
      // Create new inventory record
      inventory = new Inventory({
        product: productId,
        sku,
        quantity: quantity || 0,
        reorderPoint: reorderPoint || 5,
        reorderQuantity: reorderQuantity || 10,
        location,
        costPerUnit: costPerUnit || 0,
        transactions: [{
          product: productId,
          type: 'received',
          quantity: quantity || 0,
          previousStock: 0,
          currentStock: quantity || 0,
          notes: 'Initial inventory setup',
          performedBy: req.user._id,
        }]
      });
      
      const createdInventory = await inventory.save();
      
      // Update product countInStock
      product.countInStock = quantity || 0;
      await product.save();
      
      res.status(201).json({
        message: 'Inventory created successfully',
        inventory: createdInventory
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add stock to inventory (receiving)
// @route   PUT /api/inventory/:id/receive
// @access  Private/Admin
export const receiveStock = async (req: Request, res: Response) => {
  try {
    const { quantity, reference, notes, cost } = req.body;
    
    const inventory = await Inventory.findById(req.params.id);
    
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory record not found' });
    }
    
    // Calculate new quantity
    const previousStock = inventory.quantity;
    const newQuantity = previousStock + Number(quantity);
    
    // Add transaction record
    inventory.transactions.push({
      product: inventory.product,
      type: 'received',
      quantity: Number(quantity),
      previousStock,
      currentStock: newQuantity,
      reference,
      notes,
      cost,
      performedBy: req.user._id,
    });
    
    // Update inventory quantity
    inventory.quantity = newQuantity;
    
    // If cost is provided, calculate a new weighted average cost
    if (cost) {
      const totalOldValue = previousStock * inventory.costPerUnit;
      const newValue = Number(quantity) * Number(cost);
      inventory.costPerUnit = (totalOldValue + newValue) / newQuantity;
    }
    
    const updatedInventory = await inventory.save();
    
    // Update product countInStock
    const product = await Product.findById(inventory.product);
    if (product) {
      product.countInStock = newQuantity;
      await product.save();
    }
    
    res.json({
      message: 'Stock received successfully',
      inventory: updatedInventory
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove stock from inventory (shipping)
// @route   PUT /api/inventory/:id/ship
// @access  Private/Admin
export const shipStock = async (req: Request, res: Response) => {
  try {
    const { quantity, reference, notes } = req.body;
    
    const inventory = await Inventory.findById(req.params.id);
    
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory record not found' });
    }
    
    // Ensure there's enough stock
    if (inventory.availableQuantity < Number(quantity)) {
      return res.status(400).json({ 
        message: 'Not enough available stock',
        available: inventory.availableQuantity,
        requested: quantity
      });
    }
    
    // Calculate new quantity
    const previousStock = inventory.quantity;
    const newQuantity = previousStock - Number(quantity);
    
    // Add transaction record
    inventory.transactions.push({
      product: inventory.product,
      type: 'shipped',
      quantity: -Number(quantity), // Negative for outgoing
      previousStock,
      currentStock: newQuantity,
      reference,
      notes,
      performedBy: req.user._id,
    });
    
    // Update inventory quantity
    inventory.quantity = newQuantity;
    
    const updatedInventory = await inventory.save();
    
    // Update product countInStock
    const product = await Product.findById(inventory.product);
    if (product) {
      product.countInStock = newQuantity;
      await product.save();
    }
    
    res.json({
      message: 'Stock shipped successfully',
      inventory: updatedInventory
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reserve stock for an order
// @route   PUT /api/inventory/reserve
// @access  Private
export const reserveStock = async (req: Request, res: Response) => {
  try {
    const { items, orderId } = req.body;
    
    if (!items || !items.length) {
      return res.status(400).json({ message: 'No items provided' });
    }
    
    const results = [];
    let error = null;
    
    // Use a transaction to ensure all or nothing
    const session = await Inventory.startSession();
    
    try {
      await session.withTransaction(async () => {
        for (const item of items) {
          const { productId, quantity } = item;
          
          const inventory = await Inventory.findOne({ product: productId }).session(session);
          
          if (!inventory) {
            throw new Error(`Inventory for product ${productId} not found`);
          }
          
          if (inventory.availableQuantity < quantity) {
            throw new Error(`Not enough available stock for product ${productId}`);
          }
          
          // Increase reserved quantity
          inventory.reservedQuantity += Number(quantity);
          
          // Add reference to the reservation
          inventory.transactions.push({
            product: productId,
            type: 'shipped',
            quantity: -Number(quantity),
            previousStock: inventory.quantity,
            currentStock: inventory.quantity, // Quantity doesn't change yet, just reserved
            reference: `Order ${orderId}`,
            notes: 'Stock reserved for order',
            performedBy: req.user._id,
          });
          
          await inventory.save({ session });
          
          results.push({
            productId,
            reserved: quantity,
            remaining: inventory.availableQuantity
          });
        }
      });
      
      res.json({
        message: 'Stock reserved successfully',
        results
      });
    } catch (err: any) {
      error = err.message;
      res.status(400).json({ message: error });
    } finally {
      session.endSession();
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get inventory low stock alerts
// @route   GET /api/inventory/alerts
// @access  Private/Admin
export const getLowStockAlerts = async (req: Request, res: Response) => {
  try {
    const lowStockItems = await Inventory.find({
      $expr: { 
        $lte: ['$availableQuantity', '$reorderPoint'] 
      }
    }).populate('product', 'name image price');
    
    res.json({
      count: lowStockItems.length,
      items: lowStockItems
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get inventory transaction history
// @route   GET /api/inventory/:id/transactions
// @access  Private/Admin
export const getInventoryTransactions = async (req: Request, res: Response) => {
  try {
    const inventory = await Inventory.findById(req.params.id)
      .populate('transactions.performedBy', 'name');
    
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory record not found' });
    }
    
    // Sort transactions by date (newest first)
    const transactions = inventory.transactions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    res.json(transactions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}; 