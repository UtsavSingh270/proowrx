import {
  BadgeDollarSign,
  BriefcaseBusiness,
  Clock3,
  GraduationCap,
  Handshake,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  UsersRound,
} from 'lucide-react';

function getBenefitIcon(title = '') {
  const value = title.toLowerCase();

  if (/(cost|saving|overhead|pay)/.test(value)) return BadgeDollarSign;
  if (/(turnaround|time|fast|speed)/.test(value)) return Clock3;
  if (/(security|secure|compliance|risk)/.test(value)) return ShieldCheck;
  if (/(training|expert|specialist|skill)/.test(value)) return GraduationCap;
  if (/(client|team|people|capacity)/.test(value)) return UsersRound;
  if (/(continuity|reliable|consistent)/.test(value)) return RefreshCw;
  if (/(flex|scale|growth)/.test(value)) return TrendingUp;
  if (/(practice|business|work)/.test(value)) return BriefcaseBusiness;

  return Handshake;
}

export default function ServiceBenefits({ service, intro, benefits, heading }) {
  return (
    <section className="service-benefits-section section">
      <div className="container">
        <div className="service-benefits-head">
          <span className="chip chip-gold section-eyebrow">Benefits</span>
          <h2 className="section-title">{heading || `${service}`}</h2>
          <p className="section-body">{intro}</p>
        </div>
        <div className="service-benefits-grid">
          {benefits.map((benefit) => {
            const Icon = benefit.icon || getBenefitIcon(benefit.title);

            return (
              <article className="service-benefit-card" key={benefit.title}>
                <div className="service-benefit-heading"><span className="service-benefit-icon" aria-hidden="true"><Icon size={22} /></span><h3>{benefit.title}</h3></div>
                <p>{benefit.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
