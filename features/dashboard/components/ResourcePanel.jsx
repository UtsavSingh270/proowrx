'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Save } from 'lucide-react';
import { resources as resourcesApi, upload as uploadApi } from '@/services/api';
import SeoFields from './SeoFields';
import FileUploadInput from '@/components/shared/FileUploadInput';

const EMPTY_RESOURCE = {
  title: '',
  topic: 'General',
  desc: '',
  image: '',
  pdfUrl: '',
  active: true,
  seo: {},
  filename: '',
};

export default function ResourcePanel() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY_RESOURCE);
  const [editingId, setEditingId] = useState(null);

  const reload = useCallback(() => resourcesApi.getAdminAll()
    .then(setResources)
    .catch(err => { setResources([]); setError(err.message); })
    .finally(() => setLoading(false)), []);

  useEffect(() => { reload(); }, [reload]);

  function openNew() {
    setEditingId(null);
    setForm(EMPTY_RESOURCE);
    setError('');
    setModalOpen(true);
  }

  function openEdit(resource) {
    setEditingId(resource._id);
    setForm({
      title: resource.title || '',
      topic: resource.topic || 'General',
      desc: resource.desc || '',
      image: resource.image || '',
      pdfUrl: resource.pdfUrl || '',
      active: resource.active !== false,
      filename: resource.filename || '',
      seo: resource.seo || {},
    });
    setError('');
    setModalOpen(true);
  }

  function setField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!form.title.trim()) {
      setError('A resource title is required.');
      return;
    }
    if (!form.desc.trim()) { setError('A description is required.'); return; }
    if (!form.pdfUrl || (typeof form.pdfUrl === 'string' && !form.pdfUrl.trim())) {
      setError('A downloadable file is required.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        title: form.title.trim(),
        desc: form.desc.trim(),
        topic: form.topic.trim() || 'General',
      };

      if (form.image instanceof File) {
        const result = await uploadApi.uploadImage(form.image);
        payload.image = result.asset || result;
      }

      if (form.pdfUrl instanceof File) {
        const result = await uploadApi.uploadFile(form.pdfUrl);
        payload.pdfUrl = result.asset || result;
        payload.filename = form.pdfUrl.name;
      }

      if (editingId) {
        await resourcesApi.update(editingId, payload);
      } else {
        await resourcesApi.create(payload);
      }
      setModalOpen(false);
      reload();
    } catch (err) {
      setError(err.message || 'Unable to save resource.');
    } finally {
      setSaving(false);
    }
  }

  async function removeResource(id) {
    if (!window.confirm('Delete this resource permanently?')) return;
    try {
      await resourcesApi.remove(id);
      reload();
    } catch (err) {
      alert(err.message || 'Could not delete resource.');
    }
  }

  return (
    <div>
      <div className="dash-section-header">
        <span className="dash-section-title">Downloadables</span>
        <button className="dash-btn dash-btn-primary" onClick={openNew}>
          <Plus size={15} /> New Downloadable
        </button>
      </div>

      {loading ? (
        <div className="dash-empty">Loading…</div>
      ) : resources.length === 0 ? (
        <div className="dash-empty">No resources yet. Upload a file and create a downloadable.</div>
      ) : (
        <table className="dash-table">
          <thead>
            <tr>
              <th>Title</th>

              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.map(resource => (
              <tr key={resource._id}>
                <td>{resource.title}</td>

                <td>{resource.active ? 'Active' : 'Inactive'}</td>
                <td>
                  <div className="dash-table-actions">
                    <button className="dash-btn dash-btn-ghost dash-btn-sm" onClick={() => openEdit(resource)} title="Edit">
                      <Edit2 size={13} />
                    </button>
                    <button className="dash-btn dash-btn-danger dash-btn-sm" onClick={() => removeResource(resource._id)} title="Delete">
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
              <span className="dash-modal-title">{editingId ? 'Edit Downloadable' : 'New Downloadable'}</span>
              <button className="dash-modal-close" onClick={() => setModalOpen(false)}>×</button>
            </div>

            <div className="dash-modal-body">
              <div className="dash-form-row">
                <div className="dash-form-group">
                  <label className="dash-form-label">Title *</label>
                  <input className="dash-form-input" value={form.title} onChange={e => setField('title', e.target.value)} />
                </div>

              </div>

              <div className="dash-form-group">
                <label className="dash-form-label">Description</label>
                <textarea className="dash-form-textarea" rows={3} value={form.desc} onChange={e => setField('desc', e.target.value)} />
              </div>

              <FileUploadInput
                value={form.image}
                onChange={value => setField('image', value)}
                label="Cover Image"
                accept="image/*"
                placeholder="Choose image from computer"
                description="Optional image shown on resource cards."
                allowUrl={false}
              />

              <FileUploadInput
                value={form.pdfUrl}
                onChange={value => setField('pdfUrl', value)}
                label="Downloadable file *"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.zip"
                placeholder="Choose file from computer"
                description="PDF, Word, Excel, CSV, PowerPoint or ZIP. Maximum 50 MB."
                allowUrl={false}
              />

              <div className="dash-form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <input id="resource-active" type="checkbox" checked={form.active} onChange={e => setField('active', e.target.checked)} />
                <label htmlFor="resource-active" style={{ fontSize: '0.86rem', color: '#374a6e', cursor: 'pointer' }}>
                  Active on resource page
                </label>
              </div>

              <SeoFields value={form.seo} onChange={value => setField('seo', value)} onUploadBusyChange={setUploading} fallbackTitle={form.title} fallbackDescription={form.desc} path="/resources/your-download" />

              {error && <div className="dash-login-err" style={{ marginTop: 12 }}>{error}</div>}
            </div>

            <div className="dash-modal-footer">
              <button className="dash-btn dash-btn-ghost" onClick={() => setModalOpen(false)} disabled={saving || uploading}>Cancel</button>
              <button className="dash-btn dash-btn-primary" onClick={handleSave} disabled={saving || uploading}>
                <Save size={14} /> {saving ? 'Saving…' : 'Save Downloadable'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
