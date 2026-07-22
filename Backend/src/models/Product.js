const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id',
    },
  },
  name_en: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  name_vi: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  short_desc_en: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  short_desc_vi: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  description_en: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  description_vi: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  thumbnail_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  product_type: {
    type: DataTypes.ENUM('raw', 'cooked', 'value_added'),
    allowNull: false,
    defaultValue: 'raw',
  },
  /**
   * Specifications lưu dạng JSON array trực tiếp trong bảng products.
   * Mỗi phần tử có dạng:
   * { "key_en": "Origin", "key_vi": "Xuất xứ", "value": "Vietnam", "sort": 1 }
   * Không cần bảng product_specifications riêng.
   */
  specifications: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Array of {key_en, key_vi, value, sort} — thay thế bảng product_specifications',
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'products',
});

module.exports = Product;
