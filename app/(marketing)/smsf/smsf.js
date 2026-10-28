'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  CheckCircle2, Shield, FileCheck, TrendingUp, Clock,
  Wallet, PiggyBank, FileText, CalendarCheck, Users,
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
  'Deliver clean, error-free pay runs ready for client review.',
  'Prevent costly regulatory breaches with proactive award interpretation.',
  'Scale practice capacity easily with dedicated offshore payroll support.',
  'Integrate seamlessly with your existing cloud accounting software ecosystem.',
];

const provideItems = [
  { icon: <Wallet size={20} />, title: 'Payroll Processing', body: 'We handle salary calculations, overtime, allowances, deductions, and reimbursements to ensure employees are paid each pay cycle correctly.' },
  { icon: <PiggyBank size={20} />, title: 'PAYG & Payroll Tax Support', body: 'We calculate the tax that needs to be withheld from employee wages and help with payroll tax records and reporting, based on your practice’s requirements.' },
  { icon: <FileText size={20} />, title: 'Pay Day Super Management', body: 'We help calculate super contributions, keep payment records up to date and manage the steps involved in making payments within the required timeframes.' },
  { icon: <CalendarCheck size={20} />, title: 'Payroll Compliance & Reporting', body: 'We handle STP Phase 2 reporting and keep payroll information organised for ATO reporting. We also help maintain records relating to employee pay and applicable workplace requirements.' },
  { icon: <Users size={20} />, title: 'Employee Payments & Records Management', body: 'From preparing payment details to updating employee information, we help keep payroll records current when salaries, working hours or other employment details change.' },
  { icon: <CalendarCheck size={20} />, title: 'Leave & Entitlement Management', body: 'We track employee leave balances, including annual and personal leave, and help ensure they are recorded correctly in payroll.' },
];

const whyItems = [
  { icon: <Shield size={20} />, title: 'Secure Data Management', body: 'Our dedicated team works securely directly inside leading platforms like Xero, MYOB, QuickBooks, and KeyPay under strict confidentiality protocols.' },
  { icon: <Clock size={20} />, title: 'Turnaround Advantage', body: 'We complete pay run processing and timesheet reconciliations during off-hours, ensuring your internal accountants start every single morning with fully updated wage records.' },
  { icon: <FileCheck size={20} />, title: 'AU Compliance Standards', body: 'Our operational processes are built specifically around Single Touch Payroll (STP Phase 2), modern awards, and strict data privacy regulations to eliminate risk.' },
  { icon: <TrendingUp size={20} />, title: 'Flexible Overhead Control', body: 'Avoid expensive local recruitment and office desk costs by easily scaling your outsourced payroll support based on seasonal workloads.' },
];

export default function Smsf() {
  const r1 = useReveal(), r2 = useReveal(), r3 = useReveal(), r4 = useReveal();

  return (
    <div>
      {/* ── 1. Hero ── */}
      <section
        className="page-hero page-hero--split page-hero--img pr-hero"
        style={{ '--hero-bg': 'url("https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1800&q=85")' }}
      >
        <div className="container">
          <div className="page-hero-content">
            <span className="chip chip-gold section-eyebrow">SMSF</span>
            <h1>Hassle-Free SMSF Management for Accounting Practices</h1>
            <p>Strengthen your practice with reliable back-office business SMSF services. Proowrx helps you manage SMSF compliance, reporting, and administration with absolute precision, so your team can focus on client growth.</p>
            <div className="page-hero-stats">
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">48hr</span>
                <span className="page-hero-stat-label">Turnaround</span>
              </div>
              <div className="page-hero-stat-divider" />
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">Expert</span>
                <span className="page-hero-stat-label">SMSF Specialists</span>
              </div>
              <div className="page-hero-stat-divider" />
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">100%</span>
                <span className="page-hero-stat-label">ATO & STP Compliant</span>
              </div>
            </div>
          </div>
          <div className="page-hero-visual">
            <Image
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=85"
              alt="Payroll processing and payslip preparation on a laptop"
              width={800}
              height={533}
              sizes="(max-width: 960px) 100vw, 45vw"
            />
            <div className="page-hero-badge-float">
              <span className="pr-hero-badge-icon" aria-hidden="true"><Wallet size={24} /></span>
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
        <div className="container pr-intro">
          <div ref={r1} className="reveal pr-intro-text">
            <span className="chip chip-sky section-eyebrow">THE PROBLEM WE SOLVE</span>
            <h2 className="section-title">Seamless Payroll Management Built for Growing Practices</h2>
            <p className="section-body">
              Australian payroll requires strict compliance with STP Phase 2, superannuation, and PAYG. We manage end-to-end processing for accounting firms, ensuring your practice meets every statutory obligation accurately and on time.
            </p>
            <ul className="pr-point-list">
              {introPoints.map((p, i) => (
                <li key={i}><CheckCircle2 size={17} className="pr-point-check" /><span>{p}</span></li>
              ))}
            </ul>
          </div>
          <div className="pr-intro-visual reveal reveal-delay-2" ref={r2}>
            <Image
              src="https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=800&q=85"
              alt="Reviewing payroll reports and reconciliations"
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
            <h2 className="section-title">End-to-End Payroll Support for Accounting Firms</h2>
            <p className="section-body" style={{ maxWidth: 560, margin: '0 auto' }}>
              Explore our outsourced payroll solutions, designed to help accounting firms manage client payroll efficiently, maintain accuracy, meet compliance requirements and ensure smooth payroll processing.
            </p>
          </div>
          <div className="pr-provide-grid">
            {provideItems.map((item, i) => (
              <div key={i} className={`pr-provide-item reveal reveal-delay-${(i % 4) + 1}`}>
                <div className="pr-provide-heading">
                  <div className="pr-provide-icon">{item.icon}</div>
                  <h4 className="pr-provide-title">{item.title}</h4>
                </div>
                <p className="pr-provide-body">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServiceBenefits service="Payroll Processing" heading="Benefits of Outsourcing Payroll Processing Services" intro="Discover how outsourced payroll services help your accounting firm improve efficiency, maintain compliance and ensure seamless payroll operations for your clients." benefits={[
        { title: 'Time Savings', text: 'Offloads repetitive tasks such as crunching hours, processing overtime, and generating payslips, freeing your internal team to focus on core advisory goals.' },
        { title: 'Cost Reduction', text: 'Eliminates the need to buy and maintain expensive small business payroll software, server infrastructure, or hire specialised in-house staff.' },
        { title: 'Compliance Management', text: 'Keeping your practice aligned with changing labour laws and tax withholding requirements protects your operations from financial risks and regulatory fines.' },
        { title: 'Scalability', text: 'Easily adapting to shifting staff sizes or seasonal workforces provides operational agility without the administrative burden of managing internal personnel.' },
      ]} />

      {/* ── 4. Why Choose ── */}
      <section className="section">
        <div className="container">
          <div ref={r4} className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="chip chip-violet section-eyebrow">Why Proowrx</span>
            <h2 className="section-title">Why Choose Proowrx Outsourced Payroll Services</h2>
          </div>
          <div className="pr-why-grid">
            {whyItems.map((w, i) => (
              <div key={i} className={`pr-why-card reveal reveal-delay-${i + 1}`}>
                <div className="pr-why-heading">
                  <div className="pr-why-icon">{w.icon}</div>
                  <h4 className="pr-why-title">{w.title}</h4>
                </div>
                <p className="pr-why-body">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. FAQ ── */}
      <ServiceFaq
        variant="payroll"
        title="Got Questions? We’ve Got Answers."
        intro="Learn more about our payroll services, outsourcing models and approach to long-term client partnerships."
      />
    </div>
  );
}
