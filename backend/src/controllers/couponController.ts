import { Request, Response } from 'express';
import Coupon, { ICoupon } from '../models/Coupon';
import Product from '../models/Product';

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = async (req: Request, res: Response) => {
  try {
    const {
      code,
      description,
      discountType,
      discountAmount,
      minimumPurchase,
      expiryDate,
      usageLimit,
      applicableProducts,
      applicableCategories,
      isActive,
    } = req.body;

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      description,
      discountType,
      discountAmount,
      minimumPurchase: minimumPurchase || 0,
      expiryDate,
      usageLimit: usageLimit || 0,
      applicableProducts: applicableProducts || [],
      applicableCategories: applicableCategories || [],
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.user._id,
    });

    const createdCoupon = await coupon.save();
    res.status(201).json(createdCoupon);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
export const getCoupons = async (req: Request, res: Response) => {
  try {
    const coupons = await Coupon.find({})
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name');
    
    res.json(coupons);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get coupon by ID
// @route   GET /api/coupons/:id
// @access  Private/Admin
export const getCouponById = async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
      .populate('applicableProducts', 'name price image')
      .populate('applicableCategories', 'name');

    if (coupon) {
      res.json(coupon);
    } else {
      res.status(404).json({ message: 'Coupon not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
export const updateCoupon = async (req: Request, res: Response) => {
  try {
    const {
      code,
      description,
      discountType,
      discountAmount,
      minimumPurchase,
      expiryDate,
      usageLimit,
      applicableProducts,
      applicableCategories,
      isActive,
    } = req.body;

    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
      // If code is being updated, check if it's unique
      if (code && code !== coupon.code) {
        const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
        if (existingCoupon) {
          return res.status(400).json({ message: 'Coupon code already exists' });
        }
        coupon.code = code.toUpperCase();
      }

      coupon.description = description || coupon.description;
      coupon.discountType = discountType || coupon.discountType;
      coupon.discountAmount = discountAmount !== undefined ? discountAmount : coupon.discountAmount;
      coupon.minimumPurchase = minimumPurchase !== undefined ? minimumPurchase : coupon.minimumPurchase;
      coupon.expiryDate = expiryDate || coupon.expiryDate;
      coupon.usageLimit = usageLimit !== undefined ? usageLimit : coupon.usageLimit;
      coupon.isActive = isActive !== undefined ? isActive : coupon.isActive;
      
      if (applicableProducts) {
        coupon.applicableProducts = applicableProducts;
      }
      
      if (applicableCategories) {
        coupon.applicableCategories = applicableCategories;
      }

      const updatedCoupon = await coupon.save();
      res.json(updatedCoupon);
    } else {
      res.status(404).json({ message: 'Coupon not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
      await coupon.deleteOne();
      res.json({ message: 'Coupon removed' });
    } else {
      res.status(404).json({ message: 'Coupon not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Validate coupon code
// @route   POST /api/coupons/validate
// @access  Private
export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { code, cartItems, cartTotal } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Please provide a coupon code' });
    }

    // Find the coupon (case insensitive)
    const coupon = await Coupon.findOne({ 
      code: new RegExp(`^${code}$`, 'i'),
      isActive: true 
    });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or inactive coupon code' });
    }

    // Check if coupon has expired
    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    // Check if coupon has reached usage limit
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }

    // Check minimum purchase requirement
    if (cartTotal < coupon.minimumPurchase) {
      return res.status(400).json({ 
        message: `Minimum purchase of $${coupon.minimumPurchase} required for this coupon` 
      });
    }

    // Check if coupon is applicable to any products in cart
    let isApplicable = true;
    let applicableAmount = cartTotal;

    // If coupon has specific products or categories
    if (coupon.applicableProducts.length > 0 || coupon.applicableCategories.length > 0) {
      isApplicable = false;
      applicableAmount = 0;

      // Fetch product details for items in cart
      const productIds = cartItems.map((item: any) => item.product);
      const products = await Product.find({ _id: { $in: productIds } });

      for (const cartItem of cartItems) {
        const product = products.find(p => p._id.toString() === cartItem.product.toString());
        
        if (product) {
          // Check if product is directly applicable
          const isProductApplicable = coupon.applicableProducts.length > 0 ? 
            coupon.applicableProducts.some(id => id.toString() === product._id.toString()) : false;
          
          // Check if product's category is applicable
          const isCategoryApplicable = coupon.applicableCategories.length > 0 ? 
            coupon.applicableCategories.some(id => id.toString() === product.category.toString()) : false;
          
          if (isProductApplicable || isCategoryApplicable || 
              (coupon.applicableProducts.length === 0 && coupon.applicableCategories.length === 0)) {
            isApplicable = true;
            applicableAmount += cartItem.price * cartItem.qty;
          }
        }
      }
    }

    if (!isApplicable) {
      return res.status(400).json({ message: 'Coupon not applicable to items in cart' });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (applicableAmount * coupon.discountAmount) / 100;
    } else {
      discount = coupon.discountAmount;
    }

    // Ensure discount doesn't exceed the total
    discount = Math.min(discount, applicableAmount);

    res.json({
      valid: true,
      coupon: {
        _id: coupon._id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountAmount: coupon.discountAmount,
        description: coupon.description,
      },
      discount: Math.round(discount * 100) / 100,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Apply coupon (increment usage count)
// @route   PUT /api/coupons/apply/:id
// @access  Private
export const applyCoupon = async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    // Increment usage count
    coupon.usedCount += 1;
    await coupon.save();

    res.json({ success: true, message: 'Coupon applied successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}; 