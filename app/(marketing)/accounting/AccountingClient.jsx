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
    desc: 'Bank reconciliations, transaction processing and day-to-day bookkeeping can take up more hours than you’d like. Proowrx helps keep client records organized and up to date, so your team gets cleaner files and fewer routine tasks hanging over them.',
  },
  {
    icon: <BadgeDollarSign size={26} />,
    color: '#1f9e8e',
    title: 'Payroll Processing',
    desc: 'From pay runs and timesheet management to leave records and Single Touch Payroll (STP) processing, Proowrx supports your day-to-day payroll tasks with accuracy and consistency and keeps your process running smoothly and reducing the administrative burden from your team.',
  },
  {
    icon: <ReceiptText size={26} />,
    color: '#c9a227',
    title: 'Annual Tax Returns',
    desc: 'Preparing a year-end tax return involves more than filling in forms. Financial records need to be organized, supporting schedules prepared and missing information chased up. We get the groundwork in place, so your accountants have a more complete file to review before lodgement.',
  },
  {
    icon: <ChartSpline size={26} />,
    color: '#1f9e8e',
    title: 'Tax Planning Support',
    desc: 'Proowrx supports your team with financial information preparation and scheduled reviews that surface potential tax planning considerations ahead of year-end. Your accountants can then assess the position, talk through suitable options with clients and advise based on their circumstances.',
  },
  {
    icon: <PiggyBank size={26} />,
    color: '#c9a227',
    title: 'SMSF Management',
    desc: 'Self-managed superannuation funds need organized records, careful reconciliations and dependable year-end preparation. Proowrx supports SMSF accounting and administrative workflows, so practices can manage recurring fund workloads with the right professional oversight still in place.',
  },
  {
    icon: <ScanSearch size={26} />,
    color: '#1f9e8e',
    title: 'Audit Support',
    desc: 'When audit work comes around, organized records make a big difference. Proowrx helps compile working papers, supporting schedules and relevant financial documentation, so your team can review the file and spot anything that still needs attention.',
  },
  {
    icon: <FileCheck2 size={26} />,
    color: '#c9a227',
    title: 'BAS, IAS, Super & STP',
    desc: 'BAS, IAS, superannuation and STP-related tasks come with recurring deadlines and plenty of detail. Proowrx supports your team by preparing the necessary records, reconciling information and organizing supporting documentation in line with your firm’s processes.',
  },
  {
    icon: <PieChart size={26} />,
    color: '#1f9e8e',
    title: 'Cash Flow Forecasting ',
    desc: 'Cash flow forecasts and financial statements show liquidity, upcoming commitments and funding needs. Proowrx supports forecast preparation and financial schedules, so accountants can guide clients on what lies ahead.',
  },
];

const whyUs = [
  { icon: <MapPinned size={24} aria-hidden="true" />, title: 'Knowledge of the Australian Landscape', desc: 'We’re familiar with Australian accounting practices, reporting requirements and established accounting workflows, which helps keep task execution consistent.' },
  { icon: <ShieldCheck size={24} aria-hidden="true" />, title: 'Your Data Stays Protected', desc: 'Accounting files contain sensitive financial and personal details. Client information is handled carefully, with secure processes and controlled access around everything you share.' },
  { icon: <Gauge size={24} aria-hidden="true" />, title: 'A Team That Knows Your Work', desc: 'A dedicated team looks after your workload, so you get consistency instead of a different face every week.' },
  { icon: <Headset size={24} aria-hidden="true" />, title: 'Fast Turnaround, Accurate Work', desc: 'A file sitting untouched can hold up the next step. We work to agreed turnaround times, flag missing information and raise any issues that need your team’s attention.' },
  { icon: <TrendingUp size={24} aria-hidden="true" />, title: 'Flexibility That Follows Your Workload', desc: 'Accounting workloads rarely stay constant through the year. Support can be scoped around recurring responsibilities and adjusted by agreement as your business needs change.' },
  { icon: <Handshake size={24} aria-hidden="true" />, title: 'Built Around Your Practice', desc: 'Every practice has its own templates, approval steps and preferred ways of communicating. We take time to understand these before work begins, so our support fits into how you already operate.' },
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
            <h1>Accounting Outsourcing Services </h1>
            <p className="acc-hero-description">Take the pressure off your accounting team without taking your hands off the work. Proowrx provides dedicated back-office accounting support to Australian accounting & CPA firms, so you can manage client workloads, keep client jobs moving and get through busy periods without rushing into permanent hires. </p>
            {/* <div className="page-hero-actions">
              <a href="https://calendly.com/proowrx/30min" target="_blank" rel="noreferrer" className="btn btn-gold">
                Book a Meeting <ArrowRight size={15} />
              </a>
              <Link href="/contact" className="btn btn-gold">Send a Message<ArrowRight size={15} /></Link>
            </div> */}
            <div className="page-hero-stats">
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">50%</span>
                <span className="page-hero-stat-label">Cost Reduction</span>
              </div>
              <div className="page-hero-stat-divider" />
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">150+</span>
                <span className="page-hero-stat-label">Professionals </span>
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
            <h2 className="section-title">More Capacity for Accounting Firms. More Focus on Client Work. </h2>
            <p style={{ marginTop: 16, color: 'var(--text-2)', lineHeight: 1.75 }}>
              More clients mean more reconciliations, payroll runs, workpapers, tax returns and deadlines, often handled by the same team in the same number of hours. 
            </p>
            <p style={{ marginTop: 16, color: 'var(--text-2)', lineHeight: 1.75 }}>
              Proowrx takes on agreed accounting tasks within your existing workflows, so jobs keep moving without every extra task landing on your in-house team. Your accountants stay in charge of client relationships, technical decisions and final reviews, and get more room for the work that needs their expertise. 
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
            <h2 className="section-title">Outsourced Accounting Support for Accountants & CPA Firms </h2>
            <p className="section-body" style={{ margin: '0 auto' }}>
              From everyday bookkeeping and payroll to year-end preparation and SMSF administration, Proowrx supports the accounting tasks that keep client files progressing. Services can be tailored to your firm’s workload, software environment and internal review procedures.
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
            <h2 className="section-title">Your Existing Software, Our Expertise </h2>
            <p className="section-body" style={{ margin: '0 auto' }}>
              Our team can work with the accounting platforms your practice already uses, following your established processes, templates and handover requirements. 
            </p>
          </div>
          <div className="acc-software-marquee" aria-label="Accounting software platforms">
            <div className="acc-software-track">
              {[...Array(2)].flatMap(() => softwareNames).map((sw, i) => (
                <div key={`${sw}-${i}`} className="acc-software-chip">
                  {softwareLogos[sw] ? (
                    <img
                      className="acc-software-logo"
                      src={softwareLogos[sw]}
                      alt={`${sw} logo`}
                      aria-hidden="true"
                      onError={(event) => event.currentTarget.classList.add('is-fallback')}
                    />
                  ) : (
                    <span className="acc-software-mark" aria-hidden="true">
                      {sw.split(' ').map(word => word[0]).join('').slice(0, 3)}
                    </span>
                  )}
                  <span>{sw}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ServiceBenefits service="Outsourced Accounting Services" intro="Outsourced accounting support reduces overheads, eases team workloads and keeps routine tasks on track, so Australian accounting firms have more room to focus on clients and growth. " benefits={[
        { title: 'Significant Cost Reduction', text: 'No monthly salaries, recruitment fees, desk space or extra software license. With pay-per-requirement pricing, you only pay for the resources and services you actually use.' },
        { title: 'Specialists on Tap', text: 'Work with certified professionals who keep up with tax law changes, cloud platforms and compliance standards, with no training bill landing on you.' },
        { title: 'Free Your Best People for Better Work', text: 'Less data entry and reconciling for your senior accountants means more time advising clients, building relationships and growing the firm.' },
        { title: 'Manage Busy Seasons with Greater Flexibility', text: 'Tax season and reporting deadlines can stretch existing resources. Extra outsourced capacity helps you handle peak workloads without relying entirely on permanent recruitment.' },
      ]} />
      {/* Why Us */}
      <section className="section" style={{ background: 'var(--navy)' }}>
        <div className="container">
          <div ref={r4} className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="chip chip-white section-eyebrow">Why Proowrx</span>
            <h2 className="section-title section-title--white">Why Accounting Firms Pick Proowrx </h2>
            <p className="section-body section-body--white" style={{ margin: '0 auto' }}>
              As your outsourcing partner, we take the time to understand where your firm is headed, then back you with the right people and dependable support to get there. 
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
            <span className="chip chip-teal section-eyebrow">HOW WE GET STARTED </span>
            <h2 className="section-title">Four Steps to Getting Extra Support in Place </h2>
            <p className="section-body section-body--white" style={{ margin: '0 auto' }}>
              A straightforward onboarding process, from understanding your workload to bringing accounting support into your existing workflows.  
            </p>
          </div>
          <div className="acc-process-grid">
            {[
              { num: '01', title: 'Discovery Call', desc: 'We’ll discuss your workload, recurring tasks, current systems and the areas where your team needs a hand. This helps us define a practical starting point.' },
              { num: '02', title: 'Meet Your Team ', desc: 'We match you with accounting professionals who suit your requirements, taking your software, task complexity and existing workflows into account.' },
              { num: '03', title: 'Learn Your Way of Working', desc: 'We work through your instructions, templates, access requirements, review steps and communication preferences before the agreed tasks get underway.' },
              { num: '04', title: 'Get to Work, Stay Connected ', desc: 'Once we’re set up, just send it through. We take care of the agreed tasks and keep you posted along the way. Your team retains its agreed review and approval responsibilities.' },
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
        title="Questions AU Accounting Firms Often Ask."
        intro=""
      />
    </div>
  );
}
