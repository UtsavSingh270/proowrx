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
    desc: 'Manage client emails, day-to-day transaction processing, and bank reconciliations effortlessly. Our outsourced bookkeeping services keep your files up to date and your practice running smoothly.',
  },
  {
    icon: <BadgeDollarSign size={26} />,
    color: '#1f9e8e',
    title: 'Payroll Processing',
    desc: 'We handle pay runs, timesheets, leave records, and Single Touch Payroll lodgements accurately. Our payroll outsourcing services give your accountants reliable support without adding permanent overhead.',
  },
  {
    icon: <ReceiptText size={26} />,
    color: '#c9a227',
    title: 'Annual Tax Returns',
    desc: 'We prepare the accounting work needed for individual and business tax returns, organising financial information and supporting schedules so your team has a cleaner file to review.',
  },
  {
    icon: <ChartSpline size={26} />,
    color: '#1f9e8e',
    title: 'Tax Planning',
    desc: 'Deliver proactive mid-year reviews and tax positioning insights. We help your clients assess upcoming obligations and identify legitimate planning opportunities well before year-end.',
  },
  {
    icon: <PiggyBank size={26} />,
    color: '#c9a227',
    title: 'SMSF Management',
    desc: 'We handle fund records, reconciliations, and financial accounts seamlessly. We manage the back-office accounting work behind self-managed super funds while your practice retains client relationships.',
  },
  {
    icon: <ScanSearch size={26} />,
    color: '#1f9e8e',
    title: 'Audit Support',
    desc: 'Make audits straightforward with organised financial records, supporting schedules, and working papers. We reduce the time your team spends chasing information and assembling files.',
  },
  {
    icon: <FileCheck2 size={26} />,
    color: '#c9a227',
    title: 'BAS, IAS, Super & STP',
    desc: 'Stay on top of recurring compliance work with support for BAS, IAS, Pay Day Super, and STP requirements, helping your practice keep client obligations moving throughout the year.',
  },
  {
    icon: <PieChart size={26} />,
    color: '#1f9e8e',
    title: 'Cash Forecast Statements',
    desc: 'Transform financial figures into clear insights. We prepare detailed cash forecasts that help your team give clients a reliable view of upcoming liquidity needs.',
  },
];

const whyUs = [
  { icon: <MapPinned size={24} aria-hidden="true" />, title: 'Australian Market Expertise', desc: 'Our team deeply understands Australian accounting requirements, local compliance workflows, and the specialised software platforms your practice commonly uses.' },
  { icon: <ShieldCheck size={24} aria-hidden="true" />, title: 'Secure Data Management', desc: 'Client information needs to be handled carefully. We use controlled access and secure processes to protect the data your practice entrusts to us.' },
  { icon: <Gauge size={24} aria-hidden="true" />, title: 'Quick Data Processing', desc: 'Late returns create unnecessary bottlenecks. We focus on accurate processing and rapid turnaround times to keep your files moving forward without interruption.' },
  { icon: <Headset size={24} aria-hidden="true" />, title: 'Dedicated Service Support', desc: 'A dedicated professional team handles your assigned workload, providing consistent operational support and making routine accounting tasks much easier to manage.' },
  { icon: <TrendingUp size={24} aria-hidden="true" />, title: 'Scalable Solutions', desc: 'Your workload fluctuates throughout the year. Easily scale support up or down as needed, avoiding permanent hires for every busy season.' },
  { icon: <Handshake size={24} aria-hidden="true" />, title: 'Personalised Approach', desc: 'Choose the exact level of support that fits your workload, whether you need help with specific tasks or comprehensive back-office assistance.' },
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
            <span className="chip chip-gold section-eyebrow">ACCOUNTING SOFTWARE</span>
            <h2 className="section-title">We Work With the Software Your Practice Already Uses</h2>
            <p className="section-body" style={{ margin: '0 auto' }}>
              Bring in extra accounting support without moving files between unfamiliar systems or changing your processes. Our team works with the platforms your practice already uses to keep client work moving.
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

      <ServiceBenefits service="Accounting Outsourcing Services" intro="Build a more efficient practice with accurate back-office support that fits your systems, standards, and growth plans." benefits={[
        { title: 'Significant Cost Reduction', text: 'Eliminate full-time salaries, recruitment costs, overhead expenses, and costly software subscriptions with a flexible pay-per-use model that charges only for the hours and services you need.' },
        { title: 'Access to Specialised Expertise', text: 'Gain an immediate competitive edge by tapping into certified professionals trained in ever-changing tax laws, advanced cloud software, and reliable compliance standards without managing direct training costs.' },
        { title: 'Focus on Core Business Operations', text: 'Free your internal leadership and client-facing accountants from tedious data entry, reconciliation, and administrative bottlenecks so they can focus entirely on advisory, relationships, and driving revenue.' },
        { title: 'Flexible Scalability', text: 'Scale your support up during peak tax seasons or down during slow periods, protecting your practice from operational disruptions caused by staff turnover or unexpected leave.' },
      ]} />
      {/* Why Us */}
      <section className="section" style={{ background: 'var(--navy)' }}>
        <div className="container">
          <div ref={r4} className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="chip chip-white section-eyebrow">Why Proowrx</span>
            <h2 className="section-title section-title--white">Why Choose Proowrx For Accounting Outsourcing Services</h2>
            <p className="section-body section-body--white" style={{ margin: '0 auto' }}>
              As a dedicated accounting outsourcing partner, we understand your firm&apos;s strategic goals and help you achieve sustainable growth by integrating bespoke talent and reliable operational support directly into your practice.
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
              { num: '01', title: 'Discovery Call', desc: 'Tell us about your practice, the recurring tasks or year-end services you want to outsource, and where your team needs extra operational support.' },
              { num: '02', title: 'Team Assignment', desc: 'We match your practice requirements with the right accounting professionals on our team based on your specific workflows, software stack, and support needs.' },
              { num: '03', title: 'Workflow Integration', desc: 'We get familiar with your systems, processes, templates, and review requirements before taking on day-to-day client work or managing your back-office touchpoints.' },
              { num: '04', title: 'Ongoing Support', desc: 'Once your systems are integrated, send work as needed while we handle the agreed tasks and keep you updated along the way.' },
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
        title="Frequently Asked Questions(FAQs)"
        intro=""
      />
    </div>
  );
}
