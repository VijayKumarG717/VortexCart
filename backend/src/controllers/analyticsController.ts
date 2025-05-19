import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';

// @desc    Get dashboard stats for admin
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Get total sales
    const totalSales = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    // Get total orders
    const totalOrders = await Order.countDocuments({ isPaid: true });
    
    // Get total users
    const totalUsers = await User.countDocuments();
    
    // Get total products
    const totalProducts = await Product.countDocuments();
    
    // Get out of stock products
    const outOfStock = await Product.countDocuments({ countInStock: 0 });

    // Get top selling products
    const topSellingProducts = await Order.aggregate([
      { $match: { isPaid: true } },
      { $unwind: '$orderItems' },
      { 
        $group: { 
          _id: '$orderItems.product', 
          totalSold: { $sum: '$orderItems.qty' },
          revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.qty'] } }
        } 
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          _id: 0,
          name: '$product.name',
          totalSold: 1,
          revenue: 1,
          image: '$product.image'
        }
      }
    ]);

    // Get sales by date (last 7 days)
    const date = new Date();
    date.setDate(date.getDate() - 7);
    
    const salesByDate = await Order.aggregate([
      { 
        $match: { 
          isPaid: true,
          paidAt: { $gte: date }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$paidAt' } },
          totalSales: { $sum: '$totalPrice' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      totalSales: totalSales.length > 0 ? totalSales[0].total : 0,
      totalOrders,
      totalUsers,
      totalProducts,
      outOfStock,
      topSellingProducts,
      salesByDate
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get sales report for specified period
// @route   GET /api/analytics/sales
// @access  Private/Admin
export const getSalesReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    let start = startDate ? new Date(startDate as string) : new Date(new Date().setDate(new Date().getDate() - 30));
    let end = endDate ? new Date(endDate as string) : new Date();
    
    // Ensure end date is set to end of day
    end.setHours(23, 59, 59, 999);
    
    const salesReport = await Order.aggregate([
      { 
        $match: { 
          isPaid: true,
          paidAt: { $gte: start, $lte: end }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$paidAt' } },
          totalSales: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Get product category breakdown
    const categoryBreakdown = await Order.aggregate([
      { 
        $match: { 
          isPaid: true,
          paidAt: { $gte: start, $lte: end }
        } 
      },
      { $unwind: '$orderItems' },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $lookup: {
          from: 'categories',
          localField: 'product.category',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $group: {
          _id: '$category.name',
          count: { $sum: 1 },
          revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.qty'] } }
        }
      },
      { $sort: { revenue: -1 } }
    ]);
    
    res.json({
      period: { start, end },
      salesData: salesReport,
      totalRevenue: salesReport.reduce((acc, day) => acc + day.totalSales, 0),
      totalOrders: salesReport.reduce((acc, day) => acc + day.orders, 0),
      avgOrderValue: salesReport.length > 0 
        ? salesReport.reduce((acc, day) => acc + day.totalSales, 0) / salesReport.reduce((acc, day) => acc + day.orders, 0)
        : 0,
      categoryBreakdown
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get customer insights
// @route   GET /api/analytics/customers
// @access  Private/Admin
export const getCustomerInsights = async (req: Request, res: Response) => {
  try {
    // New vs returning customers
    const customerTypes = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: '$user',
          orderCount: { $sum: 1 },
          totalSpent: { $sum: '$totalPrice' }
        }
      },
      {
        $project: {
          _id: 1,
          orderCount: 1,
          totalSpent: 1,
          customerType: {
            $cond: { if: { $eq: ['$orderCount', 1] }, then: 'new', else: 'returning' }
          }
        }
      },
      {
        $group: {
          _id: '$customerType',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalSpent' }
        }
      }
    ]);
    
    // Top customers
    const topCustomers = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: '$user',
          totalSpent: { $sum: '$totalPrice' },
          orderCount: { $sum: 1 },
          lastOrder: { $max: '$paidAt' }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          name: '$user.name',
          email: '$user.email',
          totalSpent: 1,
          orderCount: 1,
          lastOrder: 1
        }
      }
    ]);
    
    res.json({
      customerTypes: customerTypes.reduce((obj, item) => ({ 
        ...obj, 
        [item._id]: { count: item.count, revenue: item.totalRevenue } 
      }), {}),
      topCustomers
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}; 