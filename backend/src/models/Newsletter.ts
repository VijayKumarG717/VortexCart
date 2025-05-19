import mongoose, { Document, Schema } from 'mongoose';

export interface INewsletter extends Document {
  email: string;
  name?: string;
  isSubscribed: boolean;
  subscriptionDate: Date;
  unsubscriptionDate?: Date;
  preferences: {
    promotions: boolean;
    newProducts: boolean;
    blogPosts: boolean;
    events: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const newsletterSchema = new Schema<INewsletter>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    name: {
      type: String,
      trim: true,
    },
    isSubscribed: {
      type: Boolean,
      default: true,
    },
    subscriptionDate: {
      type: Date,
      default: Date.now,
    },
    unsubscriptionDate: {
      type: Date,
    },
    preferences: {
      promotions: {
        type: Boolean,
        default: true,
      },
      newProducts: {
        type: Boolean,
        default: true,
      },
      blogPosts: {
        type: Boolean,
        default: false,
      },
      events: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Newsletter = mongoose.model<INewsletter>('Newsletter', newsletterSchema);

export default Newsletter; 