const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductSpecification = sequelize.define('ProductSpecification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id',
    },
  },
  spec_key_en: {
    type: DataTypes.STRING(150),
    allowNull: false,
    comment: 'VD: Scientific Name, Origin, Size...',
  },
  spec_key_vi: {
    type: DataTypes.STRING(150),
    allowNull: false,
    comment: 'VD: Tên khoa học, Xuất xứ, Kích cỡ...',
  },
  spec_value: {
    type: DataTypes.STRING(500),
    allowNull: false,
    comment: 'VD: Litopenaeus vannamei, Vietnam, 20/40...',
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'product_specifications',
  timestamps: false,
});

module.exports = ProductSpecification;
