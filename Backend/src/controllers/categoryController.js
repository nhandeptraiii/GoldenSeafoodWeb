const productService = require('../services/productService');

/**
 * @route GET /api/categories
 * @desc Get all active categories with product counts
 * @access Public
 */
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await productService.getCategories();
    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllCategories };
