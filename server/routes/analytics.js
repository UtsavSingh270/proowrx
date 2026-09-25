const express = require('express');
const net = require('net');
const AnalyticsEvent = require('../models/AnalyticsEvent');
const ExcludedIp = require('../models/ExcludedIp');
const Post = require('../models/Post');
const { requireAdmin } = require('../middleware/auth');
const { clearExcludedIpCache, isExcludedRequest, normalizeIp, requestIp } = require('../utils/excludedIps');
const { logAudit } = require('../utils/auditLog');

const router = express.Router();
const RETENTION_DAYS = 395;
const { analyticsRange, addDays, sourceRows } = require('../utils/analytics');
const pageSeoReport = require('../utils/pageSeoReport');

function clean(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

router.post('/events', async (req, res) => {
  try {
    if (await isExcludedRequest(req)) {
      return res.status(202).json({ accepted: false, excluded: true });
    }

    const visitorId = clean(req.body.visitorId, 80);
    const sessionId = clean(req.body.sessionId, 80);
    const pagePath = clean(req.body.path, 500);
    if (!visitorId || !sessionId || !pagePath || !pagePath.startsWith('/')) {
      return res.status(400).json({ error: 'Invalid analytics event' });
    }

    const expiresAt = new Date(Date.now() + RETENTION_DAYS * 24 * 60 * 60 * 1000);
    await AnalyticsEvent.create({
      visitorId,
      sessionId,
      path: pagePath.split(/[?#]/)[0],
      title: clean(req.body.title, 200),
      referrer: (() => { try { return new URL(req.body.referrer).origin; } catch { return ''; } })(),
      device: ['desktop', 'tablet', 'mobile'].includes(req.body.device) ? req.body.device : 'unknown',
      browser: clean(req.body.browser, 40) || 'Other',
      operatingSystem: clean(req.body.operatingSystem, 40) || 'Other',
      language: clean(req.body.language, 20),
      timezone: clean(req.body.timezone, 80),
      campaign: {
        source: clean(req.body.campaign?.source, 100),
        medium: clean(req.body.campaign?.medium, 100),
        name: clean(req.body.campaign?.name, 100),
      },
      expiresAt,
    });
    return res.status(202).json({ accepted: true });
  } catch (error) {
    console.error('Analytics event error:', error.message);
    return res.status(500).json({ error: 'Unable to record analytics event' });
  }
});

router.get('/excluded-ips', requireAdmin, async (req, res) => {
  try {
    const items = await ExcludedIp.find().sort({ createdAt: -1 }).lean();
    return res.json({ items, currentIp: requestIp(req) });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to load excluded IP addresses' });
  }
});

router.post('/excluded-ips', requireAdmin, async (req, res) => {
  try {
    const ip = normalizeIp(req.body.ip);
    const label = clean(req.body.label, 120);
    if (!net.isIP(ip)) return res.status(400).json({ error: 'Enter a valid IPv4 or IPv6 address.' });

    const item = await ExcludedIp.create({ ip, label, createdBy: req.adminId || null });
    clearExcludedIpCache();
    await logAudit(req.adminUsername, req.adminId, 'analytics', 'create', item._id, ip, { label });
    return res.status(201).json(item);
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ error: 'This IP address is already excluded.' });
    return res.status(400).json({ error: error.message || 'Unable to exclude IP address' });
  }
});

router.delete('/excluded-ips/:id', requireAdmin, async (req, res) => {
  try {
    const item = await ExcludedIp.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Excluded IP address not found' });
    clearExcludedIpCache();
    await logAudit(req.adminUsername, req.adminId, 'analytics', 'delete', item._id, item.ip, { label: item.label });
    return res.json({ message: 'IP address removed from exclusions' });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to remove excluded IP address' });
  }
});

router.get('/summary', requireAdmin, async (req, res) => {
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
