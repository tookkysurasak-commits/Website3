const INITIAL_MENUS = [
  {
    id: 'm-01',
    name: 'ข้าวกะเพราหมูกรอบไข่ดาวลาวา',
    category: 'main',
    description: 'หมูกรอบคัดพิเศษ ผัดกะเพราพริกแห้งหอมกลิ่นกระทะ เสิร์ฟพร้อมไข่ดาวเป็ดเยิ้มๆ',
    calories: 680,
    allergens: ['Gluten', 'Egg', 'Pork'],
    image_url: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80',
    date: '2026-08-27',
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
    date: '2026-08-27',
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
    date: '2026-08-27',
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
    date: '2026-08-27',
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
    date: '2026-08-27',
    is_special: false,
    rating_avg: 4.7,
    reviews_count: 31,
    station: 'ซุ้มเครื่องดื่มและผลไม้สด'
  }
];

async function executeD1Query(env, sql, params = []) {
  if (env.DB && typeof env.DB.prepare === 'function') {
    const stmt = env.DB.prepare(sql).bind(...params);
    const { results } = await stmt.all();
    return results;
  }

  const accountId = env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = env.CLOUDFLARE_DATABASE_ID;
  const apiToken = env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken || !databaseId) {
    return null;
  }

  const response = await fetch(
    https://api.cloudflare.com/client/v4/accounts/\/d1/database/\/query,
    {
      method: 'POST',
      headers: {
        'Authorization': Bearer \,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
    }
  );

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.errors?.[0]?.message || 'D1 query failed');
  }
  return data.result?.[0]?.results || [];
}

export async function onRequestGet(context) {
  try {
    const results = await executeD1Query(context.env, "SELECT * FROM menus ORDER BY is_special DESC, created_at DESC");
    if (results && results.length > 0) {
      const formatted = results.map(m => ({
        ...m,
        allergens: typeof m.allergens === 'string' ? (m.allergens ? m.allergens.split(',') : []) : (m.allergens || []),
        calories: Number(m.calories || 0),
        is_special: Boolean(m.is_special),
        rating_avg: Number(m.rating_avg || 4.8),
        reviews_count: Number(m.reviews_count || 0),
        station: m.station || 'ซุ้มอาหารหลัก'
      }));
      return Response.json({ success: true, data: formatted, source: 'cloudflare-d1' });
    }
  } catch (err) {
    console.warn("D1 query fallback:", err.message);
  }

  return Response.json({ success: true, data: INITIAL_MENUS, source: 'local' });
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { id, name, category, description, calories, allergens, image_url, date, is_special, station } = body;

    const allergensStr = Array.isArray(allergens) ? allergens.join(',') : (allergens || '');
    const menuId = id || m-\;
    const serveDate = date || new Date().toISOString().split('T')[0];

    await executeD1Query(
      context.env,
      INSERT INTO menus (id, name, category, description, calories, allergens, image_url, date, is_special)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?),
      [
        menuId, 
        name, 
        category || 'main', 
        description || '', 
        Number(calories) || 0, 
        allergensStr, 
        image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80', 
        serveDate, 
        is_special ? 1 : 0
      ]
    );

    return Response.json({ success: true, id: menuId, message: 'Menu added successfully to Cloudflare D1' });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function onRequestPut(context) {
  try {
    const body = await context.request.json();
    const { id, name, category, description, calories, allergens, image_url, date, is_special } = body;

    if (!id) {
      return Response.json({ success: false, error: 'Menu ID is required' }, { status: 400 });
    }

    const allergensStr = Array.isArray(allergens) ? allergens.join(',') : (allergens || '');

    await executeD1Query(
      context.env,
      UPDATE menus 
       SET name = ?, category = ?, description = ?, calories = ?, allergens = ?, image_url = ?, date = ?, is_special = ?
       WHERE id = ?,
      [
        name,
        category,
        description,
        Number(calories) || 0,
        allergensStr,
        image_url,
        date,
        is_special ? 1 : 0,
        id
      ]
    );

    return Response.json({ success: true, message: 'Menu updated successfully in Cloudflare D1' });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function onRequestDelete(context) {
  try {
    const { searchParams } = new URL(context.request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ success: false, error: 'Menu ID is required' }, { status: 400 });
    }

    await executeD1Query(context.env, "DELETE FROM menus WHERE id = ?", [id]);

    return Response.json({ success: true, message: 'Menu deleted from Cloudflare D1' });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
