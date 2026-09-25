import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle } from 'lucide-react';
import './CtaBanner.css';

export default function CtaBanner() {
  return (
    <section className="cta-banner">
      <div className="container cta-banner-inner">
        <div className="cta-banner-copy">
          <span className="cta-banner-pill">Get Started Today</span>
          <h2 className="cta-banner-heading">
            Clear Your Operational Bottlenecks Today
          </h2>
          <p className="cta-banner-sub">
            Whether you need support for seasonal peaks or one dedicated resource doing all your back-office tasks, Proowrx provides flexible business outsourcing support designed around your business.
          </p>
          <div className="cta-banner-assurances">
            {['No lock-in contracts', 'Onboard in 48 hours', 'Australian compliance guaranteed'].map((t) => (
              <span key={t} className="cta-banner-assurance">
                <CheckCircle size={13} /> {t}
              </span>
            ))}
          </div>
          <div className="cta-banner-buttons">
            <a href="https://calendly.com/proowrx/30min" target="_blank" rel="noreferrer" className="btn btn-gold">
              Book a Discovery Call <ArrowRight size={15} />
            </a>
            <Link href="/contact" className="btn btn-ghost">Send a Message</Link>
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
