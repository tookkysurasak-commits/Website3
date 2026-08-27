import { NextResponse } from 'next/server';
import { INITIAL_VOTES } from '@/lib/initial-data';

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
    const results = await executeD1Query("SELECT * FROM menu_votes ORDER BY votes_count DESC");
    if (results && results.length > 0) {
      return NextResponse.json({ success: true, data: results, source: 'cloudflare-d1' });
    }
  } catch (err) {
    console.warn("D1 votes query fallback:", err.message);
  }

  return NextResponse.json({ success: true, data: INITIAL_VOTES, source: 'local' });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, dishId, dish_name, category, proposed_by } = body;

    if (action === 'vote') {
      // Increment vote count
      await executeD1Query(
        "UPDATE menu_votes SET votes_count = votes_count + 1 WHERE id = ?",
        [dishId]
      );
      return NextResponse.json({ success: true, message: 'Vote recorded' });
    }

    if (action === 'propose') {
      // Add new candidate dish
      const newId = `vote-${Date.now()}`;
      await executeD1Query(
        `INSERT INTO menu_votes (id, dish_name, category, votes_count, proposed_by, status)
         VALUES (?, ?, ?, 1, ?, 'active')`,
        [newId, dish_name, category, proposed_by || 'พนักงาน']
      );
      return NextResponse.json({ success: true, id: newId, message: 'Dish proposed' });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
