const { body } = require('express-validator');
const inquiryService = require('../services/inquiryService');

/**
 * Validation rules for quick contact form submission
 */
const validateContactInquiry = [
  body('full_name')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ max: 150 })
    .withMessage('Full name cannot exceed 150 characters'),
  body('company_name')
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ max: 255 })
    .withMessage('Company name cannot exceed 255 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid business email address')
    .normalizeEmail(),
  body('country')
    .trim()
    .notEmpty()
    .withMessage('Country is required')
    .isLength({ max: 100 })
    .withMessage('Country cannot exceed 100 characters'),
  body('interested_species')
    .optional()
    .isArray()
    .withMessage('Interested species must be an array of strings'),
];

/**
 * Validation rules for inquiry basket submission
 */
const validateBasketInquiry = [
  body('full_name')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ max: 150 })
    .withMessage('Full name cannot exceed 150 characters'),
  body('company_name')
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ max: 255 })
    .withMessage('Company name cannot exceed 255 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid business email address')
    .normalizeEmail(),
  body('country')
    .trim()
    .notEmpty()
    .withMessage('Country is required')
    .isLength({ max: 100 })
    .withMessage('Country cannot exceed 100 characters'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('Inquiry basket must contain at least one item'),
  body('items.*.product_name')
    .optional()
    .isString()
    .withMessage('Product name in item must be a string'),
  body('items.*.quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
];

/**
 * @route POST /api/inquiries/contact
 * @desc Submit quick contact form inquiry
 * @access Public
 */
const submitContactInquiry = async (req, res, next) => {
  try {
    const inquiry = await inquiryService.createContactInquiry(req.body);
    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully. We will get back to you within 24 working hours.',
      data: {
        id: inquiry.id,
        inquiry_code: inquiry.inquiry_code,
        status: inquiry.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route POST /api/inquiries/basket
 * @desc Submit multi-item inquiry basket
 * @access Public
 */
const submitBasketInquiry = async (req, res, next) => {
  try {
    const inquiry = await inquiryService.createBasketInquiry(req.body);
    res.status(201).json({
      success: true,
      message: 'Inquiry basket submitted successfully. We will get back to you within 24 working hours.',
      data: {
        id: inquiry.id,
        inquiry_code: inquiry.inquiry_code,
        status: inquiry.status,
        itemCount: inquiry.items ? inquiry.items.length : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateContactInquiry,
  validateBasketInquiry,
  submitContactInquiry,
  submitBasketInquiry,
};
