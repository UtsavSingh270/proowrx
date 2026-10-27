'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { CheckCircle2, ShieldCheck, Clock3, ClipboardCheck, FileSearch, FolderOpen, ListChecks, FileText, Users, LockKeyhole, TrendingUp } from 'lucide-react';
import ServiceFaq from '@/components/shared/ServiceFaq';
import ServiceBenefits from '@/components/shared/ServiceBenefits';
import './auditsupport.css';

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add('visible');
        observer.unobserve(el);
      }
    }, { threshold: 0.08 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

const introPoints = [
  'Missing Client Documents: Time wasted chasing outstanding records and supporting information.',
  'Reconciliation Backlogs: Incomplete ledger reconciliations delaying audit preparation.',
  'Disorganised Audit Evidence: Difficulty locating financial statements, invoices and supporting documents.',
  'Repeated Auditor Queries: Valuable time spent responding to document requests and follow-ups.',
  'Last-Minute Audit Pressure: Tight deadlines, incomplete records and outstanding preparation tasks.',
  'Overloaded Accounting Teams: Senior accountants managing routine administrative work alongside technical reviews and multiple client files.',
];

const provideItems = [
  { Icon: FolderOpen, title: 'Working Paper Preparation & Organisation', body: 'Prepare structured digital working papers with organised supporting documents, clear cross-references and properly indexed records for easier review.' },
  { Icon: FileSearch, title: 'Balance Sheet & Ledger Reconciliations', body: 'Support reconciliations of fixed assets, accounts payable and receivable, payroll clearing accounts and loan schedules, helping identify discrepancies before auditor review.' },
  { Icon: ListChecks, title: 'SMSF Audit Preparation', body: 'Organise financial statements, valuation evidence, bank records and trustee resolutions to support your accounting team in preparing files for independent SMSF auditors.' },
  { Icon: ClipboardCheck, title: 'Trust Account Audit Preparation', body: 'Assist with trust account reconciliations, bank statement matching and organising client ledger records for review against applicable requirements.' },
  { Icon: FileText, title: 'Audit Evidence Collection', body: 'Collect and organise missing invoices, bank confirmations, dividend statements and supporting agreements to help prepare complete documentation packs.' },
  { Icon: Users, title: 'Auditor Query Support', body: 'Help your accounting team gather additional documents, organise responses and track outstanding information requests during external audits.' },
];

const whyItems = [
  { Icon: Clock3, title: 'Australian Compliance Standards', body: 'Our team is trained in Australian Auditing Standards, current ATO compliance regulations, and complex statutory trust account reporting frameworks.' },
  { Icon: ShieldCheck, title: 'Faster Audit Completion', body: 'We process and index completed working paper packs quickly, enabling your external auditors to complete thorough reviews without operational friction.' },
  { Icon: TrendingUp, title: 'Flexible Capacity Control', body: 'Get additional accounting support during busy audit periods without the year-round cost of hiring full-time staff.' },
];

export default function AuditSupport() {
  const r1 = useReveal();
  const r2 = useReveal();
  const r3 = useReveal();
  const r4 = useReveal();

  return (
    <div>
      {/* 1. Hero */}
      <section className="page-hero page-hero--split page-hero--img as-hero" style={{ '--hero-bg': 'url("https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1800&q=85")' }}>
        <div className="container">
          <div className="page-hero-content">
            <span className="chip chip-gold section-eyebrow">Audit Support</span>
            <h1>Audit Support for Australian Accounting Businesses</h1>
            <p>Make external audit preparation simpler. Our team supports evidence gathering, ledger reconciliations and document preparation, helping your accounting firm stay organised and keep work moving.</p>
            <div className="page-hero-stats">
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">48hr</span>
                <span className="page-hero-stat-label">Turnaround</span></div>
              <div className="page-hero-stat-divider" />
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">Experienced</span>
                <span className="page-hero-stat-label">Audit Specialists</span>
              </div>
              <div className="page-hero-stat-divider" />
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">100%</span>
                <span className="page-hero-stat-label">Frictionless Reviews</span>
              </div>
            </div>
          </div>
          <div className="page-hero-visual">
            <Image src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=85" alt="Accounting team reviewing audit documents" width={800} height={533} sizes="(max-width: 960px) 100vw, 45vw" />
            <div className="page-hero-badge-float">
              <span className="as-hero-badge-icon" aria-hidden="true"><ClipboardCheck size={24} /></span>
              <div><strong>Audit-Ready Support</strong><span>Organised Files & Workpapers</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Service Intro */}
      <section className="section">
        <div className="container as-intro">
          <div ref={r1} className="reveal as-intro-text">
            <span className="chip chip-sky section-eyebrow">THE PROBLEM WE SOLVE</span>
            <h2 className="section-title">Reliable Audit Support for Your Accounting Firm </h2>
            <p className="section-body">Audit preparation can put significant pressure on accounting firms. Missing documents, reconciliation backlogs and constant auditor requests make it difficult to keep client files organised and meet deadlines.</p>
            <ul className="as-point-list">{introPoints.map((point) => <li key={point}><CheckCircle2 size={17} className="as-point-check" /><span>{point}</span></li>)}</ul>
          </div>
          <div className="as-intro-visual reveal reveal-delay-2" ref={r2}>
            <Image src="https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=800&q=85" alt="Financial records prepared for review" width={800} height={533} sizes="(max-width: 960px) 100vw, 45vw" />
          </div>
        </div>
      </section>

       {/* 3. What We Provide */}
      <section className="section" id="services" style={{ background: 'var(--surface)' }}>
        <div className="container as-provide-container">
          <div ref={r3} className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="chip chip-gold section-eyebrow">WHAT WE HANDLE</span>
            <h2 className="section-title">Comprehensive Audit Support Services Tailored for Your Practice</h2>
            <p className="section-body" style={{ maxWidth: 560, margin: '0 auto' }}>From tracking down missing documents to reconciling complex accounts, we manage every step of your audit preparation workflow.</p>
          </div>
          <div className="as-provide-grid">
            {provideItems.map(({ Icon, title, body }, i) => <div key={title} className={`as-provide-item reveal reveal-delay-${(i % 4) + 1}`}>
              <div className="as-provide-heading"><div className="as-provide-icon"><Icon size={20} /></div><h4 className="as-provide-title">{title}</h4></div>
              <p className="as-provide-body">{body}</p>
            </div>)}
          </div>
        </div>
      </section>

      <ServiceBenefits service="Audit Support" heading="Benefits of Outsourcing Audit Support Services" intro="Cut overhead costs, eliminate audit-season bottlenecks, and give your accounting team the breathing room they need to focus entirely on core business growth." benefits={[
        { title: 'Reduce Fixed Overheads', text: 'Dropping expensive full-time salaries, office space, and specialised software turns rigid fixed expenses into predictable monthly investments, lowering your overall operational costs.' },
        { title: 'Skilled Specialist', text: 'Access a pool of certified professionals for instant expertise in complex regulatory frameworks, strict accounting standards, and advanced risk assessment techniques.' },
        { title: 'Effortless Workload Scaling', text: 'Adjust support levels to handle seasonal surges and project demands smoothly, avoiding the constant headache of hiring and firing internal staff.' },
        { title: 'Guaranteed Regulatory Alignment', text: 'Strictly adhere to established international compliance frameworks to minimise operational liability and eliminate the hidden risks of single-person dependency within your firm.' },
      ]} />

      {/* 4. Why Choose */}
      <section className="section">
        <div className="container">
          <div ref={r4} className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="chip chip-violet section-eyebrow">Why Proowrx</span>
            <h2 className="section-title">Simplify Your Audit Preparation with Proowrx</h2>
            <p className="section-body" style={{ maxWidth: 560, margin: '0 auto' }}>We expertly build and format structured workpaper files across major platforms like Xero, MYOB, Class Super, BGL, HandiSoft, and APS.</p>
          </div>
          <div className="as-why-grid">
            {whyItems.map(({ Icon, title, body }, i) => <div key={title} className={`as-why-card reveal reveal-delay-${i + 1}`}>
              <div className="as-why-heading"><div className="as-why-icon"><Icon size={20} /></div><h4 className="as-why-title">{title}</h4></div>
              <p className="as-why-body">{body}</p>
            </div>)}
          </div>
        </div>
      </section>

      {/* 5. FAQ */}
      <ServiceFaq variant="auditsupport" title="Got Questions? We’ve Got Answers." intro="Learn more about how our audit support team works with your accounting practice." />
    </div>
  );
}
