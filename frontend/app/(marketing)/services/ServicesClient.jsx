import React from 'react';
import Link from 'next/link';

import { ArrowRight, CheckCircle } from 'lucide-react';
import ServiceFaq from '@/components/shared/ServiceFaq';
import './Services.css';

const qualities = [
  { icon: '🎯', title: 'ISO Certified Security', desc: 'ISO 27001:2022 certified protocols and secure infrastructure protecting your sensitive information 24/7.' },
  { icon: '⚡', title: 'Regulatory Compliance', desc: 'Comprehensive compliance management covering all industry standards, governing bodies, and frameworks.' },
  { icon: '🔄', title: 'Expert Training', desc: 'Ongoing, structured training and development programmes keep our 150+ professionals at the top of their game.' },
  { icon: '🔧', title: 'Seamless Adaptability', desc: 'Flexible service models built on 25+ years of leadership experience to fit your shifting business needs.' },
];

// const steps = [
//   { num: '01', title: 'Receiving Application', desc: 'Brief overview of the case received from the broker along with a folder of required documents.' },
//   { num: '02', title: 'Processing Application', desc: 'Data entry in CRM, preparing missing-info lists, sending compliance documents for signing.' },
//   { num: '03', title: 'Lodgement', desc: 'Supporting documents attached, compliance check completed, broker notified when ready to lodge.' },
//   { num: '04', title: 'Post Lodgement', desc: 'Follow up with banks, coordinate document delivery as per broker instructions until settlement.' },
// ];

export default function Services() {
  return (
    <div>
      <section
        className="page-hero page-hero--img"
        style={{ '--hero-bg': 'url("https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1800&q=85")' }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="chip chip-gold" style={{ marginBottom: 16 }}>What We Offer</span>
          <h1>Scalable Back-Office Support Built for Australian Business</h1>
          <p>Grow your business operations, eliminate administrative bottlenecks, and cut processing delays. Proowrx provides dedicated, skilled back-office teams for Australian mortgage brokers, accountants, asset finance brokers, and property professionals.</p>
          <div className="page-hero-actions">
            <a href="https://calendly.com/proowrx/30min" target="_blank" rel="noreferrer" className="btn btn-gold">
              Book a Meeting <ArrowRight size={15} />
            </a>
            <Link href="/contact" className="btn btn-ghost">Contact Us</Link>
          </div>
        </div>
      </section>

      {/* 2 main services */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span className="chip chip-teal section-eyebrow">Core Services</span>
            <h2 className="section-title">Choose Your Service</h2>
          </div>
          <div className="svc-hero-pair">
            {/* Mortgage */}
            <Link href="/mortgage" className="svc-big-card svc-mortgage">
              <div className="svc-big-img">
                <img src="https://proowrx.com/wp-content/uploads/2022/05/ded-new.jpg" alt="Mortgage" loading="lazy" decoding="async" />
                <div className="svc-big-overlay" />
              </div>
              <div className="svc-big-content">
                <div className="svc-big-icon">🏠</div>
                <h2>Mortgage Outsourcing Service</h2>
                <p>Optimise your brokerage efficiently without increasing back-office admin tasks. By outsourcing mortgage loan processing to our dedicated team, you keep files moving faster.</p>
                <ul>
                  {['End-to-End Loan Processing', 'Pipeline Management', 'Broker & Client Support'].map(b => (
                    <li key={b}><CheckCircle size={14} />{b}</li>
                  ))}
                </ul>
                <p className="font-medium">Optimised for mortgage brokers working with any mortgage broker aggregator or CRM platform.</p>
                <span className="svc-big-cta">Explore Mortgage <ArrowRight size={15} /></span>
              </div>
            </Link>

            {/* Accounting */}
            <Link href="/accounting" className="svc-big-card svc-accounting">
              <div className="svc-big-img">
                <img src="https://proowrx.com/wp-content/uploads/2022/05/pay-new.jpg" alt="Accounting" loading="lazy" decoding="async" />
                <div className="svc-big-overlay" />
              </div>
              <div className="svc-big-content">
                <div className="svc-big-icon">📊</div>
                <h2>Accounting Outsourcing Services</h2>
                <p>Secure your business’s profit margins and eliminate the tax season bottlenecks with a high-precision outsourced accounting service. Our team handles routine compliance and ledger maintenance so you can focus on building client relationships.</p>
                <ul>
                  {['Bookkeeping & Reconciliation', 'Compliance Preparation', 'SMSF outsourcing service'].map(b => (
                    <li key={b}><CheckCircle size={14} />{b}</li>
                  ))}
                </ul>
                <p className="font-medium">Flexible outsourced accounting and bookkeeping service designed for modern Businesses. </p>
                <span className="svc-big-cta">Explore Accounting <ArrowRight size={15} /></span>
              </div>
            </Link>

            <Link href="/asset-finance" className="svc-big-card svc-mortgage">
              <div className="svc-big-img">
                <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=85" alt="Asset finance processing" loading="lazy" decoding="async" />
                <div className="svc-big-overlay" />
              </div>
              <div className="svc-big-content">
                <div className="svc-big-icon">🚗</div>
                <h2>Asset Finance Outsourcing Service</h2>
                <p>Proowrx provides dedicated asset finance support for brokers across commercial loans, equipment finance, vehicle finance, personal loans, chattel mortgages, and other lending scenarios.</p>
                <ul>{['Credit & Deal Structuring Support','Lender Submissions & Follow-Up','CRM & Pipeline Management'].map(b=><li key={b}><CheckCircle size={14}/>{b}</li>)}</ul>
                <p className="font-medium">Fast-track approvals with specialist asset finance back-office support.</p>
                <span className="svc-big-cta">Explore Asset Finance <ArrowRight size={15}/></span>
              </div>
            </Link>

            <Link href="/digital-marketing" className="svc-big-card svc-accounting">
              <div className="svc-big-img">
                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=85" alt="Digital marketing analytics" loading="lazy" decoding="async" />
                <div className="svc-big-overlay" />
              </div>
              <div className="svc-big-content">
                <div className="svc-big-icon">📣</div>
                <h2>Digital Marketing Support</h2>
                <p>Build a stronger online presence with all-in-one digital marketing packages designed for mortgage brokers, accountants, asset finance brokers, real estate agents, and buyer’s agents.</p>
                <ul>{['SEO & Website Optimisation','Email Marketing','Paid Advertising & Lead Generation'].map(b=><li key={b}><CheckCircle size={14}/>{b}</li>)}</ul>
                <p className="font-medium">Full-service digital marketing packages for Australian Businesses. </p>
                <span className="svc-big-cta">Explore Digital Marketing <ArrowRight size={15}/></span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Quality pillars */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="chip chip-gold section-eyebrow">Our Standards</span>
            <h2 className="section-title">The Proowrx Difference</h2>
          </div>
          <div className="quality-grid">
            {qualities.map((q, i) => (
              <div key={i} className="quality-tile reveal">
                <span className="quality-icon">{q.icon}</span>
                <h4>{q.title}</h4>
                <p>{q.desc}</p>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.8rem', color: 'var(--text-3)' }}>
            * Subject to receipt of all required documents and information.
          </p>
        </div>
      </section>

      {/* Process */}
      {/* <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span className="chip chip-teal section-eyebrow">How It Works</span>
            <h2 className="section-title">Our Process Flow</h2>
          </div>
          <div className="svc-process-grid">
            {steps.map((s, i) => (
              <div key={i} className="svc-process-card reveal">
                <div className="svc-process-num">{s.num}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      <ServiceFaq
        variant="services"
        title="Questions about our outsourcing services"
        intro="Understand how Proowrx fits into your team, systems and day-to-day operations."
      />
    </div>
  );
}
