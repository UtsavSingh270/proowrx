'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, X } from 'lucide-react';
import { FaLinkedinIn } from 'react-icons/fa';
import CtaBanner from '@/components/shared/CtaBanner';
import TeamCultureMedia from './TeamCultureMedia';
import './OurTeam.css';

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

function safeExternalUrl(value) {
  if (!value) return '';
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

function TeamProfileModal({ member, onClose }) {
  const closeButtonRef = useRef(null);
  const linkedInUrl = safeExternalUrl(member.socialMedia?.linkedin);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    const closeOnEscape = event => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const focusable = event.currentTarget.document.querySelectorAll('.team-profile-modal button:not([disabled]), .team-profile-modal a[href]');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
      previousFocus?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="team-profile-backdrop" onClick={event => event.target === event.currentTarget && onClose()}>
      <div className="team-profile-modal" role="dialog" aria-modal="true" aria-labelledby="team-profile-name">
        <button ref={closeButtonRef} type="button" className="team-profile-close" onClick={onClose} aria-label="Close team member profile">
          <X size={21} />
        </button>

        <aside className="team-profile-person">
          <div className="team-profile-visual">
            <div className="team-profile-image-stage">
              {member.img ? (
                <Image src={member.img} alt={member.name} fill sizes="(max-width: 640px) 112px, 360px" />
              ) : (
                <div className="team-image-placeholder" aria-hidden="true" />
              )}
            </div>
            <div className="team-profile-shutters" aria-hidden="true">
              <span /><span /><span /><span />
            </div>
            <span className="team-profile-scan" aria-hidden="true" />
          </div>
          <div className="team-profile-identity">
            <span>{member.role}</span>
            <h2 id="team-profile-name">{member.name}</h2>
          </div>
        </aside>

        <div className="team-profile-content">
          <span className="team-profile-kicker">About <strong>{member.name}</strong></span>
          {member.shortSummary && <p className="team-profile-intro">{member.shortSummary}</p>}
          <div className="team-profile-copy">{member.fullSummary}</div>
          <div className="team-profile-actions">
            {linkedInUrl ? (
              <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className="team-profile-button team-profile-button--primary">
                <FaLinkedinIn aria-hidden="true" /> LinkedIn
              </a>
            ) : (
              <span className="team-profile-button team-profile-button--disabled" aria-disabled="true"><FaLinkedinIn aria-hidden="true" /> LinkedIn</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
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
  const r1 = useReveal(), r2 = useReveal();
  const [selectedMember, setSelectedMember] = useState(null);
  const closeProfile = useCallback(() => setSelectedMember(null), []);

  const sourceTeam = (initialMembers || []).map(member => ({
    name: member.name,
    role: member.position,
    img: member.image,
    shortSummary: member.summary || member.description || '',
    fullSummary: member.fullSummary || member.description || member.summary || '',
    socialMedia: member.socialMedia || {},
    color: member.category === 'featured' ? '#c9a227' : '#1f9e8e',
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
                style={{ '--member-color': member.color, '--member-index': i }}
              >
                <div className="team-member-img-wrap">
                  {member.img ? <Image src={member.img} alt={member.name} fill sizes="(max-width: 640px) 42vw, (max-width: 1200px) 23vw, 320px" /> : <div className="team-image-placeholder" aria-hidden="true" />}
                  <div className="team-member-overlay" style={{ background: `linear-gradient(to top, ${member.color}44 0%, transparent 50%)` }} />
                  <div className="team-member-role-badge">{member.role}</div>
                </div>
                <div className="team-member-body">
                  <h3 className="team-member-name">{member.name}</h3>
                  <p className="team-member-summary">{member.shortSummary || 'Learn more about this member of the Proowrx team.'}</p>
                  <button type="button" className="team-member-read-more" onClick={() => setSelectedMember(member)} aria-label={`Read more about ${member.name}`}>
                    Read More <ArrowRight size={16} />
                  </button>
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

      {selectedMember && <TeamProfileModal member={selectedMember} onClose={closeProfile} />}
    </div>
  );
}
