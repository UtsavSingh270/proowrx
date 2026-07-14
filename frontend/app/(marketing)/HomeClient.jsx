'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Shield, TrendingUp, Users, Clock, CheckCircle,
  Star, Lock, Zap, Globe, FileText, Search, Settings2, Send,
  Award, BarChart3, MessageSquare, Wrench, Building2,
} from 'lucide-react';
import CtaBanner from '../../components/CtaBanner';
import './Home.css';

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

function useTypewriter(words, typingSpeed = 80, deleteSpeed = 45, pause = 2000) {
  const [display, setDisplay] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = words[wordIdx];
    let delay = deleting ? deleteSpeed : typingSpeed;
    if (!deleting && display === word) delay = pause;
    if (deleting && display === '') delay = 350;
    const t = setTimeout(() => {
      if (!deleting && display !== word) setDisplay(word.slice(0, display.length + 1));
      else if (!deleting && display === word) setDeleting(true);
      else if (deleting && display !== '') setDisplay(word.slice(0, display.length - 1));
      else { setDeleting(false); setWordIdx((i) => (i + 1) % words.length); }
    }, delay);
    return () => clearTimeout(t);
  }, [display, deleting, wordIdx, words, typingSpeed, deleteSpeed, pause]);
  return display;
}

/* ─────────────────────────────────────────────
   PHONE SLIDER (hero right panel)
───────────────────────────────────────────── */
const PHONE_SLIDES = [
  {
    tag: 'Mortgage Processing',
    title: 'Your files, handled end-to-end',
    color: '#00D4B8',
    icon: <FileText size={14} />,
    desc: 'We manage every loan file from receipt to settlement — data entry, compliance checks, lender submission, and follow-ups included.',
    stats: [{ val: '24hr', lab: 'Turnaround' }, { val: '100%', lab: 'Compliant' }],
    highlight: { icon: <CheckCircle size={12} />, text: 'Pre & post-submission handled' },
  },
  {
    tag: 'Accounting Support',
    title: 'Full-cycle back-office for accountants',
    color: '#F5A623',
    icon: <BarChart3 size={14} />,
    desc: 'Bookkeeping, payroll, BAS, SMSF, and audit support — our trained team integrates with Xero, MYOB & QuickBooks seamlessly.',
    stats: [{ val: '8+', lab: 'Platforms' }, { val: '8', lab: 'Core Services' }],
    highlight: { icon: <CheckCircle size={12} />, text: 'ATO compliant, Australian standards' },
  },
  {
    tag: 'Data Security',
    title: 'Your clients\' data, fully protected',
    color: '#00D4B8',
    icon: <Lock size={14} />,
    desc: 'AU-hosted servers, AES-256 encryption, 2FA logins, NDA-signed staff, and biometric premises access — 4 layers of protection.',
    stats: [{ val: 'AU', lab: 'Hosted Servers' }, { val: '4', lab: 'Security Layers' }],
    highlight: { icon: <Shield size={12} />, text: 'ISO-aligned data policies' },
  },
  {
    tag: 'Why Proowrx',
    title: 'Built for Australian professionals',
    color: '#F5A623',
    icon: <Award size={14} />,
    desc: 'Australian-owned, India-operated. Our team is trained by AU brokers and accountants — we know your market, compliance, and workflow.',
    stats: [{ val: '2021', lab: 'Established' }, { val: '500+', lab: 'AU Clients' }],
    highlight: { icon: <Users size={12} />, text: 'No lock-in contracts, scale freely' },
  },
];

function getTime() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

function PhoneSlider() {
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [time, setTime] = useState(getTime);
  const [ref, visible] = useInView(0.2);

  const goTo = (i) => { if (i === current) return; setCurrent(i); setAnimKey(k => k + 1); };

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent(c => (c + 1) % PHONE_SLIDES.length);
      setAnimKey(k => k + 1);
    }, 4200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const tick = () => setTime(getTime());
    const now = new Date();
    const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    const timeout = setTimeout(() => {
      tick();
      const id = setInterval(tick, 60000);
      return () => clearInterval(id);
    }, msUntilNextMinute);
    return () => clearTimeout(timeout);
  }, []);

  const slide = PHONE_SLIDES[current];

  return (
    <div className={`phone-wrap${visible ? ' phone-wrap--visible' : ''}`} ref={ref}>
      <div className="phone-glow" style={{ background: `radial-gradient(ellipse at 50% 60%, ${slide.color}22 0%, transparent 68%)` }} />

      <div className="phone-frame">
        <div className="phone-island" />

        <div className="phone-statusbar">
          <span className="phone-time">{time}</span>
          <div className="phone-signals"><span>▌▌▌</span><Zap size={9} /></div>
        </div>

        <div className="phone-appbar">
          <div className="phone-appbar-dot" style={{ background: slide.color }} />
          <span className="phone-appbar-name">Proowrx</span>
          <span className="phone-live-badge" style={{ color: slide.color, borderColor: `${slide.color}44` }}>● LIVE</span>
        </div>

        <div className="phone-scan" aria-hidden="true" />

        {/* Slide content — animates in on each slide change */}
        <div className="phone-content" key={animKey}>
          <div className="phone-badge" style={{ background: `${slide.color}18`, color: slide.color, borderColor: `${slide.color}30` }}>
            {slide.icon}&nbsp;{slide.tag}
          </div>

          <div className="phone-slide-title">{slide.title}</div>

          <p className="phone-slide-desc">{slide.desc}</p>

          {/* Stat boxes */}
          <div className="phone-stats-row">
            {slide.stats.map((s, i) => (
              <div key={i} className="phone-stat-box" style={{ borderColor: `${slide.color}28`, background: `${slide.color}0a` }}>
                <span className="phone-stat-val" style={{ color: slide.color }}>{s.val}</span>
                <span className="phone-stat-lab">{s.lab}</span>
              </div>
            ))}
          </div>

          {/* Feature highlight */}
          <div className="phone-highlight" style={{ background: `${slide.color}0d`, borderColor: `${slide.color}22`, color: slide.color }}>
            {slide.highlight.icon}
            <span>{slide.highlight.text}</span>
          </div>
        </div>

        {/* Slide indicator dots */}
        <div className="phone-dots">
          {PHONE_SLIDES.map((_, i) => (
            <button
              key={i}
              className={`phone-dot${i === current ? ' phone-dot--active' : ''}`}
              style={i === current ? { background: slide.color, width: 18 } : {}}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Home indicator */}
        <div className="phone-home-bar" />
      </div>
    </div>
  );
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
  { icon: <Award size={22} />,       value: 20,  suffix: '+',  label: 'Years Combined Experience' },
  { icon: <Zap size={22} />,         value: 24,  suffix: 'hr', label: 'Average Turnaround Time'   },
  { icon: <Globe size={22} />,       value: 500, suffix: '+',  label: 'Brokers & Accountants'     },
  { icon: <CheckCircle size={22} />, value: 100, suffix: '%',  label: 'Compliance Focused'        },
];

const SERVICES = [
  {
    icon: <Building2 size={28} />,
    tag: 'For Australian Brokers',
    title: 'Mortgage Processing',
    desc: 'Expert mortgage file processing to streamline your workflow. Our trained team handles all the paperwork, ensuring accuracy and efficiency — freeing you to close more deals faster.',
    bullets: ['Pay-Per-Application model', 'Dedicated Resource (Full/Part-time)', 'Pre & Post-submission support', 'Compliance & CRM management'],
    accent: '#00D4B8',
    glow: 'rgba(0,212,184,0.14)',
    to: '/mortgage',
  },
  {
    icon: <BarChart3 size={28} />,
    tag: 'For Australian Accountants',
    title: 'Accounting & Bookkeeping',
    desc: 'Accounting services tailored to Australian professionals. We provide the resources you need to operate efficiently so you can focus on business development and client relationships.',
    bullets: ['Bookkeeping & Reconciliation', 'Payroll & Tax Returns', 'SMSF Management', 'BAS / IAS / STP Lodgements'],
    accent: '#F5A623',
    glow: 'rgba(245,166,35,0.14)',
    to: '/accounting',
  },
];

const WHY_FEATURES = [
  {
    icon: <Users size={22} />,
    title: 'Trusted Partner For Financial Professionals',
    desc: 'Our team undergoes ongoing training by Australian experts on best practices and compliance — ensuring we truly understand the unique challenges faced by mortgage brokers and accountants.',
    color: '#00D4B8',
  },
  {
    icon: <Settings2 size={22} />,
    title: 'Optimized Operations For Australian Consultants',
    desc: 'We go beyond basic loan processing. Proowrx offers a comprehensive solution handling loan processing, bidding, compliance, and accounting tasks for a truly streamlined back-office.',
    color: '#F5A623',
  },
  {
    icon: <Lock size={22} />,
    title: 'Data Security & Policy',
    desc: 'Best-in-industry data security practices. All client data stored on Australian servers, accessible only via 2-factor authentication. Bank-grade protection at every layer.',
    color: '#00D4B8',
  },
  {
    icon: <Award size={22} />,
    title: 'Expert Back-Office Support',
    desc: 'Our India-based team is highly trained in handling a wide range of tasks for mortgage brokers and accountants at competitive rates, with an unwavering commitment to accuracy.',
    color: '#F5A623',
  },
  {
    icon: <Star size={22} />,
    title: 'Working Beyond Expectations',
    desc: 'We prioritize accuracy, efficiency, and compliance. Our highly trained team delivers exceptional service, meeting all legal requirements for completely worry-free processing.',
    color: '#00D4B8',
  },
];

const PROCESS = [
  { num: '01', icon: <MessageSquare size={22} />, title: 'Free Discovery Call',    desc: 'A 30-minute call to understand your workflow, volume, and tools. No sales pitch — just a real conversation about how we can help.' },
  { num: '02', icon: <Settings2 size={22} />,     title: 'Seamless Onboarding',    desc: 'We configure CRM access, assign your dedicated named team, and fully integrate into your workflow within 5 business days.' },
  { num: '03', icon: <Zap size={22} />,           title: 'Live File Processing',    desc: 'Your files are handled end-to-end — data entry, compliance checks, lodgement, and lender follow-ups — with daily status updates.' },
  { num: '04', icon: <TrendingUp size={22} />,    title: 'Scale As You Grow',       desc: 'Flex capacity up or down without lock-in contracts. We grow alongside your book at no additional setup cost — ever.' },
];

const OUTSOURCING_CARDS = [
  {
    icon: <TrendingUp size={20} />,
    title: 'Grow Your Business',
    desc: 'Giving time back to the broker allows for more crucial business decisions, generating leads and allowing portfolio growth. Focus on what you love doing.',
    color: '#00D4B8',
  },
  {
    icon: <BarChart3 size={20} />,
    title: 'Optimize Manpower Cost',
    desc: 'Training staff for short projects is expensive and quality suffers. Outsourcing converts fixed costs to variable costs — pay only for services you actually consume.',
    color: '#F5A623',
  },
  {
    icon: <Award size={20} />,
    title: 'Affordability with Flexibility',
    desc: 'Outsourcing should help your business grow without adding cost pressure. Get skilled support at a reasonable price with the freedom to choose your service model.',
    color: '#00D4B8',
  },
  {
    icon: <Shield size={20} />,
    title: 'Stop Worrying About Data',
    desc: 'Our team follows clear processes and secure systems so mortgage brokers and accountants can focus on their work with complete peace of mind about client data.',
    color: '#F5A623',
  },
  {
    icon: <Lock size={20} />,
    title: 'Privacy First',
    desc: 'Access is controlled, systems are secure, and every team member follows strict privacy practices to ensure your client information remains protected at all times.',
    color: '#00D4B8',
  },
  {
    icon: <Globe size={20} />,
    title: 'Experience The Best Outsourcing',
    desc: 'Proowrx works alongside mortgage brokers and accountants as a reliable extension of your team — reducing your workload so you can focus on clients and growth.',
    color: '#F5A623',
  },
];

const SECURITY_PILLARS = [
  { icon: <Lock size={18} />,        label: 'AES-256 Encryption'      },
  { icon: <Globe size={18} />,       label: 'Australia-hosted servers' },
  { icon: <Shield size={18} />,      label: '2-Factor Authentication' },
  { icon: <Users size={18} />,       label: 'NDA-signed staff'         },
  { icon: <Zap size={18} />,         label: 'Biometric & CCTV access' },
  { icon: <CheckCircle size={18} />, label: 'ISO-aligned policies'    },
];

/* ─────────────────────────────────────────────
   HOME
───────────────────────────────────────────── */
export default function HomeClient() {
  const typed = useTypewriter(['Mortgage Brokers', 'Accountants', 'Financial Advisors', 'Lending Businesses']);

  const [statsRef,    statsVisible]    = useInView(0.3);
  const [svcRef,      svcVisible]      = useInView(0.1);
  const [whyFeatRef,  whyFeatVisible]  = useInView(0.08);
  const [procRef,     procVisible]     = useInView(0.1);
  const [outsrcRef,   outsrcVisible]   = useInView(0.08);
  const [secRef,      secVisible]      = useInView(0.1);
  const [testiRef,    testiVisible]    = useInView(0.1);

  return (
    <main className="home">

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="hero">
        <div className="hero-grid-bg" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />

        <div className="container hero-inner">
          <div className="hero-content">
            <div className="hero-pill">
              <span className="hero-pill-dot" />
              Australian-Owned · Operating Since 2021
            </div>

            <h1 className="hero-heading">
              <span className="hero-heading-line1">Back-office excellence</span>
              <span className="hero-heading-line2">
                <span className="hero-heading-accent">built for&nbsp;</span>
                <span className="hero-typewriter">
                  {typed}
                  <span className="hero-cursor">|</span>
                </span>
              </span>
            </h1>

            <p className="hero-sub">
              Proowrx is a one-stop shop for streamlining your financial operations in Australia — expert loan processing, back-office support, and accounting services so you can focus on growing your business.
            </p>

            <div className="hero-actions">
              <Link href="/contact" className="btn-primary">
                Book a Discovery Call <ArrowRight size={16} />
              </Link>
              <Link href="/services" className="btn-ghost">
                See Our Services
              </Link>
            </div>

            <div className="hero-trust">
              {['Trusted by top brokers', 'Australia-based servers', '24hr turnaround'].map((t) => (
                <span key={t} className="trust-tag">
                  <CheckCircle size={13} className="trust-icon" /> {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right — Phone Slider */}
          <div className="hero-visual">
            <PhoneSlider />
          </div>
        </div>

        <div className="hero-scroll-hint">
          <span>Scroll</span>
          <div className="hero-scroll-line" />
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
            <h2 className="section-title">Two disciplines, one reliable team</h2>
            <p className="section-sub">
              Whether you&apos;re a mortgage broker or an accountant, we slot in as your offshore back-office and deliver at full speed — no ramp-up headaches.
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
          WHY PROOWRX (5 features from website)
      ══════════════════════════════════════ */}
      <section className="section why-feat-section" ref={whyFeatRef}>
        <div className="container">
          <div className={`section-head fade-up${whyFeatVisible ? ' in' : ''}`}>
            <span className="pill">Why Proowrx</span>
            <h2 className="section-title">A one-stop shop for Australian financial professionals</h2>
            <p className="section-sub">
              We offer top-notch back-office support services to mortgage brokers and comprehensive accounting services to accountants — so you can focus on what matters most.
            </p>
          </div>

          <div className="why-feat-grid">
            {WHY_FEATURES.map((f, i) => (
              <div
                key={i}
                className={`why-feat-card fade-up${whyFeatVisible ? ' in' : ''}`}
                style={{ transitionDelay: `${i * 90 + 80}ms` }}
              >
                <div className="why-feat-icon" style={{ background: `${f.color}14`, color: f.color, borderColor: `${f.color}25` }}>
                  {f.icon}
                </div>
                <div className="why-feat-bar" style={{ background: f.color }} />
                <h4 className="why-feat-title">{f.title}</h4>
                <p className="why-feat-desc">{f.desc}</p>
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
            <div className={`process-line${procVisible ? ' process-line--visible' : ''}`} />
            {PROCESS.map((step, i) => (
              <div
                key={i}
                className={`process-step fade-up${procVisible ? ' in' : ''}`}
                style={{ transitionDelay: `${i * 110 + 150}ms` }}
              >
                <div className="process-node" aria-hidden="true">
                  <span className="process-node-icon">{step.icon}</span>
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
          PRACTICAL OUTSOURCING
      ══════════════════════════════════════ */}
      <section className="section outsrc-section" ref={outsrcRef}>
        <div className="container">
          <div className={`section-head fade-up${outsrcVisible ? ' in' : ''}`}>
            <span className="pill">Practical Outsourcing</span>
            <h2 className="section-title">Why outsourcing with Proowrx makes sense</h2>
            <p className="section-sub">
              Proowrx works alongside mortgage brokers and accounting professionals as a reliable support team — helping reduce your workload so you can focus on clients and growth.
            </p>
          </div>

          <div className="outsrc-grid">
            {OUTSOURCING_CARDS.map((c, i) => (
              <div
                key={i}
                className={`outsrc-card fade-up${outsrcVisible ? ' in' : ''}`}
                style={{ transitionDelay: `${i * 80 + 80}ms` }}
              >
                <div className="outsrc-icon" style={{ background: `${c.color}14`, color: c.color, borderColor: `${c.color}25` }}>
                  {c.icon}
                </div>
                <h4 className="outsrc-title">{c.title}</h4>
                <p className="outsrc-desc">{c.desc}</p>
                <div className="outsrc-accent-line" style={{ background: `linear-gradient(90deg, ${c.color}, transparent)` }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECURITY STRIP
      ══════════════════════════════════════ */}
      <section className="security-section" ref={secRef}>
        <div className="sec-orb" />
        <div className="container">
          <div className={`section-head fade-up${secVisible ? ' in' : ''}`}>
            <span className="pill pill--teal"><Lock size={12} /> Data Security</span>
            <h2 className="section-title">Your clients&apos; data is our highest priority</h2>
            <p className="section-sub">
              All data is stored in Australia-based servers accessible via 2-factor authentication only. We follow best-in-industry practices across 4 security layers: Administrative, Physical, Technological, and Operational.
            </p>
          </div>
          <div className="security-grid">
            {SECURITY_PILLARS.map((p, i) => (
              <div
                key={i}
                className={`sec-pill fade-up${secVisible ? ' in' : ''}`}
                style={{ transitionDelay: `${i * 70 + 100}ms` }}
              >
                <span className="sec-pill-icon">{p.icon}</span>
                <span className="sec-pill-label">{p.label}</span>
              </div>
            ))}
          </div>
          <div className={`security-cta fade-up${secVisible ? ' in' : ''}`} style={{ transitionDelay: '550ms' }}>
            <Link href="/data-security" className="btn-ghost">
              Read Our Security Policy →
            </Link>
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
            <h2 className="section-title">What Australian professionals say</h2>
          </div>
          <div className="testi-grid">
            {[
              { text: 'Proowrx cut our average loan processing time from 4 days to overnight. My brokers now focus entirely on client relationships. Genuinely game-changing.', name: 'Sarah M.', role: 'Principal Broker, NSW', stars: 5 },
              { text: 'The accounting team handles everything from BAS to year-end — all compliant, all on time. It\'s like having an in-house team at a fraction of the cost.', name: 'James T.', role: 'Accounting Practice Owner, VIC', stars: 5 },
              { text: 'What surprised me most was the security. Australia-hosted, 2FA on every access point, audit logs. They take our data more seriously than most local firms.', name: 'Priya K.', role: 'Finance Broker, QLD', stars: 5 },
            ].map((r, i) => (
              <div
                key={i}
                className={`testi-card fade-up${testiVisible ? ' in' : ''}`}
                style={{ transitionDelay: `${i * 120 + 80}ms` }}
              >
                <div className="testi-stars">{'★'.repeat(r.stars)}</div>
                <p className="testi-text">&quot;{r.text}&quot;</p>
                <div className="testi-author">
                  <div className="testi-avatar">{r.name[0]}</div>
                  <div>
                    <div className="testi-name">{r.name}</div>
                    <div className="testi-role">{r.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />

    </main>
  );
}
