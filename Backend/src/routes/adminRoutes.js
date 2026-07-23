const express = require('express');
const router = express.Router();

const { authenticateAdmin } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { uploadProductImages, uploadProductImage, uploadCategoryIcon } = require('../config/multer');

const adminAuthController = require('../controllers/adminAuthController');
const adminCategoryController = require('../controllers/adminCategoryController');
const adminProductController = require('../controllers/adminProductController');
const adminInquiryController = require('../controllers/adminInquiryController');

// ===== Public Admin Routes (Login) =====
router.post(
  '/login',
  adminAuthController.validateLogin,
  validate,
  adminAuthController.login
);

// ===== Protected Admin Routes (Require Bearer Token) =====
router.use(authenticateAdmin);

// Profile
router.get('/me', adminAuthController.getMe);

// Categories Management
router.get('/categories', adminCategoryController.getAllAdminCategories);
router.post(
  '/categories/upload-icon',
  uploadCategoryIcon.single('icon'),
  adminCategoryController.uploadCategoryIcon
);
router.post(
  '/categories',
  adminCategoryController.validateCategory,
  validate,
  adminCategoryController.createCategory
);
router.put(
  '/categories/:id',
  adminCategoryController.validateCategory,
  validate,
  adminCategoryController.updateCategory
);
router.delete('/categories/:id', adminCategoryController.deleteCategory);

// Products Management
router.get('/products', adminProductController.getAllAdminProducts);
router.get('/products/:id', adminProductController.getAdminProductById);
router.post(
  '/products',
  uploadProductImages,
  adminProductController.validateProduct,
  validate,
  adminProductController.createProduct
);
router.put(
  '/products/:id',
  uploadProductImages,
  adminProductController.validateProduct,
  validate,
  adminProductController.updateProduct
);
router.delete('/products/:id', adminProductController.deleteProduct);
router.post(
  '/products/upload-image',
  uploadProductImage.single('image'),
  adminProductController.uploadImage
);

// Inquiries Management
router.get('/inquiries', adminInquiryController.getAllInquiries);
router.get('/inquiries/:id', adminInquiryController.getInquiryById);
router.patch(
  '/inquiries/:id/status',
  adminInquiryController.validateStatusUpdate,
  validate,
  adminInquiryController.updateInquiryStatus
);
router.delete('/inquiries/:id', adminInquiryController.deleteInquiry);

module.exports = router;
