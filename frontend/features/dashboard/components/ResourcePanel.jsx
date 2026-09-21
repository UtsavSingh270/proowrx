'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Save, FileText, Download } from 'lucide-react';
import { resources as resourcesApi, upload as uploadApi } from '@/services/api';
import FileUploadInput from '@/components/shared/FileUploadInput';

const EMPTY_RESOURCE = {
  title: '',
  topic: 'General',
  desc: '',
  image: '',
  pdfUrl: '',
  active: true,
};

export default function ResourcePanel() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY_RESOURCE);
  const [editingId, setEditingId] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setResources(await resourcesApi.getAdminAll());
    } catch (err) {
      setResources([]);
    } finally {
      setLoading(false);
    }
  }, []);

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
    if (!form.pdfUrl || (typeof form.pdfUrl === 'string' && !form.pdfUrl.trim())) {
      setError('A PDF file or URL is required.');
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
        <span className="dash-section-title">Resources</span>
        <button className="dash-btn dash-btn-primary" onClick={openNew}>
          <Plus size={15} /> New Resource
        </button>
      </div>

      {loading ? (
        <div className="dash-empty">Loading…</div>
      ) : resources.length === 0 ? (
        <div className="dash-empty">No resources yet. Upload a PDF and create a resource item.</div>
      ) : (
        <table className="dash-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Topic</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.map(resource => (
              <tr key={resource._id}>
                <td>{resource.title}</td>
                <td>{resource.topic}</td>
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
              <span className="dash-modal-title">{editingId ? 'Edit Resource' : 'New Resource'}</span>
              <button className="dash-modal-close" onClick={() => setModalOpen(false)}>×</button>
            </div>

            <div className="dash-modal-body">
              <div className="dash-form-row">
                <div className="dash-form-group">
                  <label className="dash-form-label">Title *</label>
                  <input className="dash-form-input" value={form.title} onChange={e => setField('title', e.target.value)} />
                </div>
                <div className="dash-form-group">
                  <label className="dash-form-label">Topic</label>
                  <input className="dash-form-input" value={form.topic} onChange={e => setField('topic', e.target.value)} placeholder="General" />
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
                placeholder="Upload image or paste URL"
                description="Optional image shown on resource cards."
                allowUrl={true}
              />

              <FileUploadInput
                value={form.pdfUrl}
                onChange={value => setField('pdfUrl', value)}
                label="PDF File"
                accept="application/pdf,.pdf"
                placeholder="Upload a PDF file"
                description="Upload the resource PDF. This file is required."
                allowUrl={true}
              />

              <div className="dash-form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <input id="resource-active" type="checkbox" checked={form.active} onChange={e => setField('active', e.target.checked)} />
                <label htmlFor="resource-active" style={{ fontSize: '0.86rem', color: '#374a6e', cursor: 'pointer' }}>
                  Active on resource page
                </label>
              </div>

              {error && <div className="dash-login-err" style={{ marginTop: 12 }}>{error}</div>}
            </div>

            <div className="dash-modal-footer">
              <button className="dash-btn dash-btn-ghost" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</button>
              <button className="dash-btn dash-btn-primary" onClick={handleSave} disabled={saving}>
                <Save size={14} /> {saving ? 'Saving…' : 'Save Resource'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
