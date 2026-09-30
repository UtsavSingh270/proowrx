import { CheckCircle2 } from 'lucide-react';

export default function ServiceBenefits({ service, intro, benefits }) {
  return (
    <section className="service-benefits-section section">
      <div className="container">
        <div className="service-benefits-head">
          <span className="chip chip-gold section-eyebrow">Benefits of {service}</span>
          <h2 className="section-title">The benefits of {service.toLowerCase()} support</h2>
          <p className="section-body">{intro}</p>
        </div>
        <div className="service-benefits-grid">
          {benefits.map((benefit) => (
            <article className="service-benefit-card" key={benefit.title}>
              <span className="service-benefit-icon" aria-hidden="true"><CheckCircle2 size={22} /></span>
              <div><h3>{benefit.title}</h3><p>{benefit.text}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
