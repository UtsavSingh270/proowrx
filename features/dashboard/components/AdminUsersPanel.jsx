'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Shield } from 'lucide-react';
import { auth } from '@/services/api';

export default function AdminUsersPanel() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    username: '',
    password: '',
    permissions: 'view-write',
    isSuperAdmin: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const reload = useCallback(() => auth.getAdmins()
    .then(result => { setAdmins(result); setError(''); })
    .catch(() => { setError('Failed to load admins'); setAdmins([]); })
    .finally(() => setLoading(false)), []);

  useEffect(() => {
    reload();
  }, [reload]);

  function resetForm() {
    setForm({ username: '', password: '', permissions: 'view-write', isSuperAdmin: false });
    setEditingId(null);
    setShowForm(false);
    setError('');
  }

  async function handleSave() {
    if (!form.username.trim()) {
      setError('Username is required');
      return;
    }
    if (editingId && !form.password.trim()) {
      setError('Password required for update');
      return;
    }
    if (!editingId && !form.password.trim()) {
      setError('Password is required for new admin');
      return;
    }

    setSaving(true);
    setError('');
    try {
      if (editingId) {
        await auth.updateAdmin(editingId, form);
      } else {
        await auth.createAdmin(form);
      }
      await reload();
      resetForm();
    } catch (err) {
      setError(err.message || 'Failed to save admin');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this admin user?')) return;
    try {
      await auth.removeAdmin(id);
      await reload();
    } catch (err) {
      setError(err.message || 'Failed to delete admin');
    }
  }

  function handleEdit(admin) {
    setForm({
      username: admin.username,
      password: '',
      permissions: admin.permissions,
      isSuperAdmin: admin.isSuperAdmin,
    });
    setEditingId(admin._id);
    setShowForm(true);
  }

  return (
    <div>
      <div className="dash-section-header">
        <span className="dash-section-title">Admin Users</span>
        <button className="dash-btn dash-btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={15} /> Add Admin
        </button>
      </div>

      {error && (
        <div style={{ background: '#fee', border: '1px solid #e74c3c', padding: 12, borderRadius: 8, marginBottom: 16, color: '#c0392b' }}>
          {error}
        </div>
      )}

      {showForm && (
        <div className="dash-inline-panel">
          <div className="dash-form-row">
            <div className="dash-form-group">
              <label className="dash-form-label">Username *</label>
              <input
                className="dash-form-input"
                type="text"
                value={form.username}
                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                placeholder="e.g. john@example.com"
                disabled={!!editingId}
              />
            </div>
            <div className="dash-form-group">
              <label className="dash-form-label">{editingId ? 'New Password' : 'Password'} *</label>
              <input
                className="dash-form-input"
                type="password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="Enter password"
              />
            </div>
          </div>

          <div className="dash-form-row">
            <div className="dash-form-group">
              <label className="dash-form-label">Permissions</label>
              <select
                className="dash-form-select"
                value={form.permissions}
                onChange={e => setForm(p => ({ ...p, permissions: e.target.value }))}
              >
                <option value="view">View Only</option>
                <option value="view-write">View & Write</option>
              </select>
            </div>
            <div className="dash-form-group" style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 24 }}>
              <input
                id="super-admin-cb"
                type="checkbox"
                checked={form.isSuperAdmin}
                onChange={e => setForm(p => ({ ...p, isSuperAdmin: e.target.checked }))}
              />
              <label htmlFor="super-admin-cb" style={{ fontSize: '0.86rem', fontWeight: 600, color: '#374a6e', cursor: 'pointer', marginLeft: 8 }}>
                Super Admin
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="dash-btn dash-btn-primary dash-btn-sm"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Admin'}
            </button>
            <button className="dash-btn dash-btn-ghost dash-btn-sm" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="dash-empty">Loading...</div>
      ) : admins.length === 0 ? (
        <div className="dash-empty">No admin users found.</div>
      ) : (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Permissions</th>
                <th>Last Login</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr key={admin._id}>
                  <td className="dash-table-title">{admin.username}</td>
                  <td>
                    {admin.isSuperAdmin ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f0a500' }}>
                        <Shield size={13} /> Super Admin
                      </span>
                    ) : (
                      'Admin'
                    )}
                  </td>
                  <td>{admin.permissions === 'view' ? 'View Only' : 'View & Write'}</td>
                  <td style={{ fontSize: '0.78rem', color: '#9aa5be' }}>
                    {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never'}
                  </td>
                  <td style={{ fontSize: '0.78rem', color: '#9aa5be' }}>
                    {new Date(admin.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="dash-table-actions">
                      <button
                        className="dash-btn dash-btn-ghost dash-btn-sm"
                        onClick={() => handleEdit(admin)}
                        title="Edit"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        className="dash-btn dash-btn-danger dash-btn-sm"
                        onClick={() => handleDelete(admin._id)}
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
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
