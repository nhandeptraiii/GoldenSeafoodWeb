const { validationResult } = require('express-validator');

/**
 * Middleware checking express-validator results
 * If invalid, returns 400 with structured errors
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: formattedErrors,
    });
  }
  next();
};

module.exports = { validate };
