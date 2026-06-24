export async function fetchGSC(env) {
  if (!env.GSC_TOKEN || !env.GSC_SITE_URL) {
    return getSampleData();
  }

  try {
    const url = `https://searchconsole.googleapis.com/v1/sites/${encodeURIComponent(env.GSC_SITE_URL)}/searchAnalytics/query`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.GSC_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate: dateDaysAgo(7),
        endDate: today(),
        dimensions: ['query', 'page'],
        rowLimit: 100,
      }),
    });

    if (!res.ok) {
      console.warn('[gsc] API returned', res.status, 'falling back to sample data');
      return getSampleData();
    }

    const json = await res.json();
    return (json.rows || []).map(r => ({
      query: r.keys[0],
      page: r.keys[1],
      impressions: r.impressions,
      clicks: r.clicks,
      ctr: r.ctr,
      position: r.position,
    }));
  } catch (err) {
    console.warn('[gsc] Fetch failed:', err.message);
    return getSampleData();
  }
}

function dateDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function today() {
  return new Date().toISOString().split('T')[0];
}

function getSampleData() {
  return [
    { query: 'inflatable sup board for beginners', page: '/en/guides/beginner-guide', impressions: 340, clicks: 6, ctr: 0.0176, position: 11.2 },
    { query: 'best paddle board for fishing', page: '/en/guides/sup-fishing', impressions: 280, clicks: 4, ctr: 0.0143, position: 14.5 },
    { query: 'how to choose a paddle board size', page: '/en/guides/choosing-paddle', impressions: 510, clicks: 11, ctr: 0.0216, position: 9.8 },
    { query: 'inflatable vs hard paddle board', page: '/en/guides/inflatable-vs-hard', impressions: 720, clicks: 18, ctr: 0.0250, position: 7.3 },
    { query: 'sup board maintenance tips', page: '/en/guides/sup-maintenance', impressions: 190, clicks: 3, ctr: 0.0158, position: 16.1 },
    { query: 'paddle board yoga poses', page: '/en/guides/sup-yoga', impressions: 145, clicks: 2, ctr: 0.0138, position: 18.4 },
    { query: 'beginner sup guide', page: '/en/guides/beginner-guide', impressions: 890, clicks: 31, ctr: 0.0348, position: 5.2 },
    { query: 'best paddle board for kids', page: '/en/guides/sup-with-kids', impressions: 230, clicks: 5, ctr: 0.0217, position: 12.8 },
    { query: 'kayak paddling techniques', page: '/en/guides/kayak-techniques', impressions: 410, clicks: 9, ctr: 0.0220, position: 10.3 },
    { query: 'multi day sup trip planning', page: '/en/guides/multi-day-trip', impressions: 165, clicks: 2, ctr: 0.0121, position: 19.7 },
  ];
}
