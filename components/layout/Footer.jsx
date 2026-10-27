'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import './Footer.css';
import Image from 'next/image';

const LOGO = '/Proowrx_Logo.png';
const BADGE = '/images/ISO Badge.jpg';

export default function Footer() {
  return (
    <footer className="footer">
      {/* Main */}
      <div className="footer-main">
        <div className="container footer-grid">
          {/* Brand col */}
          <div className="footer-brand">
            <Image src={LOGO} alt="Proowrx" className="footer-logo" width={160} height={44} />
            <p>Proowrx is an Australian-owned outsourcing company helping businesses streamline operations, reduce costs and grow through specialised mortgage, accounting, asset finance and digital marketing support.</p>
            <div className="footer-socials">
              {[
                { href: 'https://www.facebook.com/proowrx/', icon: <FaFacebook size={16} />, title: 'Facebook', color: '#1877f2' },
                { href: 'https://www.instagram.com/proowrx/', icon: <FaInstagram size={16} />, title: 'Instagram', color: '#e1306c' },
                // { href: 'https://twitter.com/proowrx/', icon: <FaXTwitter size={16} />, title: 'X / Twitter', color: '#000000' },
                { href: 'https://www.linkedin.com/company/proowrx/about/', icon: <FaLinkedinIn size={16} />, title: 'LinkedIn', color: '#0077b5' },
              ].map(s => (
                <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className="social-btn" title={s.title} style={{ '--social-color': s.color }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              {[
                ['/','Home'],
                ['/about','About Us'],
                ['/services','Services'],
                ['/our-team','Our Team'],
                ['/resources','Resources'],
                ['/career','Career'],
                ['/contact','Contact Us'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link href={to}>
                    {label}
                    <ArrowRight size={12} className="link-arrow" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact details, legal links, locations and certification */}
          <div className="footer-contact-area">
            <div className="footer-contact-layout">
              <section className="footer-contact-details" aria-labelledby="footer-contact-title">
                <h4 id="footer-contact-title" className="footer-heading">Contact</h4>
                <div className="footer-phone-list">
                  <a className="footer-phone-link" href="tel:+919610411400"><Phone size={14} aria-hidden="true" /><span>+91 96104 11400</span></a>
                  <a className="footer-phone-link" href="tel:+911412952294"><Phone size={14} aria-hidden="true" /><span>+91-141-2952294</span></a>
                  <a className="footer-phone-link" href="tel:+61288341222"><Phone size={14} aria-hidden="true" /><span>+61 02 8834 1222</span></a>
                  <a className="footer-email-link" href="mailto:support@proowrx.com"><Mail size={14} aria-hidden="true" /><span>support@proowrx.com</span></a>
                </div>
              </section>

              <section className="footer-legal-details" aria-labelledby="footer-legal-title">
                <h4 id="footer-legal-title" className="footer-heading">Legal</h4>
                <ul className="footer-links footer-legal-menu">
                  {[
                    ['/privacy-policy', 'Privacy Policy'],
                    ['/terms-of-use', 'Terms of Use'],
                    ['/disclaimer', 'Disclaimer'],
                    ['/terms-of-access', 'Terms of Access'],
                  ].map(([to, label]) => (
                    <li key={to}>
                      <Link href={to}>{label}<ArrowRight size={12} className="link-arrow" /></Link>
                    </li>
                  ))}
                </ul>
              </section>

              <div className="footer-newsletter">
                {/* Replace this neutral slot with the approved ISO badge artwork when it is available. */}
                <div className="footer-iso-slot">
                  <Image src={BADGE} alt="Proowrx ISO certification badge" width={160} height={80} className="footer-iso-badge" />
                </div>
              </div>

              <section className="footer-addresses" aria-labelledby="footer-addresses-title">
                <h4 id="footer-addresses-title" className="footer-heading">Our locations</h4>
                <div className="footer-location-list">
                  <article className="footer-location">
                    <div className="footer-location-title"><Image src="https://flagcdn.com/w40/in.png" alt="India" className="footer-country-flag" width={28} height={20} /><strong>Jaipur, India</strong></div>
                    <p><MapPin size={13} aria-hidden="true" /><span>2nd Floor, Press Trust Of India, 5 B, Jhalana Institutional Area, J L N Marg, Jaipur, Rajasthan 302004</span></p>
                  </article>
                  <article className="footer-location">
                    <div className="footer-location-title"><Image src="https://flagcdn.com/w40/au.png" alt="Australia" className="footer-country-flag" width={28} height={20} /><strong>Sydney, Australia</strong></div>
                    <p><MapPin size={13} aria-hidden="true" /><span>Suite 215, East Wing, 33 Lexington Drive, Bella Vista NSW-2153</span></p>
                  </article>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {new Date().getFullYear()} Proowrx Knowledge Centre Pvt. Ltd. All rights reserved.</p>
          {/* <div className="footer-legal">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-use">Terms of Use</Link>
            <Link href="/disclaimer">Disclaimer</Link>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
