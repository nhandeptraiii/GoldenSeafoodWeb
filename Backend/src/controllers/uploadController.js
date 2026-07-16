const path = require('path');

/**
 * @route POST /api/upload
 * @desc Upload spec sheet / attachment file for inquiry
 * @access Public
 */
const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded or invalid file format.',
      });
    }

    // Relative path to be stored in DB and returned to frontend
    const relativePath = path.join('uploads', 'specs', req.file.filename).replace(/\\/g, '/');

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: relativePath,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadFile };
