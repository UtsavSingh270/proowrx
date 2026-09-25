'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import CtaBanner from '@/components/shared/CtaBanner';
import FaqAskBot from '@/components/feedback/FaqAskBot';
import { faqs } from '@/data/faqs';
import '@/styles/InfoPages.css';

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <div>
      <section
        className="page-hero page-hero--img info-hero"
        style={{ '--hero-bg': 'url("https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1800&q=85")' }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="chip chip-gold" style={{ marginBottom: 16 }}>FAQ</span>
          <h1>Frequently Asked Questions</h1>
          <p>Clear answers about working with Proowrx and choosing the right outsourcing support.</p>
        </div>
      </section>

      <section className="section">
        <div className="container info-narrow">
          <div className="faq-list">
            {faqs.map((item, index) => (
              <div key={item.q} className={`faq-item${open === index ? ' open' : ''}`}>
                <button type="button" onClick={() => setOpen(open === index ? null : index)}>
                  <span>{item.q}</span>
                  <ChevronDown size={18} />
                </button>
                {open === index && <p>{item.a}</p>}
              </div>
            ))}
          </div>

          <FaqAskBot />
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
