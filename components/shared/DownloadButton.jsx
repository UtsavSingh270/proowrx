'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { resources } from '@/services/api';
import '@/styles/InfoPages.css';

export default function DownloadButton({ resource }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const dialog = useRef(null);
  const trigger = useRef(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.querySelector('input')?.focus();
    return () => { document.body.style.overflow = previous; trigger.current?.focus(); };
  }, [open]);
  function keyDown(event) {
    if (event.key === 'Escape' && !busy) setOpen(false);
    if (event.key !== 'Tab') return;
    const items = [...dialog.current.querySelectorAll('button:not(:disabled),input,a[href]')];
    if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items.at(-1)?.focus(); }
    if (!event.shiftKey && document.activeElement === items.at(-1)) { event.preventDefault(); items[0]?.focus(); }
  }
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const result = await resources.requestDownload({ ...form, resourceSlug: resource.slug, sourcePage: window.location.pathname });
      setDownloadUrl(result.downloadUrl);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <><button ref={trigger} className="btn btn-gold" type="button" onClick={() => { setOpen(true); setError(''); setDownloadUrl(''); }}>Download</button>
    {open && <div className="resource-modal-overlay" onMouseDown={event => { if (event.target === event.currentTarget && !busy) setOpen(false); }}><div ref={dialog} className="resource-modal" role="dialog" aria-modal="true" aria-label={`Download ${resource.title}`} onKeyDown={keyDown}>
      <button type="button" className="resource-modal-close" disabled={busy} aria-label="Close download form" onClick={() => setOpen(false)}>×</button>
      <h2>{resource.title}</h2>
      {downloadUrl ? <div role="status"><p>Your download is ready.</p><a href={downloadUrl} className="btn btn-gold" download target="_blank" rel="noreferrer">Download file</a><p className="dash-field-help">This link is available for 10 minutes.</p></div> : <form className="resource-form" onSubmit={submit}>
        <p>Enter your details to access this file.</p>
        {[['name', 'Name', 'text'], ['email', 'Email', 'email'], ['phone', 'Contact number', 'tel']].map(([key, label, type]) => <label key={key}>{label} *<input required type={type} autoComplete={key === 'phone' ? 'tel' : key} value={form[key]} onChange={event => setForm(current => ({ ...current, [key]: event.target.value }))} maxLength={key === 'email' ? 254 : 160} /></label>)}
        <p>We’ll use these details to handle your resource enquiry. <Link href="/privacy-policy">Privacy policy</Link></p>
        {error && <p className="resource-error" role="alert">{error}</p>}
        <button className="btn btn-gold" disabled={busy}>{busy ? 'Preparing…' : 'Get download'}</button>
      </form>}
    </div></div>}
  </>;
}
