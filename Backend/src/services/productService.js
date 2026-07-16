const { Op } = require('sequelize');
const { Product, Category, ProductImage, ProductSpecification } = require('../models');
const { getPagination } = require('../utils/pagination');

/**
 * Get all active categories with product counts
 */
const getCategories = async () => {
  const categories = await Category.findAll({
    where: { is_active: true },
    order: [['sort_order', 'ASC'], ['name_en', 'ASC']],
  });

  // Count active products for each category
  const categoriesWithCount = await Promise.all(
    categories.map(async (cat) => {
      const count = await Product.count({
        where: {
          category_id: cat.id,
          is_active: true,
        },
      });
      return {
        ...cat.toJSON(),
        productCount: count,
      };
    })
  );

  return categoriesWithCount;
};

/**
 * Get products with filters, search, sorting, and pagination
 */
const getProducts = async (query = {}) => {
  const whereClause = { is_active: true };
  const includeClause = [
    {
      model: Category,
      as: 'category',
      attributes: ['id', 'name_en', 'name_vi', 'slug'],
    },
  ];

  // Filter by category slug
  if (query.category) {
    includeClause[0].where = { slug: query.category };
  }

  // Filter by product_type (raw, cooked, value_added)
  if (query.type && ['raw', 'cooked', 'value_added'].includes(query.type)) {
    whereClause.product_type = query.type;
  }

  // Filter by featured
  if (query.featured === 'true' || query.featured === true) {
    whereClause.is_featured = true;
  }

  // Search by name (EN or VI)
  if (query.search && query.search.trim() !== '') {
    const searchTerm = `%${query.search.trim()}%`;
    whereClause[Op.or] = [
      { name_en: { [Op.like]: searchTerm } },
      { name_vi: { [Op.like]: searchTerm } },
      { short_desc_en: { [Op.like]: searchTerm } },
      { short_desc_vi: { [Op.like]: searchTerm } },
    ];
  }

  // Sorting
  let order = [['sort_order', 'ASC'], ['created_at', 'DESC']];
  if (query.sort === 'newest') {
    order = [['created_at', 'DESC']];
  } else if (query.sort === 'oldest') {
    order = [['created_at', 'ASC']];
  } else if (query.sort === 'name_asc') {
    order = [['name_en', 'ASC']];
  } else if (query.sort === 'name_desc') {
    order = [['name_en', 'DESC']];
  }

  // Count total matching records
  const totalCount = await Product.count({
    where: whereClause,
    include: includeClause,
  });

  // Calculate pagination
  const { limit, offset, pagination } = getPagination(query, totalCount);

  // Fetch paginated products
  const products = await Product.findAll({
    where: whereClause,
    include: includeClause,
    order,
    limit,
    offset,
    attributes: [
      'id',
      'category_id',
      'name_en',
      'name_vi',
      'slug',
      'short_desc_en',
      'short_desc_vi',
      'thumbnail_url',
      'product_type',
      'is_featured',
      'sort_order',
      'created_at',
    ],
  });

  return { products, pagination };
};

/**
 * Get featured products for homepage
 */
const getFeaturedProducts = async (limit = 6) => {
  const products = await Product.findAll({
    where: {
      is_active: true,
      is_featured: true,
    },
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name_en', 'name_vi', 'slug'],
      },
    ],
    order: [['sort_order', 'ASC'], ['created_at', 'DESC']],
    limit: parseInt(limit, 10) || 6,
  });

  return products;
};

/**
 * Get product detail by slug with full images and specifications
 */
const getProductBySlug = async (slug) => {
  const product = await Product.findOne({
    where: {
      slug,
      is_active: true,
    },
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name_en', 'name_vi', 'slug'],
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

  if (product && product.specifications) {
    // Sort specifications by sort_order
    product.specifications.sort((a, b) => a.sort_order - b.sort_order);
  }

  return product;
};

module.exports = {
  getCategories,
  getProducts,
  getFeaturedProducts,
  getProductBySlug,
};
