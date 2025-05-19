import mongoose, { Document, Schema } from 'mongoose';

export interface IInventoryTransaction extends Document {
  product: mongoose.Schema.Types.ObjectId;
  type: 'received' | 'shipped' | 'adjusted' | 'returned';
  quantity: number;
  previousStock: number;
  currentStock: number;
  reference?: string;
  notes?: string;
  cost?: number;
  performedBy: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInventory extends Document {
  product: mongoose.Schema.Types.ObjectId;
  sku: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  reorderPoint: number;
  reorderQuantity: number;
  location?: string;
  costPerUnit: number;
  transactions: IInventoryTransaction[];
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const inventoryTransactionSchema = new Schema<IInventoryTransaction>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    type: {
      type: String,
      required: true,
      enum: ['received', 'shipped', 'adjusted', 'returned'],
    },
    quantity: {
      type: Number,
      required: true,
    },
    previousStock: {
      type: Number,
      required: true,
    },
    currentStock: {
      type: Number,
      required: true,
    },
    reference: {
      type: String,
    },
    notes: {
      type: String,
    },
    cost: {
      type: Number,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const inventorySchema = new Schema<IInventory>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
      unique: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    reservedQuantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    availableQuantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    reorderPoint: {
      type: Number,
      required: true,
      default: 5,
      min: 0,
    },
    reorderQuantity: {
      type: Number,
      required: true,
      default: 10,
      min: 1,
    },
    location: {
      type: String,
    },
    costPerUnit: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    transactions: [inventoryTransactionSchema],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for calculating inventory value
inventorySchema.virtual('inventoryValue').get(function () {
  return this.quantity * this.costPerUnit;
});

// Middleware to update availableQuantity
inventorySchema.pre('save', function (next) {
  this.availableQuantity = Math.max(0, this.quantity - this.reservedQuantity);
  this.lastUpdated = new Date();
  next();
});

const Inventory = mongoose.model<IInventory>('Inventory', inventorySchema);

export default Inventory; 