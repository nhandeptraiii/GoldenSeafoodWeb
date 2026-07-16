/**
 * Database Seeder
 * Chạy: node src/seeders/run.js
 * Tạo dữ liệu mẫu từ file Excel cho development
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const { sequelize, Category, Product, ProductSpecification, User } = require('../models');
const seedData = require('./data');

const seed = async () => {
  try {
    console.log('🌱 Starting database seeder...');

    // Sync database (force: true sẽ xóa và tạo lại tất cả bảng)
    await sequelize.sync({ force: true });
    console.log('✅ Database synced (tables recreated)');

    // 1. Seed Categories
    const categories = await Category.bulkCreate(seedData.categories);
    console.log(`✅ Seeded ${categories.length} categories`);

    // Tạo map slug -> id
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat.id;
    });

    // 2. Seed Products + Specifications
    let productCount = 0;
    let specCount = 0;

    for (const productData of seedData.products) {
      const { categorySlug, specifications, ...productFields } = productData;

      const product = await Product.create({
        ...productFields,
        category_id: categoryMap[categorySlug],
      });
      productCount++;

      // Seed specifications cho sản phẩm này
      if (specifications && specifications.length > 0) {
        const specsWithProductId = specifications.map(spec => ({
          ...spec,
          product_id: product.id,
        }));
        await ProductSpecification.bulkCreate(specsWithProductId);
        specCount += specifications.length;
      }
    }
    console.log(`✅ Seeded ${productCount} products with ${specCount} specifications`);

    // 3. Seed Admin User
    await User.create(seedData.adminUser);
    console.log('✅ Seeded admin user (admin / Admin@2026)');

    console.log('\n🎉 Seeding completed successfully!');
    console.log('────────────────────────────────────');
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Products:   ${productCount}`);
    console.log(`   Specs:      ${specCount}`);
    console.log(`   Admin user: 1`);
    console.log('────────────────────────────────────');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    console.error(error);
    process.exit(1);
  }
};

seed();
