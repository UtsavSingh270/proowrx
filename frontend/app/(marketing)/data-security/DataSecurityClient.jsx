'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, Lock, Eye, Server, Users, FileCheck, Wifi, CheckCircle } from 'lucide-react';
import CtaBanner from '@/components/shared/CtaBanner';
import './DataSecurity.css';

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

const pillars = [
  {
    icon: <Users size={32} />,
    color: '#c9a227',
    glow: 'rgba(201,162,39,0.18)',
    num: '01',
    title: 'Administrative Security',
    desc: 'Robust administrative controls ensure only authorised personnel can access sensitive data and systems.',
    points: [
      'Signed Non-Disclosure Agreements (NDA) for all staff',
      'Strict need-to-know access controls',
      'Clean desk policy enforced at all times',
      'Mandatory security awareness training',
    ],
  },
  {
    icon: <Eye size={32} />,
    color: '#1f9e8e',
    glow: 'rgba(31,158,142,0.18)',
    num: '02',
    title: 'Physical Security',
    desc: 'Multi-layer physical access controls protect our operations centre 24/7 against unauthorised entry.',
    points: [
      'Biometric access control at all entry points',
      '24/7 CCTV surveillance coverage',
      'Secure, restricted-access server room',
      'No personal devices permitted in work area',
    ],
  },
  {
    icon: <Wifi size={32} />,
    color: '#c9a227',
    glow: 'rgba(201,162,39,0.18)',
    num: '03',
    title: 'Technological Security',
    desc: 'Advanced technology safeguards protect data at rest and in transit across all our systems and tools.',
    points: [
      'Australia-based data servers only',
      'Two-factor authentication (2FA) on all logins',
      'End-to-end encrypted data transfers',
      'Regular vulnerability assessments & patching',
    ],
  },
  {
    icon: <FileCheck size={32} />,
    color: '#1f9e8e',
    glow: 'rgba(31,158,142,0.18)',
    num: '04',
    title: 'Operational Security',
    desc: 'Rigorous operational procedures and protocols ensure consistent data handling practices across all workflows.',
    points: [
      'Secure file sharing and document portals only',
      'No data stored on personal or local devices',
      'Audit trails for all data access events',
      'Incident response plan in place',
    ],
  },
];

const features = [
  { icon: <Server size={22} />, title: 'Australia-Based Servers', desc: 'All client data is stored exclusively on Australia-based servers, keeping it within Australian jurisdiction at all times.' },
  { icon: <Lock size={22} />, title: 'Two-Factor Authentication', desc: 'Every login to our systems requires two-factor authentication — no exceptions, even for senior staff.' },
  { icon: <Shield size={22} />, title: 'Biometric Access', desc: 'Physical entry to our operations centre requires biometric verification, preventing any unauthorised access.' },
  { icon: <Eye size={22} />, title: 'CCTV Monitoring', desc: '24/7 CCTV coverage of all work areas ensures complete visibility of who accesses data at all times.' },
  { icon: <Users size={22} />, title: 'NDA-Signed Staff', desc: 'Every team member signs a comprehensive NDA before handling any client data or files.' },
  { icon: <FileCheck size={22} />, title: 'Clean Desk Policy', desc: 'No papers, notes, or sensitive materials left unattended — our clean desk policy is strictly enforced.' },
];

export default function DataSecurity() {
  const r1 = useReveal(), r2 = useReveal(), r3 = useReveal(), r4 = useReveal();

  return (
    <div>
      <section
        className="page-hero page-hero--split page-hero--img ds-hero"
        style={{ '--hero-bg': 'url("https://images.unsplash.com/photo-1639762681057-408e52192e55?auto=format&fit=crop&w=1800&q=85")' }}
      >
        <div className="page-hero-orb-1" />
        <div className="page-hero-orb-2" />
        <div className="container">
          <div className="page-hero-content">
            <span className="chip chip-teal" style={{ marginBottom: 20 }}>Data Security</span>
            <h1>Security at<br />Every Level</h1>
            <p>Your clients trust you with their most sensitive financial data. We make sure that trust is never broken — through 4 layers of ironclad security.</p>
            <div className="page-hero-actions">
              <a href="https://calendly.com/proowrx/30min" target="_blank" rel="noreferrer" className="btn btn-gold">
                Book a Discovery Call <ArrowRight size={15} />
              </a>
              <Link href="/contact" className="btn btn-ghost">Get in Touch</Link>
            </div>
            <div className="page-hero-stats">
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">4</span>
                <span className="page-hero-stat-label">Security Layers</span>
              </div>
              <div className="page-hero-stat-divider" />
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">2FA</span>
                <span className="page-hero-stat-label">All Logins</span>
              </div>
              <div className="page-hero-stat-divider" />
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">24/7</span>
                <span className="page-hero-stat-label">CCTV Monitoring</span>
              </div>
            </div>
          </div>
          <div className="page-hero-visual ds-hero-visual">
            <div className="ds-hero-shield-wrap">
              <Shield size={200} strokeWidth={0.6} />
              <div className="ds-shield-badge ds-shield-badge-1">
                <Lock size={13} /> End-to-End Encrypted
              </div>
              <div className="ds-shield-badge ds-shield-badge-2">
                <Server size={13} /> AU-Based Servers
              </div>
              <div className="ds-shield-badge ds-shield-badge-3">
                <Eye size={13} /> Zero-Trust Access
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Promise */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container ds-promise">
          <div ref={r1} className="reveal-left ds-promise-text">
            <span className="chip chip-gold section-eyebrow">Our Commitment</span>
            <h2 className="section-title">Data Security Is Our Foundation, Not an Afterthought</h2>
            <p className="section-body" style={{ maxWidth: '100%' }}>
              When you outsource to Proowrx, you&apos;re sharing highly sensitive client data — mortgage files, financial records, personal details. We designed our entire infrastructure around protecting that data before writing a single line of process.
            </p>
            <p style={{ marginTop: 16, color: 'var(--text-2)', lineHeight: 1.75 }}>
              The entire data is stored on an Australia-based server that can be accessed via two-factor authentication only. Our physical premises employ biometric access and 24/7 CCTV monitoring. Every team member signs an NDA and undergoes regular security training.
            </p>
            <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['100% Australia-based data storage', 'Zero tolerance for data breaches', 'Full audit trail for all data access'].map(t => (
                <div key={t} className="ds-promise-point">
                  <CheckCircle size={18} color="var(--teal)" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div ref={r2} className="reveal-right ds-promise-image">
            <img
              src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=85"
              alt="Data Security at Proowrx"
            />
          </div>
        </div>
      </section>

      {/* 4 Pillars */}
      <section className="section">
        <div className="container">
          <div ref={r3} className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="chip chip-teal section-eyebrow">The 4 Pillars</span>
            <h2 className="section-title">A Complete Security Framework</h2>
            <p className="section-body" style={{ margin: '0 auto' }}>
              We&apos;ve built a four-layer security model that covers every angle — from the people who work for us to the servers that store your data.
            </p>
          </div>
          <div className="ds-pillars-grid">
            {pillars.map((p, i) => (
              <div
                key={i}
                className={`ds-pillar reveal reveal-delay-${i + 1}`}
                style={{ '--pillar-color': p.color, '--pillar-glow': p.glow }}
              >
                <div className="ds-pillar-header">
                  <div className="ds-pillar-icon" style={{ color: p.color, background: p.glow }}>
                    {p.icon}
                  </div>
                  <div className="ds-pillar-num">{p.num}</div>
                </div>
                <h3>{p.title}</h3>
                <p className="ds-pillar-desc">{p.desc}</p>
                <ul className="ds-pillar-list">
                  {p.points.map((pt, j) => (
                    <li key={j}>
                      <CheckCircle size={14} color={p.color} />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="section" style={{ background: 'var(--navy)' }}>
        <div className="container">
          <div ref={r4} className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="chip chip-white section-eyebrow">In Detail</span>
            <h2 className="section-title section-title--white">Security Measures at a Glance</h2>
          </div>
          <div className="ds-features-grid">
            {features.map((f, i) => (
              <div key={i} className={`ds-feature-card reveal reveal-delay-${(i % 3) + 1}`}>
                <div className="ds-feature-icon">{f.icon}</div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Band */}
      <section className="ds-trust-band">
        <div className="container ds-trust-inner">
          <div className="ds-trust-stat">
            <span className="ds-trust-num">2FA</span>
            <span className="ds-trust-label">On every single login</span>
          </div>
          <div className="ds-trust-divider" />
          <div className="ds-trust-stat">
            <span className="ds-trust-num">100%</span>
            <span className="ds-trust-label">Australia-based servers</span>
          </div>
          <div className="ds-trust-divider" />
          <div className="ds-trust-stat">
            <span className="ds-trust-num">24/7</span>
            <span className="ds-trust-label">CCTV & monitoring</span>
          </div>
          <div className="ds-trust-divider" />
          <div className="ds-trust-stat">
            <span className="ds-trust-num">4</span>
            <span className="ds-trust-label">Security layers</span>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
