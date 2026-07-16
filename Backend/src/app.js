require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { sequelize } = require('./models');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Middlewares =====

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Cho phép load ảnh từ domain khác
}));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Serve admin panel static files
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));

// ===== Routes =====

// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Golden Seafood API v1.0',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Golden Seafood API v1.0',
    endpoints: {
      categories: 'GET /api/categories',
      products: 'GET /api/products',
      productDetail: 'GET /api/products/:slug',
      submitContactInquiry: 'POST /api/inquiries/contact',
      submitBasketInquiry: 'POST /api/inquiries/basket',
      uploadFile: 'POST /api/upload',
      adminLogin: 'POST /api/admin/login',
    },
  });
});

// API Routes
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

// ===== Error Handling =====
app.use(notFoundHandler);
app.use(errorHandler);

// ===== Start Server =====
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Sync models (chỉ ở development, production nên dùng migrations)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database synced');
    }

    app.listen(PORT, () => {
      console.log('═══════════════════════════════════════');
      console.log(`🚀 Golden Seafood API Server`);
      console.log(`   Environment: ${process.env.NODE_ENV}`);
      console.log(`   Port:        ${PORT}`);
      console.log(`   API:         http://localhost:${PORT}/api`);
      console.log(`   Admin:       http://localhost:${PORT}/admin`);
      console.log('═══════════════════════════════════════');
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
