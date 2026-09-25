'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, MapPin, Phone, Mail, Clock, CheckCircle, Send } from 'lucide-react';
import { contact } from '@/services/api';
import './Contact.css';

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const offices = [
  {
    flag: '🇮🇳',
    city: 'Jaipur, India',
    address: '2nd Floor, PTI Building, Jhalana Institutional Area, Jaipur – 302004',
    phones: ['+91 96104 11400', '+91-141-2952294'],
    emails: ['support@proowrx.com', 'naveenjain@proowrx.com'],
    color: '#1f9e8e',
  },
  {
    flag: '🇦🇺',
    city: 'Sydney, Australia',
    address: 'Suite 215, East Wing, 33 Lexington Drive, Bella Vista NSW – 2153',
    phones: ['02 8834 1222'],
    emails: ['support@proowrx.com', 'deepika@proowrx.com'],
    color: '#c9a227',
  },
];

export default function Contact() {
  const r1 = useReveal(), r2 = useReveal();
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('sending');
    try {
      await contact.submit({
        name: form.name,
        email: form.email,
        phone: form.phone,
        interest: form.service,
        message: form.message,
        source: 'contact_page',
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div>
      <section
        className="page-hero page-hero--split page-hero--img"
        style={{ '--hero-bg': 'url("https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1800&q=85")' }}
      >
        <div className="page-hero-orb-1" />
        <div className="page-hero-orb-2" />
        <div className="container">
          <div className="page-hero-content">
            <span className="chip chip-gold" style={{ marginBottom: 20 }}>Contact Us</span>
            <h1>Let&apos;s Start a<br />Conversation</h1>
            <p>Ready to discuss how Proowrx can support your business? Get in touch — we&apos;d love to hear from you.</p>
            <div className="page-hero-actions">
              <a href="https://calendly.com/proowrx/30min" target="_blank" rel="noreferrer" className="btn btn-gold">
                Book a 30-min Call <ArrowRight size={15} />
              </a>
              <a href="mailto:support@proowrx.com" className="btn btn-ghost">Email Us</a>
            </div>
            <div className="page-hero-stats">
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">24hr</span>
                <span className="page-hero-stat-label">Response Time</span>
              </div>
              <div className="page-hero-stat-divider" />
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">2</span>
                <span className="page-hero-stat-label">Global Offices</span>
              </div>
              <div className="page-hero-stat-divider" />
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">🇦🇺 🇮🇳</span>
                <span className="page-hero-stat-label">AU &amp; IN Support</span>
              </div>
            </div>
          </div>
          <div className="page-hero-visual">
            <Image src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=900&q=85" alt="Contact Proowrx" width={900} height={600} sizes="(max-width: 960px) 100vw, 45vw" />
            <div className="page-hero-badge-float">
              <span style={{ fontSize: '1.6rem' }}>📞</span>
              <div>
                <strong>Always Available</strong>
                <span>Mon–Fri, 9AM–6PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offices + Form */}
      <section className="section">
        <div className="container contact-grid">

          {/* Left — Offices & info */}
          <div ref={r1} className="reveal-left contact-info">
            <span className="chip chip-teal section-eyebrow">Our Offices</span>
            <h2 className="section-title" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', marginBottom: 8 }}>Find Us</h2>
            <p style={{ color: 'var(--text-2)', marginBottom: 36, lineHeight: 1.7 }}>
              We have offices in India and Australia. No matter where you are, we&apos;re just a call or message away.
            </p>

            {offices.map((o, i) => (
              <div key={i} className="office-info-card" style={{ '--office-color': o.color }}>
                <div className="office-info-header">
                  <span className="office-flag-large">{o.flag}</span>
                  <div>
                    <h3 className="office-city">{o.city}</h3>
                    <div className="office-color-bar" style={{ background: o.color }} />
                  </div>
                </div>
                <div className="office-detail">
                  <MapPin size={15} />
                  <span>{o.address}</span>
                </div>
                {o.phones.map(p => (
                  <div key={p} className="office-detail">
                    <Phone size={15} />
                    <a href={`tel:${p.replace(/\s/g, '')}`}>{p}</a>
                  </div>
                ))}
                {o.emails.map(em => (
                  <div key={em} className="office-detail">
                    <Mail size={15} />
                    <a href={`mailto:${em}`}>{em}</a>
                  </div>
                ))}
              </div>
            ))}

          </div>

          {/* Right — Contact Form */}
          <div ref={r2} className="reveal-right contact-form-wrap">
            <div className="contact-form-card">
              <h3>Send Us a Message</h3>
              <p>Fill in the form and we&apos;ll get back to you within 24 hours.</p>

              {status === 'success' ? (
                <div className="contact-success">
                  <div className="contact-success-icon">
                    <CheckCircle size={32} color="var(--teal)" />
                  </div>
                  <h4>Message Sent!</h4>
                  <p>Thank you for reaching out. Our team will be in touch with you within 24 hours.</p>
                  <button
                    className="btn btn-outline-gold"
                    style={{ marginTop: 20 }}
                    onClick={() => { setStatus('idle'); setForm({ name: '', email: '', phone: '', service: '', message: '' }); }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="cf-name">Full Name *</label>
                      <input
                        id="cf-name"
                        name="name"
                        type="text"
                        placeholder="John Smith"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cf-email">Email Address *</label>
                      <input
                        id="cf-email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="cf-phone">Phone Number</label>
                      <input
                        id="cf-phone"
                        name="phone"
                        type="tel"
                        placeholder="02 8834 1222"
                        value={form.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cf-service">Service Interested In</label>
                      <select
                        id="cf-service"
                        name="service"
                        value={form.service}
                        onChange={handleChange}
                      >
                        <option value="">Select a service</option>
                        <option value="mortgage">Mortgage Services</option>
                        <option value="accounting">Accounting Services</option>
                        <option value="both">Both Services</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="cf-message">Your Message *</label>
                    <textarea
                      id="cf-message"
                      name="message"
                      rows={5}
                      placeholder="Tell us about your business and what you're looking for..."
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-gold contact-submit-btn"
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? (
                      <>Sending…<span className="contact-spinner" /></>
                    ) : (
                      <>Send Message <Send size={15} /></>
                    )}
                  </button>
                  {status === 'error' && <p className="contact-form-note" role="alert">Could not send your message. Please try again.</p>}
                  <p className="contact-form-note">
                    We&apos;ll respond within 24 business hours. Your data is protected per our Privacy Policy.
                  </p>
                </form>
              )}
            </div>

            {/* Business Hours */}
            <div className="contact-hours contact-hours--right">
              <div className="contact-hours-header">
                <Clock size={18} color="var(--gold)" />
                <strong>Business Hours</strong>
              </div>
              <p>Monday – Friday: 9:00 AM – 6:00 PM (IST / AEDT)</p>
              <p>Weekend support available for urgent files.</p>
            </div>

            {/* Discovery CTA */}
            <a
              href="https://calendly.com/proowrx/30min"
              target="_blank"
              rel="noreferrer"
              className="btn btn-gold contact-calendly-btn"
            >
              Book a 30-min Discovery Call <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* Map-like strip */}
      <section className="contact-strip">
        <div className="container contact-strip-inner">
          <div className="contact-strip-item">
            <Mail size={22} color="var(--gold)" />
            <div>
              <strong>Email Us</strong>
              <a href="mailto:support@proowrx.com">support@proowrx.com</a>
            </div>
          </div>
          <div className="contact-strip-divider" />
          <div className="contact-strip-item">
            <Phone size={22} color="var(--gold)" />
            <div>
              <strong>Call (Australia)</strong>
              <a href="tel:+61288341222">02 8834 1222</a>
            </div>
          </div>
          <div className="contact-strip-divider" />
          <div className="contact-strip-item">
            <Phone size={22} color="var(--gold)" />
            <div>
              <strong>Call (India)</strong>
              <a href="tel:+919610411400">+91 96104 11400</a>
            </div>
          </div>
          <div className="contact-strip-divider" />
          {/* <div className="contact-strip-item">
            <Clock size={22} color="var(--gold)" />
            <div>
              <strong>Response Time</strong>
              <span>Within 24 hours</span>
            </div>
          </div> */}
        </div>
      </section>
    </div>
  );
}
