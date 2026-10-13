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
    desc: 'We handle client emails, daily transaction processing and bank reconciliations for you. Our bookkeeping services keep your files current and help your practice run smoothly.',
  },
  {
    icon: <BadgeDollarSign size={26} />,
    color: '#1f9e8e',
    title: 'Payroll Processing',
    desc: 'We take care of pay runs, timesheets, leave records, and Single Touch Payroll lodgements. Our payroll services give your accountants reliable support without increasing your ongoing costs.',
  },
  {
    icon: <ReceiptText size={26} />,
    color: '#c9a227',
    title: 'Annual Tax Returns',
    desc: 'We prepare the accounting work for individual and business tax returns, organise financial information and prepare supporting schedules so your team has a clear file to review.',
  },
  {
    icon: <ChartSpline size={26} />,
    color: '#1f9e8e',
    title: 'Tax Planning',
    desc: 'We provide proactive mid-year reviews and tax insights. This helps your clients understand their upcoming obligations and find planning opportunities before the year ends.',
  },
  {
    icon: <PiggyBank size={26} />,
    color: '#c9a227',
    title: 'SMSF Management',
    desc: 'We manage fund records, reconciliations, and financial accounts for self-managed super funds, helping your practice maintain the client relationship while we handle the back-office work.',
  },
  {
    icon: <ScanSearch size={26} />,
    color: '#1f9e8e',
    title: 'Audit Support',
    desc: 'We make audits easier by keeping financial records, supporting schedules and working papers organised. This saves the time your team spends gathering information and putting files together.',
  },
  {
    icon: <FileCheck2 size={26} />,
    color: '#c9a227',
    title: 'BAS, IAS, Super & STP',
    desc: 'We help you stay on top of regular compliance work like BAS, IAS, Pay Day Super and STP which keeps your clients’ obligations on track all year.',
  },
  {
    icon: <PieChart size={26} />,
    color: '#1f9e8e',
    title: 'Cash Forecast Statements',
    desc: 'We turn financial numbers into clear insights, and our detailed cash forecasts help your team give clients a reliable view of their upcoming cash needs.',
  },
];

const whyUs = [
  { icon: <MapPinned size={24} aria-hidden="true" />, title: 'Australian Market Expertise', desc: 'Our team knows Australian accounting requirements, local compliance workflows, and the software your practice uses every day.' },
  { icon: <ShieldCheck size={24} aria-hidden="true" />, title: 'Secure Data Management', desc: 'We handle client information with care and our secure processes and controlled access protect the data you share with us.' },
  { icon: <Gauge size={24} aria-hidden="true" />, title: 'Quick Data Processing', desc: 'Late returns can slow things down, so we focus on accurate processing and quick turnaround times to keep your files moving without delays.' },
  { icon: <Headset size={24} aria-hidden="true" />, title: 'Dedicated Service Support', desc: 'A dedicated team manages your assigned workload, giving you steady support and making routine accounting tasks easier to handle.' },
  { icon: <TrendingUp size={24} aria-hidden="true" />, title: 'Scalable Solutions', desc: 'You can easily increase or decrease support as needed when your workload changes during the year, so you don’t have to hire permanent staff for every busy season.' },
  { icon: <Handshake size={24} aria-hidden="true" />, title: 'Personalised Approach', desc: 'Choose the exact level of support that fits your workload, whether you need help with specific tasks or comprehensive back-office support.' },
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
            <h1>Accounting Outsourcing Services For<br />Australian Accounting Businesses</h1>
            <p>Routine accounting tasks like bank reconciliations, payroll, and tax returns can't wait as your client workload grows. Proowrx helps Australian accounting firms by taking care of these tasks through outsourcing. Your team can keep using its usual software and processes, so you don't need to hire another full-time employee.</p>
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
              Managing an accounting practice often leaves little time to lead your team, help clients, and handle daily tasks. Bookkeeping, payroll, reconciliations, and tax returns still need attention, even when things get busy. Proowrx helps your practice manage these tasks without changing how your team works. We use your current systems and processes, giving you more time to focus on your clients and your business.
            </p>
            {/* <p style={{ marginTop: 16, color: 'var(--text-2)', lineHeight: 1.75 }}>
              Proowrx handles daily operations on your behalf, working with the systems and processes already in use at your practice and eliminating disruptions to your team’s day-to-day work. This way, your team can focus on the more critical aspects of your clients’ needs.
            </p> */}
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
              Proowrx supports your firm with all the core accounting functions you need each day, from regular bookkeeping and payroll to specialist tax and compliance. Our team gives dedicated help where you need it most.
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
              Get extra accounting support without switching systems or changing your processes. Our team works with the platforms your practice already uses to keep client work on track.
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

      <ServiceBenefits service="Outsourcing Accounting Services" intro="Build a more efficient practice with accurate back-office support that fits your systems, standards, and growth plans." benefits={[
        { title: 'Significant Cost Reduction', text: 'Cut out full-time salaries, recruitment costs, overheads, and expensive software subscriptions. Our flexible pay-per-use model means you only pay for the hours and services you need.' },
        { title: 'Access to Specialised Expertise', text: 'Get a competitive edge by working with certified professionals who know the latest tax laws, advanced cloud software, and compliance standards without worrying about training costs.' },
        { title: 'Focus on Core Business Operations', text: 'Let your leaders and client-facing accountants spend less time on data entry, reconciliations, and admin. They can focus more on advising clients, building relationships, and growing your business.' },
        { title: 'Flexible Scalability', text: 'Increase support during busy tax seasons or reduce it when things slow down. This helps your practice avoid disruptions from staff changes or unexpected absences.' },
      ]} />
      {/* Why Us */}
      <section className="section" style={{ background: 'var(--navy)' }}>
        <div className="container">
          <div ref={r4} className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="chip chip-white section-eyebrow">Why Proowrx</span>
            <h2 className="section-title section-title--white">Why Choose Proowrx For Accounting Outsourcing Services</h2>
            <p className="section-body section-body--white" style={{ margin: '0 auto' }}>
              As your accounting outsourcing partner, we understand your firm’s goals and help you grow by bringing in the right talent and reliable support for your practice.
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
              { num: '01', title: 'Discovery Call', desc: 'Let us know about your practice, which recurring tasks or year-end services you want to outsource, and where your team could use extra support.' },
              { num: '02', title: 'Team Assignment', desc: 'We match your practice requirements with the right accounting professionals on our team based on your specific workflows, software stack, and support needs.' },
              { num: '03', title: 'Workflow Integration', desc: 'We learn your systems, processes, templates, and review steps before starting daily client work or managing your back-office tasks.' },
              { num: '04', title: 'Ongoing Support', desc: 'Once we’re set up with your systems, you can send us work as needed. We’ll handle the agreed tasks and keep you updated throughout the process.' },
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
