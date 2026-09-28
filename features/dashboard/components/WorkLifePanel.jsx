'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { worklife as worklifeApi, upload as uploadApi } from '@/services/api';
import FileUploadInput from '@/components/shared/FileUploadInput';
import { getGalleryOrder, sortGalleryImages } from '@/lib/galleryOrder';

const EMPTY_ITEM = {
  type: 'image',
  title: '',
  caption: '',
  url: '',
  posterUrl: '',
  active: true,
  order: 0,
  desktopOrder: '',
  mobileOrder: '',
};

export default function WorkLifePanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY_ITEM);
  const [editingId, setEditingId] = useState(null);
  const [orderPreview, setOrderPreview] = useState('desktop');
  const orderedItems = [
    ...sortGalleryImages(items.filter(item => item.type === 'image'), orderPreview),
    ...items.filter(item => item.type === 'video'),
  ];

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
      desktopOrder: item.desktopOrder ?? '',
      mobileOrder: item.mobileOrder ?? '',
    });
    setError('');
    setModalOpen(true);
  }

  function setField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (form.type === 'image' && ['desktopOrder', 'mobileOrder'].some(key => form[key] !== '' && (!Number.isSafeInteger(Number(form[key])) || Number(form[key]) < 0))) {
      setError('Desktop and mobile positions must be whole numbers of zero or higher.');
      return;
    }
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

      <div className="dash-content-filters">
        <label className="dash-form-group">
          <span className="dash-form-label">Preview gallery order</span>
          <select className="dash-form-select" value={orderPreview} onChange={event => setOrderPreview(event.target.value)}>
            <option value="desktop">Desktop and tablet</option>
            <option value="mobile">Mobile phones</option>
          </select>
        </label>
        <p className="dash-field-help">Images are listed in the selected device order. Edit an image to set its positions; lower numbers appear first. Hidden images are not shown on the website.</p>
      </div>
      {!modalOpen && error && <p role="alert" className="dash-login-err">{error}</p>}

      {loading ? (
        <div className="dash-empty">Loading…</div>
      ) : items.length === 0 ? (
        <div className="dash-empty">No images or videos uploaded yet. Add worklife media to populate the page.</div>
      ) : (
        <div className="dash-table-wrap"><table className="dash-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Active</th>
              <th>Desktop order</th>
              <th>Mobile order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orderedItems.map(item => (
              <tr key={item._id}>
                <td>{item.title}</td>
                <td>{item.type === 'video' ? 'Video' : 'Image'}</td>
                <td>{item.active ? 'Yes' : 'No'}</td>
                <td>{item.type === 'image' ? getGalleryOrder(item, 'desktop') : item.order}</td>
                <td>{item.type === 'image' ? getGalleryOrder(item, 'mobile') : 'Same as desktop'}</td>
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
        </table></div>
      )}

      {modalOpen && (
        <div className="dash-modal-overlay" onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="dash-modal">
            <div className="dash-modal-header">
              <span className="dash-modal-title">{editingId ? 'Edit WorkLife Item' : 'New WorkLife Item'}</span>
              <button className="dash-modal-close" onClick={() => setModalOpen(false)} aria-label="Close WorkLife editor"><X size={18} /></button>
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
                  <label className="dash-form-label">{form.type === 'image' ? 'Default order' : 'Video order'}</label>
                  <input className="dash-form-input" type="number" value={form.order} onChange={e => setField('order', Number(e.target.value))} />
                </div>
              </div>

              {form.type === 'image' && <fieldset className="dash-seo-fields">
                <legend>Gallery order by device</legend>
                <p className="dash-field-help">Set independent positions for each layout. Lower numbers appear first; leave a position blank to use the default order. Equal positions use the default order, then the upload date. Mobile applies up to 700px; tablets and larger screens use desktop order.</p>
                <div className="dash-form-row">
                  <label className="dash-form-group">
                    <span className="dash-form-label">Desktop / tablet position</span>
                    <input className="dash-form-input" type="number" min="0" step="1" inputMode="numeric" placeholder={`Default: ${form.order}`} value={form.desktopOrder} onChange={event => setField('desktopOrder', event.target.value)} />
                  </label>
                  <label className="dash-form-group">
                    <span className="dash-form-label">Mobile position</span>
                    <input className="dash-form-input" type="number" min="0" step="1" inputMode="numeric" placeholder={`Default: ${form.order}`} value={form.mobileOrder} onChange={event => setField('mobileOrder', event.target.value)} />
                  </label>
                </div>
              </fieldset>}

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
