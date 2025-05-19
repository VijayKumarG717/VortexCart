import { Request, Response } from 'express';
import Payment, { IPayment } from '../models/Payment';
import Order from '../models/Order';

// @desc    Process payment
// @route   POST /api/payments
// @access  Private
export const processPayment = async (req: Request, res: Response) => {
  try {
    const { orderId, paymentMethod, transactionId, amount, paymentDetails } = req.body;

    // Validate order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Validate payment amount matches order total
    if (amount !== order.totalPrice) {
      return res.status(400).json({ 
        message: 'Payment amount does not match order total',
        orderTotal: order.totalPrice,
        paymentAmount: amount
      });
    }

    // Create payment record
    const payment = new Payment({
      user: req.user._id,
      order: orderId,
      transactionId,
      amount,
      paymentMethod,
      status: 'completed', // In a real system, this would be set based on gateway response
      paymentDetails: paymentDetails || {},
    });

    const savedPayment = await payment.save();

    // Update order payment status
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: transactionId,
      status: 'completed',
      update_time: new Date().toISOString(),
      email_address: paymentDetails?.email || req.user.email,
    };

    await order.save();

    res.status(201).json({
      success: true,
      payment: savedPayment,
      message: 'Payment processed successfully'
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check if user is authorized to view this payment
    if (payment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this payment' });
    }

    res.json(payment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user payment history
// @route   GET /api/payments/history
// @access  Private
export const getPaymentHistory = async (req: Request, res: Response) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('order', 'orderItems totalPrice');

    res.json(payments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Issue refund
// @route   POST /api/payments/:id/refund
// @access  Private/Admin
export const issueRefund = async (req: Request, res: Response) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check if payment is already refunded
    if (payment.status === 'refunded') {
      return res.status(400).json({ message: 'Payment already refunded' });
    }

    // In a real system, you would integrate with a payment gateway 
    // to process the actual refund transaction

    // Update payment status
    payment.status = 'refunded';
    await payment.save();

    // Get associated order
    const order = await Order.findById(payment.order);
    
    if (order) {
      // You might want to update order status or add a refund record
      order.paymentResult.status = 'refunded';
      await order.save();
    }

    res.json({ 
      success: true, 
      payment, 
      message: 'Refund processed successfully' 
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all payments (admin)
// @route   GET /api/payments
// @access  Private/Admin
export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const payments = await Payment.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('order', 'orderItems totalPrice');

    res.json(payments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}; 