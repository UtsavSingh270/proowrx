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
    desc: 'We have clear rules about who can access information and how to handle confidential data. Our staff follow these rules as part of their work at Proowrx.',
    points: [
      'Staff must sign a non-disclosure agreement.',
'Internet usage is monitored.',
'Staff must adhere to our code of ethics.',
'Our team adheres to anti-bribery requirements.'
    ],
  },
  {
    icon: <Eye size={32} />,
    color: '#1f9e8e',
    glow: 'rgba(31,158,142,0.18)',
    num: '02',
    title: 'Physical Security',
    desc: 'Our office has physical security measures to control access to the building and secure the operational areas. These measures also cover what happens in the event of an unexpected incident.',
    points: [
      'Fingerprint access for secure areas.',
'24/7 CCTV monitoring across the building.',
'Controlled access to the office and operations areas.',
'Disaster response plan for unexpected events.'
    ],
  },
  {
    icon: <Wifi size={32} />,
    color: '#c9a227',
    glow: 'rgba(201,162,39,0.18)',
    num: '03',
    title: 'Technological Security',
    desc: 'The technology we use to handle client information includes security measures to protect electronic data and reduce the risk of cyberattacks. This includes the tools we use to protect and exchange information.',
    points: [
      'Firewalls to help block external threats.',
'Data encryption for sensitive information.',
'Secure file exchange tools for sending and receiving data.',
'Security measures to help prevent cyberattacks.'
    ],
  },
  {
    icon: <FileCheck size={32} />,
    color: '#1f9e8e',
    glow: 'rgba(31,158,142,0.18)',
    num: '04',
    title: 'Operational Security',
    desc: 'Our day-to-day processes also include security checks to protect client information and keep work moving if something goes wrong. Our teams work together to manage access, respond to incidents and deal with unexpected disruptions.',
    points: [
      'Access controls for systems and information.',
'Incident response plans for security issues.',
'Business continuity plans for unexpected disruptions.',
'IT, security, and business teams work together to address security risks.'

    ],
  },
];

const features = [
  { icon: <Server size={22} />, title: 'Restricted On-Site Device Usage', desc: 'Office-issued laptops are used only in the working area and are not permitted to leave the office building. This keeps sensitive client information within a controlled work environment.' },
  { icon: <Lock size={22} />, title: 'Disabled Ports & Wireless Access', desc: 'We disable physical device ports and Bluetooth on our systems. This helps prevent unauthorised data transfers through external devices or wireless connections.' },
  { icon: <Shield size={22} />, title: 'Secured Devices', desc: 'Our systems have controlled access settings in place to prevent unauthorised use and changes to device configurations.' },
  { icon: <Eye size={22} />, title: 'No Local Data Storage', desc: 'We do not store client and business information locally on user devices. Instead, our teams access information through approved cloud-based systems.' },
  { icon: <Users size={22} />, title: 'Multi-Factor Authentication', desc: 'We use multi-factor authentication across our systems and applications. Staff need an additional verification step beyond their password to access the system.' },
  { icon: <FileCheck size={22} />, title: 'Tiered Data Access', desc: 'Access to client information is based on staff roles and responsibilities. Staff can access only the information they need for their assigned work.'},
  { icon: <FileCheck size={22} />, title: 'Restricted Internet Access', desc: 'Internet access on office devices is limited to approved websites. This keeps internet use focused on work-related activities and reduces exposure to unwanted websites and online threats.' },
  { icon: <FileCheck size={22} />, title: 'Cyber Security Software', desc: 'Our systems use firewalls, antivirus and anti-malware software, and intrusion detection and prevention systems. These tools help protect electronic data from external threats and cyber attacks.' },
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
            {/* <span className="chip chip-teal" style={{ marginBottom: 20 }}>Data Security</span> */}
            <h1>Data Security & Privacy @ Proowrx</h1>
            <p>We understand the responsibility that comes with handling our clients’ confidential information. Proowrx takes strict security measures to protect client data and prevent unauthorised access, data breaches and other security risks.</p>
            <div className="page-hero-actions">
              <a href="https://calendly.com/proowrx/30min" target="_blank" rel="noreferrer" className="btn btn-gold">
                Book a Discovery Call <ArrowRight size={15} />
              </a>
              <Link href="/contact" className="btn btn-ghost">Get in Touch</Link>
            </div>
            <div className="page-hero-stats">
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">ISO 27001:2022</span>
                <span className="page-hero-stat-label">Certified</span>
              </div>
              <div className="page-hero-stat-divider" />
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">24/7</span>
                <span className="page-hero-stat-label">CCTV Monitoring</span>
              </div>
              <div className="page-hero-stat-divider" />
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">100%</span>
                <span className="page-hero-stat-label">Client Data Protection</span>
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
            <h2 className="section-title">Our Approach to Data Security and Privacy</h2>
            <p className="section-body" style={{ maxWidth: '100%' }}>
              When you work with Proowrx, our staff handles financial records, customer information, and other business documents that should not be shared outside the scope of their assigned work. That is why access to client information is restricted. Our staff sign non-disclosure agreements, and we use measures such as firewalls, encryption and restricted system access to protect client information.
            </p>
            <p style={{ marginTop: 16, color: 'var(--text-2)', lineHeight: 1.75 }}>
              The working area is restricted and monitored by 24/7 CCTV. Staff follow procedures to ensure client information is not copied, removed, or accessed without authorisation. We review security policies regularly to prevent data breaches and other security threats.
            </p>
            <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Every team member signs a non-disclosure agreement before handling client data.', 'Our operations area is secured with biometric access and 24/7 CCTV. ', 'Only staff who need it for their assigned work can access client information.'].map(t => (
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
            <h2 className="section-title">Four Pillars of Data Security at Proowrx</h2>
            <p className="section-body" style={{ margin: '0 auto' }}>
              We don&apos;t rely on only one security measure to protect client information. Proowrx takes security measures across our people, workplace, technology and everyday business operations.
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
            <h2 className="section-title section-title--white">Security Measures We Use to Protect Client Data</h2>
            <p className="section-body" style={{ maxWidth: '100%' }}>
              We have several practical measures in place across our workplace, devices, and systems to protect client information as our team works with it.
            </p>
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
