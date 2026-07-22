const { Product, Category, ProductImage, sequelize } = require('../models');
const { generateUniqueSlug } = require('../utils/slugify');
const { getPagination } = require('../utils/pagination');
const { body } = require('express-validator');
const path = require('path');

const validateProduct = [
  body('category_id').notEmpty().isInt().withMessage('Category ID is required and must be an integer'),
  body('name_en').trim().notEmpty().withMessage('English product name is required'),
  body('name_vi').trim().notEmpty().withMessage('Vietnamese product name is required'),
  body('product_type').isIn(['raw', 'cooked', 'value_added']).withMessage('Invalid product type'),
];

/**
 * Chuẩn hóa mảng specifications từ request body.
 * Mỗi phần tử phải có key_en, key_vi, value. sort tự động nếu không truyền.
 * @param {any} raw - Giá trị specifications từ req.body (string JSON hoặc array)
 * @returns {Array}
 */
const parseSpecifications = (raw) => {
  if (!raw) return [];
  let arr = raw;
  if (typeof raw === 'string') {
    try { arr = JSON.parse(raw); } catch { return []; }
  }
  if (!Array.isArray(arr)) return [];
  return arr
    .filter((s) => s && s.key_en && s.key_vi && s.value !== undefined)
    .map((s, idx) => ({
      key_en: s.key_en,
      key_vi: s.key_vi,
      value: s.value,
      sort: s.sort ?? idx + 1,
    }));
};

/**
 * @route GET /api/admin/products
 * @desc Get all products for admin with pagination, search, and category filter
 */
const getAllAdminProducts = async (req, res, next) => {
  try {
    const whereClause = {};
    if (req.query.category_id) {
      whereClause.category_id = req.query.category_id;
    }
    if (req.query.type) {
      whereClause.product_type = req.query.type;
    }
    if (req.query.search && req.query.search.trim() !== '') {
      const searchTerm = `%${req.query.search.trim()}%`;
      whereClause[sequelize.Sequelize.Op.or] = [
        { name_en: { [sequelize.Sequelize.Op.like]: searchTerm } },
        { name_vi: { [sequelize.Sequelize.Op.like]: searchTerm } },
      ];
    }

    const totalCount = await Product.count({ where: whereClause });
    const { limit, offset, pagination } = getPagination(req.query, totalCount);

    const products = await Product.findAll({
      where: whereClause,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name_en', 'name_vi', 'slug'],
        },
      ],
      order: [['sort_order', 'ASC'], ['created_at', 'DESC']],
      limit,
      offset,
    });

    res.json({
      success: true,
      data: {
        products,
        pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /api/admin/products/:id
 * @desc Get single product details by id with images and specifications (JSON column)
 */
const getAdminProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'category',
        },
        {
          model: ProductImage,
          as: 'images',
          order: [['is_primary', 'DESC'], ['sort_order', 'ASC']],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
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

/**
 * @route POST /api/admin/products
 * @desc Create new product. specifications là JSON array trực tiếp trong bảng products.
 */
const createProduct = async (req, res, next) => {
  try {
    const {
      category_id,
      name_en,
      name_vi,
      short_desc_en,
      short_desc_vi,
      description_en,
      description_vi,
      thumbnail_url,
      product_type,
      is_featured,
      is_active,
      sort_order,
      specifications,
    } = req.body;

    const category = await Category.findByPk(category_id);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category_id. Category does not exist.',
      });
    }

    const slug = await generateUniqueSlug(Product, name_en);

    const product = await Product.create({
      category_id,
      name_en,
      name_vi,
      slug,
      short_desc_en: short_desc_en || null,
      short_desc_vi: short_desc_vi || null,
      description_en: description_en || null,
      description_vi: description_vi || null,
      thumbnail_url: thumbnail_url || null,
      product_type: product_type || 'raw',
      specifications: parseSpecifications(specifications),
      is_featured: is_featured !== undefined ? is_featured : false,
      is_active: is_active !== undefined ? is_active : true,
      sort_order: sort_order || 0,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route PUT /api/admin/products/:id
 * @desc Update product. specifications ghi đè toàn bộ JSON column.
 */
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      category_id,
      name_en,
      name_vi,
      short_desc_en,
      short_desc_vi,
      description_en,
      description_vi,
      thumbnail_url,
      product_type,
      is_featured,
      is_active,
      sort_order,
      specifications,
    } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    let slug = product.slug;
    if (name_en && name_en !== product.name_en) {
      slug = await generateUniqueSlug(Product, name_en, id);
    }

    await product.update({
      category_id: category_id || product.category_id,
      name_en: name_en || product.name_en,
      name_vi: name_vi || product.name_vi,
      slug,
      short_desc_en: short_desc_en !== undefined ? short_desc_en : product.short_desc_en,
      short_desc_vi: short_desc_vi !== undefined ? short_desc_vi : product.short_desc_vi,
      description_en: description_en !== undefined ? description_en : product.description_en,
      description_vi: description_vi !== undefined ? description_vi : product.description_vi,
      thumbnail_url: thumbnail_url !== undefined ? thumbnail_url : product.thumbnail_url,
      product_type: product_type || product.product_type,
      // Chỉ cập nhật specifications nếu client truyền vào (kể cả mảng rỗng [])
      specifications: specifications !== undefined
        ? parseSpecifications(specifications)
        : product.specifications,
      is_featured: is_featured !== undefined ? is_featured : product.is_featured,
      is_active: is_active !== undefined ? is_active : product.is_active,
      sort_order: sort_order !== undefined ? sort_order : product.sort_order,
    });

    const updatedProduct = await Product.findByPk(id, {
      include: [
        { model: Category, as: 'category' },
        { model: ProductImage, as: 'images' },
      ],
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route DELETE /api/admin/products/:id
 * @desc Delete product and associated images
 */
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await product.destroy();

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route POST /api/admin/products/upload-image
 * @desc Upload image for product thumbnail or gallery
 */
const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded',
      });
    }

    const relativePath = path.join('uploads', 'products', req.file.filename).replace(/\\/g, '/');
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fullUrl = `${baseUrl}/${relativePath}`;

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
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
  validateProduct,
  getAllAdminProducts,
  getAdminProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
