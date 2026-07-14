'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight, CheckCircle, X as XIcon, Zap, Shield,
  FileCheck, TrendingUp, Clock, BarChart3,
} from 'lucide-react';
import CtaBanner from '../../../components/CtaBanner';
import './PayPerApplication.css';

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const standardFeatures = [
  'Data entry on aggregator CRM',
  'Fill in ApplyOnline (AOL)',
  'Validation and compliance checks',
  'Upload all supporting documents',
  'FHOG / FHLDS form completion',
  'Lodge application to lender',
];

const comprehensiveFeatures = [
  'Everything in Standard, plus:',
  'Follow-ups with lender, solicitors & clients',
  'Coordinate valuation orders',
  'Pricing / rate lock negotiations',
  'Construction progress payment tracking',
  'Post-settlement follow-up',
];

const comparisons = [
  { label: 'Pay monthly retainer', standard: false, comprehensive: false, hiring: true },
  { label: 'Pay only per file', standard: true, comprehensive: true, hiring: false },
  { label: 'Lock-in contract', standard: false, comprehensive: false, hiring: true },
  { label: 'Trained in AOL & aggregator CRMs', standard: true, comprehensive: true, hiring: '?' },
  { label: '24-hr turnaround SLA', standard: true, comprehensive: true, hiring: false },
  { label: 'Post-lodgement follow-up', standard: false, comprehensive: true, hiring: true },
  { label: 'Scales with your volume', standard: true, comprehensive: true, hiring: false },
];

const whyItems = [
  { icon: <TrendingUp size={20} />, title: 'Scale Without Overhead', body: 'Send one file or fifty — you only pay for what you use. No idle staff costs during quiet periods.' },
  { icon: <Clock size={20} />, title: '24-Hour Turnaround', body: 'Files submitted by 3 PM AEST are returned within 24 business hours, fully processed and ready to lodge.' },
  { icon: <FileCheck size={20} />, title: 'ATO & NCCP Compliant', body: 'Every application is checked against current compliance requirements before it leaves our team.' },
  { icon: <Shield size={20} />, title: 'Bank-Grade Security', body: 'All files are handled in our ISO-aligned secure environment with end-to-end encryption and audit trails.' },
];

const process = [
  { n: '01', title: 'Submit Your File', body: 'Upload the client file and any instructions to our secure portal. Email or shared folder options available.' },
  { n: '02', title: 'We Process It', body: 'Our trained team completes the relevant package tasks — AOL, CRM entry, compliance checks and lodgement.' },
  { n: '03', title: 'Quality Check', body: 'A senior processor reviews the work before it leaves our team, catching errors before they reach the lender.' },
  { n: '04', title: 'File Returned', body: 'You receive the fully processed, lodged file with a completion checklist and all documents organised.' },
];

export default function PayPerApplication() {
  const r1 = useReveal(), r2 = useReveal(), r3 = useReveal(), r4 = useReveal(), r5 = useReveal();

  return (
    <div>
      {/* ── Hero ── */}
      <section
        className="page-hero page-hero--split page-hero--img ppa-hero"
        style={{ '--hero-bg': 'url("https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1800&q=85")' }}
      >
        <div className="container">
          <div className="page-hero-content">
            <span className="chip chip-gold section-eyebrow">Pay Per Application</span>
            <h1>Only Pay When You Have a File</h1>
            <p>No lock-in contracts, no idle staff costs. Submit a file, we process it end-to-end, you close the loan. As simple as that.</p>
            <div className="page-hero-stats">
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">24hr</span>
                <span className="page-hero-stat-label">Turnaround<br/>SLA</span>
              </div>
              <div className="page-hero-stat-divider" />
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">$0</span>
                <span className="page-hero-stat-label">Setup or<br/>Retainer</span>
              </div>
              <div className="page-hero-stat-divider" />
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">100%</span>
                <span className="page-hero-stat-label">ATO<br/>Compliant</span>
              </div>
            </div>
            <div className="page-hero-actions">
              <Link href="/contact" className="btn btn-gold">Submit a File <ArrowRight size={15} /></Link>
              <a href="#packages" className="btn btn-ghost">View Packages</a>
            </div>
          </div>
          <div className="page-hero-visual">
            <img
              src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=85"
              alt="Mortgage application processing"
            />
            <div className="page-hero-badge-float">
              <strong>💼 No Lock-in Contract</strong>
              <span>Standard &amp; Comprehensive</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why PPA ── */}
      <section className="section">
        <div className="container">
          <div ref={r1} className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="chip chip-sky section-eyebrow">Why Pay Per Application</span>
            <h2 className="section-title">The Flexible Alternative to Hiring</h2>
            <p className="section-body" style={{ maxWidth: 560, margin: '0 auto' }}>
              For brokers with fluctuating volumes, a Pay Per Application model gives you professional processing capacity exactly when you need it — without the overhead of permanent staff.
            </p>
          </div>
          <div className="ppa-why-grid" ref={r2}>
            {whyItems.map((w, i) => (
              <div key={i} className={`ppa-why-card reveal reveal-delay-${i + 1}`}>
                <div className="ppa-why-icon">{w.icon}</div>
                <h4 className="ppa-why-title">{w.title}</h4>
                <p className="ppa-why-body">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Packages ── */}
      <section className="section" id="packages" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div ref={r3} className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="chip chip-gold section-eyebrow">Our Packages</span>
            <h2 className="section-title">Standard vs Comprehensive</h2>
            <p className="section-body" style={{ maxWidth: 520, margin: '0 auto' }}>
              Both packages are priced per file. Choose based on how much of the process you want us to own.
            </p>
          </div>
          <div className="ppa-packages">
            {/* Standard */}
            <div className="ppa-package reveal reveal-delay-1">
              <div className="ppa-package-header ppa-package-header--standard">
                <Zap size={22} />
                <div>
                  <h3 className="ppa-package-name">Standard</h3>
                  <p className="ppa-package-sub">Lodgement-ready processing</p>
                </div>
              </div>
              <ul className="ppa-feature-list">
                {standardFeatures.map((f, i) => (
                  <li key={i}><CheckCircle size={15} className="ppa-check" /><span>{f}</span></li>
                ))}
              </ul>
              <Link href="/contact" className="btn btn-outline-gold ppa-pkg-btn">
                Get Standard Pricing <ArrowRight size={14} />
              </Link>
            </div>

            {/* Comprehensive */}
            <div className="ppa-package ppa-package--featured reveal reveal-delay-2">
              <div className="ppa-package-badge">Most Popular</div>
              <div className="ppa-package-header ppa-package-header--comp">
                <BarChart3 size={22} />
                <div>
                  <h3 className="ppa-package-name">Comprehensive</h3>
                  <p className="ppa-package-sub">End-to-end file management</p>
                </div>
              </div>
              <ul className="ppa-feature-list">
                {comprehensiveFeatures.map((f, i) => (
                  <li key={i} className={i === 0 ? 'ppa-feature-divider' : ''}>
                    {i === 0
                      ? <span className="ppa-divider-label">{f}</span>
                      : <><CheckCircle size={15} className="ppa-check ppa-check--gold" /><span>{f}</span></>
                    }
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="btn btn-gold ppa-pkg-btn">
                Get Comprehensive Pricing <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          <p className="ppa-pricing-note">
            Pricing is per-file and volume-tiered. Contact us for a quote tailored to your monthly application volumes.
          </p>
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="section" ref={r4}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="chip chip-violet section-eyebrow">Comparison</span>
            <h2 className="section-title">PPA vs Hiring In-House</h2>
          </div>
          <div className="ppa-table-wrap">
            <table className="ppa-table">
              <thead>
                <tr>
                  <th></th>
                  <th><span className="ppa-th-label">Standard</span></th>
                  <th><span className="ppa-th-label">Comprehensive</span></th>
                  <th><span className="ppa-th-label ppa-th-label--dim">Hiring</span></th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, i) => (
                  <tr key={i}>
                    <td className="ppa-row-label">{row.label}</td>
                    <td><CmpCell val={row.standard} /></td>
                    <td><CmpCell val={row.comprehensive} /></td>
                    <td><CmpCell val={row.hiring} dim /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div ref={r5} className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="chip chip-emerald section-eyebrow">The Process</span>
            <h2 className="section-title">How It Works, Step by Step</h2>
          </div>
          <div className="ppa-process">
            {process.map((s, i) => (
              <div key={i} className={`ppa-step reveal reveal-delay-${i + 1}`}>
                <div className="ppa-step-num">{s.n}</div>
                <h4 className="ppa-step-title">{s.title}</h4>
                <p className="ppa-step-body">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}

function CmpCell({ val, dim }) {
  if (val === true) return (
    <div className="ppa-cell-yes"><CheckCircle size={16} /></div>
  );
  if (val === false) return (
    <div className={`ppa-cell-no ${dim ? 'ppa-cell-no--dim' : ''}`}><XIcon size={14} /></div>
  );
  return <div className="ppa-cell-maybe">?</div>;
}
