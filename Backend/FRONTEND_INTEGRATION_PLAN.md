# 📑 TÀI LIỆU HƯỚNG DẪN TÍCH HỢP FRONTEND & KẾ HOẠCH TRIỂN KHAI
**Dự án:** Website B2B Xuất Khẩu Thủy Hải Sản **Golden Seafood Co., Ltd**  
**Đối tượng sử dụng:** Frontend Developer / UI/UX Engineer / Tech Lead  
**Ngày cập nhật:** Tháng 7/2026  
**Phiên bản API:** v1.0.0

---

## 🏗️ 1. TỔNG QUAN HỆ THỐNG & CHIẾN LƯỢC PHÂN BỔ DỮ LIỆU

Hệ thống Golden Seafood được thiết kế tối ưu cho mô hình **B2B Global Export (Xuất khẩu toàn cầu)**. Mục tiêu cốt lõi là **tốc độ tải trang cực nhanh (< 2 giây)** và **trải nghiệm người mua quốc tế (International Buyers) sang trọng, chuyên nghiệp**.

### 1.1 Phân định rõ ràng Dữ liệu Động (API) vs Dữ liệu Tĩnh (Hardcode FE)
Theo sự thống nhất về kiến trúc tối ưu hiệu năng:
- ⚡ **Dữ Liệu Tĩnh (Hardcode / JSON trên Frontend)**:
  - **Trang Chủ (Home)**: Các khối giới thiệu "Về chúng tôi", quy trình làm việc, lý do chọn Golden Seafood.
  - **Trang Dịch vụ Gia công (Processing Services)**: Quy trình chế biến sâu cá thịt trắng (Whitefish Deep-Processing), đóng gói chuẩn siêu thị (Retail-ready).
  - **Trang Đảm bảo Chất lượng (Quality Assurance)**: Quy trình QC 4 bước, tiêu chuẩn nhà máy (HACCP, BRC, ASC, BAP), tiêu chuẩn đóng gói bao bì.
  - **Trang Liên hệ (Contact Us)**: Thông tin địa chỉ văn phòng, các phòng ban hỗ trợ Sourcing.
  - **Khối Mixed Container Footer**: Banner thông điệp gom container hỗn hợp (Shrimp, Fish, Cephalopods) hiển thị ở cuối trang chi tiết sản phẩm.

- 🔄 **Dữ Liệu Động (Gọi từ Backend API)**:
  - **Danh mục sản phẩm (Categories)**: 5 nhóm ngành hàng cốt lõi kèm số lượng sản phẩm.
  - **Danh sách & Chi tiết Sản phẩm (Products & Specs)**: Tên song ngữ Anh/Việt, phân loại `raw` / `cooked` / `value_added`, hình ảnh gallery, bảng thông số kỹ thuật chi tiết.
  - **Hệ thống Báo giá & Khách hàng (Inquiry Basket & Contact Form)**: Gửi form báo giá B2B, giỏ hàng nhiều mặt hàng, upload file spec sheet, nhận phản hồi tự động.

### 1.2 Cấu hình Môi trường Frontend (`.env.local`)
Frontend cần thiết lập biến môi trường trỏ về Backend API:
```ini
# Môi trường Development
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_UPLOADS_URL=http://localhost:3000/

# Môi trường Production
# NEXT_PUBLIC_API_BASE_URL=https://api.goldenseafood.com.vn/api
```

---

## 🌐 2. TỔNG HỢP TOÀN BỘ PUBLIC API ENDPOINTS

Mọi request từ Frontend gửi lên API (trừ upload file) đều dùng header:
`Content-Type: application/json`

### 2.1 Nhóm API Danh Mục (Categories)

#### 🔸 `GET /api/categories`
Lấy danh sách 5 danh mục chính kèm số lượng sản phẩm đang hoạt động (`productCount`). Dùng để render Menu trượt hoặc Sidebar Bộ lọc trên trang Sản phẩm.

- **Query Params**: Không
- **Response JSON (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name_en": "Shrimp",
      "name_vi": "Tôm",
      "slug": "shrimp",
      "icon_url": null,
      "sort_order": 1,
      "is_active": true,
      "productCount": 4
    },
    {
      "id": 2,
      "name_en": "Cephalopods",
      "name_vi": "Mực & Bạch tuộc",
      "slug": "cephalopods",
      "icon_url": null,
      "sort_order": 2,
      "is_active": true,
      "productCount": 3
    }
  ]
}
```

---

### 2.2 Nhóm API Sản Phẩm (Products)

#### 🔸 `GET /api/products`
Lấy danh sách sản phẩm hỗ trợ bộ lọc AJAX (không cần reload trang), tìm kiếm song ngữ và phân trang.

- **Query Params (Tuỳ chọn)**:
  - `page`: Số trang (mặc định: `1`)
  - `limit`: Số lượng trên mỗi trang (mặc định: `9`)
  - `category_id`: Lọc theo ID danh mục (VD: `1` cho Shrimp)
  - `type`: Lọc theo trạng thái chế biến (`raw` | `cooked` | `value_added`)
  - `search`: Từ khóa tìm kiếm song ngữ Anh/Việt (VD: `vannamei` hoặc `tôm thẻ`)
- **Ví dụ Request**: `GET /api/products?category_id=1&type=raw&page=1&limit=9`
- **Response JSON (200 OK)**:
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "category_id": 1,
        "name_en": "Frozen Vannamei Shrimp - Breaded",
        "name_vi": "Tôm thẻ chân trắng tẩm bột đông lạnh",
        "slug": "frozen-vannamei-shrimp-breaded",
        "short_desc_en": "Premium IQF breaded Vannamei shrimp, crisp golden coating, retail & food service ready.",
        "short_desc_vi": "Tôm thẻ chân trắng tẩm bột đông lạnh IQF cao cấp, lớp vỏ vàng giòn, sẵn sàng cho bán lẻ và nhà hàng.",
        "thumbnail_url": "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80",
        "product_type": "value_added",
        "is_featured": true,
        "category": {
          "id": 1,
          "name_en": "Shrimp",
          "name_vi": "Tôm",
          "slug": "shrimp"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 9,
      "total": 12,
      "totalPages": 2
    }
  }
}
```

#### 🔸 `GET /api/products/featured`
Lấy danh sách các sản phẩm nổi bật (`is_featured: true`) hiển thị trong phần "Our Premium Products" tại Trang Chủ.

- **Response JSON (200 OK)**: Trả về mảng `[ ...products ]` (Tối đa 8 sản phẩm nổi bật nhất).

#### 🔸 `GET /api/products/:slug`
Lấy chi tiết 1 sản phẩm kèm toàn bộ hình ảnh (`images` gallery) và bảng thông số kỹ thuật (`specifications`) đã được sắp xếp chuẩn thứ tự hiển thị.

- **URL Param**: `slug` (VD: `/api/products/frozen-vannamei-shrimp-breaded`)
- **Response JSON (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "category_id": 1,
    "name_en": "Frozen Vannamei Shrimp - Breaded",
    "name_vi": "Tôm thẻ chân trắng tẩm bột đông lạnh",
    "slug": "frozen-vannamei-shrimp-breaded",
    "description_en": "Sourced from ASC/BAP certified farms in Vietnam...",
    "description_vi": "Nguồn nguyên liệu từ các vùng nuôi đạt chứng nhận ASC/BAP tại Việt Nam...",
    "thumbnail_url": "https://images.unsplash.com/...",
    "product_type": "value_added",
    "category": {
      "id": 1,
      "name_en": "Shrimp",
      "name_vi": "Tôm"
    },
    "images": [
      {
        "id": 1,
        "image_url": "https://images.unsplash.com/...",
        "is_primary": true,
        "sort_order": 1
      }
    ],
    "specifications": [
      {
        "id": 1,
        "spec_key_en": "Scientific Name",
        "spec_key_vi": "Tên khoa học",
        "spec_value": "Litopenaeus vannamei",
        "sort_order": 1
      },
      {
        "id": 2,
        "spec_key_en": "Origin",
        "spec_key_vi": "Xuất xứ",
        "spec_value": "Vietnam (Farm-raised)",
        "sort_order": 2
      },
      {
        "id": 3,
        "spec_key_en": "Size / Counting",
        "spec_key_vi": "Kích cỡ",
        "spec_value": "16/20, 21/25, 26/30, 31/40 (pcs/lb or pcs/kg)",
        "sort_order": 3
      }
    ]
  }
}
```

---

### 2.3 Nhóm API Hệ Thống Báo Giá B2B (Inquiry System)

#### 🔸 `POST /api/inquiries/contact`
Gửi yêu cầu liên hệ nhanh từ Trang Liên Hệ (`Contact Us`).

- **Rate Limit**: Tối đa 10 request / 15 phút từ 1 địa chỉ IP.
- **Request Body (JSON)**:
```json
{
  "full_name": "John Smith",
  "company_name": "Global Seafoods Inc.",
  "email": "john@globalseafoods.com",
  "country": "United States",
  "whatsapp_number": "+1-555-0192",
  "interested_species": ["Vannamei Shrimp", "Black Tiger Shrimp"],
  "message": "Looking for 20ft container of IQF breaded shrimp for Q4 delivery."
}
```
*Lưu ý: `full_name`, `company_name`, `email`, `country` là bắt buộc.*

- **Response JSON (201 Created)**:
```json
{
  "success": true,
  "message": "Inquiry submitted successfully. We will get back to you within 24 working hours.",
  "data": {
    "id": 1,
    "inquiry_code": "GS-20260716-001",
    "status": "new"
  }
}
```

#### 🔸 `POST /api/inquiries/basket`
Gửi yêu cầu báo giá cho Giỏ hàng (`Inquiry Basket`). Đây là API quan trọng nhất cho luồng mua hàng B2B khi khách đã gom N sản phẩm vào danh sách quan tâm.

- **Request Body (JSON)**:
```json
{
  "full_name": "Elena Rostova",
  "job_title": "Procurement Manager",
  "company_name": "Vostok Seafood Trading",
  "email": "elena@vostokseafood.ru",
  "country": "Russia",
  "whatsapp_number": "+7-999-123-4567",
  "destination_port": "St. Petersburg Port",
  "message": "Need mixed container quote. Please include target freight rates.",
  "special_requirements": "All boxes must have Russian language labels and EAC conformity marks.",
  "attachment_url": "uploads/specs/spec-sheet-1784176444.pdf",
  "items": [
    {
      "product_id": 1,
      "product_name": "Frozen Vannamei Shrimp - Breaded",
      "quantity": 25,
      "specifications": "Size 16/20, IQF, Glazing 10%, Bulk carton 10kg",
      "notes": "Need ASC certificate copy attached with Proforma Invoice"
    },
    {
      "product_id": 4,
      "product_name": "Whole Cleaned Squid - Frozen",
      "quantity": 15,
      "specifications": "Size 8/12 cm, IQF, Glazing 5%, Block 7.5kg"
    }
  ]
}
```
*Lưu ý: `items` phải là mảng có ít nhất 1 phần tử (`min: 1`). `quantity` tính bằng số lượng thùng/tấn hoặc container tùy ghi chú.*

- **Response JSON (201 Created)**:
```json
{
  "success": true,
  "message": "Inquiry basket submitted successfully. We will get back to you within 24 working hours.",
  "data": {
    "id": 2,
    "inquiry_code": "GS-20260716-002",
    "status": "new",
    "itemCount": 2
  }
}
```

#### 🔸 `POST /api/upload`
Upload file đính kèm (Spec sheet của buyer, bảng yêu cầu đóng gói riêng, v.v.). FE nên gọi API này trước khi submit form báo giá nếu khách có chọn file.

- **Headers**: `Content-Type: multipart/form-data`
- **Form Data Field**: `file` (File tài liệu/hình ảnh, tối đa 10MB, chấp nhận: `.pdf`, `.doc`, `.docx`, `.xls`, `.xlsx`, `.jpg`, `.png`).
- **Response JSON (201 Created)**:
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "filename": "file-1784176444-123456789.pdf",
    "originalName": "buyer-specifications.pdf",
    "size": 245120,
    "url": "uploads/specs/file-1784176444-123456789.pdf"
  }
}
```
*FE lấy chuỗi `data.url` (`uploads/specs/...`) truyền vào trường `attachment_url` của API `/api/inquiries/basket`.*

---

## 💻 3. TYPESCRIPT INTERFACES CHUẨN CHO FRONTEND (`types/api.ts`)

FE Developer hãy copy trực tiếp đoạn code TypeScript này vào project (Next.js / React) để có full Type-Safety:

```typescript
// ==================== COMMON & PAGINATION ====================
export interface IApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IPaginatedResult<T> {
  products: T[];
  pagination: IPagination;
}

// ==================== CATEGORY ====================
export interface ICategory {
  id: number;
  name_en: string;
  name_vi: string;
  slug: string;
  icon_url: string | null;
  sort_order: number;
  is_active: boolean;
  productCount?: number;
}

// ==================== PRODUCT & SPECS ====================
export type ProductType = 'raw' | 'cooked' | 'value_added';

export interface IProductSpecification {
  id?: number;
  spec_key_en: string;
  spec_key_vi: string;
  spec_value: string;
  sort_order?: number;
}

export interface IProductImage {
  id?: number;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
}

export interface IProduct {
  id: number;
  category_id: number;
  name_en: string;
  name_vi: string;
  slug: string;
  short_desc_en: string | null;
  short_desc_vi: string | null;
  description_en?: string | null;
  description_vi?: string | null;
  thumbnail_url: string | null;
  product_type: ProductType;
  is_featured: boolean;
  is_active?: boolean;
  category?: ICategory;
  images?: IProductImage[];
  specifications?: IProductSpecification[];
}

// ==================== INQUIRY BASKET (CLIENT STATE & API) ====================
export interface IBasketItemState {
  product_id: number;
  product_name: string;
  product_slug: string;
  thumbnail_url: string | null;
  quantity?: number;
  specifications?: string; // Tóm tắt spec mà buyer chọn (VD: "Size 16/20, IQF, Glazing 10%")
  notes?: string;
}

export interface IInquiryBasketPayload {
  full_name: string;
  job_title?: string;
  company_name: string;
  email: string;
  country: string;
  whatsapp_number?: string;
  destination_port?: string;
  message?: string;
  special_requirements?: string;
  attachment_url?: string | null;
  items: {
    product_id: number;
    product_name?: string;
    quantity?: number;
    specifications?: string;
    notes?: string;
  }[];
}

export interface IInquiryResponse {
  id: number;
  inquiry_code: string;
  status: string;
  itemCount?: number;
}
```

---

## 🎨 4. HƯỚNG DẪN THIẾT KẾ & NGHIỆP VỤ UI/UX TỪNG TRANG (THEO EXCEL)

### 4.1 Ngôn ngữ & Tông màu (Colors & Aesthetics)
- **Tông màu chủ đạo (Primary)**: Xanh đại dương sâu (`#0b1d3a` hoặc `#0f172a`) — Thể hiện uy tín, hải sản đại dương.
- **Tông màu điểm nhấn (Secondary/Accent)**: Vàng Champagne / Vàng cát nhẹ (`#d97706` hoặc `#f59e0b`) — Thể hiện sự cao cấp, "Golden Seafood".
- **Khoảng trắng (Minimalism)**: Dùng nhiều khoảng thở (white space), card tách nền trắng/xám siêu nhẹ (`#f8fafc`).
- **Chế độ song ngữ (i18n)**: FE cần nút Toggle `EN / VI` trên Navbar. Khi chọn tiếng Anh, render các field `*_en` (`name_en`, `short_desc_en`). Khi chọn tiếng Việt, render `*_vi`.

---

### 4.2 Trang Sản Phẩm (Product Listing Page)

#### ⚡ Bộ lọc Thông minh bên trái (Left Sidebar Filter) — *Load dưới 1 giây, AJAX*
- **5 Danh mục cấp 1**: Fetch từ `GET /api/categories`. Hiển thị dạng list kèm badge số lượng (`productCount`). Khi click vào danh mục nào, gọi ngay `GET /api/products?category_id=<id>` mà không reload trang.
- **Bộ lọc thuộc tính (Attribute Checkboxes)**:
  - `[ ] Raw (Tươi sống)` (`type=raw`)
  - `[ ] Cooked (Hấp/Chín)` (`type=cooked`)
  - `[ ] Value-added / Breaded (Gia công sâu / Tẩm bột)` (`type=value_added`)

#### 📦 Grid Hiển thị Sản Phẩm (Product Grid Layout)
- **Layout**: 3 Sản phẩm / hàng (Desktop), 2 Sản phẩm / hàng (Tablet/Mobile).
- **Thẻ Sản phẩm (Product Card)**:
  - Hình ảnh sạch, tách nền.
  - Tên sản phẩm song ngữ (Ví dụ: `Frozen Vannamei Shrimp` ở trên chữ to, `Tôm thẻ chân trắng đông lạnh` chữ nhỏ bên dưới màu xám nhẹ).
- **🔥 Hiệu ứng Hover B2B (Mấu chốt theo Excel dòng 28)**:
  Khi khách rê chuột vào Product Card:
  1. Hình ảnh phóng to nhẹ (`scale: 1.05`, transition `300ms ease`).
  2. Viền khung chuyển sang màu Vàng Champagne mỏng (`border: 1px solid #f59e0b`).
  3. Xuất hiện nút hành động: **`+ Add to Inquiry List`** (hoặc `"Inquire Now"`).

---

### 4.3 Trang Chi Tiết Sản Phẩm (Product Detail Page)

Chia làm 2 cột chính (Desktop 12 columns: Cột Trái 5 col, Cột Phải 7 col):

#### 🖼️ Cột Trái: Image Gallery & Zoom
- Khung ảnh lớn ở trên, các thumbnails ở dưới.
- Tích hợp tính năng Zoom phóng to thớ thịt/lớp mạ băng khi rê chuột vào ảnh lớn.

#### 📝 Cột Phải: Thông tin & Bảng thông số (Specification Table)
- **Tên H1**: Chữ lớn màu Xanh đại dương đậm.
- **Mô tả ngắn**: 2-3 câu song ngữ giới thiệu ưu điểm nguồn hàng.
- **Bảng Thông Số Kỹ Thuật (`specifications`)**:
  - *Quy tắc CSS theo Excel dòng 42*: Thiết kế bảng sạch sẽ, **tuyệt đối không dùng đường kẻ dọc đen đậm**, chỉ dùng đường kẻ ngang mờ (`border-bottom: 1px solid #e2e8f0`), xen kẽ dòng trắng (`#ffffff`) và dòng xám rất nhạt (`#f8fafc`).
  - *Phân bổ cột*: Cột Trái hiển thị `spec_key_en` (nếu EN) hoặc `spec_key_vi` (nếu VI). Cột Phải hiển thị `spec_value`.
  - Mẫu bảng hiển thị:
    | Thuộc tính (Key) | Giá trị (Spec Value) |
    |---|---|
    | **Scientific Name** | *Litopenaeus vannamei* |
    | **Origin** | Vietnam (Farm-raised) |
    | **Size / Counting** | 16/20, 21/25, 26/30, 31/40 |
    | **Freezing Method** | IQF / Block Frozen (7.5kg Block) |
    | **Glazing** | 0%, 5%, 10%, 15%, 20% (As request) |
    | **Packaging** | Bulk carton 10kg, Inner bag, IVP |
    | **Certificates** | HACCP, BRC, ASC, BAP |

#### 🛒 Nút Hành Động Chi Tiết
Nút lớn màu xanh/vàng: **`+ Add to Inquiry Basket`** (Thêm vào danh sách báo giá). Khách có thể chọn nhanh Kích cỡ (Size) và Số lượng ước tính trước khi bấm thêm vào giỏ.

#### 🚢 Khối Call-out Container Hỗn Hợp (Mixed Container Footer)
Đặt ngay bên dưới bảng thông số kỹ thuật (Hardcode FE):
```html
<div class="bg-slate-900 text-white p-6 rounded-xl mt-8 border-l-4 border-amber-500 flex justify-between items-center flex-wrap gap-4">
  <div>
    <h4 class="text-lg font-bold text-amber-400">Looking for a flexible supply?</h4>
    <p class="text-slate-300 text-sm mt-1">
      We specialize in consolidating Mixed Containers (Shrimp, Fish, Cephalopods) to optimize your inventory and freight costs.
    </p>
  </div>
  <button onclick="openInquiryDrawer()" class="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-5 py-2.5 rounded-lg transition">
    Request Mixed Quote →
  </button>
</div>
```

---

### 4.4 Hệ Thống Giỏ Hàng Báo Giá Floating (Inquiry Basket Drawer)

Đây là tính năng B2B độc đáo nhất của Golden Seafood. Khách hàng xem qua các trang, bấm chọn Tôm, Mực, Cá vào chung 1 danh sách.

#### 1. Floating Icon ở góc phải màn hình (`fixed bottom-6 right-6 z-50`)
Một icon hình giỏ báo giá / container nhỏ kèm Badge màu đỏ/vàng hiển thị số lượng mặt hàng đang có trong giỏ (`items.length`). Khi bấm vào sẽ mở ra **Slide-over Drawer (Menu trượt từ phải sang)** hoặc Modal.

#### 2. Giao diện Drawer Giỏ Hàng
- **Phần 1: Danh sách món hàng đã chọn**:
  - Cho phép điều chỉnh số lượng (`quantity`).
  - Cho phép nhập ghi chú riêng cho từng món (`notes` - VD: *"Cần mạ băng 10%, đóng túi bao bì riêng cho siêu thị Nga"*).
  - Nút xóa món khỏi giỏ.
- **Phần 2: Form thông tin Buyer B2B**:
  - `full_name` (Họ tên buyer) - *Required*
  - `company_name` (Tên công ty nhập khẩu) - *Required*
  - `email` (Business Email) - *Required*
  - `country` (Quốc gia) - *Required*
  - `whatsapp_number` (Số WhatsApp / WeChat) - *Required cho B2B*
  - `destination_port` (Cảng đích đến - VD: `Rotterdam Port, Netherlands`)
  - `special_requirements` (Yêu cầu quy cách đóng gói, chứng từ riêng...)
  - **Upload Spec Sheet**: Input file cho phép buyer đính kèm file PDF/Excel yêu cầu của công ty họ (FE gọi `POST /api/upload` lấy URL trước).

#### 3. Sau Khi Submit (`POST /api/inquiries/basket` thành công)
Hệ thống hiển thị **Popup Chúc Mừng (Success Confirmation Modal)**:
- Hiển thị Mã Báo Giá tự động: **`GS-20260716-002`**.
- Thông báo: *"We have sent a confirmation email to elena@vostokseafood.ru. Our Sourcing Team will review your requirements and respond within 24 working hours."*
- **🔥 Nút Kết Nối Nhanh WhatsApp (Instant WhatsApp Connect theo Excel dòng 69)**:
  Hiển thị một nút lớn màu xanh lá cây:
  **`💬 Chat directly via WhatsApp with Sourcing Manager`**
  Link href: `https://wa.me/84900000000?text=Hi%20Golden%20Seafood,%20I%20have%20just%20submitted%20inquiry%20basket%20code%20GS-20260716-002.%20Please%20provide%20a%20quick%20quote.`

---

## 🛠️ 5. HƯỚNG DẪN STATE MANAGEMENT CHO GIỎ HÀNG (ZUSTAND / REDUX)

Để giữ danh sách món hàng trong giỏ khi khách chuyển trang từ Tôm sang Mực, FE bắt buộc phải dùng Client State Management có lưu vào `localStorage`. Dưới đây là gợi ý dùng **Zustand** (siêu nhẹ, chuẩn cho Next.js 14):

```bash
npm install zustand
```

**File `store/useInquiryStore.ts`**:
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IBasketItemState } from '@/types/api';

interface InquiryStore {
  items: IBasketItemState[];
  isOpenDrawer: boolean;
  addItem: (item: IBasketItemState) => void;
  removeItem: (productId: number) => void;
  updateItemQuantity: (productId: number, quantity: number) => void;
  updateItemNotes: (productId: number, notes: string) => void;
  clearBasket: () => void;
  toggleDrawer: (open?: boolean) => void;
}

export const useInquiryStore = create<InquiryStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpenDrawer: false,
      addItem: (item) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex(i => i.product_id === item.product_id);
        if (existingIndex > -1) {
          // Nếu đã có trong giỏ thì cộng số lượng
          const updated = [...currentItems];
          updated[existingIndex].quantity = (updated[existingIndex].quantity || 1) + (item.quantity || 1);
          set({ items: updated, isOpenDrawer: true });
        } else {
          set({ items: [...currentItems, { ...item, quantity: item.quantity || 1 }], isOpenDrawer: true });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter(i => i.product_id !== productId) });
      },
      updateItemQuantity: (productId, quantity) => {
        set({
          items: get().items.map(i => i.product_id === productId ? { ...i, quantity } : i)
        });
      },
      updateItemNotes: (productId, notes) => {
        set({
          items: get().items.map(i => i.product_id === productId ? { ...i, notes } : i)
        });
      },
      clearBasket: () => set({ items: [] }),
      toggleDrawer: (open) => set({ isOpenDrawer: open !== undefined ? open : !get().isOpenDrawer })
    }),
    {
      name: 'golden-seafood-inquiry-basket', // Tự động lưu localStorage
    }
  )
);
```

---

## 📅 6. KẾ HOẠCH & TIMELINE TRIỂN KHAI CHO FRONTEND (7 NGÀY)

FE Team có thể bám sát checklist dưới đây để hoàn thiện dự án đúng tiến độ và khớp 100% với Backend:

### 📍 Phase 1: Setup Project & Base Components (Ngày 1)
- [ ] Khởi tạo project Next.js 14 (App Router) hoặc Vite React + TailwindCSS.
- [ ] Cấu hình font chữ `Inter` & `Outfit` từ Google Fonts.
- [ ] Cấu hình biến môi trường (`NEXT_PUBLIC_API_BASE_URL`).
- [ ] Viết tiện ích API Client (`utils/apiClient.ts` sử dụng `axios` hoặc `fetch` có interceptor xử lý lỗi).
- [ ] Thiết lập hệ thống đa ngôn ngữ `i18n` (Anh - Việt) cho Header, Footer, Navigation.
- [ ] Xây dựng Navbar (Logo, Links, Language Toggle) & Footer B2B.

### 📍 Phase 2: State Management & Floating Inquiry Basket Drawer (Ngày 2)
- [ ] Cài đặt Zustand (`useInquiryStore`) kết nối `localStorage`.
- [ ] Tạo Component `FloatingBasketButton` hiển thị ở góc dưới màn hình kèm badge counter.
- [ ] Tạo Component `InquiryBasketDrawer` (Slide-over panel từ phải sang):
  - [ ] Render danh sách món `items` (Tăng giảm số lượng, nhập ghi chú riêng).
  - [ ] Form nhập thông tin Buyer B2B (`company_name`, `email`, `whatsapp_number`, `destination_port`...).
  - [ ] Logic gọi `POST /api/upload` (khi khách chọn spec file PDF) -> sau đó gọi `POST /api/inquiries/basket`.
  - [ ] Success Modal với `inquiry_code` + Nút `Chat directly via WhatsApp`.

### 📍 Phase 3: Trang Danh Mục & Danh Sách Sản Phẩm (Ngày 3 - 4)
- [ ] Component `ProductCard`: Render ảnh sạch, tên song ngữ, **Hover effect phóng to 5% + viền vàng + nút Add to Inquiry**.
- [ ] Trang `/products` (Listing Page):
  - [ ] Fetch danh sách danh mục `GET /api/categories` render Sidebar bên trái.
  - [ ] Bộ lọc Checkbox `Raw / Cooked / Value-added` + Thanh tìm kiếm song ngữ.
  - [ ] Gọi `GET /api/products` theo AJAX query parameters và render Grid 3 cột.
  - [ ] Tích hợp Phân trang (Pagination controls).

### 📍 Phase 4: Trang Chi Tiết Sản Phẩm (Ngày 5)
- [ ] Trang `/products/[slug]`: Gọi `GET /api/products/:slug`.
- [ ] Image Gallery bên trái với tính năng Zoom-in khi hover.
- [ ] Render Bảng Thông số Kỹ thuật (`specifications`) song ngữ bên phải (không viền dọc đen đậm, xen kẽ dòng xám/trắng).
- [ ] Nút `+ Add to Inquiry Basket` (truyền cả snapshot tên và quy cách đang chọn vào store).
- [ ] Component `Mixed Container Call-out` ở cuối trang chi tiết.

### 📍 Phase 5: Các Trang Tĩnh & Polish Core Web Vitals (Ngày 6 - 7)
- [ ] Trang Chủ (`/`):
  - [ ] Hero Banner sang trọng với nút CTA `"Contact Us | Download Catalog"`.
  - [ ] Section `"Our Premium Products"`: Gọi `GET /api/products/featured` render 6-8 sản phẩm nổi bật nhất.
  - [ ] Các section hardcode: Về chúng tôi, Quy trình 5 bước gia công, Chứng nhận nhà máy.
- [ ] Trang Dịch vụ Gia công (`/processing`): Hardcode song ngữ quy trình chế biến sâu cá thịt trắng, đóng gói màng lót Interleaved Block.
- [ ] Trang Chất lượng (`/quality`): Hero overlay QC inspector, hardcode quy trình kiểm tra 4 bước và chứng chỉ ASC/BAP/HACCP.
- [ ] Trang Liên Hệ (`/contact`): Form liên hệ gọi `POST /api/inquiries/contact` + Bản đồ & danh bạ Sourcing Team.
- [ ] Kiểm thử responsive (Mobile / Tablet / Desktop) & đo điểm Lighthouse (Mục tiêu > 95 điểm Performance).

---
*© 2026 Golden Seafood Co., Ltd — Technical Architecture Document for Frontend Engineering.*
