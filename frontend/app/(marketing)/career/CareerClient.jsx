'use client';

import { useEffect, useRef } from 'react';
import { ArrowRight, ExternalLink, CheckCircle, Users, TrendingUp, Heart, Zap, Globe, Star } from 'lucide-react';
import CtaBanner from '@/components/shared/CtaBanner';
import './Career.css';

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

const perks = [
  { icon: <TrendingUp size={24} />, title: 'Career Growth', desc: 'Clear advancement paths and ongoing training to help you develop your skills and grow your career with Proowrx.' },
  { icon: <Users size={24} />, title: 'Expert Mentorship', desc: 'Work alongside experienced professionals and learn directly from Australian mortgage and accounting industry leaders.' },
  { icon: <Globe size={24} />, title: 'Global Exposure', desc: 'Work with top Australian financial professionals and gain international industry knowledge that sets your CV apart.' },
  { icon: <Zap size={24} />, title: 'Dynamic Environment', desc: 'Fast-paced, innovative workplace where your contributions make a real and visible impact from day one.' },
  { icon: <Heart size={24} />, title: 'Work-Life Balance', desc: 'We value your well-being — structured hours, supportive culture, and a management team that genuinely cares.' },
  { icon: <CheckCircle size={24} />, title: 'Meaningful Work', desc: 'Help Australian businesses thrive. What you do here matters — every file you process is real value for a real client.' },
];

export default function CareerClient({ initialJobs }) {
  const r1 = useReveal(), r2 = useReveal(), r3 = useReveal();
  const dynamicJobs = initialJobs || [];

  return (
    <div>
      {/* ── Hero ── */}
      <section
        className="page-hero page-hero--img career-hero"
        style={{ '--hero-bg': 'url("https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1800&q=85")' }}
      >
        <div className="career-hero-grid" />
        <div className="career-hero-orb-1" />
        <div className="career-hero-orb-2" />
        <div className="container career-hero-inner">
          <div className="career-hero-content">
            <span className="chip chip-gold" style={{ marginBottom: 16 }}>Careers at Proowrx</span>
            <h1>Build Your Career<br />with Purpose</h1>
            <p>Join a growing team redefining KPO for Australian financial professionals. We hire for attitude and train for skill.</p>
          </div>
          <div className="career-hero-stats">
            {[
              // { num: '2021', label: 'Year Founded' },
              // { num: '2', label: 'Global Offices' },
              { num: '24hr', label: 'Turnaround SLA' },
              { num: '100%', label: 'Compliance Focus' },
            ].map((s, i) => (
              <div key={i} className="career-hero-stat">
                <span className="career-hero-stat-num">{s.num}</span>
                <span className="career-hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Perks ── */}
      <section className="section">
        <div className="container">
          <div ref={r1} className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="chip chip-sky section-eyebrow">Why Proowrx</span>
            <h2 className="section-title">Why You&apos;ll Love Working Here</h2>
            <p className="section-body" style={{ margin: '0 auto' }}>
              We&apos;re not just a workplace — we&apos;re a community committed to doing exceptional work together.
            </p>
          </div>
          <div className="career-perks-grid">
            {perks.map((p, i) => (
              <div key={i} className={`career-perk reveal reveal-delay-${(i % 3) + 1}`}>
                <div className="career-perk-icon">{p.icon}</div>
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Culture ── */}
      <section className="section career-culture-section">
        <div className="container career-culture-grid">
          <div ref={r2} className="reveal-left career-culture-text">
            <span className="chip chip-white section-eyebrow">Our Culture</span>
            <h2 className="section-title section-title--white">A Culture Built on Excellence & Continuous Growth</h2>
            <p className="section-body section-body--white">
              At Proowrx, we believe the best results come from teams that are empowered, well-trained, and genuinely care about their work. We invest in our people through continuous training under the guidance of experienced Australian industry professionals.
            </p>
            <ul className="career-values-list">
              {[
                'Integrity and transparency in everything we do',
                'Commitment to continuous learning and improvement',
                'Client-first mindset across all roles',
                'Collaborative, inclusive, and supportive culture',
                'Excellence in delivery — quality over quantity, always',
              ].map((v, i) => (
                <li key={i}>
                  <CheckCircle size={16} color="var(--gold)" />
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal-right career-culture-image">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=85"
              alt="Proowrx team culture"
            />
            <div className="career-img-badge">
              <Star size={14} color="var(--gold)" />
              <div>
                <strong>Great Place to Work</strong>
                <span>Jaipur, India · Est. 2021</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Open Roles ── */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div ref={r3} className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="chip chip-gold section-eyebrow">Open Roles</span>
            <h2 className="section-title">Current Opportunities</h2>
            <p className="section-body" style={{ margin: '0 auto' }}>
              We&apos;re growing and looking for talented people. Check out our current openings below.
            </p>
          </div>
          {dynamicJobs.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-3)', marginBottom: 32 }}>
              No open roles right now — check back soon, or send us your CV below.
            </p>
          )}

          <div className="career-roles-list">
            {dynamicJobs.map((role, i) => (
              <div key={role._id} className={`career-role-card reveal reveal-delay-${(i % 3) + 1}`}>
                <div className="career-role-info">
                  <div className="career-role-meta">
                    <span className="career-role-badge" style={{ background: 'var(--emerald)22', color: 'var(--emerald)', borderColor: 'var(--emerald)44' }}>
                      Hiring Now
                    </span>
                    {role.department && <span className="career-role-dept">{role.department}</span>}
                    {role.department && <span className="career-role-dot">·</span>}
                    <span className="career-role-loc">📍 {role.location}</span>
                    <span className="career-role-dot">·</span>
                    <span className="career-role-type">{role.type}</span>
                    {role.experience && <><span className="career-role-dot">·</span><span className="career-role-type">{role.experience}</span></>}
                  </div>
                  <h3 className="career-role-title">{role.title}</h3>
                  <p className="career-role-desc">{role.description}</p>
                  {role.tags?.length > 0 && (
                    <div className="career-role-skills">
                      {role.tags.map(s => <span key={s} className="career-skill-tag">{s}</span>)}
                    </div>
                  )}
                </div>
                <a
                  href={role.applyLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-navy career-role-btn"
                >
                  Apply Now <ArrowRight size={14} />
                </a>
              </div>
            ))}
          </div>

          <div className="career-no-match">
            <div className="career-no-match-inner">
              <span style={{ fontSize: '2.5rem' }}>💼</span>
              <div>
                <h4>Don&apos;t see a perfect match?</h4>
                <p>We&apos;re always open to hearing from talented people. Send us your CV and tell us how you can add value to our team.</p>
              </div>
              <a href="mailto:support@proowrx.com?subject=Speculative Application – Proowrx" className="btn btn-gold">
                Send Your CV <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Hiring Process ── */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span className="chip chip-sky section-eyebrow">Hiring Process</span>
            <h2 className="section-title">How We Hire</h2>
            <p className="section-body" style={{ margin: '0 auto' }}>Simple, transparent, and respectful of your time.</p>
          </div>
          <div className="career-process-grid">
            {[
              { num: '01', emoji: '📄', title: 'Apply Online', desc: 'Submit your application through our ZappyHire portal with your CV and a brief cover note.' },
              { num: '02', emoji: '📞', title: 'Initial Screening', desc: 'Our team reviews your application and reaches out for a short initial phone or video call.' },
              { num: '03', emoji: '✍️', title: 'Skills Assessment', desc: 'Role-specific assessment to evaluate your technical skills and industry knowledge.' },
              { num: '04', emoji: '🎯', title: 'Final Interview', desc: 'In-depth interview with the hiring manager to assess fit, expectations, and growth potential.' },
            ].map((step, i) => (
              <div key={i} className={`career-step reveal reveal-delay-${i + 1}`}>
                <div className="career-step-num">{step.num}</div>
                <span className="career-step-emoji">{step.emoji}</span>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
