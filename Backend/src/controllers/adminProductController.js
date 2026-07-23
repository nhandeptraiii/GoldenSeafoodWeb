const fs = require('fs');
const path = require('path');
const { Product, Category, ProductImage, ProductSpecification, sequelize } = require('../models');
const { generateUniqueSlug } = require('../utils/slugify');
const { getPagination } = require('../utils/pagination');
const { body } = require('express-validator');

/**
 * Build full URL cho ảnh sản phẩm từ filename
 */
const buildImageUrl = (req, filename) => {
  return `${req.protocol}://${req.get('host')}/uploads/products/${filename}`;
};

/**
 * Xóa file ảnh vật lý khỏi disk (bất đồng bộ, bỏ qua lỗi)
 */
const deleteFileFromDisk = (imageUrl) => {
  try {
    const filename = imageUrl.split('/uploads/products/').pop();
    if (!filename) return;
    const filePath = path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads', 'products', filename);
    fs.unlink(filePath, (err) => {
      if (err && err.code !== 'ENOENT') {
        console.warn(`[deleteFileFromDisk] Could not delete ${filePath}:`, err.message);
      }
    });
  } catch (err) {
    console.warn('[deleteFileFromDisk] Error parsing image URL:', err.message);
  }
};

const validateProduct = [
  body('category_id').notEmpty().isInt().withMessage('Category ID is required and must be an integer'),
  body('name_en').trim().notEmpty().withMessage('English product name is required'),
  body('name_vi').trim().notEmpty().withMessage('Vietnamese product name is required'),
  body('product_type').isIn(['raw', 'cooked', 'value_added']).withMessage('Invalid product type'),
];

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
        {
          model: ProductImage,
          as: 'images',
          where: { is_primary: true },
          attributes: ['image_url', 'alt_text'],
          required: false, // LEFT JOIN — product không ảnh vẫn hiển thị
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
 * @desc Get single product details by id with images and specifications
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
        {
          model: ProductSpecification,
          as: 'specifications',
        },
      ],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.specifications) {
      product.specifications.sort((a, b) => a.sort_order - b.sort_order);
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
 * @desc Create new product along with images (thumbnail + gallery) and specifications
 * Accepts multipart/form-data:
 *   - thumbnail (file, optional): ảnh chính → ProductImage { is_primary: true }
 *   - gallery   (files, optional): ảnh phụ  → ProductImage { is_primary: false }
 *   - specifications (JSON string, optional): mảng thông số kỹ thuật
 */
const createProduct = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      category_id,
      name_en,
      name_vi,
      short_desc_en,
      short_desc_vi,
      description_en,
      description_vi,
      product_type,
      is_featured,
      is_active,
      sort_order,
      specifications,
    } = req.body;

    const category = await Category.findByPk(category_id, { transaction });
    if (!category) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Invalid category_id. Category does not exist.',
      });
    }

    const slug = await generateUniqueSlug(Product, name_en);

    const product = await Product.create(
      {
        category_id,
        name_en,
        name_vi,
        slug,
        short_desc_en: short_desc_en || null,
        short_desc_vi: short_desc_vi || null,
        description_en: description_en || null,
        description_vi: description_vi || null,
        product_type: product_type || 'raw',
        is_featured: is_featured !== undefined ? is_featured : false,
        is_active: is_active !== undefined ? is_active : true,
        sort_order: sort_order || 0,
      },
      { transaction }
    );

    // --- Xử lý ảnh upload ---
    const imagesData = [];

    const thumbnailFiles = req.files && req.files['thumbnail'];
    if (thumbnailFiles && thumbnailFiles.length > 0) {
      imagesData.push({
        product_id: product.id,
        image_url: buildImageUrl(req, thumbnailFiles[0].filename),
        alt_text: name_en || null,
        is_primary: true,
        sort_order: 1,
      });
    }

    const galleryFiles = req.files && req.files['gallery'];
    if (galleryFiles && galleryFiles.length > 0) {
      galleryFiles.forEach((file, idx) => {
        imagesData.push({
          product_id: product.id,
          image_url: buildImageUrl(req, file.filename),
          alt_text: `${name_en} - ${idx + 1}`,
          is_primary: false,
          sort_order: idx + 2,
        });
      });
    }

    if (imagesData.length > 0) {
      await ProductImage.bulkCreate(imagesData, { transaction });
    }

    // --- Xử lý specifications (hỗ trợ cả JSON string lẫn array) ---
    let parsedSpecs = specifications;
    if (typeof specifications === 'string') {
      try { parsedSpecs = JSON.parse(specifications); } catch (_) { parsedSpecs = []; }
    }
    if (parsedSpecs && Array.isArray(parsedSpecs) && parsedSpecs.length > 0) {
      const specsData = parsedSpecs.map((spec, idx) => ({
        product_id: product.id,
        spec_key_en: spec.spec_key_en,
        spec_key_vi: spec.spec_key_vi,
        spec_value: spec.spec_value,
        sort_order: spec.sort_order || idx + 1,
      }));
      await ProductSpecification.bulkCreate(specsData, { transaction });
    }

    await transaction.commit();

    const createdProduct = await Product.findByPk(product.id, {
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name_en', 'name_vi', 'slug'] },
        { model: ProductImage, as: 'images' },
        { model: ProductSpecification, as: 'specifications' },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: createdProduct,
    });
  } catch (error) {
    await transaction.rollback();
    next(error);

  }
};

/**
 * @route PUT /api/admin/products/:id
 * @desc Update product details, sync specifications, and optionally replace images
 * Chiến lược ảnh "replace if uploaded":
 *   - Nếu có file ảnh mới → xóa toàn bộ ảnh cũ (disk + DB) → tạo lại
 *   - Nếu không có file → giữ nguyên ảnh cũ
 */
const updateProduct = async (req, res, next) => {
  const transaction = await sequelize.transaction();
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
      product_type,
      is_featured,
      is_active,
      sort_order,
      specifications,
    } = req.body;

    const product = await Product.findByPk(id, { transaction });
    if (!product) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    let slug = product.slug;
    if (name_en && name_en !== product.name_en) {
      slug = await generateUniqueSlug(Product, name_en, id);
    }

    await product.update(
      {
        category_id: category_id || product.category_id,
        name_en: name_en || product.name_en,
        name_vi: name_vi || product.name_vi,
        slug,
        short_desc_en: short_desc_en !== undefined ? short_desc_en : product.short_desc_en,
        short_desc_vi: short_desc_vi !== undefined ? short_desc_vi : product.short_desc_vi,
        description_en: description_en !== undefined ? description_en : product.description_en,
        description_vi: description_vi !== undefined ? description_vi : product.description_vi,
        product_type: product_type || product.product_type,
        is_featured: is_featured !== undefined ? is_featured : product.is_featured,
        is_active: is_active !== undefined ? is_active : product.is_active,
        sort_order: sort_order !== undefined ? sort_order : product.sort_order,
      },
      { transaction }
    );

    // --- Xử lý ảnh: replace if uploaded ---
    const thumbnailFiles = req.files && req.files['thumbnail'];
    const galleryFiles = req.files && req.files['gallery'];
    const hasNewImages = (thumbnailFiles && thumbnailFiles.length > 0) || (galleryFiles && galleryFiles.length > 0);

    if (hasNewImages) {
      // Lấy ảnh cũ để xóa file vật lý
      const oldImages = await ProductImage.findAll({
        where: { product_id: id },
        attributes: ['image_url'],
        transaction,
      });

      // Xóa records cũ trong DB
      await ProductImage.destroy({ where: { product_id: id }, transaction });

      // Xóa file vật lý cũ (bất đồng bộ, không ảnh hưởng transaction)
      oldImages.forEach((img) => deleteFileFromDisk(img.image_url));

      // Tạo records ảnh mới
      const currentName = name_en || product.name_en;
      const newImagesData = [];

      if (thumbnailFiles && thumbnailFiles.length > 0) {
        newImagesData.push({
          product_id: id,
          image_url: buildImageUrl(req, thumbnailFiles[0].filename),
          alt_text: currentName || null,
          is_primary: true,
          sort_order: 1,
        });
      }

      if (galleryFiles && galleryFiles.length > 0) {
        galleryFiles.forEach((file, idx) => {
          newImagesData.push({
            product_id: id,
            image_url: buildImageUrl(req, file.filename),
            alt_text: `${currentName} - ${idx + 1}`,
            is_primary: false,
            sort_order: idx + 2,
          });
        });
      }

      if (newImagesData.length > 0) {
        await ProductImage.bulkCreate(newImagesData, { transaction });
      }
    }

    // --- Sync specifications if provided ---
    let parsedSpecs = specifications;
    if (typeof specifications === 'string') {
      try { parsedSpecs = JSON.parse(specifications); } catch (_) { parsedSpecs = undefined; }
    }
    if (parsedSpecs && Array.isArray(parsedSpecs)) {
      await ProductSpecification.destroy({ where: { product_id: id }, transaction });
      if (parsedSpecs.length > 0) {
        const specsData = parsedSpecs.map((spec, idx) => ({
          product_id: id,
          spec_key_en: spec.spec_key_en,
          spec_key_vi: spec.spec_key_vi,
          spec_value: spec.spec_value,
          sort_order: spec.sort_order || idx + 1,
        }));
        await ProductSpecification.bulkCreate(specsData, { transaction });
      }
    }

    await transaction.commit();

    const updatedProduct = await Product.findByPk(id, {
      include: [
        { model: Category, as: 'category' },
        { model: ProductImage, as: 'images', order: [['is_primary', 'DESC'], ['sort_order', 'ASC']] },
        { model: ProductSpecification, as: 'specifications' },
      ],
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

/**
 * @route DELETE /api/admin/products/:id
 * @desc Delete product and associated images/specifications (cascade) + delete image files from disk
 */
const deleteProduct = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, { transaction });

    if (!product) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Lấy ảnh để xóa file vật lý trước khi cascade delete
    const images = await ProductImage.findAll({
      where: { product_id: id },
      attributes: ['image_url'],
      transaction,
    });

    await product.destroy({ transaction });
    await transaction.commit();

    // Xóa file vật lý sau khi commit (bất đồng bộ)
    images.forEach((img) => deleteFileFromDisk(img.image_url));

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

/**
 * @route POST /api/admin/products/upload-image
 * @desc Upload single image (legacy endpoint — kept for compatibility)
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
