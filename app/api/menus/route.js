import { NextResponse } from 'next/server';
import { INITIAL_MENUS } from '@/lib/initial-data';

// D1 REST API Client
async function executeD1Query(sql, params = []) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_DATABASE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken || !databaseId) {
    return null;
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
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

export async function GET(request) {
  try {
    const results = await executeD1Query("SELECT * FROM menus ORDER BY is_special DESC, created_at DESC");
    if (results && results.length > 0) {
      const formatted = results.map(m => ({
        ...m,
        allergens: typeof m.allergens === 'string' ? (m.allergens ? m.allergens.split(',') : []) : (m.allergens || []),
        calories: Number(m.calories || 0),
        is_special: Boolean(m.is_special),
        rating_avg: Number(m.rating_avg || 0),
        reviews_count: Number(m.reviews_count || 0),
        station: m.station || 'ซุ้มอาหารหลัก'
      }));
      return NextResponse.json({ success: true, data: formatted, source: 'cloudflare-d1' });
    }
  } catch (err) {
    console.warn("D1 query fallback:", err.message);
  }

  return NextResponse.json({ success: true, data: INITIAL_MENUS, source: 'local' });
}

// Add New Menu to D1
export async function POST(request) {
  try {
    const body = await request.json();
    const { id, name, category, description, calories, allergens, image_url, date, is_special, station } = body;

    const allergensStr = Array.isArray(allergens) ? allergens.join(',') : (allergens || '');
    const menuId = id || `m-${Date.now()}`;
    const serveDate = date || new Date().toISOString().split('T')[0];

    await executeD1Query(
      `INSERT INTO menus (id, name, category, description, calories, allergens, image_url, date, is_special)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

    return NextResponse.json({ success: true, id: menuId, message: 'Menu added successfully to Cloudflare D1' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// Update Existing Menu in D1
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, name, category, description, calories, allergens, image_url, date, is_special } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Menu ID is required' }, { status: 400 });
    }

    const allergensStr = Array.isArray(allergens) ? allergens.join(',') : (allergens || '');

    await executeD1Query(
      `UPDATE menus 
       SET name = ?, category = ?, description = ?, calories = ?, allergens = ?, image_url = ?, date = ?, is_special = ?
       WHERE id = ?`,
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

    return NextResponse.json({ success: true, message: 'Menu updated successfully in Cloudflare D1' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// Delete Menu from D1
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Menu ID is required' }, { status: 400 });
    }

    await executeD1Query("DELETE FROM menus WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: 'Menu deleted from Cloudflare D1' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
