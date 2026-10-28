'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  CheckCircle2, Shield, TrendingUp, Clock,
  Wallet, CalendarCheck, ClipboardList, Calculator, Landmark,
  FileChartColumn, FileCheck2, Handshake, ScanSearch,
} from 'lucide-react';
import ServiceFaq from '@/components/shared/ServiceFaq';
import ServiceBenefits from '@/components/shared/ServiceBenefits';
import './smsf.css';

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
  'Maintains accurate records for contributions, rollovers, expenses and pensions.',
  'Reconciles investment values, property holdings and asset disposals seamlessly.',
  'Coordinates annual audits and efficiently gathers required documentation.',
  'Protects internal staff time and keeps fund workflows moving forward.',
];

const provideItems = [
  { icon: <ClipboardList size={20} />, title: 'SMSF Administration & Day-to-Day Operations', body: 'We handle ongoing operational requirements, including new fund setups, member maintenance, contribution processing, pension administration, and structured working paper management.' },
  { icon: <Calculator size={20} />, title: 'SMSF Accounting & Bookkeeping', body: 'Our team maintains accurate financial records throughout the year by processing transactions, managing bank reconciliations, recording expenses, and reconciling member accounts.' },
  { icon: <Landmark size={20} />, title: 'SMSF Investment Accounting', body: 'We manage complex asset classes including listed shares, managed funds, term deposits, and direct property while reconciling purchase, disposal, and income transactions.' },
  { icon: <CalendarCheck size={20} />, title: 'SMSF Year-End Finalisation & Workpapers', body: 'We review year-end transactions, reconcile bank and investment accounts, calculate capital gains, and prepare clean, audit-ready files to streamline your annual review process.' },
  { icon: <FileChartColumn size={20} />, title: 'SMSF Financial Statement Preparation', body: 'We prepare structured financial statements, operating statements, member reports, and investment schedules to support an efficient independent audit.' },
  { icon: <FileCheck2 size={20} />, title: 'SMSF Annual Return & Tax Preparation', body: 'We compile lodgement-ready annual returns, complete tax calculations, manage contribution and pension reporting, and prepare all necessary supporting tax schedules.' },
];

const whyItems = [
  { icon: <Wallet size={20} />, title: 'Cost-Effective Outsourcing', body: 'Reduce recruitment, training, and operational costs with our flexible SMSF support. Convert fixed overheads into manageable variable costs so you only pay for the capacity you need.' },
  { icon: <TrendingUp size={20} />, title: 'Flexible & Scalable Support', body: 'Effortlessly manage tax-time surges and changing workloads without expanding your in-house headcount. Scale resource allocation up or down as your client portfolio evolves.' },
  { icon: <Shield size={20} />, title: 'Secure & Confidential Operations', body: 'Protect sensitive financial information through strict role-based access control, encrypted systems, and compliant offshore work practices. Your data security and privacy remain our highest priority.' },
  { icon: <Clock size={20} />, title: 'Reduced Administrative Burden', body: 'Reduce manual processing, repetitive documentation, and compliance tasks for your internal team. Free up your senior staff to focus on strategic growth and client relationships.' },
];

export default function Smsf() {
  const r1 = useReveal(), r2 = useReveal(), r3 = useReveal(), r4 = useReveal();

  return (
    <div>
      {/* ── 1. Hero ── */}
      <section
        className="page-hero page-hero--split page-hero--img smsf-hero"
        style={{ '--hero-bg': 'url("https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1800&q=85")' }}
      >
        <div className="container">
          <div className="page-hero-content">
            <span className="chip chip-gold section-eyebrow">SMSF</span>
            <h1>SMSF Outsourcing Services for Accounting Firms</h1>
            <p>Manage growing SMSF accounting and administration workloads with flexible outsourcing support from Proowrx. Increase your team&apos;s capacity while maintaining your established accounting workflows and procedures.</p>
            <div className="page-hero-stats">
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">48hr</span>
                <span className="page-hero-stat-label">Turnaround</span>
              </div>
              <div className="page-hero-stat-divider" />
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">SMSF</span>
                <span className="page-hero-stat-label">Specialists</span>
              </div>
              <div className="page-hero-stat-divider" />
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">ATO & SIS</span>
                <span className="page-hero-stat-label">Act Compliant</span>
              </div>
            </div>
          </div>
          <div className="page-hero-visual">
            <Image
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=85"
              alt="SMSF accounting and financial document preparation"
              width={800}
              height={533}
              sizes="(max-width: 960px) 100vw, 45vw"
            />
            <div className="page-hero-badge-float">
              <span className="smsf-hero-badge-icon" aria-hidden="true"><Handshake size={24} /></span>
              <div>
                <strong>No Lock-in Contract</strong>
                <span>Flexible Support Plans</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Service Intro ── */}
      <section className="section">
        <div className="container smsf-intro">
          <div ref={r1} className="reveal smsf-intro-text">
            <span className="chip chip-sky section-eyebrow">THE PROBLEM WE SOLVE</span>
            <h2 className="section-title">Expand Your SMSF Capacity With Outsourced Support</h2>
            <p className="section-body">
              Proowrx helps accounting firms manage their SMSF workload without hiring more in-house staff. From accounting and reconciliations to annual accounts, member reporting, tax workpapers, and administration, we handle day-to-day processing across different types of SMSF portfolios.
            </p>
            <ul className="smsf-point-list">
              {introPoints.map((p, i) => (
                <li key={i}><CheckCircle2 size={17} className="smsf-point-check" /><span>{p}</span></li>
              ))}
            </ul>
          </div>
          <div className="smsf-intro-visual reveal reveal-delay-2" ref={r2}>
            <Image
              src="https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=800&q=85"
              alt="Reviewing SMSF accounts and reconciliations"
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
            <h2 className="section-title">Comprehensive SMSF Accounting Outsourcing Services</h2>
            <p className="section-body" style={{ maxWidth: 560, margin: '0 auto' }}>
              From transaction processing and reconciliations to annual accounts, member reporting, tax workpapers and fund administration, Proowrx provides reliable back-office support tailored to your firm&apos;s existing systems and procedures.
            </p>
          </div>
          <div className="smsf-provide-grid">
            {provideItems.map((item, i) => (
              <div key={i} className={`smsf-provide-item reveal reveal-delay-${(i % 4) + 1}`}>
                <div className="smsf-provide-heading">
                  <div className="smsf-provide-icon">{item.icon}</div>
                  <h4 className="smsf-provide-title">{item.title}</h4>
                </div>
                <p className="smsf-provide-body">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServiceBenefits service="SMSF Accounting" heading="Benefits of Outsourcing SMSF Accounting Services" intro="Protect your margins, stay aligned with SIS Act regulations, and give your team the capacity to focus on high-value client advisory." benefits={[
        { title: 'Cost Efficiency', text: 'Reduce the high operating cost of hiring, training and retaining dedicated in-house superannuation staff while eliminating overhead and infrastructure expenses.' },
        { title: 'Specialised Expertise', text: 'Access a dedicated team that stays completely up to date with complex SMSF regulations, ATO guidelines, and strict SIS Act compliance obligations.' },
        { icon: TrendingUp, title: 'Scalability', text: 'Easily adjust your outsourced support levels based on seasonal demand, reporting deadlines, turnaround pressures or overall portfolio growth.' },
        { icon: ScanSearch, title: 'Fewer Audit Surprises', text: 'Improve file readiness and thorough documentation prep to reduce unexpected issues, delays or adjustments discovered late in the annual audit cycle.' },
      ]} />

      {/* ── 4. Why Choose ── */}
      <section className="section">
        <div className="container">
          <div ref={r4} className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="chip chip-violet section-eyebrow">Why Proowrx</span>
            <h2 className="section-title">Why Choose Proowrx for SMSF Outsourcing Services</h2>
          </div>
          <div className="smsf-why-grid">
            {whyItems.map((w, i) => (
              <div key={i} className={`smsf-why-card reveal reveal-delay-${i + 1}`}>
                <div className="smsf-why-heading">
                  <div className="smsf-why-icon">{w.icon}</div>
                  <h4 className="smsf-why-title">{w.title}</h4>
                </div>
                <p className="smsf-why-body">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. FAQ ── */}
      <ServiceFaq
        variant="smsf"
        title="Got Questions? We’ve Got Answers."
        intro="Learn more about our SMSF outsourcing services, models and approach to long-term client partnerships."
      />
    </div>
  );
}
