'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';
import pages from '@/data/pages.json';
import SeoFields, { EMPTY_SEO } from './SeoFields';

export default function SeoPanel() {
  const [entries, setEntries] = useState(null);
  const [path, setPath] = useState('/');
  const [query, setQuery] = useState('');
  const [seo, setSeo] = useState(EMPTY_SEO);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    apiClient.get('/seo').then(data => {
      if (!active) return;
      setEntries(data);
      setSeo({ ...EMPTY_SEO, ...data.find(entry => entry.path === '/')?.seo });
    }).catch(err => { if (active) setError(err.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!dirty) return;
    const warn = event => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  function select(next) {
    if (dirty && !window.confirm('Discard unsaved SEO changes for this page?')) return;
    setPath(next); setSeo({ ...EMPTY_SEO, ...entries?.find(entry => entry.path === next)?.seo });
    setDirty(false); setMessage('');
  }
  async function save(event) {
    event.preventDefault(); setSaving(true); setError(''); setMessage('');
    try {
      const entry = await apiClient.put('/seo', { path, seo });
      setEntries(current => [...current.filter(item => item.path !== path), entry]);
      setSeo({ ...EMPTY_SEO, ...entry.seo }); setDirty(false); setMessage('SEO settings saved. They apply on the next page load.');
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }
  const filtered = pages.filter(page => `${page.label} ${page.path}`.toLowerCase().includes(query.toLowerCase()));
  return <div>
    <div className="dash-section-header"><h2 className="dash-section-title">Page SEO</h2></div>
    <p className="dash-field-help">Manage static pages here. Edit individual blog and insight SEO in the post editor.</p>
    {loading ? <div className="dash-empty">Loading SEO settings…</div> : entries && <div className="dash-seo-layout">
      <aside className="dash-seo-pages"><input aria-label="Search static pages" type="search" className="dash-form-input" placeholder="Search pages…" value={query} onChange={event => setQuery(event.target.value)} />
        {filtered.map(page => <button disabled={saving || uploading} type="button" className={`dash-seo-page${path === page.path ? ' active' : ''}`} key={page.path} onClick={() => select(page.path)} aria-current={path === page.path ? 'page' : undefined}>{page.label}<small>{page.path}</small></button>)}
        {!filtered.length && <p>No matching pages.</p>}
      </aside>
      <form onSubmit={save} className="dash-seo-editor">
        <h3>{pages.find(page => page.path === path)?.label}</h3>
        <fieldset disabled={saving || uploading} className="dash-seo-form-content"><SeoFields onUploadBusyChange={setUploading} value={seo} onChange={next => { setSeo(next); setDirty(true); setMessage(''); }} path={path} fallbackTitle={pages.find(page => page.path === path)?.label} /></fieldset>
        <button className="dash-btn dash-btn-primary" disabled={saving || uploading || !dirty}>{saving ? 'Saving…' : 'Save SEO settings'}</button>
        {message && <p role="status">{message}</p>}
      </form>
    </div>}
    {error && <p className="dash-login-err" role="alert">{error}</p>}
  </div>;
}
