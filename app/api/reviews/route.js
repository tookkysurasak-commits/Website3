import { NextResponse } from 'next/server';

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
    const results = await executeD1Query("SELECT * FROM reviews ORDER BY created_at DESC");
    if (Array.isArray(results)) {
      const formatted = results.map(r => ({
        ...r,
        tags: typeof r.tags === 'string' ? (r.tags.startsWith('[') ? JSON.parse(r.tags) : r.tags.split(',')) : (r.tags || []),
        overall_score: Number(r.overall_score),
        taste_score: Number(r.taste_score),
        hygiene_score: Number(r.hygiene_score),
        portion_score: Number(r.portion_score),
        value_score: Number(r.value_score),
        helpful_count: Number(r.helpful_count || 0),
        is_anonymous: Boolean(r.is_anonymous)
      }));
      return NextResponse.json({ success: true, data: formatted, source: 'cloudflare-d1' });
    }
  } catch (err) {
    console.warn("D1 reviews query fallback:", err.message);
  }

  return NextResponse.json({ success: true, data: [], source: 'local' });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      id, menu_id, menu_name, taste_score, hygiene_score, portion_score, value_score,
      overall_score, employee_name, department, is_anonymous, comment, tags, photo_url, date
    } = body;

    const tagsStr = Array.isArray(tags) ? JSON.stringify(tags) : tags;

    await executeD1Query(
      `INSERT INTO reviews (
        id, menu_id, menu_name, taste_score, hygiene_score, portion_score, value_score, 
        overall_score, employee_name, department, is_anonymous, comment, tags, photo_url, date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id || `rev-${Date.now()}`,
        menu_id,
        menu_name,
        taste_score,
        hygiene_score,
        portion_score,
        value_score,
        overall_score,
        employee_name || 'พนักงาน',
        department || 'ทั่วไป',
        is_anonymous ? 1 : 0,
        comment || '',
        tagsStr || '',
        photo_url || null,
        date || new Date().toISOString().split('T')[0]
      ]
    );

    return NextResponse.json({ success: true, message: 'Review saved to D1' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Review ID is required' }, { status: 400 });
    }

    await executeD1Query("DELETE FROM reviews WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: 'Review deleted from Cloudflare D1' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
