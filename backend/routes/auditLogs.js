const express = require('express');
const { requireAdmin, requireSuperAdmin } = require('../middleware/auth');
const { getAuditLogs } = require('../utils/auditLog');

const router = express.Router();

// GET /api/audit-logs - Get audit logs (admin only)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { section, username, action, limit = 100, skip = 0 } = req.query;
    const filters = {};
    
    if (section) filters.section = section;
    if (username) filters.username = username;
    if (action) filters.action = action;

    const result = await getAuditLogs(filters, parseInt(limit), parseInt(skip));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// GET /api/audit-logs/stats - Get audit statistics (super admin only)
router.get('/stats', requireSuperAdmin, async (req, res) => {
  try {
    const result = await getAuditLogs({}, 10000, 0);
    
    const stats = {
      totalChanges: result.total,
      bySection: {},
      byAction: {},
      byUser: {},
    };

    result.logs.forEach(log => {
      stats.bySection[log.section] = (stats.bySection[log.section] || 0) + 1;
      stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1;
      stats.byUser[log.username] = (stats.byUser[log.username] || 0) + 1;
    });

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audit statistics' });
  }
});

module.exports = router;
