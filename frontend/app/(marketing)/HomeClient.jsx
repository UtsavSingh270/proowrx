'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Lottie } from 'lottie-react';
import {
  ArrowRight, ChevronLeft, ChevronRight, Shield, Users, Lock, Settings2,
  BarChart3, Wrench, Building2, Search,
} from 'lucide-react';
import CtaBanner from '../../components/shared/CtaBanner';
import './Home.css';

const CLIENT_STORIES = [
  { text: 'Proowrx cut our average loan processing time from 4 days to overnight. My brokers now focus entirely on client relationships. Genuinely game-changing.', name: 'Sarah M.', role: 'Principal Broker, NSW' },
  { text: 'The accounting team handles everything from BAS to year-end — all compliant, all on time. It\'s like having an in-house team at a fraction of the cost.', name: 'James T.', role: 'Accounting Practice Owner, VIC' },
  { text: 'What surprised me most was the security. Australia-hosted, 2FA on every access point, audit logs. They take our data more seriously than most local firms.', name: 'Priya K.', role: 'Finance Broker, QLD' },
  { text: 'Our turnaround times are faster, our client communication is clearer, and the whole operation finally feels ready to scale.', name: 'Daniel R.', role: 'Mortgage Director, WA' },
];

const HERO_SLIDES = [
  {
    eyebrow: 'Mortgage Process Outsourcing',
    title: 'Settle More Loans. Spend Less Time on Admin',
    description: 'Dedicated mortgage processing support handles submissions, lender follow-ups, document checks, and compliance admin, allowing you to spend more time with clients and less time chasing files.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=2000&q=88',
    primaryLabel: 'Explore Mortgage',
    primaryHref: '/mortgage',
    secondaryLabel: 'View All Services',
    secondaryHref: '/services',
  },
  {
    eyebrow: 'Accounting & Bookkeeping Support',
    title: 'Less Time on Bookkeeping. More Time for Your Clients',
    description: 'Australian-compliant bookkeeping, tax, and lodgement support that fits into your practice so you can take on more clients without hiring more staff.',
    image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=2000&q=88',
    primaryLabel: 'Explore Accounting',
    primaryHref: '/accounting',
    secondaryLabel: 'Book a Call',
    secondaryHref: '/contact',
  },
  {
    eyebrow: 'Asset Finance Support',
    title: 'Keep Deals Moving From Application to Settlement.',
    description: 'We help with application packaging, document collection, lender coordination, matrix checks and settlement tasks, so your asset finance deals keep moving forward.',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2000&q=88',
    primaryLabel: 'Explore Asset Finance',
    primaryHref: '/asset-finance',
    secondaryLabel: 'How We Work',
    secondaryHref: '/services',
  },
  {
    eyebrow: 'Digital Marketing Support',
    title: 'Build Your Online Presence. With Dedicated Marketing Support.',
    description: 'From SEO and social media to paid ads and content. We help financial services businesses build visibility, attract the right audience, and turn digital activity into real opportunities.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=2000&q=88',
    primaryLabel: 'Explore Marketing',
    primaryHref: '/digital-marketing',
    secondaryLabel: 'Talk to Our Team',
    secondaryHref: '/contact',
  },
];

/* ─────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useCountUp(target, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setCount(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return count;
}

/* ─────────────────────────────────────────────
   STAT COUNTER CARD
───────────────────────────────────────────── */
function StatCard({ icon, value, suffix, label, delay, active }) {
  const count = useCountUp(value, 1600, active);
  return (
    <div className="stat-card" style={{ transitionDelay: `${delay}ms` }}>
      <span className="stat-icon">{icon}</span>
      <div className="stat-value">{count}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const STATS = [
  { icon: <Image src="/icons/experience.svg" width={40} height={40} alt="Years Experience" />, value: 25, suffix: '+', label: 'Years of Leadership Experience' },
  { icon: <Image src="/icons/compliant.svg" width={40} height={40} alt="Average Turnaround Time" />, value: 100, suffix: '%', label: 'Australian Business Compliant ' },
  { icon: <Image src="/icons/brokers.svg" width={40} height={40} alt="Brokers & Accountants" />, value: 150, suffix: '+', label: 'Dedicated Professionals' },
  { icon: <Image src="/icons/reduction.svg" width={40} height={40} alt="Compliance Focused" />, value: 50, suffix: '%', label: 'Cost Reduction' },
];

const SERVICES = [
  {
    icon: <Building2 size={28} />,
    tag: 'For Australian Brokers',
    title: 'Mortgage Outsourcing Service',
    desc: 'Scale your brokerage efficiently with our specialised mortgage outsourcing service. By outsourcing mortgage loan processing to our dedicated team, you can reduce administrative overhead while ensuring faster file progression.',
    bullets: ['CRM & ApplyOnline/LoanApp Updates', 'Compliance Support & Serviceability Checks', 'Active Lender Follow-ups & Pipeline Tracking', 'Document Verification & Packaging', 'Pricing Requests & Valuations Coordination', 'Settlement Administration & Post-Settlement Care'],
    accent: '#173F78',
    glow: 'rgba(23,63,120,0.10)',
    to: '/mortgage',
  },
  {
    icon: <BarChart3 size={28} />,
    tag: 'For Australian Accountants',
    title: 'Accounting Outsourcing Service',
    desc: 'Safeguard your business profit margins and eliminate seasonal bottlenecks with an expert accounting outsourcing service. Our tailored outsourced accounting service provides reliable support for daily bookkeeping, bank reconciliations, payroll, and BAS draft preparation. ',
    bullets: ['Reconciliations & Bookkeeping Support', 'Payroll Processing & Superannuation', 'Accounts Payable & Receivable Management', 'BAS & IAS Draft Preparation', 'Bank Reconciliations & Ledger Maintenance', 'Financial Reporting & Data Entry'],
    accent: '#D99A00',
    glow: 'rgba(217,154,0,0.11)',
    to: '/accounting',
  },
  {
    icon: <Wrench size={28} />,
    tag: 'For Asset Finance Brokers',
    title: 'Asset Finance Outsourcing Service',
    desc: 'Elevate deal turnaround times and boost client satisfaction with streamlined asset finance outsourcing service. Designed specifically for commercial, vehicle and equipment finance providers. Our comprehensive asset finance service covers application packaging, lender matrix compliance, quotation checks, and settlement coordination.',
    bullets: ['Application Packaging & Processing', 'Customer Documentation & Verification', 'CRM Data Updates & Tracking', 'Lender Communications & Matrix Checks', 'Invoice & Quotation Verification', 'Settlement Coordination with Lenders & Dealers'],
    accent: '#173F78',
    glow: 'rgba(23,63,120,0.10)',
    to: '/asset-finance',
  },
  {
    icon: <Search size={28} />,
    tag: 'For Finance Businesses',
    title: 'Digital Marketing Outsourcing Service',
    desc: 'Grow your business with digital marketing designed for financial services. Our team handles your local search, paid ads, website content, and social media from start to finish.',
    bullets: ['Search Engine Optimisation (SEO)', 'Social Media Marketing', 'Paid Advertising', 'Email Marketing', 'Website Designing', 'Podcast & Webinars'],
    accent: '#D99A00',
    glow: 'rgba(217,154,0,0.11)',
    to: '/digital-marketing',
  },
];

const WHY_FEATURES = [
  {
    icon: <Users size={22} />,
    title: 'COMPLIANCE MANAGEMENT',
    desc: 'We handle all compliance and regulatory requirements as per industry standards, governing bodies, and platform frameworks, relieving your operational burden.',
    color: '#00D4B8',
  },
  {
    icon: <Settings2 size={22} />,
    title: 'ENSURING BUSINESS CONTINUITY',
    desc: 'We ensure uninterrupted operations with trained backup staff in place, so your work continues smoothly even when your dedicated team members are unavailable.',
    color: '#F5A623',
  },
  {
    icon: <Lock size={22} />,
    title: 'REGULAR TRAINING & DEVELOPMENT',
    desc: 'At Proowrx, our team undergoes continuous, structured training to stay aligned with industry best practices across skills, workflows, compliance, and policy updates.',
    color: '#00D4B8',
  },
  {
    icon: <Lock size={22} />,
    title: 'DATA SECURITY ASSURANCE',
    desc: 'Being ISO 27001:2022 certified, we ensure data security through industry-leading protocols, including 24/7 CCTV, secure access controls, data encryption, and a robust incident response plan.',
    color: '#F5A623',
  },
];

const PROCESS = [
  { num: '01', animation: '/Free Discovery Call.json', title: 'Tell Us Your Specific Requirements', desc: 'We start by understanding your tasks, workload, systems, and support needs. This helps us identify the most suitable service model for your operations.' },
  { num: '02', animation: '/Live File Processing.json', title: 'Choose the Right Service Model', desc: 'Based on your requirements, you can choose a flexible service model. We then set up the workflow around your existing processes, platforms, and communication channels, defining roles, responsibilities, turnaround expectations, and reporting.' },
  { num: '03', animation: '/Seamless Onboarding.json', title: 'Start Working With Your Proowrx Team', desc: 'Once the workflow is set up, our trained professionals begin supporting your day-to-day operations across the agreed-upon tasks. Communication stays clear, work is tracked, and your team remains informed throughout.' },
  { num: '04', animation: '/Scale As You Grow.json', title: 'Adjust Support as Your Business Changes', desc: 'As your workload fluctuates and business priorities shift, Proowrx provides the flexibility to scale your support, helping you stay efficient without committing to fixed costs.' },
];

const FAQS = [
  { q: 'What outsourcing and business support service does Proowrx provide in Australia?', a: 'Proowrx provides four core back-office outsourcing services for Australian businesses: mortgage processing, accounting and bookkeeping, asset finance support, and digital marketing management.' },
  { q: 'Which Australian industries does Proowrx support?', a: 'We support Australian mortgage brokerages, accounting businesses, asset finance brokers, buyer agents, and real estate agents looking to reduce administrative workloads and increase internal operational capacity.' },
  { q: 'How does Proowrx work with my existing team, systems and business processes?', a: 'Our professionals integrate as an extension of your team, working directly within your existing software such as Xero, MYOB, and ApplyOnline while following your established workflows.' },
  { q: 'Can I start with one Proowrx service and add more support as my business grows?', a: 'Yes, our flexible support models let you start with a single service and easily scale up to multi-service support or dedicated resources as your business grows.' },
  { q: 'How does Proowrx protect client data and confidential business information?', a: 'Proowrx protects confidential data through strict staff confidentiality agreements, biometric access controls, 24/7 CCTV monitoring, secure technologies such as encryption and firewalls, and clean desk policies.' },
  { q: 'What makes Proowrx different from other outsourcing providers in Australia?', a: 'As an Australian-owned partner, we provide dedicated, industry-trained professionals, flexible support models, transparent communication, and reliable turnaround times, all without lock-in contracts.' },
  { q: 'How quickly can Proowrx begin supporting my business?', a: 'Once we review your specific workload and system requirements, our trained professionals deploy and begin managing your back-office operations within a few days.' },
];

function FaqItem({ item, isOpen, onToggle, index }) {
  return (
    <div className={`faq-item${isOpen ? ' faq-item--open' : ''}`}>
      <button
        className="faq-question"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${index}`}
      >
        <span>{item.q}</span>
        <span className="faq-icon" aria-hidden="true">
          <span className="faq-icon-h" />
          <span className="faq-icon-v" />
        </span>
      </button>
      <div
        className="faq-answer-wrap"
        id={`faq-panel-${index}`}
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="faq-answer-inner">
          <p className="faq-answer">{item.a}</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   HOME
───────────────────────────────────────────── */
export default function HomeClient() {
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  const [statsRef, statsVisible]     = useInView(0.3);
  const [svcRef, svcVisible]         = useInView(0.1);
  const [whyFeatRef, whyFeatVisible] = useInView(0.08);
  const [procRef, procVisible]       = useInView(0.1);
  const [testiRef, testiVisible]     = useInView(0.1);
  const [faqRef, faqVisible]         = useInView(0.1);
  const [openFaq, setOpenFaq]        = useState(0);
  const [processStage, setProcessStage] = useState(0);
  const processLoopTimerRef = useRef(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHeroSlide(current => (current + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const nextSlide = HERO_SLIDES[(activeHeroSlide + 1) % HERO_SLIDES.length];
    const preload = new window.Image();
    preload.src = nextSlide.image;
  }, [activeHeroSlide]);

  useEffect(() => {
    if (!procVisible) return undefined;
    const startTimer = window.setTimeout(() => setProcessStage(1), 120);
    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(processLoopTimerRef.current);
    };
  }, [procVisible]);

  const advanceProcessTimeline = () => {
    setProcessStage(currentStage => {
      if (currentStage < PROCESS.length) return currentStage + 1;
      window.clearTimeout(processLoopTimerRef.current);
      processLoopTimerRef.current = window.setTimeout(() => setProcessStage(1), 1400);
      return PROCESS.length + 1;
    });
  };

  const heroSlide = HERO_SLIDES[activeHeroSlide];
  const moveHeroSlide = direction => {
    setActiveHeroSlide(current => (current + direction + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <main className="home">

      {/* ══════════════════════════════════════
    HERO — full-bleed image, white overlay
    fading left→right (text zone left,
    image fully visible on the right)
══════════════════════════════════════ */}
<section className="hero hero-slider" aria-roledescription="carousel" aria-label="Proowrx services">
  <div
    key={heroSlide.image}
    className="hero-slide-bg"
    style={{ backgroundImage: `url("${heroSlide.image}")` }}
    aria-hidden="true"
  />
  <div className="hero-slide-overlay" aria-hidden="true" />

  <div className="container hero-slider-inner">
    <div className="hero-slide-content" key={`${activeHeroSlide}-${heroSlide.title}`}>
      <div className="hero-pill">
        <span className="hero-pill-dot" />
        {heroSlide.eyebrow}
      </div>
      <h1 className="hero-heading">{heroSlide.title}</h1>
      <p className="hero-sub">{heroSlide.description}</p>
      <div className="hero-actions">
        <Link href={heroSlide.primaryHref} className="btn-primary">{heroSlide.primaryLabel} <ArrowRight size={16} /></Link>
        <Link href={heroSlide.secondaryHref} className="btn-ghost">{heroSlide.secondaryLabel}</Link>
      </div>
      <div className="hero-slider-nav" aria-label="Hero slide controls">
        <button type="button" className="hero-slider-arrow" onClick={() => moveHeroSlide(-1)} aria-label="Previous slide"><ChevronLeft size={20} /></button>
        <button type="button" className="hero-slider-arrow" onClick={() => moveHeroSlide(1)} aria-label="Next slide"><ChevronRight size={20} /></button>
      </div>
    </div>
  </div>
</section>

      {/* ══════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════ */}
      <div className="stats-bar" ref={statsRef}>
        <div className="container stats-grid">
          {STATS.map((s, i) => (
            <StatCard key={i} {...s} delay={i * 80} active={statsVisible} />
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          SERVICES
      ══════════════════════════════════════ */}
      <section className="section services-section" ref={svcRef}>
        <div className="container">
          <div className={`section-head fade-up${svcVisible ? ' in' : ''}`}>
            <span className="pill">Our Services</span>
            <h2 className="section-title">Four specialist services, one reliable team</h2>
            <p className="section-sub">
              From mortgage and accounting operations to asset finance and digital marketing, our trained remote specialists integrate with your workflow and help your business move faster.
            </p>
          </div>

          <div className="services-grid">
            {SERVICES.map((svc, i) => (
              <div
                key={i}
                className={`svc-card fade-up${svcVisible ? ' in' : ''}`}
                style={{ transitionDelay: `${i * 140 + 100}ms` }}
              >
                <div className="svc-top-bar" style={{ background: `linear-gradient(90deg, ${svc.accent}, transparent)` }} />
                <div className="svc-header">
                  <div className="svc-icon-wrap" style={{ background: svc.glow, borderColor: `${svc.accent}33`, color: svc.accent }}>
                    {svc.icon}
                  </div>
                  <div>
                    <span className="svc-tag" style={{ color: svc.accent }}>{svc.tag}</span>
                    <h3 className="svc-title">{svc.title}</h3>
                  </div>
                </div>
                <p className="svc-desc">{svc.desc}</p>
                <ul className="svc-bullets">
                  {svc.bullets.map((b) => (
                    <li key={b}>
                      <span className="svc-check" style={{ color: svc.accent }}>✦</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <Link href={svc.to} className="svc-link" style={{ color: svc.accent, borderBottomColor: `${svc.accent}55` }}>
                  Explore {svc.title} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
    WHY PROOWRX — bento grid: one large
    featured card, two side cards, one
    full-width banner card
══════════════════════════════════════ */}
<section className="section why-feat-section" ref={whyFeatRef}>
  <div className="container">
    <div className={`section-head fade-up${whyFeatVisible ? ' in' : ''}`}>
      <span className="pill">Why Proowrx</span>
      <h2 className="section-title">A one-stop solution for Australian financial professionals</h2>
      <p className="section-sub">
        We offer top-notch back-office support services to mortgage brokers and comprehensive accounting services to accountants — so you can focus on what matters most.
      </p>
    </div>

    <div className="why-bento">
      {WHY_FEATURES.map((f, i) => (
        <div
          key={i}
          className={`why-bento-card why-bento-${['a', 'b', 'c', 'd'][i]} fade-up${whyFeatVisible ? ' in' : ''}`}
          style={{ transitionDelay: `${i * 100 + 80}ms`, '--card-color': f.color }}
        >
          <div className="why-bento-icon" style={{ background: `${f.color}18`, color: f.color, borderColor: `${f.color}35` }}>
            {f.icon}
          </div>
          <span className="why-bento-num">{String(i + 1).padStart(2, '0')}</span>
          <h4 className="why-bento-title">{f.title}</h4>
          <p className="why-bento-desc">{f.desc}</p>
          <div className="why-bento-glow" style={{ background: f.color }} />
        </div>
      ))}
    </div>
  </div>
</section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <section className="section process-section" ref={procRef}>
        <div className="container">
          <div className={`section-head fade-up${procVisible ? ' in' : ''}`}>
            <span className="pill">How It Works</span>
            <h2 className="section-title">From onboarding to output in days</h2>
            <p className="section-sub">Getting started is effortless. We plug directly into your existing workflow with zero disruption to your operations.</p>
          </div>

          <div className={`process-track${procVisible ? ' process-track--visible' : ''}`}>
            <div className="process-line" style={{ '--process-progress': `${Math.min(3, Math.max(0, processStage - 1)) * 33.333}%` }} />
            {PROCESS.map((step, i) => (
              <div
                key={i}
                className={`process-step fade-up${procVisible ? ' in' : ''}${processStage === i + 1 ? ' process-step--active' : ''}${processStage > i + 1 ? ' process-step--complete' : ''}`}
                style={{ transitionDelay: `${i * 110 + 150}ms` }}
              >
                <div className="process-node" aria-hidden="true">
                  <Lottie
                    key={`${step.animation}-${processStage === i + 1 ? 'active' : 'idle'}`}
                    src={step.animation}
                    className="process-node-animation"
                    autoplay={processStage === i + 1}
                    loop={false}
                    subscriptions={processStage === i + 1 ? { complete: advanceProcessTimeline } : undefined}
                  />
                </div>
                <div className="process-num">{step.num}</div>
                <h4 className="process-title">{step.title}</h4>
                <p className="process-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
      <section className="section testi-section" ref={testiRef}>
        <div className="container">
          <div className={`section-head fade-up${testiVisible ? ' in' : ''}`}>
            <span className="pill">Client Stories</span>
            <h2 className="section-title">Trusted by Businesses Across Australia</h2>
            <p>Long-term relationships are built on reliability, communication, and consistent support. That&apos;s why businesses keep choosing Proowrx as their operational support partner.</p>
          </div>
          <div className={`testi-marquee fade-up${testiVisible ? ' in' : ''}`}>
            <div className="testi-track">
              {[0, 1].map((groupIndex) => (
                <div key={groupIndex} className="testi-group" aria-hidden={groupIndex === 1 ? 'true' : undefined}>
                  {CLIENT_STORIES.map((story) => (
                    <article key={`${groupIndex}-${story.name}`} className="testi-card">
                      <span className="testi-quote-mark" aria-hidden="true">“</span>
                      <p className="testi-text">{story.text}</p>
                      <div className="testi-meta">
                        <div className="testi-author">
                          <span className="testi-initials" aria-hidden="true">{story.name.charAt(0)}</span>
                          <div><div className="testi-name">{story.name}</div><div className="testi-role">{story.role}</div></div>
                        </div>
                        <div className="testi-stars" aria-label="5 out of 5 stars">★★★★★</div>
                      </div>
                    </article>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />

      {/* ══════════════════════════════════════
          FAQ
      ══════════════════════════════════════ */}
      <section className="section faq-section" ref={faqRef}>
        <div className="container">
          <div className={`section-head fade-up${faqVisible ? ' in' : ''}`}>
            <span className="pill">FAQs</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-sub">
              Answers to the questions we hear most from Australian brokers, accountants and finance businesses.
            </p>
          </div>

          <div className="faq-list">
            {FAQS.map((item, i) => (
              <div
                key={i}
                className={`fade-up${faqVisible ? ' in' : ''}`}
                style={{ transitionDelay: `${i * 70 + 80}ms` }}
              >
                <FaqItem
                  item={item}
                  index={i}
                  isOpen={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}