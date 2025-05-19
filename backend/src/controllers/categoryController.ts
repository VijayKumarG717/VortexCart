import { Request, Response } from 'express';
import Category, { ICategory } from '../models/Category';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, image, featured } = req.body;

    // Check if category with same name already exists
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({
      name,
      description,
      image: image || (req.file ? `/uploads/${req.file.filename}` : ''),
      featured: featured || false,
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, image, featured } = req.body;

    const category = await Category.findById(req.params.id);

    if (category) {
      // If name is updated, check if new name conflicts with existing category
      if (name && name !== category.name) {
        const categoryWithSameName = await Category.findOne({ name });
        if (categoryWithSameName) {
          return res.status(400).json({ message: 'Category name already in use' });
        }
      }

      category.name = name || category.name;
      category.description = description !== undefined ? description : category.description;
      
      if (req.file) {
        category.image = `/uploads/${req.file.filename}`;
      } else if (image) {
        category.image = image;
      }
      
      category.featured = featured !== undefined ? featured : category.featured;

      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      await category.deleteOne();
      res.json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured categories
// @route   GET /api/categories/featured
// @access  Public
export const getFeaturedCategories = async (req: Request, res: Response) => {
  try {
    const featuredCategories = await Category.find({ featured: true });
    res.json(featuredCategories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}; 