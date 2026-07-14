'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, ArrowRight, Send } from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import './Footer.css';

const LOGO = 'https://proowrx.com/wp-content/uploads/2022/05/Proowrx_Final_Logo-removebg-previewnew-1.png';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const submit = e => {
    e.preventDefault();
    setDone(true);
    setEmail('');
    setTimeout(() => setDone(false), 4000);
  };

  return (
    <footer className="footer">
      {/* Main */}
      <div className="footer-main">
        <div className="container footer-grid">
          {/* Brand col */}
          <div className="footer-brand">
            <img src={LOGO} alt="Proowrx" className="footer-logo" />
            <p>An Australian-owned KPO providing expert back-office support for mortgage brokers and accountants across Australia, operating from Jaipur, India.</p>
            <div className="footer-socials">
              {[
                { href: 'https://www.facebook.com/proowrx/', icon: <FaFacebook size={16} />, title: 'Facebook', color: '#1877f2' },
                { href: 'https://www.instagram.com/proowrx/', icon: <FaInstagram size={16} />, title: 'Instagram', color: '#e1306c' },
                { href: 'https://twitter.com/proowrx/', icon: <FaXTwitter size={16} />, title: 'X / Twitter', color: '#000000' },
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
                ['/','Home'],['/about','About Us'],['/services','Our Services'],
                ['/mortgage','Mortgage'],['/accounting','Accounting'],
                ['/data-security','Data Security'],['/our-team','Our Team'],
                ['/career','Career'],['/contact','Contact Us'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link href={to}>
                    <ArrowRight size={12} className="link-arrow" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Offices */}
          <div>
            <h4 className="footer-heading">Our Offices</h4>
            <div className="office-card">
              <img src="https://flagcdn.com/w40/in.png" alt="India" className="office-flag" width="28" height="20" />
              <div>
                <strong>Jaipur, India</strong>
                <p><MapPin size={12} /> Ist Floor, Patrika Building, 5 E, Jhalana Institutional Area, JLN Marg, Jaipur – 302004</p>
                <p><Phone size={12} /> <a href="tel:+919610411400">+91 96104 11400</a></p>
                <p><Phone size={12} /> <a href="tel:+911412952294">+91-141-2952294</a></p>
                <p><Mail size={12} /> <a href="mailto:support@proowrx.com">support@proowrx.com</a></p>
              </div>
            </div>
            <div className="office-card" style={{ marginTop: 16 }}>
              <img src="https://flagcdn.com/w40/au.png" alt="Australia" className="office-flag" width="28" height="20" />
              <div>
                <strong>Sydney, Australia</strong>
                <p><MapPin size={12} /> Suite 215, East Wing, 33 Lexington Drive, Bella Vista NSW-2153</p>
                <p><Phone size={12} /> <a href="tel:+61288341222">02 8834 1222</a></p>
                <p><Mail size={12} /> <a href="mailto:support@proowrx.com">support@proowrx.com</a></p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="footer-heading">Stay Updated</h4>
            <p className="footer-newsletter-desc">Get tips on mortgage outsourcing, accounting, and business growth.</p>
            {done ? (
              <div className="newsletter-success">✓ You&apos;re subscribed!</div>
            ) : (
              <form onSubmit={submit} className="newsletter-form">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <button type="submit" aria-label="Subscribe">
                  <Send size={15} />
                </button>
              </form>
            )}
            <div className="footer-trust">
              <div className="trust-item">🔒 ISO-compliant data security</div>
              <div className="trust-item">✓ Australian-owned & operated</div>
              <div className="trust-item">🌐 Serving brokers Australia-wide</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {new Date().getFullYear()} Proowrx Knowledge Centre Pty Ltd. All rights reserved.</p>
          <div className="footer-legal">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-use">Terms of Use</Link>
            <Link href="/disclaimer">Disclaimer</Link>
            <Link href="/data-security">Data Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
