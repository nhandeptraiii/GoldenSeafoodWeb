const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Đảm bảo thư mục upload tồn tại
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Storage config cho spec sheets / attachments
const specStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads', 'specs');
    ensureDir(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

// Storage config cho product images
const productImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads', 'products');
    ensureDir(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

// Filter: chỉ cho phép các file type nhất định
const specFileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.png', '.jpg', '.jpeg', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type '${ext}' is not allowed. Allowed: ${allowedTypes.join(', ')}`), false);
  }
};

const imageFileFilter = (req, file, cb) => {
  const allowedTypes = ['.png', '.jpg', '.jpeg', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type '${ext}' is not allowed. Allowed: ${allowedTypes.join(', ')}`), false);
  }
};

const maxFileSize = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024; // 10MB

// Upload middleware cho spec sheets
const uploadSpec = multer({
  storage: specStorage,
  fileFilter: specFileFilter,
  limits: { fileSize: maxFileSize },
});

// Upload middleware cho product images
const uploadProductImage = multer({
  storage: productImageStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB cho ảnh
});

// Storage config cho category icons
const categoryIconStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads', 'categories');
    ensureDir(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const iconFileFilter = (req, file, cb) => {
  const allowedTypes = ['.svg', '.png', '.jpg', '.jpeg', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type '${ext}' is not allowed. Allowed: ${allowedTypes.join(', ')}`), false);
  }
};

// Upload middleware cho category icons
const uploadCategoryIcon = multer({
  storage: categoryIconStorage,
  fileFilter: iconFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB cho icon
});

module.exports = { uploadSpec, uploadProductImage, uploadCategoryIcon };
