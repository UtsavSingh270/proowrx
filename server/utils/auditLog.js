const AuditLog = require('../models/AuditLog');

/**
 * Log an audit event to track changes
 * @param {string} username - Username of person making the change
 * @param {string} adminUserId - ID of admin user making the change
 * @param {string} section - Section being modified (blogs, jobs, members, etc.)
 * @param {string} action - Action type (create, update, delete)
 * @param {string} itemId - ID of the item being modified
 * @param {string} itemName - Name/title of the item being modified
 * @param {object} changes - Object containing the changes made
 */
async function logAudit(username, adminUserId, section, action, itemId, itemName, changes = {}) {
  try {
    const auditLog = new AuditLog({
      username,
      adminUserId,
      section,
      action,
      itemId,
      itemName,
      changes,
      timestamp: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    await auditLog.save();
  } catch (err) {
    console.error('Error logging audit event:', err.message);
    // Don't throw error - audit logging shouldn't break the main operation
  }
}

/**
 * Get audit logs with optional filters
 * @param {object} filters - Filter object { section, username, adminUserId, action }
 * @param {number} limit - Number of results to return
 * @param {number} skip - Number of results to skip (for pagination)
 */
async function getAuditLogs(filters = {}, limit = 100, skip = 0) {
  try {
    const query = {};
    if (filters.section) query.section = filters.section;
    if (filters.username) query.username = filters.username;
    if (filters.adminUserId) query.adminUserId = filters.adminUserId;
    if (filters.action) query.action = filters.action;

    const logs = await AuditLog.find(query)
      .populate('adminUserId', 'username')
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip);

    const total = await AuditLog.countDocuments(query);

    return { logs, total };
  } catch (err) {
    console.error('Error fetching audit logs:', err.message);
    return { logs: [], total: 0 };
  }
}

module.exports = { logAudit, getAuditLogs };
