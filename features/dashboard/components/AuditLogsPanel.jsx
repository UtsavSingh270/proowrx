'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { auditLogs } from '@/services/api';

export default function AuditLogsPanel() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState('');
  const [username, setUsername] = useState('');
  const [action, setAction] = useState('');
  const [limit, setLimit] = useState(50);
  const [total, setTotal] = useState(0);

  const reload = useCallback(() => {
      const filters = {};
      if (section) filters.section = section;
      if (username) filters.username = username;
      if (action) filters.action = action;
      
      return auditLogs.getAll(filters, limit, 0).then(result => {
      setLogs(result.logs || []);
      setTotal(result.total || 0);
      }).catch(err => {
      console.error('Failed to load audit logs:', err);
      setLogs([]);
      setTotal(0);
      }).finally(() => {
      setLoading(false);
      });
  }, [section, username, action, limit]);

  useEffect(() => {
    reload();
  }, [reload]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleString('en-AU', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Australia/Sydney',
      timeZoneName: 'short',
    });
  }

  const actionColors = {
    create: '#27ae60',
    update: '#3498db',
    delete: '#e74c3c',
  };

  return (
    <div>
      <div className="dash-section-header">
        <span className="dash-section-title">Audit Logs</span>
        <span style={{ fontSize: '0.78rem', color: '#9aa5be' }}>Total: {total}</span>
      </div>

      <div className="dash-inline-panel">
        <div className="dash-form-row">
          <div className="dash-form-group">
            <label className="dash-form-label">Section</label>
            <select
              className="dash-form-select"
              value={section}
              onChange={e => { setSection(e.target.value); }}
            >
              <option value="">All Sections</option>
              <option value="blogs">Blogs</option>
              <option value="jobs">Jobs</option>
              <option value="members">Members</option>
              <option value="authors">Authors</option>
              <option value="contacts">Contacts</option>
              <option value="meetings">Meetings</option>
              <option value="resources">Resources</option>
            </select>
          </div>

          <div className="dash-form-group">
            <label className="dash-form-label">Username</label>
            <input
              className="dash-form-input"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Filter by username"
            />
          </div>

          <div className="dash-form-group">
            <label className="dash-form-label">Action</label>
            <select
              className="dash-form-select"
              value={action}
              onChange={e => setAction(e.target.value)}
            >
              <option value="">All Actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
            </select>
          </div>

          <div className="dash-form-group">
            <label className="dash-form-label">Results Per Page</label>
            <select
              className="dash-form-select"
              value={limit}
              onChange={e => setLimit(Number(e.target.value))}
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="dash-empty">Loading audit logs...</div>
      ) : logs.length === 0 ? (
        <div className="dash-empty">No audit logs found.</div>
      ) : (
        <div className="dash-table-wrap" style={{ overflowX: 'auto' }}>
          <table className="dash-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Username</th>
                <th>Section</th>
                <th>Action</th>
                <th>Item</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, idx) => (
                <tr key={log._id || idx}>
                  <td style={{ fontSize: '0.78rem', color: '#9aa5be', whiteSpace: 'nowrap' }}>
                    {formatDate(log.timestamp)}
                  </td>
                  <td style={{ fontSize: '0.86rem', fontWeight: 500 }}>{log.username}</td>
                  <td style={{ fontSize: '0.85rem', textTransform: 'capitalize' }}>{log.section}</td>
                  <td>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: 'white',
                        backgroundColor: actionColors[log.action] || '#95a5a6',
                        textTransform: 'capitalize',
                      }}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem' }} className="dash-table-title">
                    {log.itemName || '(unnamed)'}
                  </td>
                  <td style={{ fontSize: '0.78rem', color: '#9aa5be', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {typeof log.changes === 'object' ? JSON.stringify(log.changes).substring(0, 50) + '...' : String(log.changes || '—').substring(0, 50)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
