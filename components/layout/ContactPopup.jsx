'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Phone, Mail, Calendar } from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import Image from 'next/image';
import { contact } from '@/services/api';
import './ContactPopup.css';

const LOGO = '/Proowrx_Logo.png';
const CONSENT_COOKIE = 'proowrx_cookie_consent';

function hasConsentChoice() {
  return document.cookie.split('; ').some(row => row.startsWith(`${CONSENT_COOKIE}=`));
}

export default function ContactPopup() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', interest: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let timer;
    const schedule = () => {
      if (timer || sessionStorage.getItem('cpopup_shown') || !hasConsentChoice()) return;
      timer = setTimeout(() => {
        setOpen(true);
        sessionStorage.setItem('cpopup_shown', '1');
      }, 6000);
    };
    schedule();
    window.addEventListener('proowrx:consent-choice', schedule);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('proowrx:consent-choice', schedule);
    };
  }, []);

  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const handler = e => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleSubmit = async e => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      await contact.submit({ ...form, source: 'popup' });
      setSent(true);
      setTimeout(() => { setSent(false); close(); }, 3000);
    } catch {
      setError('Could not send your request. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  return (
    <div className="cpopup-overlay" onClick={close}>
      <div className="cpopup-card" role="dialog" aria-modal="true" aria-label="Contact Proowrx" onClick={e => e.stopPropagation()}>
        {/* Close */}
        <button className="cpopup-close" onClick={close} aria-label="Close">
          <X size={18} />
        </button>

        {/* Left panel */}
        <div className="cpopup-left">
          <div className="cpopup-left-bg" />
          <Image src={LOGO} alt="Proowrx" className="cpopup-logo" width={164} height={48} />
          <h3>Let&apos;s connect</h3>
          <p>We&apos;d love to learn about your business and show you how Proowrx can help you scale.</p>

          <div className="cpopup-contact-links">
            <a href="tel:+61288341222" className="cpopup-link">
              <Phone size={16} /> 02 8834 1222
            </a>
            <a href="mailto:support@proowrx.com" className="cpopup-link">
              <Mail size={16} /> support@proowrx.com
            </a>
            <a href="https://calendly.com/proowrx/30min" target="_blank" rel="noreferrer" className="cpopup-link">
              <Calendar size={16} /> Book a 30-min call
            </a>
          </div>

          <div className="cpopup-socials">
            <a href="https://www.facebook.com/proowrx/" target="_blank" rel="noreferrer"><FaFacebook size={16} /></a>
            <a href="https://www.instagram.com/proowrx/" target="_blank" rel="noreferrer"><FaInstagram size={16} /></a>
            <a href="https://twitter.com/proowrx/" target="_blank" rel="noreferrer"><FaXTwitter size={16} /></a>
            <a href="https://www.linkedin.com/company/proowrx/about/" target="_blank" rel="noreferrer"><FaLinkedinIn size={16} /></a>
          </div>
        </div>

        {/* Right panel */}
        <div className="cpopup-right">
          {sent ? (
            <div className="cpopup-success">
              <div className="cpopup-success-check">✓</div>
              <h4>We&apos;ll be in touch!</h4>
              <p>Thank you — our team will contact you within 24 hours.</p>
            </div>
          ) : (
            <>
              <div className="cpopup-badge">Serving Australian Professionals</div>
              <h2>Get a Free <span className="cpopup-highlight">Discovery Call</span></h2>
              <p className="cpopup-sub">No commitments. Just an honest conversation about how we can support your business.</p>

              <form onSubmit={handleSubmit} className="cpopup-form">
                <input
                  type="text"
                  placeholder="Your Full Name"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  required
                />
                <input
                  type="email"
                  placeholder="Business Email Address"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  required
                />
                <select
                  value={form.interest}
                  onChange={e => setForm(p => ({ ...p, interest: e.target.value }))}
                >
                  <option value="">I&apos;m Interested in… (Optional)</option>
                  <option value="mortgage">Mortgage Services</option>
                  <option value="accounting">Accounting Services</option>
                  <option value="digital-marketing">Digital Marketing Services</option>
                  <option value="asset-finance">Asset Finance Services</option>
                </select>
                {error && <p className="cpopup-privacy" role="alert">{error}</p>}
                <button type="submit" className="cpopup-submit" disabled={sending}>
                  {sending ? 'Sending...' : <>Book A Free Call <ArrowRight size={15} /></>}
                </button>
              </form>

              <p className="cpopup-privacy">🔒 Your data is safe. We never share your information.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
