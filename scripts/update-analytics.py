from pathlib import Path
root=Path(__file__).resolve().parents[1]
p=root/'server/routes/analytics.js';s=p.read_text(encoding='utf-8')
s=s.replace("const ALLOWED_RANGES = { '7d': 7, '30d': 30, '90d': 90 };", "const { analyticsRange, addDays, sourceRows } = require('../utils/analytics');\nconst pageSeoReport = require('../utils/pageSeoReport');")
s=s.replace("path: pagePath,", "path: pagePath.split(/[?#]/)[0],")
s=s.replace("referrer: clean(req.body.referrer, 500),", "referrer: (() => { try { return new URL(req.body.referrer).origin; } catch { return ''; } })(),")
a=s.index("router.get('/summary'")
s=s[:a]+'''router.get('/summary', requireAdmin, async (req, res) => {
  let period;
  try { period = analyticsRange(req.query); }
  catch (error) { return res.status(400).json({ error: error.message }); }
  const selectedPath = clean(req.query.path, 500).split(/[?#]/)[0];
  if (selectedPath && (!selectedPath.startsWith('/') || selectedPath.startsWith('//'))) return res.status(400).json({ error: 'Invalid page path' });
  try {
    const { from, until, timeZone } = period;
    const [result] = await AnalyticsEvent.aggregate([
      { $match: { eventType: 'page_view', occurredAt: { $gte: from, $lt: until } } },
      { $addFields: { pagePath: { $arrayElemAt: [{ $split: ['$path', '?'] }, 0] } } },
      ...(selectedPath ? [{ $match: { pagePath: selectedPath } }] : []),
      { $facet: {
        overview: [{ $group: { _id: null, pageViews: { $sum: 1 }, visitors: { $addToSet: '$visitorId' }, sessions: { $addToSet: '$sessionId' } } }],
        daily: [{ $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$occurredAt', timezone: timeZone } }, views: { $sum: 1 }, visitors: { $addToSet: '$visitorId' } } }, { $sort: { _id: 1 } }],
        pages: [{ $group: { _id: '$pagePath', views: { $sum: 1 }, visitors: { $addToSet: '$visitorId' } } }, { $sort: { views: -1 } }],
        devices: [{ $group: { _id: '$device', value: { $sum: 1 } } }, { $sort: { value: -1 } }],
        browsers: [{ $group: { _id: '$browser', value: { $sum: 1 } } }, { $sort: { value: -1 } }],
        sources: [{ $group: { _id: { referrer: '$referrer', source: '$campaign.source', medium: '$campaign.medium', campaign: '$campaign.name' }, views: { $sum: 1 }, sessions: { $addToSet: '$sessionId' }, visitors: { $addToSet: '$visitorId' } } }],
      } },
    ]);
    const pageSeo = await pageSeoReport(selectedPath);
    const overview = result?.overview?.[0] || { pageViews: 0, visitors: [], sessions: [] };
    const byDate = new Map((result?.daily || []).map(item => [item._id, item]));
    const daily = [];
    for (let date = period.start; date <= period.end; date = addDays(date, 1)) {
      const item = byDate.get(date);
      daily.push({ date, views: item?.views || 0, visitors: item?.visitors?.length || 0 });
    }
    let siteHost = 'proowrx.com';
    try { siteHost = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://proowrx.com').hostname; } catch {}
    return res.json({
      period: { start: period.start, end: period.end, timezone: timeZone, range: period.range }, path: selectedPath, pageSeo,
      overview: { pageViews: overview.pageViews, uniqueVisitors: overview.visitors.length, sessions: overview.sessions.length, pagesPerSession: overview.sessions.length ? Number((overview.pageViews / overview.sessions.length).toFixed(1)) : 0 },
      daily,
      pages: (result?.pages || []).map(item => ({ path: item._id, views: item.views, visitors: item.visitors.length })),
      devices: (result?.devices || []).map(item => ({ label: item._id, value: item.value })),
      browsers: (result?.browsers || []).map(item => ({ label: item._id, value: item.value })),
      sources: sourceRows(result?.sources || [], siteHost),
    });
  } catch (error) {
    console.error('Analytics summary error:', error.message);
    return res.status(500).json({ error: 'Unable to load analytics' });
  }
});

router.get('/pages', requireAdmin, async (req, res) => {
  try {
    const CaseStudy = require('../models/CaseStudy');
    const Resource = require('../models/Resource');
    const [paths, posts, cases, resources] = await Promise.all([
      AnalyticsEvent.distinct('path'), Post.find().select('title slug').lean(), CaseStudy.find().select('title slug').lean(), Resource.find().select('title slug').lean(),
    ]);
    const registry = new Map(require('../../data/pages.json').map(page => [page.path, { path: page.path, label: page.label }]));
    for (const [prefix, records] of [['blog', posts], ['case-study', cases], ['resources', resources]]) for (const item of records) if (item.slug) registry.set(`/${prefix}/${item.slug}`, { path: `/${prefix}/${item.slug}`, label: item.title });
    for (const raw of paths) { const path = raw.split(/[?#]/)[0]; if (!registry.has(path)) registry.set(path, { path, label: path }); }
    res.json([...registry.values()]);
  } catch (error) { res.status(500).json({ error: 'Unable to load page choices' }); }
});
module.exports = router;
'''
p.write_text(s,encoding='utf-8')
p=root/'services/api.js';s=p.read_text(encoding='utf-8');s=s.replace("  getSummary(range = '30d') {\n    return apiClient.get(`/analytics/summary?range=${encodeURIComponent(range)}`);\n  },", "  getSummary(filters = {}) { return apiClient.get(`/analytics/summary?${new URLSearchParams(filters)}`); },\n  getPages() { return apiClient.get('/analytics/pages'); },")
p.write_text(s,encoding='utf-8')
