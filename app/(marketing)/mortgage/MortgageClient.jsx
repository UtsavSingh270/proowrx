'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import {
  ArrowRight,
  Award,
  CheckCircle,
  ClipboardList,
  House,
  PhoneCall,
  ShieldCheck,
  TrendingUp,
  Workflow,
  X as XIcon,
} from 'lucide-react';
import ServiceFaq from '@/components/shared/ServiceFaq';
import ServiceBenefits from '@/components/shared/ServiceBenefits';
import './Mortgage.css';
import '../GrowthPages.css';

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const comparisons = [
  { label: 'Research & Scenario · $100', Research: true, Intake: false, Processing: false, Valuation: false, Tracking: false },
  { label: 'Lodge & Track · $160', Research: false, Intake: true, Processing: true, Valuation: true, Tracking: true },
  { label: 'Assess, Lodge & Track · $250', Research: true, Intake: true, Processing: true, Valuation: true, Tracking: true },
  // { label: 'Trained in AOL & aggregator CRMs', Research: true, Intake: true, Processing: '?' },
  // { label: '24-hr turnaround SLA', Research: true, Intake: true, Processing: false },
  // { label: 'Post-lodgement follow-up', Research: false, Intake: true, Processing: true },
  // { label: 'Scales with your volume', Research: true, Intake: true, Processing: false },
];

const models = [
  { num: '01', title: 'Pay per application', tag: 'Service Model', tagColor: 'var(--gold)', desc: 'Service-based processing priced per file, from assessment only to full lodgement and tracking.', benefits: ['From $100 per file'], href: '#mortgage-pricing', packages: null },
  { num: '02', title: 'Para broker', tag: 'Service Model', tagColor: 'var(--teal)', desc: 'Detailed research, lender recommendations, submission packaging and post-settlement support.', benefits: ["See what's included"], href: '#mortgage-para', packages: null },
  { num: '03', title: 'Dedicated resources', tag: 'Service Model', tagColor: 'var(--teal)', desc: 'Part-time or full-time specialists working as an extension of your team.', benefits: ['Meet the roles'], href: '#mortgage-team', packages: null },
];

const preSubmission = [
  'Enter details in CRM and fill in ApplyOnline',
  'Generate and send loan application forms for signing',
  'Upload supporting docs with all compliance satisfied',
  'Complete FHOG, FHLDS and other relevant forms',
  'Prepare discharge authority forms where necessary',
  'Complete the file and lodge to the lender',
];

const postSubmission = [
  'Monitor application progress and follow up with lender',
  'Request any outstanding documentation from clients',
  'Respond to audit/compliance questions from lender',
  'Coordinate with solicitors and valuers',
  'Manage construction progress payments where applicable',
];

const draftModels = [
  ['Pay per application', 'Service-based processing priced per file, from assessment only to full lodgement and tracking.', 'From $100 per file'],
  ['Para broker', 'Detailed research, lender recommendations, submission packaging and post-settlement support.', 'See what’s included'],
  ['Dedicated resources', 'Part-time or full-time specialists working as an extension of your team.', 'Meet the roles'],
];
const draftScope = [
  ['Documents and loan preparation', ['Supporting document management: filing, renaming, organisation', 'Loan preparation, including credit checks', 'Data entry and document upload to MyCRM, AOL, Simpology and others']],
  ['Processing', ['Prepares the serviceability calculator', 'Prepares the lender’s file', 'Orders valuation and pricing', 'Review and signature collection']],
  ['Lodgement and tracking', ['Prepares the bank file for lodgement and attaches NCCP and other support files to your CRM', 'Application lodgement', 'Post-lodgement follow-ups with lenders for timely assessment and approval', 'Keeps you updated all the way to settlement']],
  ['Compliance', ['Reviews signed documents to keep you compliant', 'Compliance checks and audits']],
];
const draftPara = [
  ['Research and structuring', ['Detailed scenario search', 'Detailed policy research', 'Borrowing capacity calculations', 'Send scenarios to lenders and BDMs', 'Funding position and product comparison', 'Lender recommendation and alternative option']],
  ['Submission', ['Document identification and collection', 'Submission packaging', 'Compliance check', 'Data entry in CRM: MyCRM, AOL, Simpology and others', 'Contact with client pre-submission (if required)', 'Work on credit-related MIRs with the assessor (post-submission)']],
  ['After settlement', ['Post-settlement support', 'Loan increase and refinancing', 'Additional admin-related work']],
];

const whyUs = [
  { icon: <Award size={24} aria-hidden="true" />, title: 'Industry Expertise', desc: 'Trained specifically on the Australian mortgage market by an experienced Australia-based broker.' },
  { icon: <Workflow size={24} aria-hidden="true" />, title: 'Streamlined Solutions', desc: 'Technology to automate manual tasks and plug seamlessly into your existing workflow.' },
  { icon: <TrendingUp size={24} aria-hidden="true" />, title: 'Scalability', desc: 'From 1 file a week to 100 — our service adapts as your business grows.' },
  { icon: <ShieldCheck size={24} aria-hidden="true" />, title: 'Unwavering Support', desc: 'A dedicated team that helps you move faster, eliminate stress, and focus on clients.' },
];

export default function Mortgage() {
  const r1 = useReveal(), r2 = useReveal(), r3 = useReveal(), r4 = useReveal();

  return (
    <div>
      {/* ── Hero ── */}
      <section
        className="page-hero page-hero--split page-hero--img mortgage-page-hero"
        style={{ '--hero-bg': 'url("https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1800&q=85")' }}
      >
        <div className="page-hero-orb-1" />
        <div className="page-hero-orb-2" />
        <div className="container">
          <div className="page-hero-content">
            <span className="chip chip-gold" style={{ marginBottom: 10 }}>Mortgage Services</span>
            <h1>Mortgage process outsourcing for brokers who want to write more loans, not push more paper.</h1>
            <p>From scenario research to lodgement and settlement follow-ups, our team handles the processing so you can stay with clients. Pay per application, add a para broker, or build a dedicated team.</p>
            {/* <div className="page-hero-actions">
              <a href="#mortgage-pricing" className="btn btn-gold">See pay-per-application pricing <ArrowRight size={15} /></a>
              <a href="#mortgage-models" className="btn btn-outline-gold">Compare ways to work</a>
            </div> */}
            <div className="page-hero-stats">
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">2</span>
                <span className="page-hero-stat-label">Service Models</span>
              </div>
              <div className="page-hero-stat-divider" />
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">24hr</span>
                <span className="page-hero-stat-label">Turnaround SLA</span>
              </div>
              <div className="page-hero-stat-divider" />
              <div className="page-hero-stat">
                <span className="page-hero-stat-num">100%</span>
                <span className="page-hero-stat-label">ATO Compliant</span>
              </div>
            </div>
          </div>
          <ol className="mortgage-stage-flow"><h2>One file, five stages</h2>{[['Research','Scenarios, lender policy, borrowing capacity'],['Intake','Supporting documents checked and attached'],['Processing','Calculators, CRM and Apply Online data entry, bank file prep'],['Valuation','Ordered, managed and followed up'],['Tracking','Lender and solicitor follow-ups through to settlement']].map(([title, text], index) => <li key={title}><span>{index + 1}</span><div><strong>{title}</strong><small>{text}</small></div></li>)}</ol>
        </div>
      </section>

      {/* Intro split */}
      {/* <section className="section">
        <div className="container ma-intro">
          <div ref={r1} className="reveal-left ma-intro-text">
            <span className="chip chip-gold section-eyebrow">The Problem We Solve</span>
            <h2 className="section-title">Stop Drowning in Paperwork</h2>
            <p className="section-body" style={{ maxWidth: '100%' }}>
              Running a mortgage business means multitasking across loan applications, document verification, and tight compliance regulations. All of this hampers growth and limits time spent with clients.
            </p>
            <p style={{ marginTop: 16, color: 'var(--text-2)', lineHeight: 1.75 }}>
              Proowrx takes the entire back-end processing load off your plate — loan processing, data entry, document handling, and more — so you can focus on growing your book, acquiring new clients, and increasing loan volume without hiring in-house.
            </p>
          </div>
          <div ref={r2} className="reveal-right ma-intro-image">
            <Image src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=85" alt="Mortgage processing" width={900} height={600} sizes="(max-width: 960px) 100vw, 45vw" />
          </div>
        </div>
      </section> */}

      {/* Service models */}
      <section id="mortgage-models" className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div className="mortgage-draft-heading mortgage-models-heading">
            <span className="chip chip-teal section-eyebrow">Service Models</span>
            <h2 className="section-title">Three Ways to Work with Us</h2>
            <p>Start with the model that matches how your business runs today. You can change as you grow.</p>
          </div>
          <div className="models-grid">
            {models.map((m, i) => (
              <div key={i} className="model-card">
                <div className="model-header">
                  <div className="model-num">{m.num}</div>
                  <div>
                    <span className="model-tag" style={{ color: m.tagColor, borderColor: m.tagColor }}>
                      {m.tag}
                    </span>
                    <h3>{m.title}</h3>
                  </div>
                </div>
                <p className="model-desc">{m.desc}</p>
                <ul className="model-benefits">
                  {m.benefits.map((b, j) => <li key={j}><Link className="model-link" href={m.href}>{b}<ArrowRight size={15} aria-hidden="true" /></Link></li>)}
                </ul>
                {m.packages && (
                  <div className="packages">
                    {m.packages.map((p, j) => (
                      <div key={j} className={`pkg ${j === 1 ? 'pkg-dark' : ''}`}>
                        <strong>{p.name}</strong>
                        <p>{p.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section mortgage-draft-section">
        <div className="container">
          <div className="mortgage-draft-heading">
            <span className="chip chip-teal section-eyebrow">What’s included</span>
            <h2 className="section-title">What’s included in our processing service</h2>
            <p>Every file is prepared, lodged and followed up by a team that knows lender requirements and compliance obligations.</p>
          </div>
          <div className="mortgage-draft-box-grid">{draftScope.map(([title, items]) => <article className="mortgage-draft-box" key={title}><h3>{title}</h3><ul>{items.map(item => <li key={item}><CheckCircle size={15} />{item}</li>)}</ul></article>)}</div>
          <div className="mortgage-processing-outputs"><h3>Processing outputs</h3><ul><li>Lender application form</li><li>NCCP documents</li><li>Lender serviceability calculator</li><li>Discharge form <small>(if applicable)</small></li><li>FHOG <small>(if applicable)</small></li><li>Other FHLDS forms <small>(depending on lender requirements)</small></li></ul></div>
        </div>
      </section>
      <section id="mortgage-pricing" className="section mortgage-pricing-section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div className="mortgage-draft-heading"><h2 className="section-title">Pay per application: get your loan files processed from $160</h2><p>Choose the stages you need. Prices are per file.</p></div>
          <div className="mortgage-price-grid">
            <article className="mortgage-price-card"><span>Stage 1: Assess</span><h3>Research &amp; Scenario</h3><strong>$100 <small>/ file</small></strong><p>No minimum</p><h4>Research</h4><ul>{['Scenario research activity','Lender policy research','Borrowing capacity across potential lenders','Lender recommendation with an alternative'].map(item => <li key={item}><CheckCircle size={14} />{item}</li>)}</ul></article>
            <article className="mortgage-price-card"><span>Stages 2–6: Process &amp; track</span><h3>Lodge &amp; Track</h3><strong>$160 <small>/ file</small></strong><p>Minimum 5 cases commitment (pre-paid)</p><em>Everything in Research &amp; Scenario</em><h4>Intake</h4><ul>{['Supporting documents checked and attached'].map(item => <li key={item}><CheckCircle size={14} />{item}</li>)}</ul><h4>Processing</h4><ul>{['Servicing calculator and application pricing','Aggregator CRM and Apply Online data entry','Bank file prep, TFN/CRN removal','FHOG and discharge forms'].map(item => <li key={item}><CheckCircle size={14} />{item}</li>)}</ul><h4>Valuation</h4><ul><li><CheckCircle size={14} />Valuations managed and followed up</li></ul><h4>Tracking</h4><ul>{['Follow-up with lenders','Follow-up with solicitors for settlement'].map(item => <li key={item}><CheckCircle size={14} />{item}</li>)}</ul></article>
            <article className="mortgage-price-card mortgage-price-card--best"><b>Best value</b><span>Stages 1–6</span><h3>Assess, Lodge &amp; Track</h3><strong>$250 <small>/ file</small></strong><p>Minimum 5 cases commitment (pre-paid)</p><em>Everything in Research &amp; Scenario, plus everything in Lodge &amp; Track, bundled.</em><ul><li><CheckCircle size={14} />One file, one price, one team from first scenario to settlement</li></ul></article>
          </div>
          <span className="text-2xl font-bold">Coverage by Plan:</span>
          <div className="ppa-table-wrap">
            <table className="ppa-table">
              <thead>
                <tr>
                  <th></th>
                  <th><span className="ppa-th-label">Research</span></th>
                  <th><span className="ppa-th-label">Intake</span></th>
                  <th><span className="ppa-th-label">Processing</span></th>
                  <th><span className="ppa-th-label">Valuation</span></th>
                  <th><span className="ppa-th-label">Tracking</span></th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, i) => (
                  <tr key={i}>
                    <td className="ppa-row-label">{row.label}</td>
                    <td><CmpCell val={row.Research} /></td>
                    <td><CmpCell val={row.Intake} /></td>
                    <td><CmpCell val={row.Processing} /></td>
                    <td><CmpCell val={row.Valuation} /></td>
                    <td><CmpCell val={row.Tracking} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      {/* <section className="section mortgage-comparison-after-pricing">
        <div className="container">
          <div className="mortgage-draft-heading"><span className="chip chip-violet section-eyebrow">Comparison</span><h2 className="section-title">PPA vs Hiring In-House</h2></div>
          <div className="ppa-table-wrap"><table className="ppa-table"><thead><tr><th></th><th><span className="ppa-th-label">Standard</span></th><th><span className="ppa-th-label">Comprehensive</span></th><th><span className="ppa-th-label ppa-th-label--dim">Hiring</span></th></tr></thead><tbody>{comparisons.map((row, i) => <tr key={i}><td className="ppa-row-label">{row.label}</td><td><CmpCell val={row.standard} /></td><td><CmpCell val={row.comprehensive} /></td><td><CmpCell val={row.hiring} dim /></td></tr>)}</tbody></table></div>
        </div>
      </section> */}

      <section id="mortgage-para" className="section mortgage-draft-section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div className="mortgage-draft-heading">
            <span className="chip chip-gold section-eyebrow">Para broker</span>
            <h2 className="section-title">Para broker support</h2>
            <p>An experienced team that works your files from scenario to post-settlement.</p>
          </div>
          <div className="mortgage-draft-box-grid">{draftPara.map(([title, items]) => <article className="mortgage-draft-box" key={title}><h3>{title}</h3><ul>{items.map(item => <li key={item}><CheckCircle size={15} />{item}</li>)}</ul></article>)}</div>
        </div>
      </section>

      {/* Activities */}
      {/* <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="chip chip-gold section-eyebrow">What We Handle</span>
            <h2 className="section-title">Pre & Post-Submission Activities</h2>
          </div>
          <div className="activities-grid">
            <div className="activity-col activity-pre">
              <div className="activity-header">
                <span className="activity-icon" aria-hidden="true"><ClipboardList size={23} /></span>
                <h3>Pre-Submission</h3>
              </div>
              <ul>
                {preSubmission.map((a, i) => <li key={i}><CheckCircle size={14} />{a}</li>)}
              </ul>
            </div>
            <div className="activity-col activity-post">
              <div className="activity-header">
                <span className="activity-icon" aria-hidden="true"><PhoneCall size={23} /></span>
                <h3>Post-Submission</h3>
              </div>
              <ul>
                {postSubmission.map((a, i) => <li key={i}><CheckCircle size={14} />{a}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section> */}

      {/* <ServiceBenefits service="Mortgage Outsourcing" intro="Give your brokerage more capacity, faster turnaround, and dependable support without adding fixed overhead." benefits={[
        { title: 'More time for clients', text: 'Spend more of your day advising clients while routine processing keeps moving.' },
        { title: 'Flexible capacity', text: 'Scale support around settlements, campaigns, and seasonal workload peaks.' },
        { title: 'Consistent processing', text: 'Documented workflows help keep applications accurate, organised, and on schedule.' },
        { title: 'Lower operating pressure', text: 'Access trained support without the cost and commitment of another full-time hire.' },
      ]} /> */}

      
      <section id="mortgage-team" className="section mortgage-draft-section mortgage-dedicated-section">
        <div className="container">
          <div className="mortgage-dedicated-heading">
            <span className="chip chip-gold section-eyebrow">Dedicated resources</span>
            <h2>Dedicated resources model</h2>
            <p>Specialists who work as part of your team, on the schedule that suits your volume.</p>
          </div>
          <div className="mortgage-dedicated-toggle">
            <button type="button">Part-time</button>
            <button type="button">Full-time</button>
          </div>
          <div className="roles">
            <div className="role">
              <h3>Loan Processing Specialist</h3>
            </div>
            <div className="role">
              <h3>Credit Analyst (Research Analyst)</h3>
            </div>
            <div className="role">
              <h3>Post-Settlement Specialist</h3>
            </div>
            <div className="role">
              <h3>Mortgage Sales Support Specialist</h3>
            </div>
          </div>
        </div>
      </section>


      <section className="asset-finance-unique-cta mortgage-marketing-cta">
        <div className="container asset-finance-unique-cta-inner">
          <Image className="asset-finance-unique-cta-image" src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=2200&q=85" alt="Finance professionals collaborating" fill sizes="100vw" />
          <div className="asset-finance-unique-cta-content">
            <h2>Explore our digital marketing services, custom-tailored for mortgage brokers</h2>
            <p>Processing keeps your pipeline moving. Marketing keeps it full.</p>
            <Link href="/digital-marketing" className="asset-finance-unique-cta-link">Explore Marketing Support <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      {/* Why us */}
      {/* <section className="section mortgage-why-section" style={{ background: 'var(--navy)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="chip chip-white section-eyebrow">Why Us</span>
            <h2 className="section-title section-title--white">Why Choose Proowrx for Mortgage Outsourcing</h2>
          </div>
          <div className="why-grid">
            {whyUs.map((w, i) => (
              <div key={i} className="why-tile">
                <div className="why-tile-header">
                  <span className="why-tile-icon" aria-hidden="true">{w.icon}</span>
                  <h4>{w.title}</h4>
                </div>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>

          <section className="section mortgage-comparison-section" ref={r4}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="chip chip-violet section-eyebrow">Comparison</span>
            <h2 className="section-title">PPA vs Hiring In-House</h2>
          </div>
          <div className="ppa-table-wrap">
            <table className="ppa-table">
              <thead>
                <tr>
                  <th></th>
                  <th><span className="ppa-th-label">Research</span></th>
                  <th><span className="ppa-th-label">Intake</span></th>
                  <th><span className="ppa-th-label">Processing</span></th>
                  <th><span className="ppa-th-label">Valuation</span></th>
                  <th><span className="ppa-th-label">Tracking</span></th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, i) => (
                  <tr key={i}>
                    <td className="ppa-row-label">{row.label}</td>
                    <td><CmpCell val={row.Research} /></td>
                    <td><CmpCell val={row.Intake} /></td>
                    <td><CmpCell val={row.Processing} /></td>
                    <td><CmpCell val={row.Valuation} /></td>
                    <td><CmpCell val={row.Tracking} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section> */}

          {/* <div className="partner-strip">
            <div className="partner-strip-item">
              <h4>Focus on Your Clients</h4>
              <p>Free up time to deliver exceptional service and grow your relationships.</p>
            </div>
            <div className="partner-strip-divider" />
            <div className="partner-strip-item">
              <h4>Differentiate Your Practice</h4>
              <p>Offer faster turnaround and smoother experience than the competition.</p>
            </div>
            <div className="partner-strip-divider" />
            <div className="partner-strip-item">
              <h4>Scale Efficiently</h4>
              <p>Grow without adding staff overhead — flexible support at every stage.</p>
            </div>
          </div> */}

          {/* <div style={{ textAlign: 'center', marginTop: 48 }}>
            <a href="https://calendly.com/proowrx/30min" target="_blank" rel="noreferrer" className="btn btn-gold">
              Book a Discovery Call <ArrowRight size={15} />
            </a>
          </div> */}
        {/* </div>
      </section> */}

      
      <ServiceFaq
        variant="mortgage"
        title="Mortgage outsourcing questions"
        intro="Quick answers for brokers considering processing or dedicated back-office support."
      />
    </div>
  );
}

function CmpCell({ val, dim }) {
  if (val === true) return (
    <div className="ppa-cell-yes"><CheckCircle size={16} /></div>
  );
  if (val === false) return (
    <div className={`ppa-cell-no ${dim ? 'ppa-cell-no--dim' : ''}`}><XIcon size={14} /></div>
  );
  return <div className="ppa-cell-maybe">?</div>;
}
