const DEFAULT_SITE_CONFIG = {
  brandName: 'YumCanteen',
  brandSubtitle: 'ระบบประเมินอาหารพนักงาน',
  tabMenu: 'เมนูวันนี้',
  tabReviews: 'รีวิว & ความคิดเห็น',
  tabVoting: 'โหวตเมนูสัปดาห์หน้า',
  tabDashboard: 'แดชบอร์ด HR/แม่ครัว',
  bannerBadge: 'เมนูมื้อเที่ยงพร้อมเสิร์ฟแล้ววันนี้',
  bannerTitle: 'อิ่มอร่อย สด สะอาด พร้อมฟังทุกเสียงของคุณ 🍽️',
  bannerSubtitle: 'ร่วมประเมินรสชาติและคุณภาพอาหาร เพื่อเป็นกำลังใจให้แม่ครัวและพัฒนาเมนูในทุกๆ วัน (สามารถประเมินแบบไม่ระบุชื่อได้)'
};

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

  const url = 'https://api.cloudflare.com/client/v4/accounts/' + accountId + '/d1/database/' + databaseId + '/query';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + apiToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.errors?.[0]?.message || 'D1 query failed');
  }
  return data.result?.[0]?.results || [];
}

export async function onRequestGet(context) {
  try {
    const results = await executeD1Query(context.env, 'SELECT key, value FROM site_config');
    if (results && results.length > 0) {
      const config = { ...DEFAULT_SITE_CONFIG };
      results.forEach(row => {
        config[row.key] = row.value;
      });
      return Response.json({ success: true, data: config, source: 'cloudflare-d1' });
    }
  } catch (err) {
    console.warn('D1 config query fallback:', err.message);
  }

  return Response.json({ success: true, data: DEFAULT_SITE_CONFIG, source: 'default' });
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const entries = Object.entries(body);

    for (const [key, value] of entries) {
      await executeD1Query(
        context.env,
        'INSERT OR REPLACE INTO site_config (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
        [key, String(value || '')]
      );
    }

    return Response.json({ success: true, message: 'Config saved to Cloudflare D1' });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
