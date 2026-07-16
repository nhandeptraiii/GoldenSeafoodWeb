const productService = require('../services/productService');

/**
 * @route GET /api/products
 * @desc Get paginated products with optional filtering and search
 * @access Public
 */
const getProducts = async (req, res, next) => {
  try {
    const result = await productService.getProducts(req.query);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /api/products/featured
 * @desc Get featured products for homepage
 * @access Public
 */
const getFeaturedProducts = async (req, res, next) => {
  try {
    const limit = req.query.limit || 6;
    const products = await productService.getFeaturedProducts(limit);
    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /api/products/:slug
 * @desc Get single product details by slug with specifications and images
 * @access Public
 */
const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await productService.getProductBySlug(slug);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found with slug: ${slug}`,
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getFeaturedProducts,
  getProductBySlug,
};
