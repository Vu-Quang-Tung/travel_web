# Travel Web - Ứng dụng đặt tour du lịch

Ứng dụng web du lịch toàn diện cho phép người dùng khám phá, đặt chỗ và thanh toán các tour du lịch. Bao gồm dashboard admin quản lý đầy đủ.

## 🎯 Tính năng chính

### Người dùng
- ✅ Đăng ký, đăng nhập, xác minh email
- ✅ Quên mật khẩu và đặt lại mật khẩu
- ✅ Duyệt danh sách tour với bộ lọc theo danh mục
- ✅ Xem chi tiết tour với lịch trình, hình ảnh
- ✅ Đặt tour với nhiều loại khách (người lớn/trẻ em)
- ✅ Xem lịch sử booking và trạng thái thanh toán
- ✅ Tạo thanh toán cho booking
- ✅ Đánh giá và bình luận tour

### Admin
- ✅ Quản lý danh mục tour (CRUD)
- ✅ Quản lý điểm đến (CRUD)
- ✅ Quản lý tour (CRUD) với hình ảnh, lịch trình, schedule
- ✅ Quản lý lịch trình ngày (itinerary)
- ✅ Quản lý hình ảnh tour
- ✅ Quản lý lịch khởi hành (schedule) và giá cả
- ✅ Xem và xóa reviews
- ✅ Xem lịch sử thanh toán

## 🛠️ Công nghệ sử dụng

### Frontend
- **React** 19 - UI library
- **Vite** - Build tool
- **React Router** v7 - Routing
- **CSS3** - Styling

### Backend
- **Node.js** + **Express.js** 5 - Web server
- **MySQL** 8 - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Multer** - File upload
- **mysql2** - Database driver

## 📋 Cấu trúc thư mục

```
Travel_web/
├── client/              # Frontend React
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components (20+)
│   │   ├── services/    # API services
│   │   ├── context/     # Auth context
│   │   └── App.jsx      # Main app
│   └── package.json
├── server/              # Backend Express
│   ├── src/
│   │   ├── controllers/ # Route handlers
│   │   ├── routers/     # Route definitions
│   │   ├── middleware/  # Auth & upload middleware
│   │   ├── utils/       # Utilities (JWT, email, etc)
│   │   ├── config/      # Database config
│   │   ├── app.js       # Express app
│   │   └── server.js    # Server entry point
│   ├── database/
│   │   ├── schema.sql   # Database schema
│   │   └── data.sql     # Sample data
│   ├── uploads/         # User uploaded files
│   └── package.json
└── README.md
```

## 🚀 Hướng dẫn cài đặt

### Yêu cầu
- Node.js 16+
- MySQL 8+
- npm hoặc yarn

### 1. Clone repository
```bash
git clone <repository-url>
cd Travel_web
```

### 2. Setup Database

#### Tạo database
```bash
mysql -u root -p < server/database/schema.sql
```

#### Import dữ liệu mẫu (tuỳ chọn)
```bash
mysql -u root -p travel < server/database/data.sql
```

### 3. Setup Backend
```bash
cd server

# Install dependencies
npm install

# Tạo file .env (sao chép từ .env.example nếu có)
# Cập nhật các biến môi trường:
# DB_HOST, DB_USER, DB_PASSWORD, JWT_SECRET, MAIL_USER, MAIL_PASS, etc.

# Chạy server
npm run start
```

Server chạy tại: `http://localhost:5000`

### 4. Setup Frontend
```bash
cd client

# Install dependencies
npm install

# Chạy development server
npm run dev
```

Frontend chạy tại: `http://localhost:5173`

## 🔐 Biến môi trường

### Server (.env)
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=travel
DB_PORT=3306

# Server
PORT=5000
CLIENT_URL=http://localhost:5173

# JWT
JWT_SECRET=your_secret_key

# Email (Gmail)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
MAIL_FROM=your_email@gmail.com
```

## 👤 Tài khoản Test

### Admin
```
Email: admin@travel.local
Password: 123456
```

### Người dùng (Customer)
```
Email: nguyenvana@example.com
Password: 123456
```

```
Email: tranthib@example.com
Password: 123456
```

```
Email: levanc@example.com
Password: 123456
```

## 📊 API Documentation

### Public APIs
```
GET /api/tours              - Danh sách tour
GET /api/tours/:slug        - Chi tiết tour
GET /api/tours?category=... - Tour theo danh mục
GET /api/destinations       - Danh sách điểm đến
GET /api/destinations/:slug - Chi tiết điểm đến
GET /api/categories         - Danh mục tour
```

### Auth APIs
```
POST /api/auth/register           - Đăng ký
POST /api/auth/login              - Đăng nhập
POST /api/auth/verify-email       - Xác minh email
POST /api/auth/forgot-password    - Quên mật khẩu
POST /api/auth/reset-password     - Đặt lại mật khẩu
```

### User APIs (cần authentication)
```
GET  /api/user/profile            - Hồ sơ người dùng
PUT  /api/user/profile            - Cập nhật hồ sơ
PUT  /api/user/password           - Đổi mật khẩu
GET  /api/bookings                - Booking của user
POST /api/bookings                - Tạo booking
GET  /api/bookings/:code          - Chi tiết booking
GET  /api/payments                - Lịch sử thanh toán
POST /api/payments                - Tạo thanh toán
POST /api/reviews                 - Tạo review
```

### Admin APIs (cần admin role)
```
GET    /api/admin/tours           - Danh sách tour (admin)
POST   /api/admin/tours           - Tạo tour
GET    /api/admin/tours/:id       - Chi tiết tour
PUT    /api/admin/tours/:id       - Cập nhật tour
DELETE /api/admin/tours/:id       - Xóa tour
POST   /api/admin/tours/:id/schedules    - Thêm schedule
POST   /api/admin/tours/:id/itineraries - Thêm itinerary
POST   /api/admin/tours/:id/images      - Thêm hình ảnh

# Tương tự cho destinations, categories, reviews, payments
```

## 🎨 Các trang chính

### Public Pages
- `/` - Trang chủ
- `/about` - Giới thiệu
- `/contact` - Liên hệ
- `/categories` - Danh mục
- `/tours` - Danh sách tour
- `/tours/:slug` - Chi tiết tour
- `/destinations` - Danh sách điểm đến
- `/destinations/:slug` - Chi tiết điểm đến

### Auth Pages
- `/login` - Đăng nhập
- `/register` - Đăng ký
- `/forgot-password` - Quên mật khẩu
- `/reset-password?token=...` - Đặt lại mật khẩu
- `/verify-email?token=...` - Xác minh email

### User Pages (cần login)
- `/account` - Quản lý tài khoản
- `/bookings` - Danh sách booking
- `/bookings/:code` - Chi tiết booking
- `/payments` - Lịch sử thanh toán

### Admin Pages (cần admin role)
- `/admin` - Admin Dashboard

## 📦 Dữ liệu mẫu

### Tours
- Da Nang Beach Escape
- Ha Long Luxury Cruise
- Da Lat Chill Journey
- Hoi An Ancient Town Experience
- Nha Trang Diving Paradise
- Sapa Trekking Adventure
- Phu Quoc Island Getaway
- Ho Chi Minh City Food Tour
- Da Nang Wellness Retreat

### Destinations
- Da Nang (Đà Nẵng)
- Ha Long (Hạ Long)
- Da Lat (Đà Lạt)
- Ho Chi Minh City (TP.HCM)
- Hoi An (Hội An)
- Nha Trang (Nha Trang)
- Sapa (Sa Pa)
- Phu Quoc (Phú Quốc)

### Categories
- Nghi dưỡng (Relaxation)
- Khám phá (Exploration)
- Gia đình (Family)
- Cao cấp (Luxury)
- Adventure
- Culture
- Food & Wine
- Wellness

## 🧪 Testing

### Lint Frontend
```bash
cd client
npx eslint src/ --max-warnings=0
```

### Build Frontend
```bash
cd client
npm run build
```

### Test Database
```bash
mysql -u root -p
USE travel;
SELECT * FROM tours;
SELECT * FROM bookings;
```

## 📝 Ghi chú phát triển

- **Database**: Foreign keys được enable, constraints kiểm tra dữ liệu
- **Auth**: JWT tokens hết hạn sau 7 ngày
- **Upload**: Multer hỗ trợ upload avatar, hình ảnh tour
- **Email**: Nodemailer gửi email xác minh và reset password
- **Admin**: Role-based access control (RBAC)

## 🐛 Troubleshooting

### MySQL connection error
```
Kiểm tra DB_HOST, DB_USER, DB_PASSWORD trong .env
```

### Email không gửi được
```
Bật "Less secure app access" cho Gmail
Hoặc dùng "App Passwords" nếu bật 2FA
```

### Port 5000 hoặc 5173 đã được sử dụng
```
Thay đổi PORT trong .env (server)
hoặc dùng --port flag (client)
```

## 📄 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.

## ✉️ Liên hệ

Nếu có câu hỏi hoặc phản hồi, vui lòng liên hệ:
- Email: a41673vuquangtung@gmail.com
- GitHub: [Your GitHub URL]
