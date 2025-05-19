import mongoose, { Document, Schema } from 'mongoose';

export interface IReviewDetail extends Document {
  product: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  name: string;
  rating: number;
  title: string;
  comment: string;
  pros: string[];
  cons: string[];
  helpfulCount: number;
  notHelpfulCount: number;
  verified: boolean;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const reviewDetailSchema = new Schema<IReviewDetail>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    pros: {
      type: [String],
      default: [],
    },
    cons: {
      type: [String],
      default: [],
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
    notHelpfulCount: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index to ensure a user can only review a product once
reviewDetailSchema.index({ product: 1, user: 1 }, { unique: true });

const ReviewDetail = mongoose.model<IReviewDetail>('ReviewDetail', reviewDetailSchema);

export default ReviewDetail; 