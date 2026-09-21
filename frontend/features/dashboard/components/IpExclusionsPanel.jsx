'use client';

import { useEffect, useState } from 'react';
import { Ban, Plus, RefreshCw, ShieldCheck, Trash2 } from 'lucide-react';
import { analytics } from '@/services/api';
import './IpExclusionsPanel.css';

export default function IpExclusionsPanel() {
  const [items, setItems] = useState([]);
  const [currentIp, setCurrentIp] = useState('');
  const [form, setForm] = useState({ ip: '', label: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await analytics.getExcludedIps();
      setItems(data.items || []);
      setCurrentIp(data.currentIp || '');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  // Intentional: fetch dashboard data once when this client-only panel mounts.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);

  async function addIp(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await analytics.addExcludedIp(form);
      setForm({ ip: '', label: '' });
      await load();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  async function removeIp(item) {
    if (!window.confirm(`Start counting engagement from ${item.ip} again?`)) return;
    try {
      await analytics.removeExcludedIp(item._id);
      setItems(current => current.filter(entry => entry._id !== item._id));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <section className="ip-exclusions-panel">
      <header className="ip-exclusions-header">
        <div><span>Analytics controls</span><h1>Excluded IP Addresses</h1><p>Activity from these addresses is ignored for website analytics, blog views, likes and new comments.</p></div>
        <button type="button" onClick={load} disabled={loading} aria-label="Refresh excluded IP addresses"><RefreshCw size={17} className={loading ? 'spin' : ''} /></button>
      </header>

      <div className="ip-exclusions-grid">
        <form className="ip-exclusions-form" onSubmit={addIp}>
          <div className="ip-exclusions-icon"><ShieldCheck size={24} /></div>
          <h2>Add an IP address</h2>
          <p>Exclusions apply to future activity. Ensure the backend proxy configuration reflects your hosting provider.</p>
          <label>IP address<input required value={form.ip} onChange={event => setForm(current => ({ ...current, ip: event.target.value }))} placeholder="203.0.113.42 or 2001:db8::1" /></label>
          <label>Label <span>Optional</span><input maxLength={120} value={form.label} onChange={event => setForm(current => ({ ...current, label: event.target.value }))} placeholder="Office, developer, agency…" /></label>
          {currentIp && <button type="button" className="ip-current-button" onClick={() => setForm(current => ({ ...current, ip: currentIp }))}>Use my current IP: <strong>{currentIp}</strong></button>}
          <button type="submit" className="ip-add-button" disabled={saving}><Plus size={17} /> {saving ? 'Adding…' : 'Exclude IP Address'}</button>
          {error && <p className="ip-exclusions-error" role="alert">{error}</p>}
        </form>

        <div className="ip-exclusions-list-card">
          <div className="ip-exclusions-list-heading"><div><span>Active exclusions</span><h2>{items.length} IP {items.length === 1 ? 'address' : 'addresses'}</h2></div><Ban size={22} /></div>
          {loading ? <div className="ip-exclusions-empty">Loading…</div> : items.length === 0 ? <div className="ip-exclusions-empty"><ShieldCheck size={28} /><strong>No excluded addresses</strong><span>All visitor activity is currently eligible for tracking.</span></div> : <div className="ip-exclusions-list">{items.map(item => <article key={item._id}><div><strong>{item.ip}</strong><span>{item.label || 'No label provided'}</span><small>Added {new Date(item.createdAt).toLocaleDateString('en-AU')}</small></div><button type="button" onClick={() => removeIp(item)} aria-label={`Remove ${item.ip}`} title="Remove exclusion"><Trash2 size={16} /></button></article>)}</div>}
        </div>
      </div>
    </section>
  );
}
