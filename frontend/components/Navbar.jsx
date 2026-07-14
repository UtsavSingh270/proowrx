'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X, ArrowRight, Sun, Moon } from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { useTheme } from './ThemeProvider';
import './Navbar.css';

const LOGO = 'https://proowrx.com/wp-content/uploads/2022/05/Proowrx_Final_Logo-removebg-previewnew-1.png';

const nav = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  {
    label: 'Services', to: '/services',
    mega: [
      { type: 'heading', label: 'Mortgage' },
      { label: 'Mortgage Overview', to: '/mortgage', desc: 'Full-cycle loan processing & lodgement', icon: '🏠' },
      { label: 'Virtual Assistant', to: '/virtual-assistant', desc: 'Dedicated remote VA for your brokerage', icon: '👤' },
      { label: 'Pay Per Application', to: '/pay-per-application', desc: 'Flexible, no-contract file processing', icon: '💼' },
      { type: 'heading', label: 'Accounting' },
      { label: 'Accounting Services', to: '/accounting', desc: 'Bookkeeping, tax, SMSF & BAS', icon: '📊' },
    ],
  },
  { label: 'Data Security', to: '/data-security' },
  { label: 'Our Team', to: '/our-team' },
  { label: 'Blog', to: '/blog' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Resources', to: '/resources' },
  {
    label: 'Career', to: '/career',
    mega: [
      { label: 'Current Openings', to: '/career', desc: 'View and apply to open roles at Proowrx', icon: '💼' },
      { label: 'WorkLife@Proowrx', to: '/worklife', desc: 'Photos & videos from life inside Proowrx', icon: '📸' },
    ],
  },
];

export default function Navbar() {
  const [scrolled, setScrolled]             = useState(false);
  const [mobileOpen, setMobileOpen]         = useState(false);
  const [openMega, setOpenMega]             = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const pathname   = usePathname();
  const closeTimer = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Intentional: close the mobile menu/mega-menu whenever the route changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
    setOpenMega(null);
    setMobileExpanded(null);
  }, [pathname]);

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') { setMobileOpen(false); setOpenMega(null); } };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // Intentional: standard SSR-safe "mounted" flag (avoids a theme hydration
  // mismatch — server always renders light, client corrects after mount).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  const theme = mounted ? resolvedTheme : 'light';
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const openMenu  = label => { clearTimeout(closeTimer.current); setOpenMega(label); };
  const closeMenu = ()    => { closeTimer.current = setTimeout(() => setOpenMega(null), 140); };
  const toggleMobileExpanded = label => setMobileExpanded(prev => (prev === label ? null : label));
  const megaLinks     = mega => mega.filter(m => m.type !== 'heading');
  const isServiceActive = item => item.mega && megaLinks(item.mega).some(m => m.to === pathname);

  return (
    <>
      {/* ─────────────────────────────────────────
          CONTACT STRIP — scrolls away with page
      ───────────────────────────────────────── */}
      <div className="topbar">
        <div className="container topbar-inner">
          <div className="topbar-left">
            <a href="tel:+61288341222">📞 02 8834 1222</a>
            <a href="mailto:support@proowrx.com">✉️ support@proowrx.com</a>
          </div>
          <div className="topbar-socials">
            {[
              { href: 'https://www.facebook.com/proowrx/',               icon: <FaFacebook size={13} />,   label: 'Facebook'  },
              { href: 'https://www.instagram.com/proowrx/',              icon: <FaInstagram size={13} />,  label: 'Instagram' },
              { href: 'https://twitter.com/proowrx/',                    icon: <FaXTwitter size={13} />,   label: 'X/Twitter' },
              { href: 'https://www.linkedin.com/company/proowrx/about/', icon: <FaLinkedinIn size={13} />, label: 'LinkedIn'  },
            ].map(s => (
              <a key={s.href} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────
          NAV WRAPPER — sticky at top after topbar scrolls
      ───────────────────────────────────────── */}
      <div className="nav-wrapper">
        <nav
          className={`navbar${scrolled && !mobileOpen ? ' scrolled' : ''}${mobileOpen ? ' mobile-open' : ''}`}
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="container nav-inner">
            <Link href="/" className="nav-logo" aria-label="Proowrx — go to homepage">
              <img src={LOGO} alt="Proowrx" width="160" height="44" />
            </Link>

            <ul className="nav-links" role="menubar">
              {nav.map(item => (
                <li
                  key={item.to}
                  className={`nav-item${item.mega ? ' has-mega' : ''}`}
                  role="none"
                  onMouseEnter={() => item.mega && openMenu(item.label)}
                  onMouseLeave={() => item.mega && closeMenu()}
                >
                  <Link
                    href={item.to}
                    role="menuitem"
                    aria-haspopup={item.mega ? 'true' : undefined}
                    aria-expanded={item.mega ? openMega === item.label : undefined}
                    className={`nav-link${pathname === item.to || isServiceActive(item) ? ' active' : ''}`}
                  >
                    {item.label}
                    {item.mega && (
                      <ChevronDown
                        size={13}
                        className={`nav-chevron${openMega === item.label ? ' open' : ''}`}
                        aria-hidden="true"
                      />
                    )}
                  </Link>

                  {item.mega && openMega === item.label && (
                    <div
                      className="mega-menu"
                      role="menu"
                      onMouseEnter={() => openMenu(item.label)}
                      onMouseLeave={closeMenu}
                    >
                      <div className="mega-inner">
                        {item.mega.map((m, j) =>
                          m.type === 'heading' ? (
                            <div key={j} className="mega-section-heading" role="separator">{m.label}</div>
                          ) : (
                            <Link key={j} href={m.to} className="mega-item" role="menuitem">
                              <span className="mega-icon" aria-hidden="true">{m.icon}</span>
                              <div>
                                <span className="mega-label">{m.label}</span>
                                <span className="mega-desc">{m.desc}</span>
                              </div>
                              <ArrowRight size={14} className="mega-arrow" aria-hidden="true" />
                            </Link>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <div className="nav-actions">
              <Link href="/contact" className="btn btn-gold nav-cta">
                Get Started <ArrowRight size={14} aria-hidden="true" />
              </Link>
              <button
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              >
                {theme === 'dark'
                  ? <Sun size={18} aria-hidden="true" />
                  : <Moon size={18} aria-hidden="true" />
                }
              </button>
            </div>

            <button
              className="hamburger"
              onClick={() => setMobileOpen(o => !o)}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-drawer"
            >
              {mobileOpen
                ? <X size={22} aria-hidden="true" />
                : <Menu size={22} aria-hidden="true" />
              }
            </button>
          </div>
        </nav>
      </div>

      {/* ─────────────────────────────────────────
          BACKDROP — z-index 998, below drawer
      ───────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ─────────────────────────────────────────
          MOBILE DRAWER — z-index 999
          OUTSIDE nav-wrapper so navbar (1001) is
          always rendered above the drawer.
      ───────────────────────────────────────── */}
      <div
        id="mobile-drawer"
        className={`mobile-drawer${mobileOpen ? ' open' : ''}`}
        aria-hidden={!mobileOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="mobile-drawer-inner">
          {nav.map(item => (
            <div key={item.to} className="mobile-nav-group">
              {item.mega ? (
                <>
                  <button
                    className="mobile-nav-link mobile-nav-toggle"
                    onClick={() => toggleMobileExpanded(item.label)}
                    aria-expanded={mobileExpanded === item.label}
                  >
                    {item.label}
                    <ChevronDown
                      size={16}
                      className={`mobile-chevron${mobileExpanded === item.label ? ' open' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                  <div
                    className={`mobile-sub-list${mobileExpanded === item.label ? ' open' : ''}`}
                    role="menu"
                  >
                    {item.mega.map((m, j) =>
                      m.type === 'heading' ? (
                        <div key={j} className="mobile-sub-heading" role="separator">{m.label}</div>
                      ) : (
                        <Link key={j} href={m.to} className="mobile-nav-sub" role="menuitem">
                          <span className="mobile-sub-icon" aria-hidden="true">{m.icon}</span>
                          <span>{m.label}</span>
                        </Link>
                      )
                    )}
                  </div>
                </>
              ) : (
                <Link href={item.to} className="mobile-nav-link">{item.label}</Link>
              )}
            </div>
          ))}

          <Link href="/contact" className="btn btn-gold mobile-cta-btn">
            Get Started <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </>
  );
}
