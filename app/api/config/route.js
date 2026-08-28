import { NextResponse } from 'next/server';
import { DEFAULT_SITE_CONFIG } from '@/lib/initial-data';

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
    const results = await executeD1Query("SELECT key, value FROM site_config");
    if (results && results.length > 0) {
      const config = { ...DEFAULT_SITE_CONFIG };
      results.forEach(row => {
        config[row.key] = row.value;
      });
      return NextResponse.json({ success: true, data: config, source: 'cloudflare-d1' });
    }
  } catch (err) {
    console.warn("D1 config query fallback:", err.message);
  }

  return NextResponse.json({ success: true, data: DEFAULT_SITE_CONFIG, source: 'default' });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const entries = Object.entries(body);

    for (const [key, value] of entries) {
      await executeD1Query(
        `INSERT OR REPLACE INTO site_config (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)`,
        [key, String(value || '')]
      );
    }

    return NextResponse.json({ success: true, message: 'Config saved to Cloudflare D1' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
