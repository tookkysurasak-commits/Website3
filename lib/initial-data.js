export const MENU_CATEGORIES = [
  { id: 'all', name: 'ทั้งหมด', icon: 'UtensilsCrossed' },
  { id: 'main', name: 'อาหารจานหลัก / ผัด-ทอด', icon: 'Flame' },
  { id: 'soup_curry', name: 'แกง / ต้มยำ / ซุป', icon: 'Soup' },
  { id: 'healthy_veg', name: 'เพื่อสุขภาพ / คลีน / สลัด', icon: 'Salad' },
  { id: 'dessert', name: 'ของหวาน / ขนมไทย', icon: 'IceCream' },
  { id: 'drink_fruit', name: 'ผลไม้ / เครื่องดื่ม', icon: 'Apple' },
];

export const ALLERGEN_OPTIONS = [
  { id: 'Gluten', label: 'กลูเตน/แป้งสาลี', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 'Egg', label: 'ไข่ไก่', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { id: 'Peanut', label: 'ถั่วลิสง', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { id: 'Seafood', label: 'อาหารทะเล/กุ้ง/ปู', color: 'bg-red-100 text-red-800 border-red-200' },
  { id: 'Dairy', label: 'นม/เนย', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 'Pork', label: 'เนื้อหมู', color: 'bg-rose-100 text-rose-800 border-rose-200' },
  { id: 'None', label: 'ไม่มีสารก่อภูมิแพ้หลัก', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
];

export const QUICK_TAGS = [
  { id: 'delicious', label: '😋 อร่อยกลมกล่อม', sentiment: 'positive' },
  { id: 'hot', label: '♨️ ร้อนกำลังดี', sentiment: 'positive' },
  { id: 'big_portion', label: '🍚 ให้เยอะจุใจ', sentiment: 'positive' },
  { id: 'clean', label: '✨ สะอาดถูกสุขอนามัย', sentiment: 'positive' },
  { id: 'fresh', label: '🌿 วัตถุดิบสดใหม่', sentiment: 'positive' },
  { id: 'spicy', label: '🌶️ เผ็ดจัดจ้านสะใจ', sentiment: 'neutral' },
  { id: 'too_salty', label: '🧂 เค็มไปนิดนึง', sentiment: 'negative' },
  { id: 'too_sweet', label: '🍯 หวานเกินไปหน่อย', sentiment: 'negative' },
  { id: 'cold', label: '❄️ อาหารไม่ค่อยร้อน', sentiment: 'negative' },
  { id: 'small_portion', label: '🤏 ให้น้อยไปนิด', sentiment: 'negative' },
  { id: 'hard_rice', label: '🌾 ข้าวค่อนข้างแข็ง', sentiment: 'negative' },
];

export const DAYS_OF_WEEK = [
  { 
    id: 'all', 
    name: 'ทุกวัน (จันทร์ - เสาร์)', 
    short: 'ทั้งหมด', 
    dayNum: 0, 
    color: 'bg-slate-900 text-white',
    activeBtn: 'bg-slate-900 text-white shadow-md shadow-slate-900/20',
    cardBg: 'bg-white',
    borderColor: 'border-slate-200/90 hover:border-orange-300 shadow-sm',
    badge: 'bg-slate-900 text-white font-bold',
    accentText: 'text-slate-800',
    dotColor: 'bg-slate-400'
  },
  { 
    id: '1', 
    name: 'วันจันทร์', 
    short: 'จันทร์', 
    dayNum: 1, 
    color: 'bg-amber-400 text-amber-950',
    activeBtn: 'bg-amber-400 text-amber-950 shadow-md shadow-amber-400/30 ring-2 ring-amber-400',
    cardBg: 'bg-gradient-to-b from-amber-50/90 via-yellow-50/40 to-white',
    borderColor: 'border-amber-300 hover:border-amber-400 hover:shadow-amber-500/15 shadow-sm',
    badge: 'bg-amber-400 text-amber-950 border-amber-300 font-black',
    accentText: 'text-amber-700',
    dotColor: 'bg-amber-400',
    dayHeader: 'bg-amber-100/90 text-amber-900 border-b border-amber-200'
  },
  { 
    id: '2', 
    name: 'วันอังคาร', 
    short: 'อังคาร', 
    dayNum: 2, 
    color: 'bg-pink-500 text-white',
    activeBtn: 'bg-pink-500 text-white shadow-md shadow-pink-500/30 ring-2 ring-pink-400',
    cardBg: 'bg-gradient-to-b from-pink-50/90 via-rose-50/40 to-white',
    borderColor: 'border-pink-300 hover:border-pink-400 hover:shadow-pink-500/15 shadow-sm',
    badge: 'bg-pink-500 text-white border-pink-400 font-black',
    accentText: 'text-pink-700',
    dotColor: 'bg-pink-500',
    dayHeader: 'bg-pink-100/90 text-pink-900 border-b border-pink-200'
  },
  { 
    id: '3', 
    name: 'วันพุธ', 
    short: 'พุธ', 
    dayNum: 3, 
    color: 'bg-emerald-500 text-white',
    activeBtn: 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 ring-2 ring-emerald-400',
    cardBg: 'bg-gradient-to-b from-emerald-50/90 via-green-50/40 to-white',
    borderColor: 'border-emerald-300 hover:border-emerald-400 hover:shadow-emerald-500/15 shadow-sm',
    badge: 'bg-emerald-500 text-white border-emerald-400 font-black',
    accentText: 'text-emerald-700',
    dotColor: 'bg-emerald-500',
    dayHeader: 'bg-emerald-100/90 text-emerald-900 border-b border-emerald-200'
  },
  { 
    id: '4', 
    name: 'วันพฤหัสบดี', 
    short: 'พฤหัสบดี', 
    dayNum: 4, 
    color: 'bg-orange-500 text-white',
    activeBtn: 'bg-orange-500 text-white shadow-md shadow-orange-500/30 ring-2 ring-orange-400',
    cardBg: 'bg-gradient-to-b from-orange-50/90 via-amber-50/40 to-white',
    borderColor: 'border-orange-300 hover:border-orange-400 hover:shadow-orange-500/15 shadow-sm',
    badge: 'bg-orange-500 text-white border-orange-400 font-black',
    accentText: 'text-orange-700',
    dotColor: 'bg-orange-500',
    dayHeader: 'bg-orange-100/90 text-orange-900 border-b border-orange-200'
  },
  { 
    id: '5', 
    name: 'วันศุกร์', 
    short: 'ศุกร์', 
    dayNum: 5, 
    color: 'bg-sky-500 text-white',
    activeBtn: 'bg-sky-500 text-white shadow-md shadow-sky-500/30 ring-2 ring-sky-400',
    cardBg: 'bg-gradient-to-b from-sky-50/90 via-blue-50/40 to-white',
    borderColor: 'border-sky-300 hover:border-sky-400 hover:shadow-sky-500/15 shadow-sm',
    badge: 'bg-sky-500 text-white border-sky-400 font-black',
    accentText: 'text-sky-700',
    dotColor: 'bg-sky-500',
    dayHeader: 'bg-sky-100/90 text-sky-900 border-b border-sky-200'
  },
  { 
    id: '6', 
    name: 'วันเสาร์', 
    short: 'เสาร์', 
    dayNum: 6, 
    color: 'bg-purple-500 text-white',
    activeBtn: 'bg-purple-500 text-white shadow-md shadow-purple-500/30 ring-2 ring-purple-400',
    cardBg: 'bg-gradient-to-b from-purple-50/90 via-violet-50/40 to-white',
    borderColor: 'border-purple-300 hover:border-purple-400 hover:shadow-purple-500/15 shadow-sm',
    badge: 'bg-purple-500 text-white border-purple-400 font-black',
    accentText: 'text-purple-700',
    dotColor: 'bg-purple-500',
    dayHeader: 'bg-purple-100/90 text-purple-900 border-b border-purple-200'
  },
];

export const getMenuDayInfo = (dateStr) => {
  if (!dateStr) return DAYS_OF_WEEK[1]; // default Monday
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return DAYS_OF_WEEK[1];
  const jsDay = d.getDay(); // 0 is Sun, 1 is Mon, 6 is Sat
  const dayNum = jsDay === 0 ? 7 : jsDay;
  const found = DAYS_OF_WEEK.find(day => day.dayNum === jsDay);
  if (found) return { ...found, dayNum };
  return { 
    dayNum, 
    name: jsDay === 0 ? 'วันอาทิตย์' : `วัน${['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'][jsDay]}`,
    short: jsDay === 0 ? 'อาทิตย์' : ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'][jsDay],
    badge: 'bg-rose-500 text-white font-bold',
    cardBg: 'bg-gradient-to-b from-rose-50/90 via-red-50/40 to-white',
    borderColor: 'border-rose-300 hover:border-rose-400 hover:shadow-rose-500/15 shadow-sm',
    accentText: 'text-rose-700',
    dotColor: 'bg-rose-500',
    dayHeader: 'bg-rose-100/90 text-rose-900 border-b border-rose-200'
  };
};

export const INITIAL_MENUS = [
  {
    id: 'm-01',
    name: 'ข้าวกะเพราหมูกรอบไข่ดาวลาวา',
    category: 'main',
    description: 'หมูกรอบคัดพิเศษ ผัดกะเพราพริกแห้งหอมกลิ่นกระทะ เสิร์ฟพร้อมไข่ดาวเป็ดเยิ้มๆ',
    calories: 680,
    allergens: ['Gluten', 'Egg', 'Pork'],
    image_url: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80',
    date: '2026-08-24',
    is_special: true,
    rating_avg: 4.8,
    reviews_count: 38,
    station: 'ซุ้มตามสั่งจานด่วน (เชฟสมชาย)'
  },
  {
    id: 'm-02',
    name: 'ต้มยำกุ้งน้ำข้นยอดมะพร้าวอ่อน',
    category: 'soup_curry',
    description: 'กุ้งแชบ๊วยตัวโต ซุปต้มยำหอมเครื่องสมุนไพร ข่า ตะไคร้ ใบมะกรูด และนมข้นสดแท้',
    calories: 340,
    allergens: ['Seafood', 'Dairy'],
    image_url: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&w=800&q=80',
    date: '2026-08-25',
    is_special: true,
    rating_avg: 4.6,
    reviews_count: 29,
    station: 'ซุ้มต้มแกงไทยแท้ (ป้าสมร)'
  },
  {
    id: 'm-03',
    name: 'สลัดอกไก่นุ่มย่างพริกไทยดำ & อะโวคาโด',
    category: 'healthy_veg',
    description: 'อกไก่หมักสมุนไพรย่างเตาถ่าน ผักไฮโดรโปนิกส์สดกรอบ 5 ชนิด น้ำสลัดงาญี่ปุ่นโฮมเมด',
    calories: 310,
    allergens: ['Gluten'],
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    date: '2026-08-26',
    is_special: false,
    rating_avg: 4.5,
    reviews_count: 22,
    station: 'ซุ้ม Healthy & Clean Corner'
  },
  {
    id: 'm-04',
    name: 'แกงเขียวหวานไก่ยอดมะพร้าว + ขนมจีน',
    category: 'soup_curry',
    description: 'แกงเขียวหวานกะทิคั้นสด เข้มข้นกลมกล่อม ไก่นุ่ม ยอดมะพร้าวกรุบกรอบ',
    calories: 520,
    allergens: ['None'],
    image_url: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=800&q=80',
    date: '2026-08-27',
    is_special: false,
    rating_avg: 4.3,
    reviews_count: 19,
    station: 'ซุ้มต้มแกงไทยแท้ (ป้าสมร)'
  },
  {
    id: 'm-05',
    name: 'ข้าวเหนียวมะม่วงน้ำดอกไม้มูนกะทิสด',
    category: 'dessert',
    description: 'มะม่วงน้ำดอกไม้สุกหวานฉ่ำ ข้าวเหนียวมูนเม็ดสวย ราดกะทิอบควันเทียนและถั่วทอง',
    calories: 420,
    allergens: ['None'],
    image_url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
    date: '2026-08-28',
    is_special: true,
    rating_avg: 4.9,
    reviews_count: 45,
    station: 'ซุ้มขนมหวาน & เบเกอรี่'
  },
  {
    id: 'm-06',
    name: 'น้ำแตงโมปั่นเกล็ดหิมะ & ผลไม้รวมตามฤดูกาล',
    category: 'drink_fruit',
    description: 'แตงโมสดหวานธรรมชาติ 100% ไม่เติมน้ำเชื่อม พร้อมเซ็ตแตงโม แคนตาลูป และฝรั่งสด',
    calories: 120,
    allergens: ['None'],
    image_url: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?auto=format&fit=crop&w=800&q=80',
    date: '2026-08-29',
    is_special: false,
    rating_avg: 4.7,
    reviews_count: 31,
    station: 'ซุ้มเครื่องดื่มและผลไม้สด'
  }
];

export const INITIAL_REVIEWS = [
  {
    id: 'rev-01',
    menu_id: 'm-01',
    menu_name: 'ข้าวกะเพราหมูกรอบไข่ดาวลาวา',
    taste_score: 5,
    hygiene_score: 5,
    portion_score: 5,
    value_score: 5,
    overall_score: 5.0,
    employee_name: 'คุณณัฐพล (Dev Team)',
    department: 'Engineering',
    is_anonymous: false,
    comment: 'หมูกรอบกรอบมากกกก ไม่อมน้ำมันเลย พริกกระเทียมผัดมาหอมกลิ่นกระทะสุดๆ ไข่ดาวไข่แดงเยิ้มกำลังดี วันนี้ฟินมากครับ!',
    tags: ['😋 อร่อยกลมกล่อม', '♨️ ร้อนกำลังดี', '🍚 ให้เยอะจุใจ'],
    photo_url: null,
    helpful_count: 14,
    date: '2026-08-27',
    created_at: '2026-08-27T12:15:00.000Z'
  },
  {
    id: 'rev-02',
    menu_id: 'm-02',
    menu_name: 'ต้มยำกุ้งน้ำข้นยอดมะพร้าวอ่อน',
    taste_score: 4,
    hygiene_score: 5,
    portion_score: 4,
    value_score: 5,
    overall_score: 4.5,
    employee_name: 'พนักงานไม่ประสงค์ออกนาม',
    department: 'Marketing',
    is_anonymous: true,
    comment: 'กุ้งตัวใหญ่และสดมาก ไม่คาวเลย รสชาติเข้มข้น แต่อยากให้ลดเปรี้ยวลงนิดนึงจะกลมกล่อมเพอร์เฟกต์มากค่ะ',
    tags: ['🌿 วัตถุดิบสดใหม่', '✨ สะอาดถูกสุขอนามัย', '🌶️ เผ็ดจัดจ้านสะใจ'],
    photo_url: null,
    helpful_count: 8,
    date: '2026-08-27',
    created_at: '2026-08-27T12:28:00.000Z'
  },
  {
    id: 'rev-03',
    menu_id: 'm-05',
    menu_name: 'ข้าวเหนียวมะม่วงน้ำดอกไม้มูนกะทิสด',
    taste_score: 5,
    hygiene_score: 5,
    portion_score: 5,
    value_score: 5,
    overall_score: 5.0,
    employee_name: 'น้องแพรวา (HR Team)',
    department: 'Human Resources',
    is_anonymous: false,
    comment: 'มะม่วงหวานฉ่ำ ข้าวเหนียวนุ่มหอมกะทิมาก อยากให้มีเมนูนี้ทุกสัปดาห์เลยค่ะ ให้ 10 ดาวเลย',
    tags: ['😋 อร่อยกลมกล่อม', '✨ สะอาดถูกสุขอนามัย'],
    photo_url: null,
    helpful_count: 19,
    date: '2026-08-27',
    created_at: '2026-08-27T12:45:00.000Z'
  },
  {
    id: 'rev-04',
    menu_id: 'm-03',
    menu_name: 'สลัดอกไก่นุ่มย่างพริกไทยดำ & อะโวคาโด',
    taste_score: 5,
    hygiene_score: 5,
    portion_score: 4,
    value_score: 4,
    overall_score: 4.5,
    employee_name: 'คุณกิตติ (Finance)',
    department: 'Finance & Accounting',
    is_anonymous: false,
    comment: 'อกไก่นุ่มมาก ไม่แห้งเหมือนที่อื่น ผักสลัดกรอบสด ชื่นชมทีมโภชนาการที่เพิ่มเมนูคลีนเข้ามาครับ',
    tags: ['🌿 วัตถุดิบสดใหม่', '✨ สะอาดถูกสุขอนามัย'],
    photo_url: null,
    helpful_count: 6,
    date: '2026-08-27',
    created_at: '2026-08-27T12:50:00.000Z'
  }
];

export const INITIAL_VOTES = [
  {
    id: 'vote-01',
    dish_name: 'ข้าวขาหมูเยอรมันทอดกรอบ + น้ำจิ้มซีฟู้ด',
    category: 'main',
    votes_count: 64,
    proposed_by: 'ทีม Business Development',
    tags: ['ยอดฮิต', '🔥 มาแรง'],
    status: 'active'
  },
  {
    id: 'vote-02',
    dish_name: 'ก๋วยเตี๋ยวเรือเนื้อวากิว / หมูคุโรบูตะน้ำตกเข้มข้น',
    category: 'main',
    votes_count: 89,
    proposed_by: 'ฝ่ายไอที & Tech',
    tags: ['🌟 อันดับ 1', '🔥 มาแรง'],
    status: 'active'
  },
  {
    id: 'vote-03',
    dish_name: 'แซลมอนย่างซีอิ๊วญี่ปุ่น + ข้าวญี่ปุ่นและซุปมิโซะ',
    category: 'healthy_veg',
    votes_count: 53,
    proposed_by: 'ทีมดีไซน์ UX/UI',
    tags: ['เมนูสุขภาพ'],
    status: 'active'
  },
  {
    id: 'vote-04',
    dish_name: 'บิงซูชาไทยเฉาก๊วยนมสด',
    category: 'dessert',
    votes_count: 72,
    proposed_by: 'HR Activities Club',
    tags: ['หวานชื่นใจ'],
    status: 'active'
  },
  {
    id: 'vote-05',
    dish_name: 'แกงส้มชะอมกุ้งสดผักรวม',
    category: 'soup_curry',
    votes_count: 41,
    proposed_by: 'ทีมปฏิบัติการ Operations',
    tags: ['อาหารไทยแท้'],
    status: 'active'
  }
];

export const CANTEEN_ANNOUNCEMENTS = [
  {
    id: 'ann-01',
    title: '📢 แจ้งเปลี่ยนเมนูของหวานวันศุกร์นี้เป็น "ทับทิมกรอบชาววัง"',
    date: '27 ส.ค. 2026',
    author: 'หัวหน้าแม่ครัวสมศรี',
    badge: 'ประกาศโรงอาหาร'
  },
  {
    id: 'ann-02',
    title: '🌿 Canteen Green Day: สัปดาห์หน้าเตรียมพบกับ 4 เมนูมังสวิรัติเพื่อสุขภาพ',
    date: '26 ส.ค. 2026',
    author: 'คณะกรรมการสวัสดิการพนักงาน',
    badge: 'กิจกรรมพิเศษ'
  }
];

export const DEFAULT_SITE_CONFIG = {
  brandName: 'DOD Canteen',
  brandSubtitle: 'ระบบประเมินอาหารพนักงาน',
  tabMenu: 'เมนูวันนี้',
  tabReviews: 'รีวิว & ความคิดเห็น',
  tabVoting: 'โหวตเมนูสัปดาห์หน้า',
  tabDashboard: 'แดชบอร์ด HR/แม่ครัว',
  bannerBadge: 'เมนูมื้อเที่ยงพร้อมเสิร์ฟแล้ววันนี้',
  bannerTitle: 'อิ่มอร่อย สด สะอาด พร้อมฟังทุกเสียงของคุณ 🍽️',
  bannerSubtitle: 'ร่วมประเมินรสชาติและคุณภาพอาหาร เพื่อเป็นกำลังใจให้แม่ครัวและพัฒนาเมนูในทุกๆ วัน (สามารถประเมินแบบไม่ระบุชื่อได้)'
};

