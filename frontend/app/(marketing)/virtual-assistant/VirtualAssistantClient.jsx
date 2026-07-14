'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight, CheckCircle, Clock, Calendar, Users, Mail,
  FileText, Phone, Database, Star, Headphones,
} from 'lucide-react';
import CtaBanner from '../../../components/CtaBanner';
import './VirtualAssistant.css';

function useReveal(cls = 'reveal') {
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

const tasks = [
  { icon: <Database size={18} />, label: 'CRM Data Entry & Management', desc: 'Keep your aggregator CRM up to date with every client interaction.' },
  { icon: <Mail size={18} />, label: 'Email & Client Correspondence', desc: 'Draft, send and follow up on emails so nothing falls through the cracks.' },
  { icon: <FileText size={18} />, label: 'Document Preparation', desc: 'Prepare application packages, compliance docs & supporting files.' },
  { icon: <Calendar size={18} />, label: 'Appointment Scheduling', desc: 'Manage your calendar, book valuations and co-ordinate with lenders.' },
  { icon: <Phone size={18} />, label: 'Lender Follow-ups', desc: 'Chase progress with lenders, solicitors and real-estate agents.' },
  { icon: <Users size={18} />, label: 'Client Onboarding', desc: 'Send welcome kits, collect IDs and guide clients through the process.' },
  { icon: <Headphones size={18} />, label: 'Status Update Calls', desc: 'Make routine update calls to keep clients informed at every stage.' },
  { icon: <Star size={18} />, label: 'Report & Review Prep', desc: 'Compile progress reports and pre-settlement review packs for brokers.' },
];

const plans = [
  {
    name: 'Part-Time VA',
    hours: '4 hrs / day',
    days: 'Mon – Fri',
    color: 'var(--sky)',
    glow: 'var(--sky-glow)',
    features: [
      'Dedicated VA allocated to your business',
      '20 hours per week (4 hrs × 5 days)',
      'Morning or afternoon shift — your choice',
      'Daily handover report via email',
      'Trained in Australian mortgage industry',
      'Access to your existing CRM & tools',
    ],
    cta: 'Start Part-Time',
  },
  {
    name: 'Full-Time VA',
    hours: '8 hrs / day',
    days: 'Mon – Fri',
    color: 'var(--gold)',
    glow: 'var(--gold-pale)',
    badge: 'Most Popular',
    features: [
      'Dedicated VA allocated to your business',
      '40 hours per week (8 hrs × 5 days)',
      'Aligned with Australian business hours',
      'Daily handover report via email',
      'Trained in Australian mortgage industry',
      'Access to your existing CRM & tools',
      'Fortnightly performance review',
      'Backup VA cover during leave',
    ],
    cta: 'Start Full-Time',
  },
];

const steps = [
  { n: '01', title: 'Discovery Call', body: 'We understand your workflow, the tools you use, and exactly what tasks to hand over.' },
  { n: '02', title: 'VA Matching', body: 'We select and brief a VA from our trained mortgage team who fits your style and volume.' },
  { n: '03', title: 'Onboarding', body: 'We provide read-only or role-based access to your systems and align on processes.' },
  { n: '04', title: 'Ongoing Support', body: 'Your VA starts, you get daily updates, and our team is always available to resolve issues.' },
];

export default function VirtualAssistant() {
  const r1 = useReveal(), r2 = useReveal(), r3 = useReveal(), r4 = useReveal(), r5 = useReveal();

  return (
    <div>
      {/* ── Hero ── */}
      <section
        className="page-hero page-hero--split page-hero--img va-hero"
        style={{ '--hero-bg': 'url("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1800&q=85")' }}
      >
        <div className="container">
          <div className="page-hero-content">
            <span className="chip chip-gold section-eyebrow">Virtual Assistant</span>
            <h1>Your Dedicated Team Member</h1>
            <p>A Proowrx Virtual Assistant works as a seamless extension of your brokerage — handling admin, CRM, follow-ups and paperwork so you can focus on clients and growth.</p>
            <div className="page-hero-stats">
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">40+</span>
                <span className="page-hero-stat-label">Hours Saved<br/>Per Week</span>
              </div>
              <div className="page-hero-stat-divider" />
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">1</span>
                <span className="page-hero-stat-label">Dedicated VA<br/>for You Only</span>
              </div>
              <div className="page-hero-stat-divider" />
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">100%</span>
                <span className="page-hero-stat-label">Industry<br/>Trained</span>
              </div>
            </div>
            <div className="page-hero-actions">
              <Link href="/contact" className="btn btn-gold">Get Your VA <ArrowRight size={15} /></Link>
              <a href="#how-it-works" className="btn btn-ghost">How It Works</a>
            </div>
          </div>
          <div className="page-hero-visual">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85"
              alt="Virtual Assistant working"
            />
            <div className="page-hero-badge-float">
              <strong>👤 Dedicated Resource</strong>
              <span>AU Business Hours</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── What a VA Does ── */}
      <section className="section">
        <div className="container">
          <div ref={r1} className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="chip chip-sky section-eyebrow">What We Handle</span>
            <h2 className="section-title">Tasks Your VA Takes Off Your Plate</h2>
            <p className="section-body" style={{ maxWidth: 560, margin: '0 auto' }}>
              Your VA is trained in the Australian mortgage process — they understand industry terminology, aggregator systems, and lender requirements from day one.
            </p>
          </div>
          <div className="va-tasks-grid" ref={r2}>
            {tasks.map((t, i) => (
              <div key={i} className={`va-task-card reveal reveal-delay-${(i % 4) + 1}`}>
                <div className="va-task-icon">{t.icon}</div>
                <div>
                  <h4 className="va-task-title">{t.label}</h4>
                  <p className="va-task-desc">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Plans ── */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div ref={r3} className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="chip chip-gold section-eyebrow">Engagement Models</span>
            <h2 className="section-title">Choose Your VA Plan</h2>
            <p className="section-body" style={{ maxWidth: 520, margin: '0 auto' }}>
              Both plans include a dedicated, industry-trained VA. Scale up or down as your business needs change.
            </p>
          </div>
          <div className="va-plans-grid">
            {plans.map((p, i) => (
              <div key={i} className={`va-plan-card reveal reveal-delay-${i + 1} ${p.badge ? 'va-plan-card--featured' : ''}`}>
                {p.badge && <div className="va-plan-badge">{p.badge}</div>}
                <div className="va-plan-header" style={{ '--plan-color': p.color, '--plan-glow': p.glow }}>
                  <Clock size={20} style={{ color: p.color }} />
                  <div>
                    <h3 className="va-plan-name">{p.name}</h3>
                    <div className="va-plan-meta">
                      <span style={{ color: p.color, fontWeight: 700 }}>{p.hours}</span>
                      <span> · </span>
                      <span>{p.days}</span>
                    </div>
                  </div>
                </div>
                <ul className="va-plan-features">
                  {p.features.map((f, j) => (
                    <li key={j}>
                      <CheckCircle size={14} style={{ color: p.color }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className="btn va-plan-btn" style={{ '--btn-clr': p.color }}>
                  {p.cta} <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
          <p className="va-plans-note">
            Both plans are billed monthly with no lock-in contract. Pricing on request — contact us for a custom quote.
          </p>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section" id="how-it-works">
        <div className="container">
          <div ref={r4} className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="chip chip-emerald section-eyebrow">The Process</span>
            <h2 className="section-title">Up and Running in Days, Not Weeks</h2>
          </div>
          <div className="va-steps">
            {steps.map((s, i) => (
              <div key={i} className={`va-step reveal reveal-delay-${i + 1}`}>
                <div className="va-step-num">{s.n}</div>
                <div className="va-step-body">
                  <h4 className="va-step-title">{s.title}</h4>
                  <p className="va-step-desc">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
