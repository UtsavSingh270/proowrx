'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';
import { uploadImageValue } from '@/lib/media';
import FileUploadInput from '@/components/shared/FileUploadInput';
import PagePicker from './PagePicker';
import SeoFields from './SeoFields';

const EMPTY = { title: '', clientName: '', industry: '', service: '', duration: '', summary: '', image: '', challenge: '', approach: '', results: '', metrics: [], testimonial: '', testimonialBy: '', status: 'draft', displayPages: [], seo: {} };

function CaseStudyEditor({ item, onClose, onSaved }) {
  const [form, setForm] = useState({ ...EMPTY, ...item });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const set = (key, value) => setForm(current => ({ ...current, [key]: value }));
  async function save(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const body = { ...form, image: await uploadImageValue(form.image) };
      if (item?._id) await apiClient.put(`/case-studies/${item._id}`, body);
      else await apiClient.post('/case-studies', body);
      onSaved(); onClose();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <div className="dash-modal-overlay"><form className="dash-modal" onSubmit={save} role="dialog" aria-modal="true" aria-labelledby="case-editor-title">
    <div className="dash-modal-header"><h2 id="case-editor-title" className="dash-modal-title">{item ? 'Edit case study' : 'New case study'}</h2><button type="button" className="dash-modal-close" onClick={onClose} disabled={busy || uploading} aria-label="Close">×</button></div>
    <fieldset disabled={busy} className="dash-modal-body dash-upload-field">
      <p className="dash-field-help">Tell the project story: the client’s challenge, your approach, and the outcome. Use only approved client details and results.</p>
      <div className="dash-form-row">{[['title', 'Case study title *'], ['clientName', 'Client / organisation'], ['industry', 'Industry'], ['service', 'Service delivered'], ['duration', 'Project duration']].map(([key, label]) => <label className="dash-form-group" key={key}><span className="dash-form-label">{label}</span><input className="dash-form-input" required={key === 'title'} value={form[key]} onChange={event => set(key, event.target.value)} /></label>)}</div>
      <FileUploadInput label="Project cover image" value={form.image} onChange={value => set('image', value)} allowUrl={false} accept="image/jpeg,image/png,image/webp,image/gif" />
      {[['summary', 'Project summary'], ['challenge', 'The challenge'], ['approach', 'Our approach / solution'], ['results', 'Results and impact']].map(([key, label]) => <label className="dash-form-group" key={key}><span className="dash-form-label">{label}{form.status === 'published' ? ' *' : ''}</span><textarea rows={key === 'summary' ? 3 : 5} className="dash-form-textarea" required={form.status === 'published'} value={form[key]} onChange={event => set(key, event.target.value)} /></label>)}
      <fieldset className="dash-seo-fields"><legend>Measurable outcomes</legend>{form.metrics.map((metric, index) => <div className="dash-form-row" key={index}>
        <label className="dash-form-group">Value<input required className="dash-form-input" placeholder="e.g. 30%" value={metric.value} onChange={event => set('metrics', form.metrics.map((m, i) => i === index ? { ...m, value: event.target.value } : m))} /></label>
        <label className="dash-form-group">Outcome<input required className="dash-form-input" placeholder="e.g. less processing time" value={metric.label} onChange={event => set('metrics', form.metrics.map((m, i) => i === index ? { ...m, label: event.target.value } : m))} /></label>
        <button type="button" className="dash-btn dash-btn-ghost" onClick={() => set('metrics', form.metrics.filter((_, i) => i !== index))}>Remove</button>
      </div>)}<button type="button" className="dash-btn dash-btn-ghost" disabled={form.metrics.length >= 6} onClick={() => set('metrics', [...form.metrics, { value: '', label: '' }])}>Add outcome metric</button></fieldset>
      <label className="dash-form-group">Client testimonial<textarea className="dash-form-textarea" value={form.testimonial} onChange={event => set('testimonial', event.target.value)} /></label>
      <label className="dash-form-group">Testimonial attribution<input className="dash-form-input" value={form.testimonialBy} onChange={event => set('testimonialBy', event.target.value)} /></label>
      <PagePicker value={form.displayPages} onChange={value => set('displayPages', value)} contentLabel="case study" />
      <SeoFields value={form.seo} onChange={value => set('seo', value)} onUploadBusyChange={setUploading} fallbackTitle={form.title} fallbackDescription={form.summary} path={item?.slug ? `/case-study/${item.slug}` : '/case-study/your-project'} />
      <label className="dash-form-group">Status<select className="dash-form-select" value={form.status} onChange={event => set('status', event.target.value)}><option value="draft">Draft</option><option value="published">Published</option><option value="paused">Paused</option></select></label>
      {error && <p role="alert" className="dash-login-err">{error}</p>}
    </fieldset><div className="dash-modal-footer"><button type="button" className="dash-btn dash-btn-ghost" onClick={onClose} disabled={busy || uploading}>Cancel</button><button className="dash-btn dash-btn-primary" disabled={busy || uploading}>{busy ? 'Saving…' : 'Save case study'}</button></div>
  </form></div>;
}

export default function CaseStudiesPanel() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [editor, setEditor] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const reload = () => apiClient.get('/case-studies/admin/all').then(data => { setItems(data); setError(''); }).catch(err => setError(err.message)).finally(() => setLoading(false));
  useEffect(() => { reload(); }, []);
  const filtered = items.filter(item => (!status || item.status === status) && [item.title, item.clientName, item.industry, item.service].join(' ').toLowerCase().includes(query.trim().toLowerCase()));
  async function remove(item) {
    if (!window.confirm(`Delete “${item.title}”?`)) return;
    try { await apiClient.delete(`/case-studies/${item._id}`); reload(); } catch (err) { setError(err.message); }
  }
  return <section><div className="dash-section-header"><h2 className="dash-section-title">Case Studies</h2><button className="dash-btn dash-btn-primary" onClick={() => setEditor('new')}>New case study</button></div>
    <div className="dash-content-filters"><input type="search" aria-label="Search case studies" className="dash-form-input" placeholder="Search title, client, industry or service…" value={query} onChange={event => setQuery(event.target.value)} /><select className="dash-form-select" aria-label="Case study status" value={status} onChange={event => setStatus(event.target.value)}><option value="">All statuses</option>{['draft', 'published', 'paused'].map(value => <option key={value}>{value}</option>)}</select><span>{filtered.length} results</span></div>
    {error && <p role="alert" className="dash-login-err">{error}</p>}
    {loading ? <p>Loading case studies…</p> : <div className="dash-table-wrap"><table className="dash-table"><thead><tr><th>Project</th><th>Client / industry</th><th>Status</th><th>Placements</th><th>Actions</th></tr></thead><tbody>{filtered.map(item => <tr key={item._id}><td>{item.title}</td><td>{item.clientName || item.industry || '—'}</td><td>{item.status}</td><td>{item.displayPages?.length || 0} pages</td><td><div className="dash-table-actions"><button className="dash-btn dash-btn-ghost" onClick={() => setEditor(item)}>Edit</button>{item.status === 'published' && <a className="dash-btn dash-btn-ghost" href={`/case-study/${item.slug}`} target="_blank" rel="noreferrer">View</a>}<button className="dash-btn dash-btn-danger" onClick={() => remove(item)}>Delete</button></div></td></tr>)}</tbody></table>{!filtered.length && <p className="dash-empty">No matching case studies.</p>}</div>}
    {editor && <CaseStudyEditor item={editor === 'new' ? null : editor} onClose={() => setEditor(null)} onSaved={reload} />}
  </section>;
}
