const INITIAL_VOTES = [
  {
    id: 'vote-01',
    dish_name: '¢éÒÇ¢ÒËÁÙàÂÍÃÁÑ¹·Í´¡ÃÍº + ¹éÓ¨ÔéÁ«Õ¿Ùé´',
    category: 'main',
    votes_count: 64,
    proposed_by: '·ÕÁ Business Development',
    tags: ['ÂÍ´ÎÔµ', '?? ÁÒáÃ§'],
    status: 'active'
  },
  {
    id: 'vote-02',
    dish_name: '¡ëÇÂàµÕëÂÇàÃ×Íà¹×éÍÇÒ¡ÔÇ / ËÁÙ¤ØâÃºÙµÐ¹éÓµ¡à¢éÁ¢é¹',
    category: 'main',
    votes_count: 89,
    proposed_by: '½èÒÂäÍ·Õ & Tech',
    tags: ['?? ÍÑ¹´Ñº 1', '?? ÁÒáÃ§'],
    status: 'active'
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
    const results = await executeD1Query(context.env, 'SELECT * FROM menu_votes ORDER BY votes_count DESC');
    if (results && results.length > 0) {
      return Response.json({ success: true, data: results, source: 'cloudflare-d1' });
    }
  } catch (err) {
    console.warn('D1 votes query fallback:', err.message);
  }

  return Response.json({ success: true, data: INITIAL_VOTES, source: 'local' });
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { action, dishId, dish_name, category, proposed_by } = body;

    if (action === 'vote') {
      await executeD1Query(
        context.env,
        'UPDATE menu_votes SET votes_count = votes_count + 1 WHERE id = ?',
        [dishId]
      );
      return Response.json({ success: true, message: 'Vote recorded' });
    }

    if (action === 'propose') {
      const newId = 'vote-' + Date.now();
      await executeD1Query(
        context.env,
        'INSERT INTO menu_votes (id, dish_name, category, votes_count, proposed_by, status) VALUES (?, ?, ?, 1, ?, ?)',
        [newId, dish_name, category, proposed_by || '¾¹Ñ¡§Ò¹', 'active']
      );
      return Response.json({ success: true, id: newId, message: 'Dish proposed' });
    }

    return Response.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
