# 📋 Kế Hoạch Chi Tiết Từng Phase - Golden Seafood Backend

---

# Phase 1: Foundation (1-2 ngày)

## 🎯 Mục tiêu
Khởi tạo project, kết nối MySQL, tạo tất cả models/migrations/seeders. Kết thúc Phase 1 phải chạy được `npm run dev` và database có đầy đủ bảng + dữ liệu mẫu.

## 📁 Danh sách file cần tạo

### 1.1 Khởi tạo Project
```
GoldenSeafood-Backend/
├── package.json              # Dependencies & scripts
├── .env.example              # Biến môi trường mẫu
├── .env                      # Biến môi trường thực (gitignore)
├── .gitignore
├── docker-compose.yml        # MySQL container cho dev
└── src/
    └── app.js                # Entry point
```

**package.json** - Scripts chính:
```json
{
  "name": "goldenseafood-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "nodemon src/app.js",
    "start": "node src/app.js",
    "db:migrate": "npx sequelize-cli db:migrate",
    "db:seed": "npx sequelize-cli db:seed:all",
    "db:reset": "npx sequelize-cli db:migrate:undo:all && npm run db:migrate && npm run db:seed"
  }
}
```

**`.env.example`**:
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=goldenseafood
DB_USER=root
DB_PASSWORD=root123

# JWT
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRES_IN=7d

# Email (SMTP của goldenseafood.com.vn)
SMTP_HOST=mail.goldenseafood.com.vn
SMTP_PORT=587
SMTP_USER=info@goldenseafood.com.vn
SMTP_PASS=email-password-here
SMTP_FROM_NAME=Golden Seafood
SMTP_FROM_EMAIL=info@goldenseafood.com.vn

# Email nhận thông báo inquiry
NOTIFY_EMAIL=binh@goldenseafood.com.vn
NOTIFY_EMAIL_CC=tram@goldenseafood.com.vn

# Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760

# WhatsApp
WHATSAPP_NUMBER=84945950099

# Frontend URL (cho CORS)
FRONTEND_URL=http://localhost:3001
```

**`docker-compose.yml`**:
```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    container_name: goldenseafood-db
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: goldenseafood
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
volumes:
  mysql_data:
```

---

### 1.2 Config Files

```
src/config/
├── database.js       # Sequelize connection
├── email.js          # Nodemailer transporter
├── multer.js         # File upload config
└── jwt.js            # JWT options
```

**`database.js`** - Kết nối MySQL:
- Đọc thông tin từ `.env`
- Tạo Sequelize instance
- Pool connection: min 0, max 10
- Timezone: `+07:00` (Việt Nam)
- Logging: chỉ bật ở development

**`email.js`** - Nodemailer:
- Tạo SMTP transporter từ config `.env`
- Export hàm `sendMail(to, subject, html)`
- Có fallback: nếu SMTP lỗi → log ra console (dev mode)

**`multer.js`** - Upload config:
- Storage: `diskStorage` → thư mục `uploads/`
- Tên file: `${timestamp}-${originalname}`
- Filter: Chỉ cho phép `.pdf, .png, .jpg, .jpeg, .doc, .docx`
- Max size: 10MB
- Tạo subdirectory tự động: `uploads/specs/`, `uploads/products/`

**`jwt.js`** - JWT:
- Secret từ `.env`
- Expires: 7 ngày
- Export: `generateToken(payload)`, `verifyToken(token)`

---

### 1.3 Models (7 files)

```
src/models/
├── index.js                  # Sequelize init + associations
├── Category.js
├── Product.js
├── ProductImage.js
├── ProductSpecification.js
├── Inquiry.js
├── InquiryItem.js
└── User.js
```

**`index.js`** - Associations (quan hệ giữa các bảng):
```javascript
// Relationships sẽ được define ở đây:
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

Product.hasMany(ProductImage, { foreignKey: 'product_id', as: 'images' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id' });

Product.hasMany(ProductSpecification, { foreignKey: 'product_id', as: 'specifications' });
ProductSpecification.belongsTo(Product, { foreignKey: 'product_id' });

Inquiry.hasMany(InquiryItem, { foreignKey: 'inquiry_id', as: 'items' });
InquiryItem.belongsTo(Inquiry, { foreignKey: 'inquiry_id' });

InquiryItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
```

**Chi tiết từng Model:**

| Model | Các cột chính | Ghi chú |
|-------|--------------|---------|
| `Category` | id, name_en, name_vi, slug, icon_url, sort_order, is_active | Slug UNIQUE, dùng cho URL: `/products?category=shrimp` |
| `Product` | id, category_id(FK), name_en, name_vi, slug, short_desc_en/vi, description_en/vi, thumbnail_url, product_type(ENUM), is_featured, is_active, sort_order | product_type: `raw`, `cooked`, `value_added` |
| `ProductImage` | id, product_id(FK), image_url, alt_text, sort_order, is_primary | is_primary: ảnh chính hiển thị trên grid |
| `ProductSpecification` | id, product_id(FK), spec_key_en, spec_key_vi, spec_value, sort_order | Bảng thông số kỹ thuật dạng key-value |
| `Inquiry` | id, inquiry_code(UNIQUE), full_name, job_title, company_name, country, email, whatsapp_number, destination_port, message, special_requirements, attachment_url, status(ENUM), source(ENUM), interested_species(JSON), auto_reply_sent | status: `new`→`processing`→`quoted`→`closed` |
| `InquiryItem` | id, inquiry_id(FK), product_id(FK nullable), product_name_snapshot, specifications, quantity, notes | product_name_snapshot: lưu tên sản phẩm tại thời điểm gửi (phòng trường hợp sản phẩm bị sửa/xóa) |
| `User` | id, username(UNIQUE), password_hash, email, full_name, role(ENUM), is_active, last_login | role: `admin`, `editor` |

---

### 1.4 Migrations (7 files)

```
src/migrations/
├── 20260716-001-create-categories.js
├── 20260716-002-create-products.js
├── 20260716-003-create-product-images.js
├── 20260716-004-create-product-specifications.js
├── 20260716-005-create-inquiries.js
├── 20260716-006-create-inquiry-items.js
└── 20260716-007-create-users.js
```

Mỗi migration file sẽ:
- `up()`: Tạo bảng với đầy đủ columns, constraints, indexes
- `down()`: Drop bảng
- Indexes: slug (UNIQUE), category_id, product_id, inquiry_code (UNIQUE), status

---

### 1.5 Seeders (3 files)

```
src/seeders/
├── 01-categories.js          # 5 danh mục từ Excel
├── 02-sample-products.js     # Sản phẩm mẫu (2-3 SP/danh mục)
└── 03-admin-user.js          # Admin mặc định
```

**`01-categories.js`** - 5 danh mục:
```javascript
// Dữ liệu lấy trực tiếp từ file Excel:
[
  { name_en: 'Premium Shrimp',          name_vi: 'Tôm Cao Cấp',       slug: 'shrimp' },
  { name_en: 'Squid, Octopus & Cuttlefish', name_vi: 'Mực & Bạch Tuộc', slug: 'cephalopods' },
  { name_en: 'Marine Fish',             name_vi: 'Cá Biển',            slug: 'marine-fish' },
  { name_en: 'Freshwater Fish',         name_vi: 'Cá Nước Ngọt',      slug: 'freshwater-fish' },
  { name_en: 'Amphibians & Shellfish',  name_vi: 'Ếch & Loài Có Vỏ',  slug: 'shellfish' },
]
```

**`02-sample-products.js`** - Sản phẩm mẫu cho mỗi danh mục, ví dụ:
```javascript
// Shrimp category:
{
  name_en: 'Frozen Vannamei Shrimp - Breaded',
  name_vi: 'Tôm thẻ chân trắng tẩm bột đông lạnh',
  slug: 'frozen-vannamei-shrimp-breaded',
  short_desc_en: 'Vannamei Breaded shrimp, premium quality...',
  short_desc_vi: 'Tôm thẻ chân trắng tẩm bột, chất lượng cao cấp...',
  product_type: 'value_added',
  is_featured: true,
  // + specifications: Scientific Name, Origin, Size, Freezing Method, Glazing, Packaging, Certificates
}
```

**`03-admin-user.js`** - Admin mặc định:
```javascript
{
  username: 'admin',
  password_hash: bcrypt.hashSync('Admin@2026', 10),
  email: 'admin@goldenseafood.com.vn',
  full_name: 'Administrator',
  role: 'admin'
}
```

---

### 1.6 Middlewares cơ bản

```
src/middlewares/
├── errorHandler.js       # Global error handler
└── logger.js             # Request logging (morgan)
```

**`errorHandler.js`**:
- Catch tất cả error
- Format response: `{ success: false, message, errors }`
- Phân biệt: Validation error (400), Auth error (401), Not found (404), Server error (500)

---

### 1.7 App Entry Point

**`src/app.js`** - Setup Express:
```javascript
// 1. Import & config dotenv
// 2. Import express, cors, helmet, morgan
// 3. Kết nối database (sequelize.authenticate())
// 4. Apply middlewares: cors, helmet, json parser, morgan
// 5. Serve static: /uploads
// 6. Mount routes: /api/*
// 7. Global error handler
// 8. Sync database & start server
// 9. Log: "🚀 Server running on port 3000"
```

---

### ✅ Kết quả Phase 1
- Chạy `docker-compose up -d` → MySQL ready
- Chạy `npm run db:migrate` → 7 bảng được tạo
- Chạy `npm run db:seed` → Có 5 categories + ~15 sản phẩm mẫu + 1 admin
- Chạy `npm run dev` → Server chạy ở `localhost:3000`
- Truy cập `localhost:3000` → Trả về `{ message: "Golden Seafood API v1.0" }`

---
---

# Phase 2: Product APIs (2 ngày)

## 🎯 Mục tiêu
CRUD hoàn chỉnh cho Products & Categories. Frontend có thể gọi API lọc sản phẩm theo danh mục + loại mà không cần reload trang.

## 📁 Danh sách file cần tạo

```
src/
├── controllers/
│   ├── categoryController.js
│   └── productController.js
├── services/
│   └── productService.js
├── routes/
│   ├── index.js
│   └── publicRoutes.js
├── middlewares/
│   └── validate.js
└── utils/
    ├── pagination.js
    └── slugify.js
```

---

### 2.1 Category Controller

| Endpoint | Logic |
|----------|-------|
| `GET /api/categories` | Trả về tất cả categories (is_active=true), sắp xếp theo sort_order. Include số lượng products trong mỗi category |

**Response mẫu:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name_en": "Premium Shrimp",
      "name_vi": "Tôm Cao Cấp",
      "slug": "shrimp",
      "icon_url": "/uploads/icons/shrimp.svg",
      "productCount": 5
    }
  ]
}
```

---

### 2.2 Product Controller - Public APIs

#### `GET /api/products` - Danh sách + Filter + Pagination

**Query params:**
| Param | Kiểu | Mô tả | Ví dụ |
|-------|------|-------|-------|
| `category` | string | Filter theo category slug | `?category=shrimp` |
| `type` | string | Filter theo product_type | `?type=raw` |
| `search` | string | Tìm kiếm theo tên (EN + VI) | `?search=vannamei` |
| `featured` | boolean | Chỉ lấy sản phẩm nổi bật | `?featured=true` |
| `page` | number | Trang hiện tại (default: 1) | `?page=2` |
| `limit` | number | Số SP/trang (default: 9, max: 50) | `?limit=12` |
| `sort` | string | Sắp xếp | `?sort=newest` hoặc `?sort=name` |

**Logic xử lý trong `productService.js`:**
```javascript
// 1. Build WHERE clause động từ query params
// 2. Nếu có category → JOIN categories WHERE slug = ?
// 3. Nếu có type → WHERE product_type = ?
// 4. Nếu có search → WHERE (name_en LIKE ? OR name_vi LIKE ?)
// 5. Nếu featured=true → WHERE is_featured = true
// 6. Luôn WHERE is_active = true
// 7. Include: thumbnail_url, category info
// 8. Pagination: LIMIT ? OFFSET ?
// 9. Return: { products, pagination: { page, limit, total, totalPages } }
```

**Response mẫu:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name_en": "Frozen Vannamei Shrimp - Breaded",
        "name_vi": "Tôm thẻ chân trắng tẩm bột đông lạnh",
        "slug": "frozen-vannamei-shrimp-breaded",
        "short_desc_en": "...",
        "short_desc_vi": "...",
        "thumbnail_url": "/uploads/products/shrimp-breaded.jpg",
        "product_type": "value_added",
        "category": {
          "name_en": "Premium Shrimp",
          "name_vi": "Tôm Cao Cấp",
          "slug": "shrimp"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 9,
      "total": 23,
      "totalPages": 3
    }
  }
}
```

#### `GET /api/products/featured` - Sản phẩm nổi bật (Trang chủ)
- Lấy sản phẩm có `is_featured = true`
- Giới hạn 5-6 sản phẩm (tương ứng 5 khối trên trang chủ)
- Include: category info

#### `GET /api/products/:slug` - Chi tiết sản phẩm
- Tìm theo slug (SEO-friendly URL)
- Include: **tất cả images** (gallery), **tất cả specifications** (bảng thông số)
- Include: category info
- Nếu không tìm thấy → 404

**Response mẫu:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name_en": "Frozen Vannamei Shrimp - Breaded",
    "name_vi": "Tôm thẻ chân trắng tẩm bột đông lạnh",
    "slug": "frozen-vannamei-shrimp-breaded",
    "short_desc_en": "...",
    "description_en": "Full description...",
    "thumbnail_url": "/uploads/products/shrimp-breaded.jpg",
    "product_type": "value_added",
    "category": { "name_en": "Premium Shrimp", "slug": "shrimp" },
    "images": [
      { "id": 1, "image_url": "/uploads/products/img1.jpg", "is_primary": true },
      { "id": 2, "image_url": "/uploads/products/img2.jpg", "is_primary": false }
    ],
    "specifications": [
      { "spec_key_en": "Scientific Name", "spec_key_vi": "Tên khoa học", "spec_value": "Litopenaeus vannamei" },
      { "spec_key_en": "Origin", "spec_key_vi": "Xuất xứ", "spec_value": "Vietnam" },
      { "spec_key_en": "Size / Counting", "spec_key_vi": "Kích cỡ", "spec_value": "20/40, 40/60, 60/80" },
      { "spec_key_en": "Freezing Method", "spec_key_vi": "Quy cách cấp đông", "spec_value": "IQF" },
      { "spec_key_en": "Glazing", "spec_key_vi": "Tỷ lệ mạ băng", "spec_value": "0%, 5%, 10%, 15%, 20%" },
      { "spec_key_en": "Packaging", "spec_key_vi": "Quy cách đóng gói", "spec_value": "Bulk carton 10kg, Retail bag" },
      { "spec_key_en": "Certificates", "spec_key_vi": "Chứng chỉ", "spec_value": "HACCP, BRC, IFS, ASC, BAP" }
    ]
  }
}
```

---

### 2.3 Utils

**`pagination.js`**:
```javascript
// Input: page, limit, totalCount
// Output: { page, limit, total, totalPages, offset }
// Validate: page >= 1, 1 <= limit <= 50
```

**`slugify.js`**:
```javascript
// Chuyển tên sản phẩm EN → URL slug
// "Frozen Vannamei Shrimp - Breaded" → "frozen-vannamei-shrimp-breaded"
// Xử lý trùng: nếu slug đã tồn tại → thêm "-2", "-3"
```

---

### ✅ Kết quả Phase 2
Có thể test bằng Postman/Thunder Client:
- `GET localhost:3000/api/categories` → 5 danh mục
- `GET localhost:3000/api/products` → Tất cả sản phẩm
- `GET localhost:3000/api/products?category=shrimp` → Chỉ sản phẩm tôm
- `GET localhost:3000/api/products?category=shrimp&type=value_added` → Tôm tẩm bột
- `GET localhost:3000/api/products?search=vannamei` → Tìm kiếm
- `GET localhost:3000/api/products/featured` → SP nổi bật
- `GET localhost:3000/api/products/frozen-vannamei-shrimp-breaded` → Chi tiết + ảnh + specs

---
---

# Phase 3: Inquiry System (2 ngày)

## 🎯 Mục tiêu
Xây dựng hệ thống nhận yêu cầu báo giá từ khách hàng B2B, bao gồm contact form, inquiry basket, upload file, và auto-reply email.

## 📁 Danh sách file cần tạo

```
src/
├── controllers/
│   ├── inquiryController.js
│   └── uploadController.js
├── services/
│   ├── inquiryService.js
│   └── emailService.js
├── utils/
│   ├── inquiryCode.js
│   └── emailTemplates.js
├── middlewares/
│   └── rateLimiter.js
└── routes/
    └── publicRoutes.js      # (bổ sung thêm routes)
```

---

### 3.1 Inquiry Controller

#### `POST /api/inquiries/contact` - Form liên hệ (Trang Contact)

**Request body:**
```json
{
  "full_name": "John Smith",
  "job_title": "Purchasing Manager",
  "company_name": "Nordic Seafood Import AS",
  "country": "Norway",
  "email": "john@nordicseafood.no",
  "whatsapp_number": "+4712345678",
  "interested_species": ["Alaska Pollock / Cod", "Snow / Dungeness Crab", "Scallops"],
  "message": "We are looking for IQF scallop meat, 200-300g size...",
  "attachment_url": "/uploads/specs/1721100000-spec-sheet.pdf"
}
```

**Logic xử lý:**
```
1. Validate input (express-validator):
   - full_name: required, min 2 chars
   - company_name: required
   - country: required  
   - email: required, valid email format
   - interested_species: optional, array of strings
   - message: optional, max 2000 chars
   
2. Generate inquiry_code: "GS-20260716-001"
   - Format: GS-{YYYYMMDD}-{sequence 3 digits}
   - Sequence tự tăng theo ngày
   
3. INSERT vào bảng inquiries:
   - source: 'contact_form'
   - status: 'new'
   - interested_species: JSON stringify
   
4. Gửi Auto-Reply email cho buyer (async, không block response)

5. Gửi Notification email cho team GS (async)

6. Response:
   { success: true, inquiryCode: "GS-20260716-001", whatsappLink: "https://wa.me/84945950099?text=..." }
```

#### `POST /api/inquiries/basket` - Inquiry Basket (Trang Sản phẩm)

**Request body:**
```json
{
  "full_name": "Sarah Lee",
  "company_name": "Pacific Foods Ltd",
  "country": "South Korea",
  "email": "sarah@pacificfoods.kr",
  "whatsapp_number": "+8210123456",
  "destination_port": "Busan Port",
  "special_requirements": "Need HALAL certification for all items",
  "items": [
    {
      "product_id": 1,
      "product_name": "Frozen Vannamei Shrimp - Breaded",
      "specifications": "Size 40/60, IQF, Glazing 10%",
      "quantity": 5000,
      "notes": "Need sample first"
    },
    {
      "product_id": 8,
      "product_name": "Squid Rings Block 7.5kg",
      "specifications": "Block frozen, net weight 7.5kg",
      "quantity": 2000,
      "notes": ""
    }
  ]
}
```

**Logic xử lý:**
```
1. Validate input:
   - full_name, company_name, country, email: required
   - items: required, array min 1 item
   - Mỗi item: product_id (optional), product_name (required)

2. Generate inquiry_code

3. Transaction:
   - INSERT inquiry (source: 'inquiry_basket')
   - INSERT mỗi item vào inquiry_items
   - product_name_snapshot = product_name (lưu snapshot)

4. Gửi email (async):
   - Auto-reply cho buyer (kèm danh sách sản phẩm đã chọn)
   - Notification cho team GS (chi tiết đầy đủ)

5. Response:
   { success: true, inquiryCode, whatsappLink }
```

---

### 3.2 Upload Controller

#### `POST /api/upload` - Upload file đính kèm

**Logic:**
```
1. Nhận file qua multer middleware
2. Validate:
   - File types: .pdf, .png, .jpg, .jpeg, .doc, .docx
   - Max size: 10MB
3. Lưu vào: uploads/specs/{timestamp}-{originalname}
4. Response: { success: true, fileUrl: "/uploads/specs/1721100000-spec.pdf" }
```

> [!NOTE]
> Upload tách riêng endpoint để FE có thể upload trước, nhận URL, rồi gửi kèm trong inquiry form. Tránh gửi file + form data cùng lúc → đơn giản hơn cho FE.

---

### 3.3 Email Service

**`emailService.js`** - 2 hàm chính:

```javascript
// 1. sendAutoReply(inquiry)
//    - Gửi đến: email của buyer
//    - Subject: "Golden Seafood - Inquiry Received [GS-20260716-001]"
//    - Content: HTML template cảm ơn + mã inquiry + link WhatsApp

// 2. sendInquiryNotification(inquiry, items)
//    - Gửi đến: binh@goldenseafood.com.vn
//    - CC: tram@goldenseafood.com.vn
//    - Subject: "🔔 New Inquiry [GS-20260716-001] from Nordic Seafood Import AS"
//    - Content: HTML bảng chi tiết thông tin khách + danh sách SP
```

**`emailTemplates.js`** - HTML templates:

```javascript
// autoReplyTemplate(inquiryCode, fullName, whatsappLink)
// → Return HTML string với:
//   - Logo Golden Seafood
//   - "Thank you for contacting Golden Seafood..."
//   - Inquiry reference code
//   - "We will get back to you within 24 hours"
//   - WhatsApp button
//   - Footer: địa chỉ công ty

// notificationTemplate(inquiry, items)
// → Return HTML string với:
//   - Thông tin khách hàng (bảng)
//   - Danh sách sản phẩm quan tâm (bảng)
//   - Message/requirements
//   - Link download file đính kèm (nếu có)
```

---

### 3.4 Inquiry Code Generator

**`inquiryCode.js`**:
```javascript
// generateInquiryCode()
// Logic:
// 1. Lấy ngày hiện tại: 20260716
// 2. Đếm số inquiry đã có trong ngày (SELECT COUNT)
// 3. Sequence = count + 1, pad 3 digits
// 4. Return: "GS-20260716-001"
// 5. Nếu trùng (race condition) → retry với sequence + 1
```

---

### 3.5 Rate Limiter

**`rateLimiter.js`**:
```javascript
// inquiryLimiter:
// - Window: 15 phút
// - Max: 5 requests per IP
// - Message: "Too many inquiries. Please try again later."
// 
// uploadLimiter:
// - Window: 15 phút  
// - Max: 10 uploads per IP
```

Áp dụng:
```javascript
router.post('/inquiries/contact', inquiryLimiter, inquiryController.submitContact);
router.post('/inquiries/basket', inquiryLimiter, inquiryController.submitBasket);
router.post('/upload', uploadLimiter, uploadController.uploadFile);
```

---

### ✅ Kết quả Phase 3
Test bằng Postman:
- `POST /api/upload` + file PDF → Nhận URL file
- `POST /api/inquiries/contact` → Nhận inquiry code + email gửi thành công
- `POST /api/inquiries/basket` + 2 items → Nhận inquiry code + 2 email gửi
- Gửi >5 requests/15 phút → Bị rate limit (429)
- Kiểm tra database: inquiries + inquiry_items có đầy đủ dữ liệu

---
---

# Phase 4: Admin Panel (3-4 ngày)

## 🎯 Mục tiêu
Xây dựng giao diện quản trị cho nhân viên Golden Seafood để quản lý sản phẩm và xem/xử lý yêu cầu báo giá.

## Kiến trúc

```
GoldenSeafood-Backend/
└── admin/                        # Thư mục riêng cho admin frontend
    ├── index.html
    ├── css/
    │   └── admin.css
    ├── js/
    │   ├── app.js                # SPA Router
    │   ├── api.js                # Axios/fetch wrapper
    │   ├── auth.js               # Login/logout logic
    │   ├── pages/
    │   │   ├── login.js
    │   │   ├── dashboard.js
    │   │   ├── products.js       # Danh sách SP
    │   │   ├── productForm.js    # Thêm/sửa SP
    │   │   └── inquiries.js      # DS yêu cầu báo giá
    │   └── components/
    │       ├── sidebar.js
    │       ├── header.js
    │       ├── table.js          # Reusable data table
    │       └── modal.js
    └── assets/
        └── logo.svg
```

> [!NOTE]
> Admin panel sẽ được build bằng **Vanilla JS (SPA đơn giản)** — không cần React/Vue vì chỉ có 4-5 trang. Backend serve static files từ thư mục `admin/` tại route `/admin`.

---

### 4.1 Backend - Admin Routes

```
src/
├── controllers/
│   └── adminController.js        # Tất cả admin logic
├── middlewares/
│   └── auth.js                   # JWT middleware (bổ sung)
└── routes/
    └── adminRoutes.js            # /api/admin/*
```

#### Auth
| Method | Endpoint | Logic |
|--------|----------|-------|
| `POST` | `/api/admin/login` | Nhận username + password → verify bcrypt → trả JWT token |
| `GET` | `/api/admin/profile` | Decode JWT → trả thông tin admin đang login |

#### Product Management
| Method | Endpoint | Logic |
|--------|----------|-------|
| `GET` | `/api/admin/products` | DS sản phẩm + search + pagination (include inactive) |
| `GET` | `/api/admin/products/:id` | Chi tiết 1 SP (full info) |
| `POST` | `/api/admin/products` | Tạo SP mới (name, desc, category, type, specs, images) |
| `PUT` | `/api/admin/products/:id` | Sửa thông tin SP |
| `DELETE` | `/api/admin/products/:id` | Soft delete (is_active = false) |
| `POST` | `/api/admin/products/:id/images` | Upload thêm ảnh cho SP |
| `DELETE` | `/api/admin/products/:id/images/:imageId` | Xóa 1 ảnh |
| `PUT` | `/api/admin/products/:id/specs` | Cập nhật toàn bộ bảng specs (bulk replace) |

#### Category Management
| Method | Endpoint | Logic |
|--------|----------|-------|
| `GET` | `/api/admin/categories` | DS danh mục (include inactive) |
| `POST` | `/api/admin/categories` | Tạo danh mục mới |
| `PUT` | `/api/admin/categories/:id` | Sửa danh mục |
| `DELETE` | `/api/admin/categories/:id` | Xóa (chỉ nếu không có SP nào) |

#### Inquiry Management
| Method | Endpoint | Logic |
|--------|----------|-------|
| `GET` | `/api/admin/inquiries` | DS inquiries + filter status + search + pagination |
| `GET` | `/api/admin/inquiries/:id` | Chi tiết inquiry + items |
| `PUT` | `/api/admin/inquiries/:id/status` | Đổi trạng thái: new → processing → quoted → closed |
| `GET` | `/api/admin/inquiries/stats` | Thống kê: tổng, theo status, theo ngày/tháng |

---

### 4.2 Admin Frontend - Các Trang

#### Trang Login (`/admin/login`)
- Form: Username + Password
- Gọi `POST /api/admin/login` → Lưu JWT vào localStorage
- Redirect → Dashboard

#### Trang Dashboard (`/admin/dashboard`)
- **Thẻ thống kê nhanh:**
  - Tổng sản phẩm (active)
  - Tổng inquiries tháng này
  - Inquiries mới (chưa xử lý)
  - Inquiries đã báo giá
- **Bảng Inquiries gần nhất** (5 mới nhất):
  - Mã inquiry | Tên công ty | Quốc gia | Trạng thái | Ngày gửi
- **Biểu đồ đơn giản** (optional): Số inquiry theo tuần

#### Trang Quản Lý Sản Phẩm (`/admin/products`)
- **Bảng danh sách:**
  - Ảnh thumbnail | Tên EN | Tên VI | Danh mục | Loại | Trạng thái | Actions
- **Chức năng:**
  - Search theo tên
  - Filter theo danh mục
  - Pagination
  - Nút: Thêm mới | Sửa | Xóa

#### Trang Thêm/Sửa Sản Phẩm (`/admin/products/new` hoặc `/admin/products/:id/edit`)
- **Form thông tin:**
  - Tên EN / VI
  - Mô tả ngắn EN / VI
  - Mô tả chi tiết EN / VI (textarea)
  - Danh mục (dropdown)
  - Loại sản phẩm (radio: Raw / Cooked / Value-added)
  - Sản phẩm nổi bật (checkbox)
  - Trạng thái active (toggle)
- **Upload ảnh:**
  - Khu vực drag & drop hoặc click chọn file
  - Preview ảnh đã upload
  - Đánh dấu ảnh chính (primary)
  - Xóa ảnh
- **Bảng Specifications:**
  - Bảng động: thêm/xóa dòng
  - Mỗi dòng: Key EN | Key VI | Value
  - Pre-fill template: Scientific Name, Origin, Size, Freezing Method, Glazing, Packaging, Certificates

#### Trang Quản Lý Inquiries (`/admin/inquiries`)
- **Bảng danh sách:**
  - Mã | Tên khách | Công ty | Quốc gia | Email | Nguồn | Trạng thái | Ngày
- **Filter tabs:** All | New | Processing | Quoted | Closed
- **Click vào 1 inquiry → Modal chi tiết:**
  - Thông tin khách hàng
  - Danh sách sản phẩm quan tâm (nếu basket)
  - Mặt hàng tích chọn (nếu contact form)
  - Message + file đính kèm (link download)
  - Dropdown đổi trạng thái
  - Nút: Reply via Email | Chat WhatsApp

---

### 4.3 Thiết kế giao diện Admin

**Color scheme:**
- Sidebar: Xanh đại dương đậm (`#0A2540`)
- Background: Xám nhẹ (`#F5F7FA`)
- Accent: Vàng champagne (`#C9A84C`)
- Text: Đen/xám đậm
- Status badges: New (🔵 blue), Processing (🟡 yellow), Quoted (🟢 green), Closed (⚫ gray)

**Layout:**
```
┌──────────┬─────────────────────────────────┐
│          │  Header (Admin name + Logout)   │
│ Sidebar  ├─────────────────────────────────┤
│          │                                 │
│ Dashboard│       Main Content Area         │
│ Products │                                 │
│ Inquiries│       (Tables, Forms, etc.)     │
│          │                                 │
│          │                                 │
└──────────┴─────────────────────────────────┘
```

---

### ✅ Kết quả Phase 4
- Truy cập `localhost:3000/admin` → Trang login
- Đăng nhập `admin / Admin@2026` → Dashboard với thống kê
- Thêm/sửa/xóa sản phẩm → Upload ảnh + specs
- Xem danh sách inquiry → Lọc theo trạng thái → Xem chi tiết → Đổi trạng thái

---
---

# Phase 5: Testing & Polish (1 ngày)

## 🎯 Mục tiêu
Đảm bảo tất cả APIs hoạt động ổn định, bảo mật, và sẵn sàng kết nối với Frontend chính.

## 📁 File cần tạo

```
├── tests/
│   ├── products.test.js       # Test product APIs
│   ├── inquiries.test.js      # Test inquiry flow
│   └── auth.test.js           # Test admin auth
├── src/
│   └── middlewares/
│       └── validate.js        # (hoàn thiện validation rules)
└── README.md                  # Hướng dẫn setup & API docs
```

---

### 5.1 Checklist Testing

#### API Testing (Postman/Thunder Client)
- [ ] `GET /api/categories` → 200, trả 5 danh mục
- [ ] `GET /api/products` → 200, pagination hoạt động
- [ ] `GET /api/products?category=shrimp` → Chỉ trả SP tôm
- [ ] `GET /api/products?category=shrimp&type=raw` → Kết hợp filter
- [ ] `GET /api/products?search=vannamei` → Tìm kiếm hoạt động
- [ ] `GET /api/products/featured` → Chỉ SP nổi bật
- [ ] `GET /api/products/:slug` → Chi tiết + images + specs
- [ ] `GET /api/products/non-existent` → 404
- [ ] `POST /api/upload` + file PDF → 200, trả URL
- [ ] `POST /api/upload` + file .exe → 400 (rejected)
- [ ] `POST /api/upload` + file >10MB → 400 (too large)
- [ ] `POST /api/inquiries/contact` → 201, inquiry code generated
- [ ] `POST /api/inquiries/contact` thiếu email → 400 validation error
- [ ] `POST /api/inquiries/basket` + 2 items → 201
- [ ] `POST /api/inquiries/*` 6 lần/15 phút → 429 rate limit
- [ ] Kiểm tra email auto-reply gửi thành công
- [ ] Kiểm tra email notification gửi thành công

#### Admin API Testing
- [ ] `POST /api/admin/login` đúng credentials → 200, JWT token
- [ ] `POST /api/admin/login` sai password → 401
- [ ] `GET /api/admin/products` không có token → 401
- [ ] `GET /api/admin/products` có token → 200
- [ ] `POST /api/admin/products` tạo SP mới → 201
- [ ] `PUT /api/admin/products/:id` sửa SP → 200
- [ ] `DELETE /api/admin/products/:id` xóa SP → 200 (soft delete)
- [ ] `GET /api/admin/inquiries` → 200, pagination
- [ ] `GET /api/admin/inquiries?status=new` → Chỉ inquiry mới
- [ ] `PUT /api/admin/inquiries/:id/status` → 200, status changed
- [ ] `GET /api/admin/inquiries/stats` → Thống kê đúng

#### Security Testing
- [ ] CORS chỉ cho phép FRONTEND_URL
- [ ] Helmet headers hoạt động
- [ ] JWT expire sau 7 ngày
- [ ] Password hash bằng bcrypt (không lưu plaintext)
- [ ] SQL injection: test input `'; DROP TABLE products; --` → Sequelize escape
- [ ] XSS: test input `<script>alert('xss')</script>` → Escaped
- [ ] File upload chỉ nhận đúng extension

#### Admin Panel Testing
- [ ] Login form hoạt động
- [ ] Dashboard hiển thị đúng thống kê
- [ ] CRUD products hoạt động (list, add, edit, delete)
- [ ] Upload ảnh sản phẩm hoạt động
- [ ] Quản lý specs (thêm/sửa/xóa dòng)
- [ ] Inquiry list + filter status
- [ ] Inquiry detail modal
- [ ] Đổi trạng thái inquiry
- [ ] Logout xóa token

---

### 5.2 README.md

Nội dung:
- Mô tả project
- Tech stack
- Hướng dẫn cài đặt (clone, npm install, docker-compose, migrate, seed)
- Biến môi trường (.env)
- Danh sách API endpoints
- Tài khoản admin mặc định
- Cấu trúc thư mục

---

## Tổng Kết Toàn Bộ Files

| Phase | Số files tạo mới | Thời gian |
|-------|------------------|-----------|
| Phase 1: Foundation | ~20 files (config, models, migrations, seeders, app) | 1-2 ngày |
| Phase 2: Product APIs | ~8 files (controllers, services, routes, utils) | 2 ngày |
| Phase 3: Inquiry System | ~8 files (controllers, services, email, rate limiter) | 2 ngày |
| Phase 4: Admin Panel | ~15 files (admin routes + admin frontend pages) | 3-4 ngày |
| Phase 5: Testing | ~4 files (tests, README) | 1 ngày |
| **Tổng** | **~55 files** | **9-11 ngày** |
