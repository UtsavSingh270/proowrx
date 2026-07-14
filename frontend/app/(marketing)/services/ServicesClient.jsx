import React from 'react';
import Link from 'next/link';

import { ArrowRight, CheckCircle } from 'lucide-react';
import CtaBanner from '../../../components/CtaBanner';
import './Services.css';

const qualities = [
  { icon: '🎯', title: 'Accuracy', desc: 'Accurate processing within 24 hours of receiving all required documents.' },
  { icon: '⚡', title: 'Efficiency', desc: 'Error-free processing of cases within the stipulated time, every time.' },
  { icon: '🔄', title: 'Consistency', desc: 'Quality services consistently matching the client\'s expectations.' },
  { icon: '🔧', title: 'Flexibility', desc: 'Service offerings modified to suit your unique requirements.' },
];

const steps = [
  { num: '01', title: 'Receiving Application', desc: 'Brief overview of the case received from the broker along with a folder of required documents.' },
  { num: '02', title: 'Processing Application', desc: 'Data entry in CRM, preparing missing-info lists, sending compliance documents for signing.' },
  { num: '03', title: 'Lodgement', desc: 'Supporting documents attached, compliance check completed, broker notified when ready to lodge.' },
  { num: '04', title: 'Post Lodgement', desc: 'Follow up with banks, coordinate document delivery as per broker instructions until settlement.' },
];

export default function Services() {
  return (
    <div>
      <section
        className="page-hero page-hero--img"
        style={{ '--hero-bg': 'url("https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1800&q=85")' }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="chip chip-gold" style={{ marginBottom: 16 }}>What We Offer</span>
          <h1>Outsourcing, Anytime of the Day</h1>
          <p>Expert back-office services built specifically for Australian mortgage brokers and accounting professionals.</p>
        </div>
      </section>

      {/* 2 main services */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span className="chip chip-teal section-eyebrow">Core Services</span>
            <h2 className="section-title">Choose Your Service</h2>
          </div>
          <div className="svc-hero-pair">
            {/* Mortgage */}
            <Link href="/mortgage" className="svc-big-card svc-mortgage">
              <div className="svc-big-img">
                <img src="https://proowrx.com/wp-content/uploads/2022/05/ded-new.jpg" alt="Mortgage" loading="lazy" decoding="async" />
                <div className="svc-big-overlay" />
              </div>
              <div className="svc-big-content">
                <div className="svc-big-icon">🏠</div>
                <h2>Mortgage Services</h2>
                <p>Pay-Per-Application or Dedicated Resource models for loan processing, compliance, and settlement support.</p>
                <ul>
                  {['Pre & Post-submission', 'CRM & ApplyOnline', 'Compliance management', 'Lender follow-ups'].map(b => (
                    <li key={b}><CheckCircle size={14} />{b}</li>
                  ))}
                </ul>
                <span className="svc-big-cta">Explore Mortgage <ArrowRight size={15} /></span>
              </div>
            </Link>

            {/* Accounting */}
            <Link href="/accounting" className="svc-big-card svc-accounting">
              <div className="svc-big-img">
                <img src="https://proowrx.com/wp-content/uploads/2022/05/pay-new.jpg" alt="Accounting" loading="lazy" decoding="async" />
                <div className="svc-big-overlay" />
              </div>
              <div className="svc-big-content">
                <div className="svc-big-icon">📊</div>
                <h2>Accounting Services</h2>
                <p>Full-cycle accounting outsourcing for Australian accounting firms — bookkeeping to SMSF to tax lodgements.</p>
                <ul>
                  {['Bookkeeping & Payroll', 'Tax Returns & Planning', 'SMSF Management', 'BAS / IAS / STP'].map(b => (
                    <li key={b}><CheckCircle size={14} />{b}</li>
                  ))}
                </ul>
                <span className="svc-big-cta">Explore Accounting <ArrowRight size={15} /></span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Quality pillars */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="chip chip-gold section-eyebrow">Our Standards</span>
            <h2 className="section-title">What Every Service Includes</h2>
          </div>
          <div className="quality-grid">
            {qualities.map((q, i) => (
              <div key={i} className="quality-tile reveal">
                <span className="quality-icon">{q.icon}</span>
                <h4>{q.title}</h4>
                <p>{q.desc}</p>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.8rem', color: 'var(--text-3)' }}>
            * Subject to receipt of all required documents and information.
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span className="chip chip-teal section-eyebrow">How It Works</span>
            <h2 className="section-title">Our Process Flow</h2>
          </div>
          <div className="svc-process-grid">
            {steps.map((s, i) => (
              <div key={i} className="svc-process-card reveal">
                <div className="svc-process-num">{s.num}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}