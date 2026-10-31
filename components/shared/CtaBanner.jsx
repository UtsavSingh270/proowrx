import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle } from 'lucide-react';
import './CtaBanner.css';

export default function CtaBanner({ eyebrow = 'Get Started Today', heading = 'Clear Your Operational Bottlenecks Today', description = 'Whether you need support for seasonal peaks or one dedicated resource doing all your back-office tasks, Proowrx provides flexible business outsourcing support designed around your business.', primaryLabel = 'Book a Discovery Call', primaryHref = 'https://calendly.com/proowrx/30min' }) {
  return (
    <section className="cta-banner">
      <div className="container cta-banner-inner">
        <div className="cta-banner-copy">
          <span className="cta-banner-pill">{eyebrow}</span>
          <h2 className="cta-banner-heading">{heading}</h2>
          <p className="cta-banner-sub">{description}</p>
          <div className="cta-banner-assurances">
            {['No lock-in contracts', 'Onboard in 48 hours', 'Australian compliance guaranteed'].map((t) => (
              <span key={t} className="cta-banner-assurance">
                <CheckCircle size={13} /> {t}
              </span>
            ))}
          </div>
          <div className="cta-banner-buttons">
            <Link href="/contact" className="btn btn-ghost">Get Started Today</Link>
            <a href={primaryHref} target={primaryHref.startsWith('http') ? '_blank' : undefined} rel={primaryHref.startsWith('http') ? 'noreferrer' : undefined} className="btn cta-banner-booking-btn">
              {primaryLabel} <ArrowRight size={15} />
            </a>
          </div>
        </div>
        <div className="cta-banner-visual" aria-label="Proowrx workplace gallery">
          <div className="cta-banner-image cta-banner-image-one" />
          <div className="cta-banner-image cta-banner-image-two" />
          <div className="cta-banner-image cta-banner-image-three" />
          <div className="cta-banner-image cta-banner-image-four" />
          <div className="cta-banner-logo">
            <Image src="/Proowrx_Logo.png" alt="Proowrx" width={150} height={48} />
          </div>
        </div>
      </div>
    </section>
  );
}
