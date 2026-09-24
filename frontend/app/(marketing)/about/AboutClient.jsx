'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Target, Rocket, Users, TrendingUp } from 'lucide-react';
import CtaBanner from '@/components/shared/CtaBanner';
import ServiceFaq from '@/components/shared/ServiceFaq';
import './About.css';

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } }, { threshold: 0.1 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return ref;
}

const values = [
  { icon: <Target size={24} />, title: 'Our Vision', desc: 'To be the first choice for businesses looking for a trusted outsourcing partner.' },
  { icon: <Rocket size={24} />, title: 'Our Mission', desc: 'To deliver exceptional and proactive outsourcing services that help our clients work better and grow over the long term.' },
  { icon: <Users size={24} />, title: 'Our Approach', desc: 'We are easy to work with. We listen, communicate clearly, adapt when things change and take responsibility for getting the work done right. ' },
  { icon: <TrendingUp size={24} />, title: 'Our Focus', desc: 'Our focus is simple: take care of the work that takes up valuable time, so businesses can run more efficiently and their teams can focus on clients, growth and bigger priorities.' },
];

export default function About({ initialMembers = [] }) {
  const r1 = useReveal(), r2 = useReveal(), r3 = useReveal(), r4 = useReveal();
  const team = initialMembers.filter(member => member.category === 'featured').map(member => ({
    name: member.name,
    role: member.position,
    img: typeof member.image === 'string' && member.image.trim() ? member.image.trim() : null,
    bio: member.description || member.summary || '',
    summary: member.summary || '',
  }));

  return (
    <div>
      <section
        className="page-hero page-hero--split page-hero--img"
        style={{ '--hero-bg': 'url("https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1800&q=85")' }}
      >
        <div className="page-hero-orb-1" />
        <div className="page-hero-orb-2" />
        <div className="container">
          <div className="page-hero-content">
            {/* <span className="chip chip-gold" style={{ marginBottom: 20 }}>Our Story</span> */}
            <h1>Better Support. Better Way of Working.</h1>
            <p>Proowrx is an Australian-owned outsourcing organisation, delivering knowledge and skill-based services and empowering Australian businesses through smarter outsourcing</p>
            <div className="page-hero-actions">
              <Link href="/contact" className="btn btn-gold">Let&apos;s Talk <ArrowRight size={15} /></Link>
              <Link href="/services" className="btn btn-ghost">Explore Services</Link>
            </div>
            <div className="page-hero-stats">
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">2021</span>
                <span className="page-hero-stat-label">Est. Year</span>
              </div>
              <div className="page-hero-stat-divider" />
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">2</span>
                <span className="page-hero-stat-label">Global Offices</span>
              </div>
              <div className="page-hero-stat-divider" />
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">20+</span>
                <span className="page-hero-stat-label">Years Expertise</span>
              </div>
            </div>
          </div>
          <div className="page-hero-visual">
  <Image
    src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80"
    alt="Proowrx team"
    fill
    sizes="(max-width:768px) 100vw, 50vw"
    style={{ objectFit: "cover" }}
  />
            <div className="page-hero-badge-float">
              <span style={{ fontSize: '1.6rem' }}>🇦🇺</span>
              <div>
                <strong>Australian-Owned</strong>
                <span>Operating Since 2021</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who we are */}
      <section className="section">
        <div className="container about-intro-grid">
          <div ref={r1} className="reveal-left">
            <span className="chip chip-gold section-eyebrow">Who We Are</span>
            <h2 className="section-title">Your Trusted Partner for Smarter Outsourcing</h2>
            <p className="section-body" style={{ maxWidth: '100%' }}>
              Proowrx is an Australian-owned outsourcing company helping Australian businesses work more efficiently through skilled and reliable support. We support Australian mortgage brokerage businesses, accounting firms, asset finance brokers, real estate firms and buyer agencies. We help Australian businesses reduce turnaround times and be more profitable. Our focus is simple: help businesses do more with less.
            </p>
            <p style={{ marginTop: 16, color: 'var(--text-2)', lineHeight: 1.75 }}>
              We offer credit analysis and end-to-end loan processing services to mortgage and asset finance brokers, supporting routine accounting and back-office work for accountants, basic admin, sales calling and data management services to real estate agents and buyer agents. We have also developed a strong in-house digital marketing engine and provide social media & digital marketing support to Australian businesses.
            </p>
            <p style={{ marginTop: 16, color: 'var(--text-2)', lineHeight: 1.75 }}>
              Our strong understanding of the Australian market helps our teams work confidently within Australian processes, industry requirements and compliance. Our teams receive ongoing training in Australian industry practices and market requirements under the guidance of experienced Australia-based professionals.
            </p>
            <p style={{ marginTop: 16, color: 'var(--text-2)', lineHeight: 1.75 }}>
              Our approach remains simple: Do the work right, communicate clearly and make things easier for our clients, so they can focus on growing their business while we handle what keeps it running.
            </p>
            <Link href="/contact" className="btn btn-gold" style={{ marginTop: 32 }}>
              Let&apos;s Talk <ArrowRight size={15} />
            </Link>
          </div>
          <div ref={r2} className="reveal-right about-image-stack">
           <Image
  src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=80"
  alt="Our office"
  fill
  sizes="(max-width:768px) 100vw, 50vw"
  style={{ objectFit: "cover" }}
/>
<div className="about-img-badge">
              <strong>Est. 2021</strong>
              <span>Serving Australia</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values grid */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div ref={r3} className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="chip chip-teal section-eyebrow">What Drives Us</span>
            <h2 className="section-title">Vision, Mission & Values</h2>
          </div>
          <div className="values-grid">
            {values.map((v, i) => (
              <div key={i} className={`value-card reveal reveal-delay-${i + 1}`}>
                <div className="value-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What makes us different */}
      <section className="section diff-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="chip chip-gold section-eyebrow">The Proowrx Difference</span>
            <h2 className="section-title">Deep Local Knowledge. Scalable Offshore Support.</h2>
          </div>
          <div className="diff-grid">
            {[
              { img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=85', title: 'Australian Market Understanding', desc: 'Our teams are trained around Australian processes and industry requirements, with guidance from Australia-based professionals. That means we approach the work with a clear understanding of how Australian businesses operate.' },
              { img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=85', title: 'Industry-Trained Teams', desc: 'From loan processing and credit analysis to accounting, property support and digital marketing, our people are trained for the work they handle. They understand the tasks, the processes behind them and what your team needs from them.' },
              { img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=85', title: 'Flexible Business Support', desc: 'Your workload can change from month to month. We can take on specific tasks, provide ongoing support or add capacity when things get busy, all while working with the systems and processes you already use.' },
            ].map((d, i) => (
              <div key={i} className={`diff-card reveal reveal-delay-${i + 1}`}>
                <div className="diff-img">
               <Image
  src={d.img}
  alt={d.title}
  fill
  sizes="(max-width:768px) 100vw, 33vw"
  style={{ objectFit: "cover" }}
/>
</div>
                <div className="diff-body">
                  <h4>{d.title}</h4>
                  <p>{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section" style={{ background: 'var(--navy)' }}>
        <div className="container">
          <div ref={r4} className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="chip chip-white section-eyebrow">The People Behind Proowrx</span>
            <h2 className="section-title section-title--white">Meet Our Core Team</h2>
            <p className="section-body section-body--white" style={{ margin: '0 auto' }}>
              A powerhouse team striving to make Proowrx the first-choice outsourcing company for Australian financial professionals.
            </p>
          </div>
          {team.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'white' }}>Featured team members coming soon.</div>
          ) : (
            <>
              <div className="team-grid">
                {team.map((m, i) => (
  <div key={i} className={`team-card reveal reveal-delay-${i + 1}`}>
    <div className="team-img-wrap">
      {m.img ? (
        <Image
          src={m.img}
          alt={`${m.name} - ${m.role}`}
          fill
          sizes="(max-width:768px) 100vw, 33vw"
          style={{ objectFit: "cover" }}
        />
      ) : (
        <div className="team-img-placeholder" aria-hidden="true">
          <Users size={46} />
        </div>
      )}
      <div className="team-img-overlay" />
    </div>

    <div className="team-body">
      <div className="team-role">{m.role}</div>
      <h3 className="team-name">{m.name}</h3>

      {m.summary && (
        <p
          className="team-bio"
          style={{ fontStyle: "italic", marginBottom: 8 }}
        >
          {m.summary}
        </p>
      )}

      {/* <p className="team-bio">{m.bio}</p> */}
    </div>
  </div>
))}
              </div>
              <div style={{ textAlign: 'center', marginTop: 48 }}>
                <Link href="/our-team" className="btn btn-ghost">
                  Full Team Page <ArrowRight size={15} />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <ServiceFaq
        variant="about"
        title="Questions about Proowrx"
        intro="Learn more about our team, operating model and approach to long-term client partnerships."
      />
      <CtaBanner />
    </div>
  );
}
