const sequelize = require('../config/database');
const Category = require('./Category');
const Product = require('./Product');
const ProductImage = require('./ProductImage');
const ProductSpecification = require('./ProductSpecification');
const Inquiry = require('./Inquiry');
const InquiryItem = require('./InquiryItem');
const User = require('./User');

// ===== Associations =====

// Category <-> Product (1:N)
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// Product <-> ProductImage (1:N)
Product.hasMany(ProductImage, { foreignKey: 'product_id', as: 'images', onDelete: 'CASCADE' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id' });

// Product <-> ProductSpecification (1:N)
Product.hasMany(ProductSpecification, { foreignKey: 'product_id', as: 'specifications', onDelete: 'CASCADE' });
ProductSpecification.belongsTo(Product, { foreignKey: 'product_id' });

// Inquiry <-> InquiryItem (1:N)
Inquiry.hasMany(InquiryItem, { foreignKey: 'inquiry_id', as: 'items', onDelete: 'CASCADE' });
InquiryItem.belongsTo(Inquiry, { foreignKey: 'inquiry_id' });

// InquiryItem <-> Product (N:1, optional)
InquiryItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

module.exports = {
  sequelize,
  Category,
  Product,
  ProductImage,
  ProductSpecification,
  Inquiry,
  InquiryItem,
  User,
};
