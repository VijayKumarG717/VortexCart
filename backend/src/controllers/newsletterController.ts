import { Request, Response } from 'express';
import Newsletter from '../models/Newsletter';

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
export const subscribeToNewsletter = async (req: Request, res: Response) => {
  try {
    const { email, name, preferences } = req.body;

    // Check if email already exists
    let subscriber = await Newsletter.findOne({ email });

    if (subscriber) {
      // If already subscribed, just update preferences
      if (subscriber.isSubscribed) {
        if (preferences) {
          subscriber.preferences = {
            ...subscriber.preferences,
            ...preferences,
          };
        }
        
        if (name && !subscriber.name) {
          subscriber.name = name;
        }
        
        await subscriber.save();
        
        return res.json({
          message: 'Newsletter preferences updated',
          subscriber,
        });
      } else {
        // If previously unsubscribed, resubscribe
        subscriber.isSubscribed = true;
        subscriber.subscriptionDate = new Date();
        subscriber.unsubscriptionDate = undefined;
        
        if (preferences) {
          subscriber.preferences = {
            ...subscriber.preferences,
            ...preferences,
          };
        }
        
        await subscriber.save();
        
        return res.json({
          message: 'Successfully resubscribed to newsletter',
          subscriber,
        });
      }
    }

    // Create new subscriber
    subscriber = await Newsletter.create({
      email,
      name,
      preferences: preferences || {
        promotions: true,
        newProducts: true,
        blogPosts: false,
        events: false,
      },
    });

    res.status(201).json({
      message: 'Successfully subscribed to newsletter',
      subscriber,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unsubscribe from newsletter
// @route   PUT /api/newsletter/unsubscribe
// @access  Public
export const unsubscribeFromNewsletter = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const subscriber = await Newsletter.findOne({ email });

    if (!subscriber) {
      return res.status(404).json({ message: 'Email not found in our records' });
    }

    subscriber.isSubscribed = false;
    subscriber.unsubscriptionDate = new Date();
    
    await subscriber.save();

    res.json({
      message: 'Successfully unsubscribed from newsletter',
      subscriber,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update newsletter preferences
// @route   PUT /api/newsletter/preferences
// @access  Private
export const updateNewsletterPreferences = async (req: Request, res: Response) => {
  try {
    const { email, preferences } = req.body;

    const subscriber = await Newsletter.findOne({ email });

    if (!subscriber) {
      return res.status(404).json({ message: 'Email not found in our records' });
    }

    // Ensure the user is either the owner of the email or an admin
    if (req.user.email !== email && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update these preferences' });
    }

    subscriber.preferences = {
      ...subscriber.preferences,
      ...preferences,
    };

    await subscriber.save();

    res.json({
      message: 'Newsletter preferences updated successfully',
      subscriber,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all newsletter subscribers
// @route   GET /api/newsletter/subscribers
// @access  Private/Admin
export const getNewsletterSubscribers = async (req: Request, res: Response) => {
  try {
    const { active } = req.query;
    
    let query = {};
    
    // Filter by subscription status if provided
    if (active !== undefined) {
      query = { isSubscribed: active === 'true' };
    }
    
    const subscribers = await Newsletter.find(query).sort({ createdAt: -1 });

    res.json(subscribers);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete newsletter subscriber
// @route   DELETE /api/newsletter/:id
// @access  Private/Admin
export const deleteNewsletterSubscriber = async (req: Request, res: Response) => {
  try {
    const subscriber = await Newsletter.findById(req.params.id);

    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }

    await subscriber.deleteOne();

    res.json({ message: 'Subscriber removed successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}; 