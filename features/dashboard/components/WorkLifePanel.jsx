'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Save } from 'lucide-react';
import { worklife as worklifeApi, upload as uploadApi } from '@/services/api';
import FileUploadInput from '@/components/shared/FileUploadInput';

const EMPTY_ITEM = {
  type: 'image',
  title: '',
  caption: '',
  url: '',
  posterUrl: '',
  active: true,
  order: 0,
};

export default function WorkLifePanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY_ITEM);
  const [editingId, setEditingId] = useState(null);

  const reload = useCallback(() => worklifeApi.getAdminAll()
    .then(setItems)
    .catch(err => { setItems([]); setError(err.message); })
    .finally(() => setLoading(false)), []);

  useEffect(() => { reload(); }, [reload]);

  function openNew() {
    setEditingId(null);
    setForm(EMPTY_ITEM);
    setError('');
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditingId(item._id);
    setForm({
      type: item.type || 'image',
      title: item.title || '',
      caption: item.caption || '',
      url: item.url || '',
      posterUrl: item.posterUrl || '',
      active: item.active !== false,
      order: item.order || 0,
    });
    setError('');
    setModalOpen(true);
  }

  function setField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!form.url || (typeof form.url === 'string' && !form.url.trim())) {
      setError('Please upload or specify a file URL.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        title: form.title.trim(),
        caption: form.caption.trim(),
      };

      if (form.url instanceof File) {
        const result = await uploadApi.uploadFile(form.url);
        payload.url = result.asset || result;
      }

      if (form.posterUrl instanceof File) {
        const result = await uploadApi.uploadImage(form.posterUrl);
        payload.posterUrl = result.asset || result;
      }

      if (editingId) {
        await worklifeApi.update(editingId, payload);
      } else {
        await worklifeApi.create(payload);
      }
      setModalOpen(false);
      reload();
    } catch (err) {
      setError(err.message || 'Unable to save worklife item.');
    } finally {
      setSaving(false);
    }
  }

  async function removeItem(id) {
    if (!window.confirm('Delete this worklife item?')) return;
    try {
      await worklifeApi.remove(id);
      reload();
    } catch (err) {
      alert(err.message || 'Could not delete item.');
    }
  }

  return (
    <div>
      <div className="dash-section-header">
        <span className="dash-section-title">WorkLife Media</span>
        <button className="dash-btn dash-btn-primary" onClick={openNew}>
          <Plus size={15} /> New Item
        </button>
      </div>

      {loading ? (
        <div className="dash-empty">Loading…</div>
      ) : items.length === 0 ? (
        <div className="dash-empty">No images or videos uploaded yet. Add worklife media to populate the page.</div>
      ) : (
        <table className="dash-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item._id}>
                <td>{item.title}</td>
                <td>{item.type === 'video' ? 'Video' : 'Image'}</td>
                <td>{item.active ? 'Yes' : 'No'}</td>
                <td>
                  <div className="dash-table-actions">
                    <button className="dash-btn dash-btn-ghost dash-btn-sm" onClick={() => openEdit(item)} title="Edit">
                      <Edit2 size={13} />
                    </button>
                    <button className="dash-btn dash-btn-danger dash-btn-sm" onClick={() => removeItem(item._id)} title="Delete">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalOpen && (
        <div className="dash-modal-overlay" onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="dash-modal">
            <div className="dash-modal-header">
              <span className="dash-modal-title">{editingId ? 'Edit WorkLife Item' : 'New WorkLife Item'}</span>
              <button className="dash-modal-close" onClick={() => setModalOpen(false)}>×</button>
            </div>

            <div className="dash-modal-body">
              <div className="dash-form-row">
                <div className="dash-form-group">
                  <label className="dash-form-label">Type</label>
                  <select className="dash-form-select" value={form.type} onChange={e => setField('type', e.target.value)}>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div className="dash-form-group">
                  <label className="dash-form-label">Order</label>
                  <input className="dash-form-input" type="number" value={form.order} onChange={e => setField('order', Number(e.target.value))} />
                </div>
              </div>

              <div className="dash-form-group">
                <label className="dash-form-label">Title *</label>
                <input className="dash-form-input" value={form.title} onChange={e => setField('title', e.target.value)} />
              </div>

              <div className="dash-form-group">
                <label className="dash-form-label">Caption</label>
                <textarea className="dash-form-textarea" rows={3} value={form.caption} onChange={e => setField('caption', e.target.value)} />
              </div>

              <FileUploadInput
                value={form.url}
                onChange={value => setField('url', value)}
                label={form.type === 'video' ? 'Video file' : 'Image file'}
                accept={form.type === 'video' ? 'video/*' : 'image/*'}
                placeholder={form.type === 'video' ? 'Upload a video file' : 'Upload an image'}
                description={form.type === 'video' ? 'Supported formats: MP4, WEBM, MOV.' : 'Supported formats: JPG, PNG, WEBP.'}
                allowUrl={true}
              />

              {form.type === 'video' && (
                <FileUploadInput
                  value={form.posterUrl}
                  onChange={value => setField('posterUrl', value)}
                  label="Video poster image"
                  accept="image/*"
                  placeholder="Upload poster image"
                  description="Optional thumbnail shown before playback."
                  allowUrl={true}
                />
              )}

              <div className="dash-form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <input id="worklife-active" type="checkbox" checked={form.active} onChange={e => setField('active', e.target.checked)} />
                <label htmlFor="worklife-active" style={{ fontSize: '0.86rem', color: '#374a6e', cursor: 'pointer' }}>
                  Show on WorkLife page
                </label>
              </div>

              {error && <div className="dash-login-err" style={{ marginTop: 12 }}>{error}</div>}
            </div>

            <div className="dash-modal-footer">
              <button className="dash-btn dash-btn-ghost" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</button>
              <button className="dash-btn dash-btn-primary" onClick={handleSave} disabled={saving}>
                <Save size={14} /> {saving ? 'Saving…' : 'Save Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
