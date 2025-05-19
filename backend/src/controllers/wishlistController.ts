import { Request, Response } from 'express';
import Wishlist from '../models/Wishlist';
import Product from '../models/Product';

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req: Request, res: Response) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    
    // If no wishlist exists, create an empty one
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [],
      });
    }
    
    res.json(wishlist);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private
export const addToWishlist = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;
    
    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Find user's wishlist or create one
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [productId],
      });
    } else {
      // Check if product is already in wishlist
      if (wishlist.products.includes(productId)) {
        return res.status(400).json({ message: 'Product already in wishlist' });
      }
      
      // Add product to wishlist
      wishlist.products.push(productId);
      await wishlist.save();
    }
    
    res.status(201).json({ message: 'Product added to wishlist', wishlist });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
export const removeFromWishlist = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;
    
    // Find user's wishlist
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }
    
    // Check if product is in wishlist
    if (!wishlist.products.includes(productId)) {
      return res.status(400).json({ message: 'Product not in wishlist' });
    }
    
    // Remove product from wishlist
    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== productId
    );
    
    await wishlist.save();
    
    res.json({ message: 'Product removed from wishlist', wishlist });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
export const clearWishlist = async (req: Request, res: Response) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }
    
    wishlist.products = [];
    await wishlist.save();
    
    res.json({ message: 'Wishlist cleared', wishlist });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}; 