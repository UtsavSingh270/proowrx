'use client';

import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { Download, FileText, ShieldCheck, X } from 'lucide-react';
import { resources as resourcesApi } from '../../../services/api';
import CtaBanner from '../../../components/CtaBanner';
import './InfoPages.css';

export default function ResourcesClient({ initialResources }) {
const [resourceItems] = useState(initialResources || []);
  const [active, setActive] = useState(null);
  const [step, setStep] = useState('details');
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '' });
  const [requestId, setRequestId] = useState('');
  const [otp, setOtp] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function openDownload(resource) {
    setActive(resource);
    setStep('details');
    setForm({ name: '', email: '', phone: '', company: '' });
    setRequestId('');
    setOtp('');
    setError('');
  }

  async function requestOtp(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await resourcesApi.requestOtp({ resourceSlug: active.slug, ...form });
      setRequestId(data.requestId);
      setStep('otp');
    } catch (err) {
      setError(err.message || 'Could not send OTP.');
    } finally {
      setBusy(false);
    }
  }

  async function verifyOtp(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await resourcesApi.verifyOtp({ requestId, otp });
      window.location.href = resourcesApi.downloadUrl(data.downloadUrl);
      setActive(null);
    } catch (err) {
      setError(err.message || 'Incorrect OTP.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <section
        className="page-hero page-hero--img info-hero"
        style={{ '--hero-bg': 'url("https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=85")' }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="chip chip-gold" style={{ marginBottom: 16 }}>Resources</span>
          <h1>Downloadable Guides</h1>
          <p>Helpful ebooks and checklists for mortgage, accounting, and secure outsourcing workflows.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {resourceItems.length === 0 ? (
            <div className="dash-empty">No downloadable resources are available right now.</div>
          ) : (
            <div className="resources-grid">
              {resourceItems.map(item => (
                <article key={item.slug} className="resource-card">
                 <Image
                   src={item.image}
                   alt={item.title}
                   width={500}
                   height={300}
                   className="resource-image"
                   loading="lazy"
                 />
                  <div className="resource-card-body">
                    <span className="chip chip-sky">{item.topic}</span>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                    <button type="button" className="btn btn-gold" onClick={() => openDownload(item)}>
                      <Download size={15} /> Download PDF
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {active && (
        <div className="resource-modal-overlay" onClick={() => setActive(null)}>
          <div className="resource-modal" onClick={e => e.stopPropagation()}>
            <button type="button" className="resource-modal-close" onClick={() => setActive(null)} aria-label="Close">
              <X size={18} />
            </button>
            <div className="resource-modal-head">
              {step === 'details' ? <FileText size={22} /> : <ShieldCheck size={22} />}
              <div>
                <h3>{active.title}</h3>
                <p>{step === 'details' ? 'Enter your details to receive an OTP.' : 'Enter the OTP sent to your email.'}</p>
              </div>
            </div>

            {step === 'details' ? (
              <form onSubmit={requestOtp} className="resource-form">
                <label>Name *</label>
                <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                <label>Email *</label>
                <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                <label>Phone</label>
                <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                <label>Company</label>
                <input value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
                {error && <div className="resource-error">{error}</div>}
                <button type="submit" className="btn btn-gold" disabled={busy}>
                  {busy ? 'Sending...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={verifyOtp} className="resource-form">
                <label>OTP *</label>
                <input required inputMode="numeric" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} />
                {error && <div className="resource-error">{error}</div>}
                <button type="submit" className="btn btn-gold" disabled={busy || otp.length < 6}>
                  {busy ? 'Verifying...' : 'Verify & Download'}
                </button>
                <button type="button" className="btn btn-outline-gold" onClick={() => setStep('details')}>
                  Edit Details
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <CtaBanner />
    </div>
  );
}
