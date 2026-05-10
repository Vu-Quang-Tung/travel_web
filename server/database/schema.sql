-- Travel Web schema definition
-- Thiết lập database travel và các bảng liên quan.

CREATE DATABASE IF NOT EXISTS travel
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE travel;

ALTER DATABASE travel
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

SET NAMES utf8mb4;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS booking_travelers;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS tour_schedules;
DROP TABLE IF EXISTS tour_itineraries;
DROP TABLE IF EXISTS tour_images;
DROP TABLE IF EXISTS tours;
DROP TABLE IF EXISTS destinations;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(30) NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500) NULL,
  email_verified TINYINT NOT NULL DEFAULT 0,
  email_verify_token_hash VARCHAR(255) NULL,
  email_verify_expires DATETIME NULL,
  password_reset_token_hash VARCHAR(255) NULL,
  password_reset_expires DATETIME NULL,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB;

CREATE TABLE categories (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(140) NOT NULL,
  description TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_categories_slug (slug),
  UNIQUE KEY uq_categories_name (name)
) ENGINE=InnoDB;

CREATE TABLE destinations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(170) NOT NULL,
  country VARCHAR(120) NOT NULL,
  city VARCHAR(120) NULL,
  short_description VARCHAR(300) NULL,
  description TEXT NULL,
  hero_image_url VARCHAR(500) NULL,
  best_season VARCHAR(120) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_destinations_slug (slug)
) ENGINE=InnoDB;

CREATE TABLE tours (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id BIGINT UNSIGNED NOT NULL,
  destination_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(180) NOT NULL,
  slug VARCHAR(200) NOT NULL,
  summary VARCHAR(300) NULL,
  description LONGTEXT NULL,
  duration_days SMALLINT UNSIGNED NOT NULL,
  duration_nights SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  meeting_point VARCHAR(255) NULL,
  max_guests SMALLINT UNSIGNED NULL,
  difficulty_level ENUM('easy', 'moderate', 'hard') NOT NULL DEFAULT 'easy',
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
  featured TINYINT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_tours_slug (slug),
  KEY idx_tours_category (category_id),
  KEY idx_tours_destination (destination_id),
  CONSTRAINT fk_tours_category FOREIGN KEY (category_id) REFERENCES categories(id),
  CONSTRAINT fk_tours_destination FOREIGN KEY (destination_id) REFERENCES destinations(id)
) ENGINE=InnoDB;

CREATE TABLE tour_images (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tour_id BIGINT UNSIGNED NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255) NULL,
  is_cover TINYINT NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_tour_images_tour (tour_id),
  CONSTRAINT fk_tour_images_tour FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE tour_itineraries (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tour_id BIGINT UNSIGNED NOT NULL,
  day_number SMALLINT UNSIGNED NOT NULL,
  title VARCHAR(180) NOT NULL,
  description TEXT NULL,
  meals VARCHAR(100) NULL,
  accommodation VARCHAR(180) NULL,
  transport VARCHAR(180) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_tour_itineraries_day (tour_id, day_number),
  CONSTRAINT fk_tour_itineraries_tour FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE tour_schedules (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tour_id BIGINT UNSIGNED NOT NULL,
  code VARCHAR(50) NOT NULL,
  departure_date DATE NOT NULL,
  return_date DATE NOT NULL,
  booking_deadline DATE NULL,
  seats_total SMALLINT UNSIGNED NOT NULL,
  seats_available SMALLINT UNSIGNED NOT NULL,
  base_price DECIMAL(12,2) NOT NULL,
  child_price DECIMAL(12,2) NULL,
  currency CHAR(3) NOT NULL DEFAULT 'VND',
  status ENUM('open', 'sold_out', 'closed', 'cancelled') NOT NULL DEFAULT 'open',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_tour_schedules_code (code),
  KEY idx_tour_schedules_tour_date (tour_id, departure_date),
  CONSTRAINT fk_tour_schedules_tour FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
  CONSTRAINT chk_tour_schedules_dates CHECK (return_date >= departure_date),
  CONSTRAINT chk_tour_schedules_deadline CHECK (booking_deadline IS NULL OR booking_deadline <= departure_date),
  CONSTRAINT chk_tour_schedules_seats CHECK (seats_available <= seats_total),
  CONSTRAINT chk_tour_schedules_prices CHECK (base_price >= 0 AND (child_price IS NULL OR child_price >= 0))
) ENGINE=InnoDB;

CREATE TABLE bookings (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_code VARCHAR(40) NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  tour_schedule_id BIGINT UNSIGNED NOT NULL,
  contact_name VARCHAR(150) NOT NULL,
  contact_email VARCHAR(190) NOT NULL,
  contact_phone VARCHAR(30) NOT NULL,
  adult_count SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  child_count SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  subtotal_amount DECIMAL(12,2) NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  special_requests TEXT NULL,
  status ENUM('pending', 'confirmed', 'paid', 'cancelled', 'completed') NOT NULL DEFAULT 'pending',
  payment_status ENUM('unpaid', 'paid', 'refunded') NOT NULL DEFAULT 'unpaid',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_bookings_code (booking_code),
  KEY idx_bookings_user (user_id),
  KEY idx_bookings_schedule (tour_schedule_id),
  CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_bookings_schedule FOREIGN KEY (tour_schedule_id) REFERENCES tour_schedules(id),
  CONSTRAINT chk_bookings_guest_count CHECK (adult_count + child_count > 0),
  CONSTRAINT chk_bookings_amounts CHECK (subtotal_amount >= 0 AND total_amount >= 0)
) ENGINE=InnoDB;

CREATE TABLE booking_travelers (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_id BIGINT UNSIGNED NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  traveler_type ENUM('adult', 'child') NOT NULL DEFAULT 'adult',
  gender ENUM('male', 'female', 'other') NULL,
  date_of_birth DATE NULL,
  passport_number VARCHAR(80) NULL,
  nationality VARCHAR(120) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_booking_travelers_booking (booking_id),
  CONSTRAINT fk_booking_travelers_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE payments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_id BIGINT UNSIGNED NOT NULL,
  payment_method ENUM('bank_transfer', 'cash', 'card', 'momo', 'zalopay', 'vnpay') NOT NULL,
  transaction_code VARCHAR(100) NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'VND',
  status ENUM('pending', 'success', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  paid_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_payments_booking (booking_id),
  CONSTRAINT fk_payments_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  CONSTRAINT chk_payments_amount CHECK (amount >= 0)
) ENGINE=InnoDB;

CREATE TABLE reviews (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  tour_id BIGINT UNSIGNED NOT NULL,
  rating TINYINT UNSIGNED NOT NULL,
  title VARCHAR(180) NULL,
  content TEXT NULL,
  is_published TINYINT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_reviews_tour (tour_id),
  KEY idx_reviews_user (user_id),
  CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT fk_reviews_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_reviews_tour FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO users (full_name, email, phone, password_hash, email_verified, status, role) VALUES
  (
    'Admin Travel',
    'admin@travel.local',
    '0900000000',
    '$2b$10$HPsqcaYHKqol8CXaSPBh/.Ug8GFK5YysKQWR2Jo3XRd6XabLYgw/O',
    1,
    'active',
    'admin'
  );

INSERT INTO categories (name, slug, description) VALUES
  ('Nghi duong', 'nghi-duong', 'Tour nghi duong va resort'),
  ('Kham pha', 'kham-pha', 'Tour trai nghiem va adventure'),
  ('Gia dinh', 'gia-dinh', 'Tour phu hop gia dinh'),
  ('Cao cap', 'cao-cap', 'Tour cao cap va private');

INSERT INTO destinations (
  name,
  slug,
  country,
  city,
  short_description,
  description,
  hero_image_url,
  best_season
) VALUES
  (
    'Da Nang',
    'da-nang',
    'Viet Nam',
    'Da Nang',
    'Bien dep va resort cao cap',
    'Da Nang la diem den noi bat voi bai bien dep, resort chat luong cao va nhieu diem tham quan.',
    '/uploads/destinations/da-nang.jpg',
    'Thang 3 - Thang 8'
  ),
  (
    'Ha Long',
    'ha-long',
    'Viet Nam',
    'Quang Ninh',
    'Du thuyen va canh quan ky vi',
    'Ha Long noi tieng voi vinh bien dep, du thuyen sang trong va nhieu trai nghiem thu vi.',
    '/uploads/destinations/ha-long.jpg',
    'Thang 10 - Thang 4'
  ),
  (
    'Da Lat',
    'da-lat',
    'Viet Nam',
    'Lam Dong',
    'Khi hau lanh va khung canh lang man',
    'Da Lat phu hop cho nghi duong, check-in, thuong thuc cafe va tan huong khong khi mat me.',
    '/uploads/destinations/da-lat.jpg',
    'Quanh nam'
  );

INSERT INTO tours (
  category_id,
  destination_id,
  title,
  slug,
  summary,
  description,
  duration_days,
  duration_nights,
  meeting_point,
  max_guests,
  difficulty_level,
  status,
  featured
) VALUES
  (
    1,
    1,
    'Da Nang Beach Escape',
    'da-nang-beach-escape',
    'Nghi duong bien cao cap tai Da Nang',
    'Hanh trinh nghi duong ket hop resort, am thuc va tham quan cac diem noi bat tai Da Nang.',
    3,
    2,
    'San bay Da Nang',
    20,
    'easy',
    'published',
    1
  ),
  (
    4,
    2,
    'Ha Long Luxury Cruise',
    'ha-long-luxury-cruise',
    'Du thuyen cao cap tren vinh Ha Long',
    'Trai nghiem du thuyen cao cap, thuong thuc hai san va ngam canh dep tren vinh Ha Long.',
    2,
    1,
    'Cang tau Ha Long',
    30,
    'easy',
    'published',
    1
  ),
  (
    2,
    3,
    'Da Lat Chill Journey',
    'da-lat-chill-journey',
    'Hanh trinh thu gian giua rung thong va khong khi lanh',
    'Tour danh cho nhom ban tre, cap doi hoac gia dinh nho muon tan huong khong gian Da Lat.',
    3,
    2,
    'Trung tam Da Lat',
    15,
    'easy',
    'published',
    0
  );

INSERT INTO tour_images (tour_id, image_url, alt_text, is_cover, sort_order) VALUES
  (1, '/uploads/tours/da-nang-1.jpg', 'Tour Da Nang', 1, 1),
  (1, '/uploads/tours/da-nang-2.jpg', 'Resort Da Nang', 0, 2),
  (2, '/uploads/tours/ha-long-1.jpg', 'Tour Ha Long', 1, 1),
  (2, '/uploads/tours/ha-long-2.jpg', 'Du thuyen Ha Long', 0, 2),
  (3, '/uploads/tours/da-lat-1.jpg', 'Tour Da Lat', 1, 1),
  (3, '/uploads/tours/da-lat-2.jpg', 'Canh dep Da Lat', 0, 2);

INSERT INTO tour_itineraries (
  tour_id,
  day_number,
  title,
  description,
  meals,
  accommodation,
  transport
) VALUES
  (1, 1, 'Den Da Nang va nhan phong', 'Don khach tai san bay, dua ve khach san nhan phong va tu do nghi ngoi tam bien.', 'Toi', 'Resort 4 sao', 'Xe dua don'),
  (1, 2, 'Tham quan Ba Na Hills', 'Di cap treo, tham quan Cau Vang, vui choi va chup anh tai Ba Na Hills.', 'Sang, Trua', 'Resort 4 sao', 'Xe du lich'),
  (1, 3, 'Mua sam va ket thuc tour', 'Tu do mua sam dac san, tra phong va dua ra san bay.', 'Sang', NULL, 'Xe dua san bay'),
  (2, 1, 'Len du thuyen Ha Long', 'Check-in du thuyen, an trua, tham quan hang dong va thuong thuc bua toi tren tau.', 'Trua, Toi', 'Du thuyen 5 sao', 'Xe + du thuyen'),
  (2, 2, 'Ngam binh minh va tro ve', 'Tap thai cuc buoi sang, an sang va quay tro lai ben tau.', 'Sang, Trua', NULL, 'Du thuyen'),
  (3, 1, 'Den Da Lat', 'Nhan phong, tham quan quan cafe dep va dao cho dem Da Lat.', 'Toi', 'Khach san trung tam', 'Xe dua don'),
  (3, 2, 'Lang hoa va doi che', 'Tham quan nhung diem check-in noi bat, vuon hoa va doi che xanh mat.', 'Sang, Trua', 'Khach san trung tam', 'Xe du lich'),
  (3, 3, 'Tu do va ket thuc hanh trinh', 'Mua sam dac san, tra phong va ket thuc tour.', 'Sang', NULL, 'Xe dua don');

INSERT INTO tour_schedules (
  tour_id,
  code,
  departure_date,
  return_date,
  booking_deadline,
  seats_total,
  seats_available,
  base_price,
  child_price,
  currency,
  status
) VALUES
  (1, 'DN-2026-05-01', '2026-05-01', '2026-05-03', '2026-04-25', 20, 12, 4500000, 3200000, 'VND', 'open'),
  (1, 'DN-2026-06-10', '2026-06-10', '2026-06-12', '2026-06-03', 20, 18, 4700000, 3300000, 'VND', 'open'),
  (2, 'HL-2026-05-15', '2026-05-15', '2026-05-16', '2026-05-10', 30, 20, 7200000, 4900000, 'VND', 'open'),
  (3, 'DL-2026-05-20', '2026-05-20', '2026-05-22', '2026-05-15', 15, 10, 3900000, 2800000, 'VND', 'open');
