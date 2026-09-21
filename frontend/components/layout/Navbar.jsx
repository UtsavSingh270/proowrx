'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  ArrowRight, BarChart3, BriefcaseBusiness, Building2, Calculator,
  CarFront, ChevronDown, FileCheck2, FileStack, Megaphone, Menu,
  UserRound, X,
} from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import './Navbar.css';

const LOGO = '/Proowrx_Logo.png';

const SERVICE_GROUPS = [
  {
    id: 'mortgage',
    label: 'Mortgage',
    description: 'End-to-end broker support',
    to: '/mortgage',
    icon: Building2,
    children: [
      { label: 'Mortgage Processing', to: '/mortgage', desc: 'Full-cycle loan processing and lodgement', icon: FileCheck2 },
      { label: 'Virtual Assistant', to: '/virtual-assistant', desc: 'Dedicated remote support for your brokerage', icon: UserRound },
      { label: 'Pay Per Application', to: '/pay-per-application', desc: 'Flexible file processing without lock-in contracts', icon: FileStack },
    ],
  },
  {
    id: 'accounting',
    label: 'Accounting',
    description: 'Reliable finance operations',
    to: '/accounting',
    icon: Calculator,
    children: [
      { label: 'Accounting Services', to: '/accounting', desc: 'Complete accounting back-office support', icon: BarChart3 },
      { label: 'Bookkeeping', to: '/bookkeeping', desc: 'Reconciliation, payroll and bookkeeping support', icon: BriefcaseBusiness },
      { label: 'Tax, BAS & SMSF', to: '/accounting#services', desc: 'Australian-compliant preparation and administration', icon: FileCheck2 },
    ],
  },
  {
    id: 'asset-finance',
    label: 'Asset Finance',
    description: 'Faster application processing',
    to: '/asset-finance',
    icon: CarFront,
    children: [
      { label: 'Asset Finance Processing', to: '/asset-finance', desc: 'Vehicle, equipment and commercial finance support', icon: CarFront },
      { label: 'Application Packaging', to: '/asset-finance', desc: 'Document validation and lender-ready packaging', icon: FileStack },
      { label: 'Settlement Support', to: '/asset-finance', desc: 'Lender follow-up and settlement coordination', icon: FileCheck2 },
    ],
  },
  {
    id: 'digital-marketing',
    label: 'Digital Marketing',
    description: 'Consistent brand visibility',
    to: '/digital-marketing',
    icon: Megaphone,
    children: [
      { label: 'Digital Marketing Support', to: '/digital-marketing', desc: 'A remote marketing extension for finance teams', icon: Megaphone },
      // { label: 'SEO & Content', to: '/digital-marketing', desc: 'Search-led content planning and execution', icon: Megaphne },
      // { label: 'Social & Campaigns', to: '/digital-marketing', desc: 'Social media, email and campaign assistance', icon: Share2 },
    ],
  },
];

const nav = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  {
    label: 'Our Services', to: '/services', serviceMenu: true,
    mega: [
      { type: 'heading', label: 'Mortgage' },
      { label: 'Mortgage Overview', to: '/mortgage', desc: 'Full-cycle loan processing & lodgement', icon: '🏠' },
      { label: 'Virtual Assistant', to: '/virtual-assistant', desc: 'Dedicated remote VA for your brokerage', icon: '👤' },
      { label: 'Pay Per Application', to: '/pay-per-application', desc: 'Flexible, no-contract file processing', icon: '💼' },
      { type: 'heading', label: 'Accounting' },
      { label: 'Account Services', to: '/accounting', desc: 'Bookkeeping, tax, SMSF & BAS', icon: '📊' },
      { label: 'BookKeeping Service', to: '/bookkeeping', desc: 'Bookkeeping', icon: '📊' },
      { type: 'heading', label: 'Asset Finance' },
      { label: 'Asset Finance', to: '/asset-finance', desc: 'Application processing and lender support', icon: '🚗' },
      { type: 'heading', label: 'Digital Marketing' },
      { label: 'Digital Marketing', to: '/digital-marketing', desc: 'Content, SEO, social and campaign support', icon: '📣' },
    ],
  },
  { label: 'Our Team', to: '/our-team' },
  // { label: 'Blog', to: '/blog' },
  {
    label: 'Resources', to: '/resources',
    mega: [
      { label: 'Data Security', to: '/data-security', icon: '💼' },
      { label: 'Case Study', to: '/case-study', icon: '📸' },
      { label: 'Blog', to: '/blog', icon: '📝' },
      { label: 'Downloadable Resources', to: '/downloadable-resources', icon: '💾' },
    ],
  },
  { label: 'Career', to: '/career' },
];

function groupMegaColumns(items) {
  const columns = [];
  let current = null;

  items.forEach(item => {
    if (item.type === 'heading') {
      current = { heading: item.label, links: [] };
      columns.push(current);
      return;
    }

    if (!current) {
      current = { heading: null, links: [] };
      columns.push(current);
    }
    current.links.push(item);
  });

  return columns;
}

export default function Navbar() {
  const [scrolled, setScrolled]             = useState(false);
  const [mobileOpen, setMobileOpen]         = useState(false);
  const [openMega, setOpenMega]             = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [activeService, setActiveService] = useState(SERVICE_GROUPS[0].id);
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

  const openMenu  = label => { clearTimeout(closeTimer.current); setOpenMega(label); };
  const closeMenu = ()    => { closeTimer.current = setTimeout(() => setOpenMega(null), 140); };
  const toggleMobileExpanded = label => setMobileExpanded(prev => (prev === label ? null : label));
  const megaLinks     = mega => mega.filter(m => m.type !== 'heading');
  const isServiceActive = item => item.mega && megaLinks(item.mega).some(m => m.to === pathname);
  const selectedService = SERVICE_GROUPS.find(service => service.id === activeService) || SERVICE_GROUPS[0];
  const SelectedServiceIcon = selectedService.icon;

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
              // { href: 'https://twitter.com/proowrx/',                    icon: <FaXTwitter size={13} />,   label: 'X/Twitter' },
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
              <Image src={LOGO} alt="Proowrx" width={200} height={60} priority />
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

                  {item.mega && openMega === item.label && item.serviceMenu && (
                    <div
                      className="mega-menu services-mega"
                      role="menu"
                      onMouseEnter={() => openMenu(item.label)}
                      onMouseLeave={closeMenu}
                    >
                      <div className="services-mega-header">
                        <div>
                          <span>Our expertise</span>
                          <strong>Services built for finance professionals</strong>
                        </div>
                        <Link href="/services">View all services <ArrowRight size={14} /></Link>
                      </div>
                      <div className="services-mega-grid">
                        <div className="services-mega-list" aria-label="Service categories">
                          {SERVICE_GROUPS.map(service => {
                            const ServiceIcon = service.icon;
                            const active = selectedService.id === service.id;
                            return (
                              <Link
                                key={service.id}
                                href={service.to}
                                className={`services-mega-category${active ? ' active' : ''}`}
                                onMouseEnter={() => setActiveService(service.id)}
                                onFocus={() => setActiveService(service.id)}
                              >
                                <span className="services-mega-category-icon"><ServiceIcon size={19} /></span>
                                <span><strong>{service.label}</strong><small>{service.description}</small></span>
                                <ArrowRight size={14} />
                              </Link>
                            );
                          })}
                        </div>
                        <div className="services-mega-detail" aria-live="polite">
                          <div className="services-mega-detail-heading">
                            <span className="services-mega-detail-icon"><SelectedServiceIcon size={20} /></span>
                            <div><small>Explore</small><strong>{selectedService.label}</strong></div>
                          </div>
                          <div className="services-mega-subcategories">
                            {selectedService.children.map(child => {
                              const ChildIcon = child.icon;
                              return (
                                <Link key={`${selectedService.id}-${child.label}`} href={child.to} className="services-mega-subcategory" role="menuitem">
                                  <span><ChildIcon size={18} /></span>
                                  <div><strong>{child.label}</strong><small>{child.desc}</small></div>
                                  <ArrowRight size={14} />
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {item.mega && openMega === item.label && !item.serviceMenu && (
                    <div
                      className={`mega-menu${groupMegaColumns(item.mega).length > 1 ? ' mega-menu--wide' : ''}`}
                      role="menu"
                      onMouseEnter={() => openMenu(item.label)}
                      onMouseLeave={closeMenu}
                    >
                      <div className={`mega-inner${groupMegaColumns(item.mega).length > 1 ? ' mega-inner--columns' : ''}`}>
                        {groupMegaColumns(item.mega).map((column, columnIndex) => (
                          <div className="mega-column" key={column.heading || columnIndex}>
                            {column.heading && <div className="mega-section-heading" role="separator">{column.heading}</div>}
                            {column.links.map(link => (
                              <Link key={link.to} href={link.to} className="mega-item" role="menuitem">
                                <span className="mega-icon" aria-hidden="true">{link.icon}</span>
                                <div>
                                  <span className="mega-label">{link.label}</span>
                                  {link.desc && <span className="mega-desc">{link.desc}</span>}
                                </div>
                                <ArrowRight size={14} className="mega-arrow" aria-hidden="true" />
                              </Link>
                            ))}
                          </div>
                        ))}
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