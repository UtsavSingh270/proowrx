'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { FaFacebookF, FaGithub, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import CtaBanner from '@/components/shared/CtaBanner';
import TeamCultureMedia from './TeamCultureMedia';
import './OurTeam.css';

function SocialMediaIcons({ socialMedia }) {
  if (!socialMedia || Object.keys(socialMedia).length === 0) return null;
  
  const icons = {
    twitter: FaTwitter,
    linkedin: FaLinkedinIn,
    facebook: FaFacebookF,
    instagram: FaInstagram,
    github: FaGithub,
  };
  
  return (
    <div style={{ display: 'flex', gap: 12, marginTop: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
      {Object.entries(socialMedia).map(([platform, url]) => {
        if (!url) return null;
        const Icon = icons[platform];
        if (!Icon) return null;
        
        return (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title={platform}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: 6,
              backgroundColor: 'rgba(201, 162, 39, 0.1)',
              color: '#c9a227',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#c9a227';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'rgba(201, 162, 39, 0.1)';
              e.currentTarget.style.color = '#c9a227';
            }}
          >
            <Icon size={16} />
          </a>
        );
      })}
    </div>
  );
}

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

const values = [
  { emoji: '🎯', title: 'COMMIT TO DELIVERY EXCELLENCE', desc: 'We complete assigned tasks accurately, follow set industry guidelines, and meet daily turnaround times. ' },
  { emoji: '🔒', title: 'EMBRACE INTEGRITY AND OPENNESS', desc: 'We communicate clearly with your onshore team, report delays early, and provide straightforward updates.' },
  { emoji: '🚀', title: 'PRACTICE RESPONSIBLE STEWARDSHIP', desc: 'We handle client files, financial records, and business systems with strict privacy and security.' },
  { emoji: '🤝', title: 'IGNITE PASSION FOR THE GREATER GOOD', desc: 'We channel our energy into positive work that benefits our clients, team, and wider community.' },
  { emoji: '⚡', title: 'INVEST IN AN EXCEPTIONAL CULTURE', desc: 'We build a workplace founded on mutual respect, continuous learning, and strong team collaboration.' },
  { emoji: '🌏', title: 'LIVE A BALANCED LIFE', desc: 'We support healthy boundaries between work and personal life to maintain well-being and focus.' },
];

export default function OurTeamClient({ initialMembers, initialCultureItems }) {
  const r1 = useReveal(), r2 = useReveal(), r3 = useReveal();

  const sourceTeam = (initialMembers || []).map(member => ({
    name: member.name,
    role: member.position,
    img: member.image,
    email: member.email,
    bio: member.description,
    summary: member.summary || '',
    tags: member.tags || [],
    socialMedia: member.socialMedia || {},
    color: member.category === 'featured' ? '#c9a227' : '#1f9e8e',
    bookable: member.bookable,
    category: member.category,
  }));
  const featuredMembers = sourceTeam.filter(member => member.category === 'featured');
  const coreMembers = sourceTeam.filter(member => member.category === 'core');

  return (
    <div>
      <section
        className="page-hero page-hero--img team-page-hero"
        style={{ '--hero-bg': 'url("/images/our-team/Proowrx-team.webp")' }}
      >
        <div className="container team-hero-content">
          <div className="team-hero-heading">
            <span className="chip chip-gold">Our Team</span>
            <h1>The People Behind Proowrx</h1>
          </div>
          <div className="team-hero-people-space" aria-hidden="true" />
          <p className="team-hero-description">Dedicated professionals trained in Australian workflows, ready to handle your back-office operations and help your business grow.</p>
        </div>
      </section>

      <TeamCultureMedia initialItems={initialCultureItems || []} />

      {/* Team Section */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div ref={r1} className="reveal" style={{ textAlign: 'center', marginBottom: 72 }}>
            <span className="chip chip-teal section-eyebrow">Leadership</span>
            <h2 className="section-title">Meet Our Core Team</h2>
            <p className="section-body" style={{ margin: '0 auto' }}>
            Experienced leaders dedicated to maintaining high operational standards, client alignment, and team performance.
            </p>
          </div>

          {featuredMembers.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-3)' }}>
              Team profiles coming soon.
            </p>
          )}

          <div className="team-cards-grid">
            {featuredMembers.map((member, i) => (
              <div
                key={i}
                className={`team-member-card reveal reveal-delay-${i + 1}`}
                style={{ '--member-color': member.color }}
              >
                <div className="team-member-img-wrap">
                  {member.img ? <Image src={member.img} alt={member.name} fill sizes="(max-width: 640px) 100vw, 33vw" /> : <div className="team-image-placeholder" aria-hidden="true" />}
                  <div className="team-member-overlay" style={{ background: `linear-gradient(to top, ${member.color}44 0%, transparent 50%)` }} />
                  <div className="team-member-role-badge">{member.role}</div>
                </div>
                <div className="team-member-body">
                  <h3 className="team-member-name">{member.name}</h3>
                  {member.summary && <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-2)', marginBottom: 8 }}>{member.summary}</p>}
                  <p className="team-member-bio">{member.bio}</p>
                  <SocialMediaIcons socialMedia={member.socialMedia} />
                  {member.tags?.length > 0 && (
                    <div className="team-member-tags">
                      {member.tags.map(t => (
                        <span key={t} className="team-member-tag" style={{ borderColor: member.color + '40', color: member.color }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {coreMembers.length > 0 && (
            <div className="team-core-section">
              <div className="team-core-heading">
                <span className="chip chip-sky section-eyebrow">Core Members</span>
                <h3>Our Core Team</h3>
              </div>
              <div className="team-core-grid">
                {coreMembers.map((member, i) => (
                  <div key={`${member.name}-${i}`} className="team-core-card">
                    {member.img ? <Image src={member.img} alt={member.name} width={420} height={280} sizes="(max-width: 640px) 100vw, 33vw" /> : <div className="team-image-placeholder" aria-hidden="true" />}
                    <div>
                      <h4>{member.name}</h4>
                      <p>{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Values Section */}
      <section className="section">
        <div className="container">
          <div ref={r2} className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="chip chip-gold section-eyebrow">What Drives Us</span>
            <h2 className="section-title">Our Team Values</h2>
            <p className="section-body" style={{ margin: '0 auto' }}>
              The core operating standards our team follows across daily tasks, client communication, and system management.
            </p>
          </div>
          <div className="team-values-grid">
            {values.map((v, i) => (
              <div key={i} className={`team-value-card reveal reveal-delay-${(i % 3) + 1}`}>
                <span className="team-value-emoji">{v.emoji}</span>
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join / Culture */}
      {/* <section className="section team-culture-section">
        <div className="container">
          <div ref={r3} className="reveal team-culture-inner">
            <div className="team-culture-text">
              <span className="chip chip-white section-eyebrow">Work With Us</span>
              <h2 className="section-title section-title--white">Want to Be Part of Something Bigger?</h2>
              <p className="section-body section-body--white">
                We&apos;re always looking for talented, motivated professionals who are passionate about delivering exceptional service. If you thrive in a fast-paced environment and want to work with top Australian financial professionals, we&apos;d love to hear from you.
              </p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 36 }}>
                <Link href="/career" className="btn btn-gold">
                  View Open Positions <ArrowRight size={15} />
                </Link>
                <Link href="/contact" className="btn btn-ghost">
                  Get in Touch
                </Link>
              </div>
            </div>
            <div className="team-culture-stats">
              {[
                { num: '20+', label: 'Years Combined Leadership Experience' },
                { num: '2021', label: 'Founded in Australia' },
                { num: '2', label: 'Global Office Locations' },
                { num: '100%', label: 'Compliance-Focused Approach' },
              ].map((s, i) => (
                <div key={i} className="culture-stat">
                  <span className="culture-stat-num">{s.num}</span>
                  <span className="culture-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      <CtaBanner />
    </div>
  );
}
