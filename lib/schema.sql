-- =========================================================================
-- CLOUDFLARE D1 SQL SCHEMA: Employee Lunch Feedback & Rating System
-- =========================================================================

-- 1. Menus Table (ตารางรายการอาหาร)
CREATE TABLE IF NOT EXISTS menus (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,          -- 'main', 'soup_curry', 'dessert', 'healthy_veg', 'drink_fruit'
  description TEXT,
  calories INTEGER DEFAULT 0,
  allergens TEXT,                  -- Comma-separated: 'Gluten,Egg,Peanut,Seafood,Dairy,None'
  image_url TEXT,
  date TEXT NOT NULL,              -- YYYY-MM-DD
  is_special BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Reviews Table (ตารางการประเมินและรีวิวอาหาร)
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  menu_id TEXT,
  menu_name TEXT NOT NULL,
  taste_score REAL NOT NULL,        -- 1 to 5
  hygiene_score REAL NOT NULL,      -- 1 to 5
  portion_score REAL NOT NULL,      -- 1 to 5
  value_score REAL NOT NULL,        -- 1 to 5
  overall_score REAL NOT NULL,      -- Average of 4 dimensions
  employee_name TEXT DEFAULT 'พนักงาน (ไม่ประสงค์ออกนาม)',
  department TEXT DEFAULT 'ทั่วไป',
  is_anonymous BOOLEAN DEFAULT 1,
  comment TEXT,
  tags TEXT,                        -- JSON or comma-separated tags like "อร่อยมาก,ร้อนกำลังดี,เค็มไปนิด"
  photo_url TEXT,
  helpful_count INTEGER DEFAULT 0,
  date TEXT NOT NULL,               -- YYYY-MM-DD
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Menu Votes Table (ตารางโหวตเมนูสำหรับสัปดาห์ถัดไป / Wishlist)
CREATE TABLE IF NOT EXISTS menu_votes (
  id TEXT PRIMARY KEY,
  dish_name TEXT NOT NULL,
  category TEXT NOT NULL,
  votes_count INTEGER DEFAULT 0,
  proposed_by TEXT DEFAULT 'พนักงาน',
  status TEXT DEFAULT 'active',     -- 'active', 'scheduled', 'completed'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Canteen Feedback / Issues Table (ตารางข้อเสนอแนะทั่วไปของโรงอาหาร)
CREATE TABLE IF NOT EXISTS canteen_feedbacks (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,          -- 'cleanliness', 'service', 'variety', 'air_conditioning', 'price'
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',   -- 'pending', 'in_progress', 'resolved'
  department TEXT DEFAULT 'ไม่ระบุ',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for lightning fast queries on Cloudflare D1
CREATE INDEX IF NOT EXISTS idx_menus_date ON menus(date);
CREATE INDEX IF NOT EXISTS idx_reviews_menu_id ON reviews(menu_id);
CREATE INDEX IF NOT EXISTS idx_reviews_date ON reviews(date);
CREATE INDEX IF NOT EXISTS idx_menu_votes_status ON menu_votes(status);
