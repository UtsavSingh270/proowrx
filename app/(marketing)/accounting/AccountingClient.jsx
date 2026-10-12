'use client';

import React, { useEffect, useRef } from 'react';
import {
  ArrowRight, CheckCircle, BookOpenCheck, BadgeDollarSign, ReceiptText,
  PieChart, ChartSpline, PiggyBank, ScanSearch, FileCheck2,
  Gauge, Handshake, Headset, MapPinned, ShieldCheck, TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ServiceFaq from '@/components/shared/ServiceFaq';
import ServiceBenefits from '@/components/shared/ServiceBenefits';
import './Accounting.css';

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

const services = [
  {
    icon: <BookOpenCheck size={26} />,
    color: '#c9a227',
    title: 'Bookkeeping',
    desc: 'Comprehensive bookkeeping including bank reconciliation, accounts payable/receivable, mailbox services, month-end finalization, cash forecasts, and annual workbook reconciliation.',
  },
  {
    icon: <BadgeDollarSign size={26} />,
    color: '#1f9e8e',
    title: 'Payroll Processing',
    desc: 'Complete payroll management — employee payments, tax deductions, admin tasks, and monthly/quarterly/annual tax filings — ensuring accuracy and employee satisfaction.',
  },
  {
    icon: <ReceiptText size={26} />,
    color: '#c9a227',
    title: 'Annual Tax Returns',
    desc: 'Expert handling of complex Australian tax compliance, document management, and accurate lodgement, reducing your compliance risk.',
  },
  {
    icon: <ChartSpline size={26} />,
    color: '#1f9e8e',
    title: 'Tax Planning',
    desc: 'Customized, proactive tax preparation strategies that optimize your clients\' tax positions throughout the year.',
  },
  {
    icon: <PiggyBank size={26} />,
    color: '#c9a227',
    title: 'SMSF Management',
    desc: 'Fund setup, period processing, bank reconciliation, audit support, and customized reporting for Self-Managed Superannuation Funds.',
  },
  {
    icon: <ScanSearch size={26} />,
    color: '#1f9e8e',
    title: 'Audit Support',
    desc: 'Comprehensive analysis and thorough working file preparation that makes your audit process smooth and stress-free.',
  },
  {
    icon: <FileCheck2 size={26} />,
    color: '#c9a227',
    title: 'BAS, IAS, Super & STP',
    desc: 'End-to-end compliance management for Business Activity Statements, Instalment Activity Statements, superannuation, and Single Touch Payroll lodgements.',
  },
  {
    icon: <PieChart size={26} />,
    color: '#1f9e8e',
    title: 'Cash Forecast Statements',
    desc: 'Liquidity planning based on closing balances to prevent cash shortages and keep your clients\' businesses financially healthy.',
  },
];

const whyUs = [
  { icon: <MapPinned size={24} aria-hidden="true" />, title: 'Australian Market Expertise', desc: 'Deep understanding of ATO requirements, Australian tax laws, and compliance obligations.' },
  { icon: <ShieldCheck size={24} aria-hidden="true" />, title: 'Secured Data Management', desc: 'Australia-based servers, 2FA, encrypted transfers — your clients\' data is always protected.' },
  { icon: <Gauge size={24} aria-hidden="true" />, title: 'Quick Data Processing', desc: 'Fast, accurate turnaround so your firm stays ahead of deadlines without the pressure.' },
  { icon: <Headset size={24} aria-hidden="true" />, title: 'Dedicated Service Support', desc: 'A dedicated team that understands your firm\'s processes and delivers consistent results.' },
  { icon: <TrendingUp size={24} aria-hidden="true" />, title: 'Scalable Solutions', desc: 'Scale your support up or down as your practice grows — with no lock-in contracts.' },
  { icon: <Handshake size={24} aria-hidden="true" />, title: 'Personalized Approach', desc: 'We adapt to your workflow and software stack, not the other way around.' },
];

const softwareLogos = {
  Xero: 'https://icons.duckduckgo.com/ip3/xero.com.ico',
  MYOB: 'https://icons.duckduckgo.com/ip3/myob.com.ico',
  QuickBooks: 'https://icons.duckduckgo.com/ip3/quickbooks.intuit.com.ico',
  HandiSoft: 'https://icons.duckduckgo.com/ip3/handisoft.com.au.ico',
  'Class Super': 'https://icons.duckduckgo.com/ip3/class.com.au.ico',
  'BGL Simple Fund': 'https://icons.duckduckgo.com/ip3/bglcorp.com.ico',
  FuturePlanner: 'https://icons.duckduckgo.com/ip3/futureplanner.com.au.ico',
  APS: 'https://icons.duckduckgo.com/ip3/aps.net.au.ico',
};
const softwareNames = ['Xero', 'MYOB', 'QuickBooks', 'HandiSoft', 'Class Super', 'BGL Simple Fund', 'FuturePlanner', 'APS'];

export default function Accounting() {
  const r1 = useReveal(), r2 = useReveal(), r3 = useReveal(), r4 = useReveal();

  return (
    <div>
      <section
        className="page-hero page-hero--split page-hero--img"
        style={{ '--hero-bg': 'url("https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1800&q=85")' }}
      >
        <div className="page-hero-orb-1" />
        <div className="page-hero-orb-2" />
        <div className="container">
          <div className="page-hero-content">
            <span className="chip chip-gold" style={{ marginBottom: 20 }}>Accounting Services</span>
            <h1>Grow Your Accounting Business<br />With Expert Outsourced Accounting Services</h1>
            <p>Helping Australian accounting firms manage fluctuating workloads without the costs of full-time hires by tapping into our reliable outsourced accounting services, tailored to fit the systems and processes your team is already using.</p>
            {/* <div className="page-hero-actions">
              <a href="https://calendly.com/proowrx/30min" target="_blank" rel="noreferrer" className="btn btn-gold">
                Book a Meeting <ArrowRight size={15} />
              </a>
              <Link href="/contact" className="btn btn-gold">Send a Message<ArrowRight size={15} /></Link>
            </div> */}
            <div className="page-hero-stats">
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">8</span>
                <span className="page-hero-stat-label">Core Services</span>
              </div>
              <div className="page-hero-stat-divider" />
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">AUSTRALIAN</span>
                <span className="page-hero-stat-label">ACCOUNTING EXPERTISE</span>
              </div>
              <div className="page-hero-stat-divider" />
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">100%</span>
                <span className="page-hero-stat-label">ATO Compliant</span>
              </div>
            </div>
          </div>
          <div className="page-hero-visual">
            <Image src="https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=900&q=85" alt="Accounting team" width={900} height={600} sizes="(max-width: 960px) 100vw, 45vw" />
            <div className="page-hero-badge-float">
              <span className="acc-hero-badge-icon" aria-hidden="true"><ChartSpline size={24} /></span>
              <div>
                <strong>Full-Spectrum Support</strong>
                <span>Xero · MYOB · QuickBooks</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="section">
        <div className="container acc-intro">
          <div ref={r1} className="reveal-left acc-intro-text">
            <span className="chip chip-gold section-eyebrow">The Problem We Solve</span>
            <h2 className="section-title">Expand Your Accounting Firm’s Capacity Through Dedicated Back-Office Support</h2>
            <p className="section-body" style={{ maxWidth: '100%' }}>
              An accounting business demands far more than just client meetings and tax advice. Between daily bookkeeping, payroll, reconciliations, tax returns, and compliance deadlines, the sheer volume of routine work can easily overwhelm your team.
            </p>
            <p style={{ marginTop: 16, color: 'var(--text-2)', lineHeight: 1.75 }}>
              Proowrx handles daily operations on your behalf, working with the systems and processes already in use at your practice and eliminating disruptions to your team’s day-to-day work. This way, your team can focus on the more critical aspects of your clients’ needs.
            </p>
          </div>
          <div ref={r2} className="reveal-right acc-intro-image">
            <Image src="https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=900&q=85" alt="Accounting team" width={900} height={600} sizes="(max-width: 960px) 100vw, 45vw" />
            <div className="acc-intro-badge">
              <strong>8 Core Services</strong>
              <span>All under one roof</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div ref={r3} className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="chip chip-teal section-eyebrow">What We Handle</span>
            <h2 className="section-title">Accounting Outsourcing Services for Australian Accounting Firms</h2>
            <p className="section-body" style={{ margin: '0 auto' }}>
              Our accounting support covers the core functions your firm relies on daily, from everyday bookkeeping and payroll to specialist tax and compliance and delivers dedicated support right where your team needs it most.
            </p>
          </div>
          <div className="acc-services-grid">
            {services.map((svc, i) => (
              <div
                key={i}
                className={`acc-svc-card reveal reveal-delay-${(i % 4) + 1}`}
                style={{ '--acc-color': svc.color }}
              >
                <div className="acc-svc-heading">
                  <div className="acc-svc-icon" style={{ color: svc.color, background: svc.color + '18' }}>
                    {svc.icon}
                  </div>
                  <h4><span>{svc.title}</span></h4>
                </div>
                <p>{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Software Strip */}
      <section className="section acc-software-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="chip chip-gold section-eyebrow">Software We Work With</span>
            <h2 className="section-title">Integrated with Your Existing Stack</h2>
            <p className="section-body" style={{ margin: '0 auto' }}>
              Our team is trained on all major Australian accounting platforms — we plug into your workflow from day one.
            </p>
          </div>
          <div className="acc-software-marquee" aria-label="Accounting software platforms">
            <div className="acc-software-track">
              {[...Array(2)].flatMap(() => softwareNames).map((sw, i) => (
                <div key={`${sw}-${i}`} className="acc-software-chip">{softwareLogos[sw] ? <img src={softwareLogos[sw]} alt="" aria-hidden="true" /> : <span className="acc-software-mark" aria-hidden="true">{sw.split(' ').map(word => word[0]).join('').slice(0, 3)}</span>}<span>{sw}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ServiceBenefits service="Accounting Outsourcing" intro="Build a more efficient practice with accurate back-office support that fits your systems, standards, and growth plans." benefits={[
        { title: 'Significant Cost Reduction', text: 'Eliminate full-time salaries, recruitment costs, overhead expenses, and costly software subscriptions with flexible support.' },
        { title: 'Access to Specialised Expertise', text: 'Gain trained professionals experienced in changing tax laws, cloud software, and reliable compliance standards.' },
        { title: 'Focus on Core Business Operations', text: 'Free your leadership and client-facing accountants from data entry, reconciliation, and administrative bottlenecks.' },
        { title: 'Flexible Scalability', text: 'Scale support up during peak tax seasons or down during slower periods without permanent hires.' },
      ]} />
      {/* Why Us */}
      <section className="section" style={{ background: 'var(--navy)' }}>
        <div className="container">
          <div ref={r4} className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="chip chip-white section-eyebrow">Why Proowrx</span>
            <h2 className="section-title section-title--white">Why Accounting Firms Choose Us</h2>
            <p className="section-body section-body--white" style={{ margin: '0 auto' }}>
              We&apos;re not a generic outsourcing firm. We specifically understand the Australian accounting landscape and software ecosystem.
            </p>
          </div>
          <div className="acc-why-grid">
            {whyUs.map((w, i) => (
              <div key={i} className={`acc-why-card reveal reveal-delay-${(i % 3) + 1}`}>
                <div className="acc-why-header">
                  <span className="acc-why-icon" aria-hidden="true">{w.icon}</span>
                  <h4>{w.title}</h4>
                </div>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span className="chip chip-teal section-eyebrow">Getting Started</span>
            <h2 className="section-title">Simple Onboarding Process</h2>
          </div>
          <div className="acc-process-grid">
            {[
              { num: '01', title: 'Discovery Call', desc: 'We learn about your firm\'s size, software, and the tasks you want to outsource.' },
              { num: '02', title: 'Team Assignment', desc: 'A dedicated accountant is assigned and trained on your specific processes and preferences.' },
              { num: '03', title: 'Workflow Integration', desc: 'We integrate into your existing tools and workflows with minimal disruption.' },
              { num: '04', title: 'Ongoing Delivery', desc: 'Consistent, quality output delivered on time — with regular reviews to keep improving.' },
            ].map((s, i) => (
              <div key={i} className={`acc-process-step reveal reveal-delay-${i + 1}`}>
                <div className="acc-step-num">{s.num}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServiceFaq
        variant="accounting"
        title="Accounting outsourcing questions"
        intro="What accounting firms commonly ask before adding a Proowrx resource to their workflow."
      />
    </div>
  );
}
