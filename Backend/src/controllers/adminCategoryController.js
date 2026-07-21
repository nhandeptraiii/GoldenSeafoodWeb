const { Category, Product } = require('../models');
const { generateUniqueSlug } = require('../utils/slugify');
const { body } = require('express-validator');
const path = require('path');

const validateCategory = [
  body('name_en').trim().notEmpty().withMessage('English name is required'),
  body('name_vi').trim().notEmpty().withMessage('Vietnamese name is required'),
  body('sort_order').optional().isInt().withMessage('Sort order must be an integer'),
];

/**
 * @route GET /api/admin/categories
 * @desc Get all categories for admin (including inactive ones)
 */
const getAllAdminCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      order: [['sort_order', 'ASC'], ['name_en', 'ASC']],
    });

    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.count({
          where: { category_id: cat.id },
        });
        return {
          ...cat.toJSON(),
          productCount: count,
        };
      })
    );

    res.json({
      success: true,
      data: categoriesWithCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route POST /api/admin/categories
 * @desc Create new category
 */
const createCategory = async (req, res, next) => {
  try {
    const { name_en, name_vi, icon_url, sort_order, is_active } = req.body;
    const slug = await generateUniqueSlug(Category, name_en);

    const category = await Category.create({
      name_en,
      name_vi,
      slug,
      icon_url: icon_url || null,
      sort_order: sort_order || 0,
      is_active: is_active !== undefined ? is_active : true,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route PUT /api/admin/categories/:id
 * @desc Update category by id
 */
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name_en, name_vi, icon_url, sort_order, is_active } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    let slug = category.slug;
    if (name_en && name_en !== category.name_en) {
      slug = await generateUniqueSlug(Category, name_en, id);
    }

    await category.update({
      name_en: name_en || category.name_en,
      name_vi: name_vi || category.name_vi,
      slug,
      icon_url: icon_url !== undefined ? icon_url : category.icon_url,
      sort_order: sort_order !== undefined ? sort_order : category.sort_order,
      is_active: is_active !== undefined ? is_active : category.is_active,
    });

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route DELETE /api/admin/categories/:id
 * @desc Delete category (only if no products attached)
 */
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const productCount = await Product.count({ where: { category_id: id } });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. There are ${productCount} products assigned to this category.`,
      });
    }

    await category.destroy();

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route POST /api/admin/categories/upload-icon
 * @desc Upload icon for a category (SVG, PNG, WebP)
 */
const uploadCategoryIcon = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No icon file uploaded',
      });
    }

    const relativePath = path.join('uploads', 'categories', req.file.filename).replace(/\\/g, '/');
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fullUrl = `${baseUrl}/${relativePath}`;

    res.status(201).json({
      success: true,
      message: 'Icon uploaded successfully',
      data: {
        filename: req.file.filename,
        url: fullUrl,
        relative_url: relativePath,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateCategory,
  getAllAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryIcon,
};
