const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InquiryItem = sequelize.define('InquiryItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  inquiry_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'inquiries',
      key: 'id',
    },
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'products',
      key: 'id',
    },
    comment: 'NULL nếu sản phẩm bị xóa sau này',
  },
  product_name_snapshot: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Lưu tên sản phẩm tại thời điểm gửi inquiry',
  },
  specifications: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'VD: Size 40/60, IQF, Glazing 10%',
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'inquiry_items',
  timestamps: false,
});

module.exports = InquiryItem;
