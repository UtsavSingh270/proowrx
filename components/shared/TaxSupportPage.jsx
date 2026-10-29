'use client';

import { Fragment, useEffect, useRef } from 'react';
import Image from 'next/image';
import { CheckCircle2, ClipboardCheck } from 'lucide-react';
import ServiceBenefits from '@/components/shared/ServiceBenefits';
import ServiceFaq from '@/components/shared/ServiceFaq';

function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        element.classList.add('visible');
        observer.unobserve(element);
      }
    }, { threshold: 0.08 });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return ref;
}

export default function TaxSupportPage({ content, className = '' }) {
  const introRef = useReveal();
  const visualRef = useReveal();
  const servicesRef = useReveal();
  const whyRef = useReveal();

  return (
    <div className={className}>
      <section className="page-hero page-hero--split page-hero--img as-hero" style={{ '--hero-bg': `url("${content.heroImage}")` }}>
        <div className="container">
          <div className="page-hero-content">
            <h1>{content.heroHeading}</h1>
            <p>{content.heroSubtext}</p>
            <div className="page-hero-stats">
              {content.stats.map((stat, index) => <Fragment key={`${stat.value}-${stat.label}`}>
                {index > 0 && <span className="page-hero-stat-divider" />}
                <span className="page-hero-stat"><span className="page-hero-stat-num">{stat.value}</span><span className="page-hero-stat-label">{stat.label}</span></span>
              </Fragment>)}
            </div>
          </div>
          <div className="page-hero-visual">
            <Image src={content.heroImage} alt={content.heroImageAlt} width={800} height={533} sizes="(max-width: 960px) 100vw, 45vw" />
            <div className="page-hero-badge-float" aria-hidden="true"><span className="as-hero-badge-icon"><ClipboardCheck size={24} /></span></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container as-intro">
          <div ref={introRef} className="reveal as-intro-text">
            <h2 className="section-title">{content.introHeading}</h2>
            <p className="section-body">{content.introText}</p>
            <ul className="as-point-list">{content.introPoints.map((point) => <li key={point}><CheckCircle2 size={17} className="as-point-check" /><span>{point}</span></li>)}</ul>
          </div>
          <div className="as-intro-visual reveal reveal-delay-2" ref={visualRef}>
            <Image src={content.introImage} alt={content.introImageAlt} width={800} height={533} sizes="(max-width: 960px) 100vw, 45vw" />
          </div>
        </div>
      </section>

      <section className="section" id="services" style={{ background: 'var(--surface)' }}>
        <div className="container as-provide-container">
          <div ref={servicesRef} className="reveal as-section-heading">
            <h2 className="section-title">{content.servicesHeading}</h2>
            <p className="section-body">{content.servicesSubtext}</p>
          </div>
          <div className="as-provide-grid">
            {content.services.map(({ Icon, title, body }, index) => <article key={title} className={`as-provide-item reveal reveal-delay-${(index % 4) + 1}`}>
              <div className="as-provide-heading"><span className="as-provide-icon"><Icon size={20} /></span><h3 className="as-provide-title">{title}</h3></div>
              <p className="as-provide-body">{body}</p>
            </article>)}
          </div>
        </div>
      </section>

      <ServiceBenefits service={content.benefitsHeading} heading={content.benefitsHeading} intro={content.benefitsSubtext} benefits={content.benefits} />

      <section className="section">
        <div className="container">
          <div ref={whyRef} className="reveal as-section-heading">
            <h2 className="section-title">{content.whyHeading}</h2>
          </div>
          <div className="as-why-grid">
            {content.whyItems.map(({ Icon, title, body }, index) => <article key={title} className={`as-why-card reveal reveal-delay-${index + 1}`}>
              <div className="as-why-heading"><span className="as-why-icon"><Icon size={20} /></span><h3 className="as-why-title">{title}</h3></div>
              <p className="as-why-body">{body}</p>
            </article>)}
          </div>
        </div>
      </section>

      <ServiceFaq title={content.faqHeading} intro="" items={content.faqs} />
    </div>
  );
}
