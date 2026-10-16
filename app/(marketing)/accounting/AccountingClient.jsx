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
    desc: 'Proowrx fits into your existing workflows to manage bank reconciliations, transaction processing and day-to-day bookkeeping workloads, keep client records up to date and create more capacity for your team to serve more clients without the same increase in internal workload.',
  },
  {
    icon: <BadgeDollarSign size={26} />,
    color: '#1f9e8e',
    title: 'Payroll Processing',
    desc: 'From pay runs and timesheet management to leave records and Single Touch Payroll (STP) processing, Proowrx helps absorb this growing workload within your existing processes, allowing your team to support more businesses while maintaining consistent service and keeping additional hiring pressure in check.',
  },
  {
    icon: <ReceiptText size={26} />,
    color: '#c9a227',
    title: 'Annual Tax Returns',
    desc: 'Proowrx supports the preparation of annual tax returns by organizing financial records, preparing supporting schedules and coordinating missing information. With more groundwork completed before reviewing, your accountants can serve a higher volume of returns requests without every additional client adding the same administrative burden.',
  },
  {
    icon: <ChartSpline size={26} />,
    color: '#1f9e8e',
    title: 'Tax Planning Support',
    desc: 'Proowrx supports the preparation of financial information and scheduled reviews, giving your accountants a stronger foundation to serve additional planning opportunities, advise clients and dedicate more time to services that strengthen client relationships and practice growth.',
  },
  {
    icon: <PiggyBank size={26} />,
    color: '#c9a227',
    title: 'SMSF Management',
    desc: 'Proowrx supports SMSF accounting and administrative workflows, helping your practice manage a growing portfolio while allowing your accountants to retain oversight and focus on review, client advice and more complex work.',
  },
  {
    icon: <ScanSearch size={26} />,
    color: '#1f9e8e',
    title: 'Audit Support',
    desc: 'Proowrx helps organize working papers, supporting schedules and financial documentation, giving your accountants a more structured review process and helping your practice manage overlapping workloads avoiding any roadblock in serving new clients in the pipeline with more efficiency.',
  },
  {
    icon: <FileCheck2 size={26} />,
    color: '#c9a227',
    title: 'BAS, IAS, Super & STP',
    desc: 'Proowrx supports BAS, IAS, superannuation and STP workflows, helping your team manage recurring deadlines, maintain consistent records and accommodate new growth opportunities without proportionately increasing internal workload.',
  },
  {
    icon: <PieChart size={26} />,
    color: '#1f9e8e',
    title: 'Cash Flow Forecasting ',
    desc: 'Proowrx supports the preparation of cash flow forecasts, financial statements and supporting schedules, helping your accountants spend less time assembling information and more time interpreting results, advising clients and identifying opportunities to add value.',
  },
];

const whyUs = [
  { icon: <MapPinned size={24} aria-hidden="true" />, title: 'Knowledge of the Australian Landscape', desc: 'We know the AU accounting practices, reporting requirements and established accounting compliances, which helps us with consistent delivery.' },
  { icon: <ShieldCheck size={24} aria-hidden="true" />, title: 'Your Data Stays Protected', desc: 'Proowrx is ISO 27001:2022 certified, the international standard for information security management, so your data is handled under established ISO standards.' },
  { icon: <Gauge size={24} aria-hidden="true" />, title: 'A Team That Knows Your Work', desc: 'A dedicated team looks after your workload, so you get consistency instead of a different face every week.' },
  { icon: <Headset size={24} aria-hidden="true" />, title: 'Fast Turnaround, Accurate Work', desc: 'We work to agreed turnaround times, flag missing information and raise any issues that need your team’s attention. In a nutshell, we ensure no file is sitting with us blocking the workflow.' },
  { icon: <TrendingUp size={24} aria-hidden="true" />, title: 'Flexibility That Follows Your Workload', desc: 'Our support works around your recurring tasks & responsibilities. We can also adjust your unique requirements through flexible agreements, so you get what you need.' },
  { icon: <Handshake size={24} aria-hidden="true" />, title: 'Built Around Your Practice', desc: 'We take time to understand your templates, approval steps and your preferred way of communication before work begins. Our support will fit into your operations seamlessly.' },
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
            <p className="acc-hero-description">Take on more clients and grow your accounting practice without adding headcount.<br />Proowrx integrates with your existing workflows to manage recurring accounting tasks, improve team capacity and free up time for client relationships, advisory services and business growth without committing cost to permanent hires.</p>
            {/* <div className="page-hero-actions">
              <a href="https://calendly.com/proowrx/30min" target="_blank" rel="noreferrer" className="btn btn-gold">
                Book a Meeting <ArrowRight size={15} />
              </a>
              <Link href="/contact" className="btn btn-gold">Send a Message<ArrowRight size={15} /></Link>
            </div> */}
            <div className="page-hero-stats">
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">50%+</span>
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
            <h2 className="section-title">More Capacity for Accounting Firms. More Focus on Growth.</h2>
            <p style={{ marginTop: 16, color: 'var(--text-2)', lineHeight: 1.75 }}>
              Proowrx helps you do more with less by taking on routine accounting tasks within your existing workflows, giving your team the capacity to handle more clients without proportionately increasing overheads.
            </p>
            <p style={{ marginTop: 16, color: 'var(--text-2)', lineHeight: 1.75 }}>
              With reconciliations, payroll, workpapers, tax returns and SMSF administration supported by our team, your accountants can focus on building new client relationships, strategic advice and business growth.
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
            <h2 className="section-title">Outsourced Accounting Support</h2>
            <p className="section-body" style={{ margin: '0 auto' }}>
              From everyday bookkeeping and payroll to year-end tax & accounts preparation along with SMSF administration, Proowrx supports the accounting tasks that keep client files getting processed. Services can be tailored to your firm’s workload, software environment and compliance requirements.
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

      <ServiceBenefits service="What’s In It for You?" intro="Outsourced accounting support will allow you to take on additional work without limitations of overheads, workloads and still delivering results well on time, fully compliant. So, you can focus on new clients and business growth." benefits={[
        { title: 'Significant Cost Reduction', text: 'No monthly salaries, recruitment fees, desk space or extra software license. With pay-per-requirement pricing, you only pay for the resources and services you actually use.' },
        { title: 'Specialists on Tap', text: 'Work with trained & experienced professionals who keep up with tax law changes, cloud platforms and compliance standards, with no extra cost landing on you.' },
        { title: 'Best People for Better Work', text: 'Let your people spend more time advising clients, building relationships and growing the firm while we do data entry, reconciliation and other repetitive tasks.' },
        { title: 'More Flexibility for Busy Seasons', text: 'We understand the stretch which tax seasons and reporting deadlines bring for you. Have extra outsourced capacity at hand so you can handle new clients even in peak seasons without committing a fixed cost.' },
      ]} />
      {/* Why Us */}
      <section className="section" style={{ background: 'var(--navy)' }}>
        <div className="container">
          <div ref={r4} className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="chip chip-white section-eyebrow">Why Proowrx</span>
            <h2 className="section-title section-title--white">The First Choice for Accounting Firms</h2>
            <p className="section-body section-body--white" style={{ margin: '0 auto' }}>
              We take the time to understand the blockages in your growth path and offer customized solutions backed with trained and dependable professionals who lead your business to success.
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

      {/* Software Strip */}
      <section className="section acc-software-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="chip chip-gold section-eyebrow">ACCOUNTING SOFTWARES</span>
            <h2 className="section-title">If It Works for You, We’re Good with It</h2>
            <p className="section-body" style={{ margin: '0 auto' }}>
              Our team can work with any accounting stack your practice uses, following your established processes, templates and handover requirements.
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

      {/* Process */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span className="chip chip-teal section-eyebrow">HOW WE GET STARTED</span>
            <h2 className="section-title">Four Simple Steps to Extra Support</h2>
            <p className="section-body section-body--white" style={{ margin: '0 auto' }}>
              A straightforward onboarding process, from understanding your workload to integrate required accounting support into your existing workflows.
            </p>
          </div>
          <div className="acc-process-grid">
            {[
              { num: '01', title: 'Discovery Call', desc: 'We’ll discuss your workload, recurring tasks, current systems and the pain points in your business. This gives us a clear and practical starting point' },
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
