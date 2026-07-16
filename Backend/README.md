# 🦐 Golden Seafood B2B Backend API & Executive Portal

Hệ thống Backend API và Cổng thông tin Quản trị (Admin Portal) cho website B2B xuất khẩu thủy hải sản **Golden Seafood Co., Ltd**. Được xây dựng tối ưu hóa tốc độ cao với **Node.js, Express, Sequelize ORM và MySQL**.

---

## ✨ Điểm nổi bật & Kiến trúc

1. **Hiệu năng & Tối ưu hóa Database (7 Bảng)**:
   - Các nội dung tĩnh ít thay đổi (Trang chủ, Dịch vụ gia công, Quy trình QC, Liên hệ) được đề xuất xử lý trên Frontend/JSON để đạt tốc độ tải trang dưới 100ms.
   - Database tập trung toàn lực cho **Quản lý Danh mục & Sản phẩm (với Thông số kỹ thuật động)** và **Hệ thống Quản lý Báo giá (Inquiry & RFQ Workflow)**.

2. **Hệ thống Báo giá B2B Chuyên nghiệp**:
   - Hỗ trợ cả Form liên hệ nhanh (`Contact Form`) và Giỏ hàng Báo giá (`Inquiry Basket`) chứa nhiều mặt hàng cùng lúc.
   - **Mã định danh tự động**: Tạo mã theo chuẩn `GS-YYYYMMDD-XXX` (VD: `GS-20260716-001`).
   - **Tự động gửi Email kép (Nodemailer)**: 
     - Gửi email cảm ơn/xác nhận chuyên nghiệp cho khách hàng quốc tế.
     - Gửi email cảnh báo khẩn cấp (`🔥 New B2B Inquiry`) đến bộ phận kinh doanh (`binh@goldenseafood.com.vn`, CC `tram@goldenseafood.com.vn`).
     - *Trong môi trường Development, email được tự động log ra console với format rõ ràng mà không cần cấu hình SMTP thật.*

3. **Giao diện Quản trị (Executive Admin Portal)**:
   - Tích hợp sẵn giao diện **Single-Page Application (SPA)** tại `/admin`.
   - Thiết kế chuẩn **Glassmorphism Dark Mode** hiện đại, sang trọng, hiệu ứng chuyển động mượt mà.
   - Quản lý toàn diện: Tổng quan số liệu (Dashboard), thêm/sửa/xóa sản phẩm cùng bảng thông số kỹ thuật song ngữ (EN/VI), cập nhật trạng thái xử lý đơn hỏi hàng (`new` → `processing` → `quoted` → `closed`).

4. **Bảo mật Đa lớp**:
   - **Helmet**: Bảo vệ HTTP headers.
   - **CORS**: Cấu hình chia sẻ tài nguyên an toàn cho Frontend (`http://localhost:3001`).
   - **Rate Limiter**: Chống spam & DDoS (giới hạn 10 request / 15 phút cho form gửi báo giá).
   - **JWT + Bcrypt**: Xác thực và mã hóa mật khẩu cho người quản trị.

---

## 🚀 Hướng dẫn Cài đặt & Khởi chạy

### 1. Yêu cầu hệ thống
- **Node.js**: v18+ 
- **MySQL**: v8.0+ (Hoặc sử dụng Docker Compose đi kèm)

### 2. Cài đặt Dependencies
```bash
git clone <repository-url>
cd GoldenSeafood-Backend
npm install
```

### 3. Cấu hình Biến môi trường (`.env`)
Dự án đã có sẵn file `.env.example`. Đảm bảo file `.env` được cấu hình thông số kết nối MySQL của bạn:
```ini
PORT=3000
NODE_ENV=development

# MySQL Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=goldenseafood
DB_USER=root
DB_PASSWORD=123456   # Thay đổi theo mật khẩu MySQL của bạn

# JWT Secret
JWT_SECRET=golden-seafood-jwt-secret-key-2026
JWT_EXPIRES_IN=7d

# Email Notification
SMTP_HOST=mail.goldenseafood.com.vn
NOTIFY_EMAIL=binh@goldenseafood.com.vn
NOTIFY_EMAIL_CC=tram@goldenseafood.com.vn
```

### 4. Khởi tạo Database & Dữ liệu mẫu (Seeder)
Hệ thống đi kèm bộ dữ liệu mẫu chuẩn xuất khẩu được trích xuất từ file Excel ban đầu (5 danh mục chính, 12 sản phẩm kèm 76 thông số kỹ thuật chi tiết, tài khoản Admin mặc định):
```bash
# Lệnh này sẽ tự tạo bảng và nạp toàn bộ dữ liệu mẫu
npm run seed
```

Tài khoản Admin mặc định được khởi tạo sau khi seed:
- **Username**: `admin`
- **Password**: `Admin@2026`

### 5. Chạy Server
```bash
# Môi trường Development (tự động reload với nodemon)
npm run dev

# Môi trường Production
npm start
```

Server sẽ chạy tại `http://localhost:3000`.
- **API Endpoints**: `http://localhost:3000/api`
- **Admin Portal UI**: `http://localhost:3000/admin`

---

## 📚 Danh sách API Endpoints chính

### Public APIs (Khách hàng & Frontend)
| Phương thức | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/api/categories` | Lấy danh sách 5 danh mục cùng số lượng sản phẩm |
| `GET` | `/api/products` | Danh sách sản phẩm (Hỗ trợ phân trang `?page=1&limit=9`, lọc theo danh mục `?category=shrimp`, tìm kiếm `?search=vannamei`) |
| `GET` | `/api/products/featured` | Lấy các sản phẩm nổi bật (`is_featured: true`) cho Trang chủ |
| `GET` | `/api/products/:slug` | Chi tiết sản phẩm theo URL slug kèm hình ảnh và bảng thông số |
| `POST` | `/api/inquiries/contact` | Gửi yêu cầu liên hệ nhanh |
| `POST` | `/api/inquiries/basket` | Gửi yêu cầu báo giá cho giỏ hàng (chứa nhiều sản phẩm & số lượng) |
| `POST` | `/api/upload` | Upload file đính kèm/spec sheet (Tối đa 10MB) |

### Admin APIs (Yêu cầu `Authorization: Bearer <token>`)
| Phương thức | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/api/admin/login` | Đăng nhập lấy JWT token |
| `GET` | `/api/admin/me` | Thông tin tài khoản Admin đang đăng nhập |
| `GET/POST` | `/api/admin/categories` | Quản lý danh mục |
| `PUT/DELETE` | `/api/admin/categories/:id` | Cập nhật/xóa danh mục (không cho xóa nếu có sản phẩm) |
| `GET/POST` | `/api/admin/products` | Quản lý sản phẩm & thông số kỹ thuật |
| `PUT/DELETE` | `/api/admin/products/:id` | Cập nhật/xóa sản phẩm |
| `POST` | `/api/admin/products/upload-image` | Upload hình ảnh sản phẩm |
| `GET` | `/api/admin/inquiries` | Lấy danh sách đơn hỏi hàng (lọc theo `status`, `source`, `search`) |
| `PATCH` | `/api/admin/inquiries/:id/status` | Cập nhật trạng thái (`new` / `processing` / `quoted` / `closed`) |
| `DELETE` | `/api/admin/inquiries/:id` | Xóa đơn hỏi hàng |

---

## 🧪 Ví dụ Request Body cho API Báo giá (`/api/inquiries/basket`)

```json
{
  "full_name": "Elena Rostova",
  "company_name": "Vostok Seafood Trading",
  "email": "elena@vostokseafood.ru",
  "country": "Russia",
  "destination_port": "St. Petersburg Port",
  "items": [
    {
      "product_id": 1,
      "quantity": 25,
      "specifications": "Size 16/20, IQF, Glazing 10%, Bulk carton 10kg",
      "notes": "Need ASC certificate copy"
    },
    {
      "product_id": 4,
      "quantity": 15,
      "specifications": "Size 8/12 cm, IQF, Glazing 5%"
    }
  ]
}
```

---

## 📁 Cấu trúc thư mục dự án
```text
GoldenSeafood-Backend/
├── admin/                 # Executive Admin Portal (Single-Page UI Glassmorphism)
│   └── index.html
├── src/
│   ├── config/            # Cấu hình Database, Email, JWT, Multer
│   ├── controllers/       # Handlers cho Public & Admin APIs
│   ├── middlewares/       # Auth, Validation, Error Handler, Rate Limiter
│   ├── models/            # 7 Sequelize Models + Associations (index.js)
│   ├── routes/            # Public & Admin Express Routes
│   ├── seeders/           # Dữ liệu chuẩn từ Excel + Runner script
│   ├── services/          # Business logic cho Products, Inquiries, Emails
│   ├── utils/             # Pagination, Slugify, Inquiry Code Generator
│   └── app.js             # Entry point
├── uploads/               # Thư mục lưu trữ hình ảnh & tài liệu upload
├── .env                   # Biến môi trường
├── docker-compose.yml     # Docker cấu hình MySQL 8.0
└── package.json           # Dependencies & scripts
```

---
*© 2026 Golden Seafood Co., Ltd. Designed and Developed for High-Performance B2B Export Operations.*
