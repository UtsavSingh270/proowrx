import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import './CtaBanner.css';

export default function CtaBanner() {
  return (
    <section className="cta-banner">
      <div className="cta-banner-grid" />
      <div className="cta-banner-orb" />
      <div className="container cta-banner-inner">
        <span className="cta-banner-pill">Get Started Today</span>
        <h2 className="cta-banner-heading">
          Ready to hand off the<br />back-office work?
        </h2>
        <p className="cta-banner-sub">
          Book a 30-minute discovery call. No commitment, no sales deck — just a real conversation about how we can free up your team.
        </p>
        <div className="cta-banner-buttons">
          <a
            href="https://calendly.com/proowrx/30min"
            target="_blank"
            rel="noreferrer"
            className="btn btn-gold"
          >
            Book a Discovery Call <ArrowRight size={15} />
          </a>
          <Link href="/contact" className="btn btn-ghost">Send a Message</Link>
        </div>
        <div className="cta-banner-assurances">
          {['No lock-in contracts', 'Onboard in 48 hours', 'Australian compliance guaranteed'].map((t) => (
            <span key={t} className="cta-banner-assurance">
              <CheckCircle size={13} /> {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
