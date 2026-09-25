'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight, CheckCircle2, Shield, FileCheck,
  TrendingUp, Clock, Landmark, Receipt, Users,
  BarChart3, Settings2, Percent, CalendarCheck,
} from 'lucide-react';
import ServiceFaq from '@/components/shared/ServiceFaq';
import './BookKeeping.css';

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

/* ── Content ─────────────────────────────── */

const introPoints = [
  'No lock-in contracts — scale your bookkeeping up or down with your client base',
  'Trained across Xero, MYOB and QuickBooks Online',
  'Bank and credit card reconciliations completed daily or weekly, not at month-end',
  'BAS-ready books at all times, so lodgement day is never a scramble',
];

const provideItems = [
  { icon: <Landmark size={20} />, title: 'Bank & Card Reconciliation', body: 'Every transaction matched against your bank feed daily or weekly, so your ledger is accurate, not backdated at month-end.' },
  { icon: <Receipt size={20} />, title: 'Accounts Payable & Receivable', body: 'Bills entered and scheduled, invoices raised and followed up, so cash keeps moving in both directions.' },
  { icon: <Users size={20} />, title: 'Payroll & STP Lodgement', body: 'Pay runs processed on time, every time, with Single Touch Payroll lodged directly to the ATO.' },
  { icon: <FileCheck size={20} />, title: 'BAS & IAS Preparation', body: 'GST-coded transactions and activity statements prepared and ready for your accountant to review and lodge.' },
  { icon: <BarChart3 size={20} />, title: 'Financial & Management Reports', body: 'Profit & loss, balance sheet and cash flow reports delivered monthly, in a format you can actually act on.' },
  { icon: <Settings2 size={20} />, title: 'Software Setup & Clean-up', body: 'Xero, MYOB or QuickBooks configured, migrated or untangled — chart of accounts included.' },
  { icon: <Percent size={20} />, title: 'Payroll Tax & Super Reconciliation', body: 'Superannuation guarantee and payroll tax obligations tracked and reconciled every quarter.' },
  { icon: <CalendarCheck size={20} />, title: 'EOFY Finalisation', body: 'Year-end adjustments and STP finalisation handled, with a clean handover file ready for tax time.' },
];

const whyItems = [
  { icon: <TrendingUp size={20} />, title: 'Scale Without Overhead', body: 'Onboard one client or fifty — you only pay for the bookkeeping hours you use, with no idle staff costs.' },
  { icon: <Clock size={20} />, title: '48-Hour Turnaround', body: 'Reconciliations and reports submitted by end of day are returned within 48 business hours, ready to review.' },
  { icon: <FileCheck size={20} />, title: 'ATO & BAS Compliant', body: 'Every set of books is checked against current ATO and BAS requirements before it comes back to you.' },
  { icon: <Shield size={20} />, title: 'Bank-Grade Security', body: 'Client financial data is handled in our ISO-aligned secure environment with end-to-end encryption and audit trails.' },
];

const whySubItems = [
  { title: 'No Idle Costs', body: 'Nothing to pay in quiet months — your spend moves with your client volume, not a fixed headcount.' },
  { title: 'Faster Than Hiring', body: 'Onboard in 48 hours instead of the weeks it takes to recruit, train and ramp up an in-house bookkeeper.' },
  { title: 'Grows With You', body: 'The same team that handles your first client also handles your hundredth, with no renegotiation.' },
];

export default function Bookkeeping() {
  const r1 = useReveal(), r2 = useReveal(), r3 = useReveal(), r4 = useReveal();

  return (
    <div>
      {/* ── 1. Hero ── */}
      <section
        className="page-hero page-hero--split page-hero--img bk-hero"
        style={{ '--hero-bg': 'url("https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1800&q=85")' }}
      >
        <div className="container">
          <div className="page-hero-content">
            <span className="chip chip-gold section-eyebrow">Bookkeeping</span>
            <h1>Accurate Books, Delivered On Time, Every Time</h1>
            <p>Outsourced bookkeeping for accounting firms and businesses — reconciliations, payroll and BAS-ready reports, without adding headcount.</p>
            <div className="page-hero-stats">
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">48hr</span>
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
                <span className="page-hero-stat-label">BAS<br/>Compliant</span>
              </div>
            </div>
            {/* <div className="page-hero-actions">
              <a href="https://calendly.com/proowrx/30min" target="_blank" rel="noreferrer" className="btn btn-gold">
                Book a Meeting <ArrowRight size={15} />
              </a>
              <Link href="/contact" className="btn btn-gold">Send a Message<ArrowRight size={15} /></Link>
            </div> */}
          </div>
          <div className="page-hero-visual">
            <Image
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=85"
              alt="Bookkeeping and reconciliation on a laptop"
              width={800}
              height={533}
              sizes="(max-width: 960px) 100vw, 45vw"
            />
            <div className="page-hero-badge-float">
              <strong>📊 No Lock-in Contract</strong>
              <span>Standard &amp; Comprehensive</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Service Intro ── */}
      <section className="section">
        <div className="container bk-intro">
          <div ref={r1} className="reveal bk-intro-text">
            <span className="chip chip-sky section-eyebrow">The Smarter Alternative</span>
            <h2 className="section-title">Bookkeeping That Keeps Pace With Your Business</h2>
            <p className="section-body">
              Between reconciliations, chasing receipts and the EOFY squeeze, bookkeeping is the work that eats
              your week without growing your business. Proowrx takes the books off your plate — accurate,
              up to date, and ready whenever your accountant or tax agent needs them.
            </p>
            <ul className="bk-point-list">
              {introPoints.map((p, i) => (
                <li key={i}><CheckCircle2 size={17} className="bk-point-check" /><span>{p}</span></li>
              ))}
            </ul>
          </div>
          <div className="bk-intro-visual reveal reveal-delay-2" ref={r2}>
            <Image
              src="https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=800&q=85"
              alt="Reviewing financial reports and reconciliations"
              width={800}
              height={533}
              sizes="(max-width: 960px) 100vw, 45vw"
            />
          </div>
        </div>
      </section>

      {/* ── 3. What We Provide ── */}
      <section className="section" id="services" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div ref={r3} className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="chip chip-gold section-eyebrow">What We Provide</span>
            <h2 className="section-title">Everything Your Books Need, Handled</h2>
            <p className="section-body" style={{ maxWidth: 560, margin: '0 auto' }}>
              From daily reconciliations to EOFY finalisation, here&apos;s what a Proowrx bookkeeping engagement
              actually covers.
            </p>
          </div>
          <div className="bk-provide-grid">
            {provideItems.map((item, i) => (
              <div key={i} className={`bk-provide-item reveal reveal-delay-${(i % 4) + 1}`}>
                <div className="bk-provide-icon">{item.icon}</div>
                <h4 className="bk-provide-title">{item.title}</h4>
                <p className="bk-provide-body">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Why Choose ── */}
      <section className="section">
        <div className="container">
          <div ref={r4} className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="chip chip-violet section-eyebrow">Why Proowrx</span>
            <h2 className="section-title">Why Firms Choose Outsourced Bookkeeping</h2>
          </div>
          <div className="bk-why-grid">
            {whyItems.map((w, i) => (
              <div key={i} className={`bk-why-card reveal reveal-delay-${i + 1}`}>
                <div className="bk-why-icon">{w.icon}</div>
                <h4 className="bk-why-title">{w.title}</h4>
                <p className="bk-why-body">{w.body}</p>
              </div>
            ))}
          </div>
          <div className="bk-why-sub">
            {whySubItems.map((s, i) => (
              <div key={i} className="bk-why-sub-item">
                <h5>{s.title}</h5>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. FAQ ── */}
      <ServiceFaq
        variant="bookkeeping"
        title="Bookkeeping questions"
        intro="Helpful details about outsourced bookkeeping without a monthly headcount commitment."
      />
    </div>
  );
}
