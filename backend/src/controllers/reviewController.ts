import { Request, Response } from 'express';
import ReviewDetail from '../models/Review';
import Product from '../models/Product';
import Order from '../models/Order';

// @desc    Create a new detailed review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req: Request, res: Response) => {
  try {
    const { 
      productId, 
      rating, 
      title, 
      comment, 
      pros, 
      cons,
      images 
    } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user has already reviewed this product
    const alreadyReviewed = await ReviewDetail.findOne({
      user: req.user._id,
      product: productId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    // Verify the user has purchased the product (optional but recommended)
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      'orderItems.product': productId,
      isPaid: true,
    });

    // Create the review
    const review = new ReviewDetail({
      product: productId,
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      title,
      comment,
      pros: pros || [],
      cons: cons || [],
      verified: Boolean(hasPurchased), // Mark as verified if purchased
      images: images || [],
    });

    const createdReview = await review.save();

    // Update product rating
    await updateProductRating(productId);

    res.status(201).json({
      message: 'Review added successfully',
      review: createdReview,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;
    
    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const reviews = await ReviewDetail.find({ product: productId })
      .sort({ createdAt: -1 })
      .populate('user', 'name avatar');

    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a review by ID
// @route   GET /api/reviews/:id
// @access  Public
export const getReviewById = async (req: Request, res: Response) => {
  try {
    const review = await ReviewDetail.findById(req.params.id)
      .populate('user', 'name avatar')
      .populate('product', 'name image');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(review);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req: Request, res: Response) => {
  try {
    const { 
      rating, 
      title, 
      comment, 
      pros, 
      cons,
      images 
    } = req.body;

    const review = await ReviewDetail.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is the author of the review
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    // Update review fields
    if (rating) review.rating = Number(rating);
    if (title) review.title = title;
    if (comment) review.comment = comment;
    if (pros) review.pros = pros;
    if (cons) review.cons = cons;
    if (images) review.images = images;

    const updatedReview = await review.save();

    // Update product rating
    await updateProductRating(review.product);

    res.json({
      message: 'Review updated successfully',
      review: updatedReview,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const review = await ReviewDetail.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is the author of the review or an admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    const productId = review.product;
    
    await review.deleteOne();

    // Update product rating
    await updateProductRating(productId);

    res.json({ message: 'Review removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark review as helpful
// @route   PUT /api/reviews/:id/helpful
// @access  Private
export const markReviewHelpful = async (req: Request, res: Response) => {
  try {
    const review = await ReviewDetail.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Don't allow users to mark their own reviews as helpful
    if (review.user.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot mark your own review as helpful' });
    }

    review.helpfulCount += 1;
    await review.save();

    res.json({ 
      message: 'Review marked as helpful',
      helpfulCount: review.helpfulCount 
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark review as not helpful
// @route   PUT /api/reviews/:id/not-helpful
// @access  Private
export const markReviewNotHelpful = async (req: Request, res: Response) => {
  try {
    const review = await ReviewDetail.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Don't allow users to mark their own reviews as not helpful
    if (review.user.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot mark your own review as not helpful' });
    }

    review.notHelpfulCount += 1;
    await review.save();

    res.json({ 
      message: 'Review marked as not helpful',
      notHelpfulCount: review.notHelpfulCount 
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's reviews
// @route   GET /api/reviews/user
// @access  Private
export const getUserReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await ReviewDetail.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('product', 'name image');

    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to update a product's rating based on reviews
const updateProductRating = async (productId: string) => {
  const reviews = await ReviewDetail.find({ product: productId });
  
  if (reviews.length === 0) {
    // If no detailed reviews exist, reset product rating
    const product = await Product.findById(productId);
    if (product) {
      product.rating = 0;
      product.numReviews = 0;
      await product.save();
    }
    return;
  }
  
  const avgRating = reviews.reduce((total, review) => total + review.rating, 0) / reviews.length;
  
  const product = await Product.findById(productId);
  if (product) {
    product.rating = avgRating;
    product.numReviews = reviews.length;
    await product.save();
  }
}; 