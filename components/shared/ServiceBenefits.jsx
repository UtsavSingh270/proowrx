import { CheckCircle2 } from 'lucide-react';

export default function ServiceBenefits({ service, intro, benefits }) {
  return (
    <section className="service-benefits-section section">
      <div className="container">
        <div className="service-benefits-head">
          <span className="chip chip-gold section-eyebrow">Benefits</span>
          <h2 className="section-title">The benefits of {service.toLowerCase()}</h2>
          <p className="section-body">{intro}</p>
        </div>
        <div className="service-benefits-grid">
          {benefits.map((benefit) => (
            <article className="service-benefit-card" key={benefit.title}>
              <div className="service-benefit-heading"><span className="service-benefit-icon" aria-hidden="true"><CheckCircle2 size={22} /></span><h3>{benefit.title}</h3></div>
              <p>{benefit.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
