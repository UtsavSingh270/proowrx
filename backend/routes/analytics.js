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
const ALLOWED_RANGES = { '7d': 7, '30d': 30, '90d': 90 };

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
      path: pagePath,
      title: clean(req.body.title, 200),
      referrer: clean(req.body.referrer, 500),
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
  try {
    const range = ALLOWED_RANGES[req.query.range] ? req.query.range : '30d';
    const from = new Date(Date.now() - ALLOWED_RANGES[range] * 24 * 60 * 60 * 1000);
    const liveFrom = new Date(Date.now() - 5 * 60 * 1000);

    const [result] = await AnalyticsEvent.aggregate([
      { $match: { eventType: 'page_view', occurredAt: { $gte: from } } },
      { $facet: {
        overview: [{ $group: { _id: null, pageViews: { $sum: 1 }, visitors: { $addToSet: '$visitorId' }, sessions: { $addToSet: '$sessionId' } } }],
        daily: [{ $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$occurredAt' } }, views: { $sum: 1 }, visitors: { $addToSet: '$visitorId' } } }, { $sort: { _id: 1 } }],
        pages: [{ $group: { _id: '$path', views: { $sum: 1 }, visitors: { $addToSet: '$visitorId' } } }, { $sort: { views: -1 } }, { $limit: 10 }],
        devices: [{ $group: { _id: '$device', value: { $sum: 1 } } }, { $sort: { value: -1 } }],
        browsers: [{ $group: { _id: '$browser', value: { $sum: 1 } } }, { $sort: { value: -1 } }, { $limit: 6 }],
        referrers: [{ $match: { referrer: { $ne: '' } } }, { $group: { _id: '$referrer', value: { $sum: 1 } } }, { $sort: { value: -1 } }, { $limit: 8 }],
        live: [{ $match: { occurredAt: { $gte: liveFrom } } }, { $group: { _id: null, sessions: { $addToSet: '$sessionId' } } }],
        blogTraffic: [{ $match: { path: { $regex: '^/blog' } } }, { $group: { _id: null, views: { $sum: 1 }, visitors: { $addToSet: '$visitorId' } } }],
      } },
    ]);

    const [blogResult] = await Post.aggregate([
      { $facet: {
        overview: [{ $group: { _id: null, totalPosts: { $sum: 1 }, publishedPosts: { $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] } }, views: { $sum: '$views' }, likes: { $sum: '$likes' } } }],
        topPosts: [{ $sort: { views: -1, likes: -1 } }, { $limit: 10 }, { $project: { _id: 0, title: 1, slug: 1, category: 1, status: 1, views: 1, likes: 1 } }],
        categories: [{ $group: { _id: '$category', posts: { $sum: 1 }, views: { $sum: '$views' }, likes: { $sum: '$likes' } } }, { $sort: { views: -1 } }],
      } },
    ]);

    const overview = result?.overview?.[0] || { pageViews: 0, visitors: [], sessions: [] };
    const sessions = overview.sessions.length;
    return res.json({
      range,
      overview: {
        pageViews: overview.pageViews,
        uniqueVisitors: overview.visitors.length,
        sessions,
        pagesPerSession: sessions ? Number((overview.pageViews / sessions).toFixed(1)) : 0,
        liveUsers: result?.live?.[0]?.sessions?.length || 0,
      },
      daily: result.daily.map(item => ({ date: item._id, views: item.views, visitors: item.visitors.length })),
      pages: result.pages.map(item => ({ path: item._id, views: item.views, visitors: item.visitors.length })),
      devices: result.devices.map(item => ({ label: item._id, value: item.value })),
      browsers: result.browsers.map(item => ({ label: item._id, value: item.value })),
      referrers: result.referrers.map(item => ({ label: item._id, value: item.value })),
      blog: {
        overview: {
          totalPosts: blogResult?.overview?.[0]?.totalPosts || 0,
          publishedPosts: blogResult?.overview?.[0]?.publishedPosts || 0,
          views: blogResult?.overview?.[0]?.views || 0,
          likes: blogResult?.overview?.[0]?.likes || 0,
          engagementRate: blogResult?.overview?.[0]?.views ? Number(((blogResult.overview[0].likes / blogResult.overview[0].views) * 100).toFixed(1)) : 0,
          periodPageViews: result?.blogTraffic?.[0]?.views || 0,
          periodVisitors: result?.blogTraffic?.[0]?.visitors?.length || 0,
        },
        topPosts: blogResult?.topPosts || [],
        categories: (blogResult?.categories || []).map(item => ({ label: item._id || 'General', posts: item.posts, views: item.views, likes: item.likes })),
      },
    });
  } catch (error) {
    console.error('Analytics summary error:', error.message);
    return res.status(500).json({ error: 'Unable to load analytics' });
  }
});

module.exports = router;
