'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight, CheckCircle2, Shield, FileCheck,
  TrendingUp, Clock, Landmark, Receipt, BadgeDollarSign,
  BarChart3, Settings2, Percent, CalendarCheck,
} from 'lucide-react';
import ServiceFaq from '@/components/shared/ServiceFaq';
import ServiceBenefits from '@/components/shared/ServiceBenefits';
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
  'Start your morning with updated ledgers ready for instant client review.',
  'Free your internal accountants to focus entirely on high-value advisory.',
  'Scale your practice capacity seamlessly without hiring full-time local staff.',
  'Eliminate manual bottlenecks to deliver real-time financial clarity every day.',
];

const provideItems = [
  { icon: <Landmark size={20} />, title: 'Bank & Credit Card Reconciliations', body: 'We regularly reconcile all financial transactions to ensure accurate reporting and eliminate discrepancies.' },
  { icon: <Receipt size={20} />, title: 'Accounts Payable & Receivable Management', body: 'We regularly index supplier invoices, prepare payment runs, issue sales invoices, and maintain aged balances.' },
  { icon: <FileCheck size={20} />, title: 'General Ledger Maintenance & Reclassifications', body: 'We record journal entries, allocate multi-currency transactions, and resolve unallocated item lists.' },
  { icon: <BarChart3 size={20} />, title: 'End-of-Month & Year-End Reconciliations', body: 'We reconcile GST accounts, payroll clearing accounts, and loan schedules to streamline year-end preparation.' },
];

const whyItems = [
  { icon: <Shield size={20} />, title: 'Secure Data Management', body: 'Our dedicated team works securely directly inside leading platforms like Xero, MYOB, QuickBooks, HandiSoft, and APS under strict confidentiality protocols.' },
  { icon: <Clock size={20} />, title: 'Turnaround Advantage', body: 'We complete reconciliations and detailed data entry during off-hours, ensuring your internal accountants start every single morning with fully updated ledgers.' },
  { icon: <FileCheck size={20} />, title: 'AU Compliance Standards', body: 'Our operational processes are built specifically around Australian GST frameworks, BAS guidelines, and strict data privacy regulations to eliminate risk.' },
  { icon: <TrendingUp size={20} />, title: 'Flexible Overhead Control', body: 'Avoid expensive local recruitment and office desk costs by easily scaling your outsourced bookkeeping support based on seasonal workloads.' },
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
            <h1>Dedicated Bookkeeping Support for Accounting Firms</h1>
            <p>Expand your practice capacity and eliminate ledger backlogs with our offshore bookkeeping support for Australian accounting businesses.</p>
            <div className="page-hero-stats">
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">48hr</span>
                <span className="page-hero-stat-label">Turnaround</span>
              </div>
              <div className="page-hero-stat-divider" />
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">150+</span>
                <span className="page-hero-stat-label">Working Professionals</span>
              </div>
              <div className="page-hero-stat-divider" />
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">100%</span>
                <span className="page-hero-stat-label">ATO Compliant</span>
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
              <span className="bk-hero-badge-icon" aria-hidden="true"><BarChart3 size={24} /></span>
              <div>
                <strong>No Lock-in Contract</strong>
                <span>Standard &amp; Comprehensive</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Service Intro ── */}
      <section className="section">
        <div className="container bk-intro">
          <div ref={r1} className="reveal bk-intro-text">
            <span className="chip chip-sky section-eyebrow">THE PROBLEM WE SOLVE</span>
            <h2 className="section-title">Scale Your Practice Capacity Without Adding Fixed Overheads</h2>
            <p className="section-body">
              Accurate bookkeeping is the foundation of every financially healthy business. At Proowrx, we provide outsourced bookkeeping services that keep your daily financial transactions recorded, organised and reconciled.
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
            <span className="chip chip-gold section-eyebrow">WHAT WE HANDLE</span>
            <h2 className="section-title">Core Bookkeeping Solutions We Handle For You</h2>
            <p className="section-body" style={{ maxWidth: 560, margin: '0 auto' }}>
              From daily reconciliations to year-end balancing, we manage the work behind your client ledgers.
            </p>
          </div>
          <div className="bk-provide-grid">
            {provideItems.map((item, i) => (
              <div key={i} className={`bk-provide-item reveal reveal-delay-${(i % 4) + 1}`}>
                <div className="bk-provide-heading">
                  <div className="bk-provide-icon">{item.icon}</div>
                  <h4 className="bk-provide-title">{item.title}</h4>
                </div>
                <p className="bk-provide-body">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServiceBenefits service="Bookkeeping Services" heading="Benefits of Outsourcing Bookkeeping Services" intro="Lower your operating expenses, protect profit margins, and keep your client ledgers up to date without the hassle of hiring in-house staff." benefits={[
        { title: 'Significant Cost Savings', text: 'By eliminating expensive full-time salaries, employee benefits, superannuation, training costs, and office space, this converts fixed overhead into predictable monthly fees and reduces operational expenses.' },
        { title: 'Access to Expertise & Compliance', text: 'Connecting your practice with trained professionals who understand changing tax laws and compliance frameworks protects your operations from financial risk, thereby reducing human error and costly regulatory penalties.' },
        { title: 'Scalability & Flexibility', text: 'Scaling support up or down as transaction volumes or seasonal workloads shift provides operational agility without the administrative burden of hiring or firing staff.' },
        { title: 'Business Continuity', text: 'Maintaining a reliable external team ensures your accounting firm delivers consistent, day-in, day-out bookkeeping outputs without the operational hiccups caused by internal staff churn.' },
      ]} />
      {/* ── 4. Why Choose ── */}
      <section className="section">
        <div className="container">
          <div ref={r4} className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="chip chip-violet section-eyebrow">Why Proowrx</span>
            <h2 className="section-title">Why Choose Proowrx Outsourced Bookkeeping Services</h2>
          </div>
          <div className="bk-why-grid">
            {whyItems.map((w, i) => (
              <div key={i} className={`bk-why-card reveal reveal-delay-${i + 1}`}>
                <div className="bk-why-heading">
                  <div className="bk-why-icon">{w.icon}</div>
                  <h4 className="bk-why-title">{w.title}</h4>
                </div>
                <p className="bk-why-body">{w.body}</p>
              </div>
            ))}
          </div>
          {/* <div className="bk-why-sub">
            {whySubItems.map((s, i) => (
              <div key={i} className="bk-why-sub-item">
                <h5>{s.title}</h5>
                <p>{s.body}</p>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* ── 5. FAQ ── */}
      <ServiceFaq
        variant="bookkeeping"
        title="Got Questions? We’ve Got Answers."
        intro="Learn more about our bookkeeping services, outsourcing models and approach to long-term client partnerships."
      />
    </div>
  );
}
