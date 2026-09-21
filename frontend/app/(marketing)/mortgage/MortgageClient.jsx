'use client';

import React, { useEffect, useRef } from 'react';

import { ArrowRight, CheckCircle } from 'lucide-react';
import ServiceFaq from '@/components/shared/ServiceFaq';
import './Mortgage.css';

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

const models = [
  {
    num: '01',
    title: 'Pay-Per-Application',
    tag: 'Flexible',
    tagColor: 'var(--gold)',
    desc: 'Perfect for brokers who need help without committing to fixed monthly volumes. Pay only when you have a file.',
    benefits: ['No lock-in contracts', 'Tailored processing to your workflow', 'Manage peak loads without extra hires', 'No setup costs or fixed fees'],
    packages: [
      { name: 'Standard', desc: 'Data entry on aggregator CRM, validation, compliance checks, coordination, and accurate lodgements on the lender portal.' },
      { name: 'Comprehensive', desc: 'Everything in Standard plus follow-ups with solicitors, lenders & clients. Handles valuations, pricing, and construction progress payments.' },
    ],
  },
  {
    num: '02',
    title: 'Dedicated Resource Model',
    tag: 'Most Popular',
    tagColor: 'var(--teal)',
    desc: 'Our resources act as a direct extension of your team — available full-time or part-time based on your needs.',
    benefits: ['Full-time: 8hrs/day, 5 days/week', 'Part-time: 4hrs/day, 5 days/week', 'Consistent support & familiarity with your workflow', 'Scales with your portfolio growth'],
    packages: null,
  },
];

const preSubmission = [
  'Enter details in CRM and fill in ApplyOnline',
  'Generate and send loan application forms for signing',
  'Upload supporting docs with all compliance satisfied',
  'Complete FHOG, FHLDS and other relevant forms',
  'Prepare discharge authority forms where necessary',
  'Complete the file and lodge to the lender',
];

const postSubmission = [
  'Monitor application progress and follow up with lender',
  'Request any outstanding documentation from clients',
  'Respond to audit/compliance questions from lender',
  'Coordinate with solicitors and valuers',
  'Manage construction progress payments where applicable',
];

const whyUs = [
  { icon: '🏆', title: 'Industry Expertise', desc: 'Trained specifically on the Australian mortgage market by an experienced Australia-based broker.' },
  { icon: '⚡', title: 'Streamlined Solutions', desc: 'Technology to automate manual tasks and plug seamlessly into your existing workflow.' },
  { icon: '📈', title: 'Scalability', desc: 'From 1 file a week to 100 — our service adapts as your business grows.' },
  { icon: '🛡️', title: 'Unwavering Support', desc: 'A dedicated team that helps you move faster, eliminate stress, and focus on clients.' },
];

export default function Mortgage() {
  const r1 = useReveal(), r2 = useReveal(), r3 = useReveal(), r4 = useReveal();

  return (
    <div>
      {/* ── Hero ── */}
      <section
        className="page-hero page-hero--split page-hero--img"
        style={{ '--hero-bg': 'url("https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1800&q=85")' }}
      >
        <div className="page-hero-orb-1" />
        <div className="page-hero-orb-2" />
        <div className="container">
          <div className="page-hero-content">
            <span className="chip chip-gold" style={{ marginBottom: 10 }}>Mortgage Services</span>
            <h1>Mortgage Outsourcing<br />Services</h1>
            <p>We handle everything behind the scenes — loan processing, compliance, data entry, and post-submission follow-ups — so you can focus on closing more deals.</p>
            <div className="page-hero-actions">
              <a href="https://calendly.com/proowrx/30min" target="_blank" rel="noreferrer" className="btn btn-gold">
                Book a Meeting <ArrowRight size={15} />
              </a>
            </div>
            <div className="page-hero-stats">
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">2</span>
                <span className="page-hero-stat-label">Service Models</span>
              </div>
              <div className="page-hero-stat-divider" />
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">24hr</span>
                <span className="page-hero-stat-label">Turnaround SLA</span>
              </div>
              <div className="page-hero-stat-divider" />
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">100%</span>
                <span className="page-hero-stat-label">ATO Compliant</span>
              </div>
            </div>
          </div>
          <div className="page-hero-visual">
            <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=85" alt="Mortgage processing" />
            <div className="page-hero-badge-float">
              <span style={{ fontSize: '1.6rem' }}>🏠</span>
              <div>
                <strong>Expert Processors</strong>
                <span>Pre &amp; Post-Submission</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro split */}
      <section className="section">
        <div className="container ma-intro">
          <div ref={r1} className="reveal-left ma-intro-text">
            <span className="chip chip-gold section-eyebrow">The Problem We Solve</span>
            <h2 className="section-title">Stop Drowning in Paperwork</h2>
            <p className="section-body" style={{ maxWidth: '100%' }}>
              Running a mortgage business means multitasking across loan applications, document verification, and tight compliance regulations. All of this hampers growth and limits time spent with clients.
            </p>
            <p style={{ marginTop: 16, color: 'var(--text-2)', lineHeight: 1.75 }}>
              Proowrx takes the entire back-end processing load off your plate — loan processing, data entry, document handling, and more — so you can focus on growing your book, acquiring new clients, and increasing loan volume without hiring in-house.
            </p>
          </div>
          <div ref={r2} className="reveal-right ma-intro-image">
            <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=85" alt="Mortgage processing" loading="lazy" decoding="async" />
          </div>
        </div>
      </section>

      {/* Service models */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span className="chip chip-teal section-eyebrow">Service Models</span>
            <h2 className="section-title">Two Ways to Work with Us</h2>
          </div>
          <div className="models-grid">
            {models.map((m, i) => (
              <div key={i} className="model-card">
                <div className="model-header">
                  <div className="model-num">{m.num}</div>
                  <div>
                    <span className="model-tag" style={{ color: m.tagColor, borderColor: m.tagColor }}>
                      {m.tag}
                    </span>
                    <h3>{m.title}</h3>
                  </div>
                </div>
                <p className="model-desc">{m.desc}</p>
                <ul className="model-benefits">
                  {m.benefits.map((b, j) => <li key={j}><CheckCircle size={15} />{b}</li>)}
                </ul>
                {m.packages && (
                  <div className="packages">
                    {m.packages.map((p, j) => (
                      <div key={j} className={`pkg ${j === 1 ? 'pkg-dark' : ''}`}>
                        <strong>{p.name}</strong>
                        <p>{p.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="chip chip-gold section-eyebrow">What We Handle</span>
            <h2 className="section-title">Pre & Post-Submission Activities</h2>
          </div>
          <div className="activities-grid">
            <div className="activity-col activity-pre">
              <div className="activity-header">
                <span className="activity-icon">📋</span>
                <h3>Pre-Submission</h3>
              </div>
              <ul>
                {preSubmission.map((a, i) => <li key={i}><CheckCircle size={14} />{a}</li>)}
              </ul>
            </div>
            <div className="activity-col activity-post">
              <div className="activity-header">
                <span className="activity-icon">📞</span>
                <h3>Post-Submission</h3>
              </div>
              <ul>
                {postSubmission.map((a, i) => <li key={i}><CheckCircle size={14} />{a}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="section mortgage-why-section" style={{ background: 'var(--navy)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="chip chip-white section-eyebrow">Why Proowrx</span>
            <h2 className="section-title section-title--white">Why Brokers Choose Us</h2>
          </div>
          <div className="why-grid">
            {whyUs.map((w, i) => (
              <div key={i} className="why-tile">
                <span className="why-tile-icon">{w.icon}</span>
                <h4>{w.title}</h4>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>

          <div className="partner-strip">
            <div className="partner-strip-item">
              <h4>Focus on Your Clients</h4>
              <p>Free up time to deliver exceptional service and grow your relationships.</p>
            </div>
            <div className="partner-strip-divider" />
            <div className="partner-strip-item">
              <h4>Differentiate Your Practice</h4>
              <p>Offer faster turnaround and smoother experience than the competition.</p>
            </div>
            <div className="partner-strip-divider" />
            <div className="partner-strip-item">
              <h4>Scale Efficiently</h4>
              <p>Grow without adding staff overhead — flexible support at every stage.</p>
            </div>
          </div>

          {/* <div style={{ textAlign: 'center', marginTop: 48 }}>
            <a href="https://calendly.com/proowrx/30min" target="_blank" rel="noreferrer" className="btn btn-gold">
              Book a Discovery Call <ArrowRight size={15} />
            </a>
          </div> */}
        </div>
      </section>
      <ServiceFaq
        variant="mortgage"
        title="Mortgage outsourcing questions"
        intro="Quick answers for brokers considering processing or dedicated back-office support."
      />
    </div>
  );
}
