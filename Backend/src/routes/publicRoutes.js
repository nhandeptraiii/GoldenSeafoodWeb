const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController');
const productController = require('../controllers/productController');
const inquiryController = require('../controllers/inquiryController');
const uploadController = require('../controllers/uploadController');
const { validate } = require('../middlewares/validate');
const { inquiryLimiter } = require('../middlewares/rateLimiter');
const { uploadSpec } = require('../config/multer');

// ===== Categories =====
router.get('/categories', categoryController.getAllCategories);

// ===== Products =====
router.get('/products', productController.getProducts);
router.get('/products/featured', productController.getFeaturedProducts);
router.get('/products/:slug', productController.getProductBySlug);

// ===== Inquiries =====
router.post(
  '/inquiries/contact',
  inquiryLimiter,
  inquiryController.validateContactInquiry,
  validate,
  inquiryController.submitContactInquiry
);

router.post(
  '/inquiries/basket',
  inquiryLimiter,
  inquiryController.validateBasketInquiry,
  validate,
  inquiryController.submitBasketInquiry
);

// ===== File Upload =====
router.post(
  '/upload',
  inquiryLimiter,
  uploadSpec.single('file'),
  uploadController.uploadFile
);

module.exports = router;
