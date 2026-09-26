'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  ArrowRight, BarChart3, BookOpenCheck, Calculator, CarFront,
  ChevronDown, Download, FileChartColumn, FileCheck2, FileStack,
  Globe, House, Landmark, Megaphone, Menu, Mic, Newspaper, Palette,
  PenTool, Receipt, Shield, ShieldCheck, Target, UserRound, Users,
  Wallet, X,
} from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import './Navbar.css';

const LOGO = '/Proowrx_Logo.png';

const SERVICE_GROUPS = [
  {
    id: 'mortgage',
    label: 'Mortgage',
    description: 'End-to-end broker support',
    to: '/mortgage',
    icon: House,
    children: [
      { label: 'Mortgage Process', to: '/mortgage', desc: 'Full-cycle loan processing and lodgement', icon: FileCheck2 },
      { label: 'Dedicated Resource', to: '/virtual-assistant', desc: 'Dedicated remote support for your brokerage', icon: UserRound },
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
      { label: 'Accounting Services', to: '/accounting', desc: 'Complete Accounting Services For Your Business', icon: BarChart3 },
      { label: 'Bookkeeping Services', to: '/bookkeeping', desc: 'Reconciliation, payroll and bookkeeping support', icon: BookOpenCheck },
      { label: 'Tax, BAS & SMSF', to: '/accounting#services', desc: 'Australian-compliant preparation and administration', icon: Receipt },
      { label: 'Payroll Processing', to: '/accounting#services', desc: 'Australian-compliant preparation and administration', icon: Wallet },
      { label: 'Cash Forecast Statement', to: '/accounting#services', desc: 'Australian-compliant preparation and administration', icon: BarChart3 },
      { label: 'Audit Support', to: '/accounting#services', desc: 'Australian-compliant preparation and administration', icon: ShieldCheck },
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
      { label: 'Settlement Support', to: '/asset-finance', desc: 'Lender follow-up and settlement coordination', icon: Landmark },
    ],
  },
  {
    id: 'digital-marketing',
    label: 'Digital Marketing',
    description: 'Consistent brand visibility',
    to: '/digital-marketing',
    icon: Megaphone,
    children: [
      { label: 'Demand/Lead Generation', to: '/digital-marketing', desc: 'Paid Advertising, SEO, Email Marketing and CRO Assistance', icon: Target },
      { label: 'Social & Reputation', to: '/digital-marketing', desc: 'Social Media Marketing and Online Reputation Management', icon: Users },
      { label: 'Content Services', to: '/digital-marketing', desc: 'Content Writing and Content Marketing Assistance', icon: PenTool },
      { label: 'Web Support', to: '/digital-marketing', desc: 'Website Development & Maintenance Assistance', icon: Globe },
      { label: 'Digital Events', to: '/digital-marketing', desc: 'Podcasts & Webinars Market Growth Assistance', icon: Mic },
      { label: 'Graphic Events', to: '/digital-marketing', desc: 'Graphics Designing and Video Creation & Editing Assistance', icon: Palette },
    ],
  },
];

const nav = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Our Services', to: '/services', serviceMenu: true },
  { label: 'Our Team', to: '/our-team' },
  {
    label: 'Resources', to: '/resources',
    mega: [
      { label: 'Data Security', to: '/data-security', desc: 'Data Security & Privacy at Proowrx', icon: Shield },
      { label: 'Case Studies', to: '/case-study', desc: 'Read Case studies and success stories', icon: FileChartColumn },
      { label: 'Blogs', to: '/blog', desc: 'Read Latest news and insights', icon: Newspaper },
      { label: 'Downloadables', to: '/downloadable-resources', desc: 'Download E-Guides and Resources', icon: Download },
    ],
  },
  { label: 'Career', to: '/career' },
];

const ALL_SERVICE_LINKS = SERVICE_GROUPS.flatMap(s => [
  { to: s.to },
  ...s.children.map(c => ({ to: c.to })),
]);

function groupMegaColumns(items) {
  const columns = [];
  let current = null;

  function getSubcategoryColumns(count) {
  if (count > 6) return 3;
  if (count > 3) return 2;
  return 1;
}

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

const hasDropdown = item => Boolean(item.mega || item.serviceMenu);

export default function Navbar() {
  const [scrolled, setScrolled]             = useState(false);
  const [mobileOpen, setMobileOpen]         = useState(false);
  const [openMega, setOpenMega]             = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [mobileServiceCat, setMobileServiceCat] = useState(null);
  const [activeService, setActiveService]   = useState(SERVICE_GROUPS[0].id);
  const pathname   = usePathname();
  const closeTimer = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
    setOpenMega(null);
    setMobileExpanded(null);
    setMobileServiceCat(null);
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
  const closeMenu = ()    => { closeTimer.current = setTimeout(() => setOpenMega(null), 180); };

  const toggleMobileExpanded = label => {
    setMobileExpanded(prev => (prev === label ? null : label));
    setMobileServiceCat(null);
  };
  const toggleMobileServiceCat = id => setMobileServiceCat(prev => (prev === id ? null : id));

  const isActiveLink = item => {
    if (item.serviceMenu) return pathname === item.to || ALL_SERVICE_LINKS.some(l => l.to === pathname);
    if (item.mega) return item.mega.filter(m => m.type !== 'heading').some(m => m.to === pathname);
    return pathname === item.to;
  };

  const selectedService = SERVICE_GROUPS.find(s => s.id === activeService) || SERVICE_GROUPS[0];
  const SelectedServiceIcon = selectedService.icon;

  return (
    <>
      {/* CONTACT STRIP */}
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
              { href: 'https://www.linkedin.com/company/proowrx/about/', icon: <FaLinkedinIn size={13} />, label: 'LinkedIn'  },
            ].map(s => (
              <a key={s.href} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* NAV WRAPPER */}
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
                  className={`nav-item${hasDropdown(item) ? ' has-mega' : ''}`}
                  role="none"
                  onMouseEnter={() => hasDropdown(item) && openMenu(item.label)}
                  onMouseLeave={() => hasDropdown(item) && closeMenu()}
                >
                  <Link
                    href={item.to}
                    role="menuitem"
                    aria-haspopup={hasDropdown(item) ? 'true' : undefined}
                    aria-expanded={hasDropdown(item) ? openMega === item.label : undefined}
                    className={`nav-link${isActiveLink(item) ? ' active' : ''}`}
                  >
                    {item.label}
                    {hasDropdown(item) && (
                      <ChevronDown
                        size={13}
                        className={`nav-chevron${openMega === item.label ? ' open' : ''}`}
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            {/* CENTERED DROPDOWNS — rendered once, positioned relative to the full-width navbar */}
            {nav.filter(hasDropdown).map(item => (
              <div
                key={`mega-${item.label}`}
                className={
                  item.serviceMenu
                    ? `services-mega mega-dropdown${openMega === item.label ? ' open' : ''}`
                    : `mega-menu mega-dropdown${groupMegaColumns(item.mega).length > 1 ? ' mega-menu--wide' : ''}${openMega === item.label ? ' open' : ''}`
                }
                role="menu"
                aria-hidden={openMega !== item.label}
                onMouseEnter={() => openMenu(item.label)}
                onMouseLeave={closeMenu}
              >
                {item.serviceMenu ? (
                  <>
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
                        <div
                          className={`services-mega-subcategories${
                            selectedService.children.length > 4 ? ' services-mega-subcategories--two-col' : ''
                          }`}
                        >
                          {selectedService.children.map(child => {
                            const ChildIcon = child.icon;
                            return (
                              <Link
                                key={`${selectedService.id}-${child.label}`}
                                href={child.to}
                                className="services-mega-subcategory"
                                role="menuitem"
                              >
                                <span><ChildIcon size={18} /></span>
                                <div><strong>{child.label}</strong><small>{child.desc}</small></div>
                                <ArrowRight size={14} />
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={groupMegaColumns(item.mega).length > 1 ? 'mega-inner mega-inner--columns' : 'mega-inner'}>
                    {groupMegaColumns(item.mega).map((column, columnIndex) => (
                      <div className="mega-column" key={column.heading || columnIndex}>
                        {column.heading && <div className="mega-section-heading" role="separator">{column.heading}</div>}
                        {column.links.map(link => {
                          const LinkIcon = link.icon;
                          return (
                            <Link key={link.to} href={link.to} className="mega-item" role="menuitem">
                              <span className="mega-icon" aria-hidden="true"><LinkIcon size={18} /></span>
                              <div>
                                <span className="mega-label">{link.label}</span>
                                {link.desc && <span className="mega-desc">{link.desc}</span>}
                              </div>
                              <ArrowRight size={14} className="mega-arrow" aria-hidden="true" />
                            </Link>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

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
              {mobileOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </div>

      {mobileOpen && (
        <div className="mobile-backdrop" onClick={() => setMobileOpen(false)} aria-hidden="true" />
      )}

      {/* MOBILE DRAWER */}
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
              {item.serviceMenu ? (
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
                    className={`mobile-sub-list mobile-service-list${mobileExpanded === item.label ? ' open' : ''}`}
                    role="menu"
                  >
                    {SERVICE_GROUPS.map(group => {
                      const GroupIcon = group.icon;
                      const catOpen = mobileServiceCat === group.id;
                      return (
                        <div key={group.id} className="mobile-service-group">
                          <button
                            className="mobile-service-cat"
                            onClick={() => toggleMobileServiceCat(group.id)}
                            aria-expanded={catOpen}
                          >
                            <span className="mobile-service-cat-icon"><GroupIcon size={17} /></span>
                            <span className="mobile-service-cat-text">
                              <strong>{group.label}</strong>
                              <small>{group.description}</small>
                            </span>
                            <ChevronDown
                              size={15}
                              className={`mobile-chevron${catOpen ? ' open' : ''}`}
                              aria-hidden="true"
                            />
                          </button>
                          <div className={`mobile-service-children${catOpen ? ' open' : ''}`}>
                            {group.children.map(child => {
                              const ChildIcon = child.icon;
                              return (
                                <Link
                                  key={`${group.id}-${child.label}`}
                                  href={child.to}
                                  className="mobile-nav-sub"
                                  role="menuitem"
                                >
                                  <span className="mobile-sub-icon" aria-hidden="true"><ChildIcon size={15} /></span>
                                  <span>{child.label}</span>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : item.mega ? (
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
                          <span className="mobile-sub-icon" aria-hidden="true"><m.icon size={15} /></span>
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
