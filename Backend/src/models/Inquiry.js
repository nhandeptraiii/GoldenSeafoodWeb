const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Inquiry = sequelize.define('Inquiry', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  inquiry_code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    comment: 'Format: GS-YYYYMMDD-XXX',
  },
  full_name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  job_title: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  company_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  whatsapp_number: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  destination_port: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  special_requirements: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  attachment_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('new', 'processing', 'quoted', 'closed'),
    defaultValue: 'new',
  },
  source: {
    type: DataTypes.ENUM('contact_form', 'inquiry_basket'),
    allowNull: false,
  },
  interested_species: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Mảng các mặt hàng quan tâm (checkbox) cho contact form',
  },
  auto_reply_sent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'inquiries',
});

module.exports = Inquiry;
