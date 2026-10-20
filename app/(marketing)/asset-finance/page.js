import PageInsights from '@/components/shared/PageInsights';
import Image from 'next/image';
import { pageMetadata } from '@/lib/seo';
import {
  ArrowRight,
  Check,
  CircleCheckBig,
  CarFront,
  BriefcaseBusiness,
  Building2,
  Cog,
  Headphones,
  MessagesSquare,
  Database,
  FileText,
  Network,
  ShieldCheck,
} from 'lucide-react';
import CtaBanner from '@/components/shared/CtaBanner';
import Link from 'next/link';
import ServiceFaq from '@/components/shared/ServiceFaq';
import '../GrowthPages.css';

const metadata ={title:'Asset Finance Processing Support',description:'Outsourced asset finance processing support for Australian brokers, including document collection, CRM updates, lender packaging, compliance checks and settlement follow-up.',keywords:['asset finance outsourcing Australia','asset finance loan processing','broker support services','equipment finance processing','car finance administration'],alternates:{canonical:'/asset-finance'},openGraph:{title:'Asset Finance Processing Support for Australian Brokers | Proowrx',description:'Reliable back-office support from enquiry and document collection through submission and settlement.',url:'/asset-finance'}};
const serviceGroups = [
  { title: 'End-to-End Loan Processing', icon: <FileText size={23} aria-hidden="true" />, items: ['Data entry and application setup', 'Credit checks and credit policy checks', 'Client document collection and verification', 'Income verification and bank statement checks', 'Asset valuation coordination', 'Lender portal submissions', 'Settlement coordination'] },
  { title: 'Customer Relationship Management (CRM)', icon: <Database size={23} aria-hidden="true" />, items: ['CRM data updates and pipeline tracking', 'Daily status tracking and milestone updates', 'Automated and manual follow-up reminders', 'Client communications management'] },
  { title: 'Sales Support', icon: <CarFront size={23} aria-hidden="true" />, items: ['Inbound and outbound sales administration', 'Preparing quotations and proposal documents', 'Generating repayment schedules', 'Comparing lender products and policy requirements', 'Scheduling client appointments', 'Supporting up-sell and cross-sell opportunities'] },
  { title: 'Customer Service Support', icon: <Headphones size={23} aria-hidden="true" />, items: ['Real-time loan status updates', 'Document collection follow-ups', 'Appointment scheduling', 'Settlement coordination with lenders and solicitors', 'Customer onboarding', 'Post-settlement support'] },
  { title: 'Compliance Support', icon: <ShieldCheck size={23} aria-hidden="true" />, items: ['Know Your Customer (KYC) verification', 'Anti-Money Laundering (AML) checks', 'Comprehensive file and document audits', 'Compliance checklists and aggregator standard alignment', 'Privacy documentation management', 'Internal quality assurance reviews'] },
  { title: 'Community & Communication Management', icon: <MessagesSquare size={23} aria-hidden="true" />, items: ['Inbox monitoring and email response management', 'Social media listening and monitoring', 'Online audience engagement', 'Feedback and escalation management'] },
];
const valueItems = [
  ['Serve More Loans with Less Headcount', 'Expand your asset financing without increasing fixed operational costs.'],
  ['Improve Settlement Rates', 'Fast-track files with accurate pre-submission checks and daily tracking.'],
  ['Reduce Turnaround Times', 'Eliminate paperwork bottlenecks and clear conditional delays swiftly.'],
  ['Increase Customer Retention', 'Deliver faster outcomes and consistent communication to your clients.'],
  ['Lower Operating Costs', 'Save up to 50–60% compared to local hiring expenses.'],
  ['Enhance Compliance', 'Maintain strict alignment with aggregator rules and lender policies.'],
];
function AssetFinancePage(){
  return <main className="growth-page">
    <section className="growth-hero">
      <div className="container">
        <span className="growth-eyebrow">Asset Finance Services</span>
        <h1>Asset Finance Outsourcing Service </h1>
        <p>Reliable processing support for automobile, equipment, and commercial asset financing, from initial document collection and CRM administration to lender follow-up and settlement.</p>
        {/* <div className="growth-actions">
          <Link href="/contact" className="btn btn-gold">Book Your Discovery Call Today <ArrowRight size={15} />
          </Link>
        </div> */}
      </div>
    </section>
    <section className="growth-section asset-finance-flexible-section">
      <div className="container asset-finance-flexible-layout">
        <div className="asset-finance-flexible-content">
          {/* <span className="chip chip-gold">Flexible Asset Finance</span> */}
          <h2>Flexible Outsourcing Support for Asset Finance Brokers</h2>
          <p>As your asset finance brokerage grows, so does the work involved in managing applications, meeting lender requirements and keeping deals on track. With Proowrx, you can manage this growing workload without the added costs and responsibilities of hiring more staff. We support Australian brokers with loan processing, documentation and lender follow-ups across vehicle, equipment, machinery and commercial finance. Our flexible outsourcing options allow you to get the support you need, whether for daily operations or during periods of increased demand.</p>
          <div className="growth-actions"><Link href="/contact" className="btn btn-gold">Book Your Discovery Call Today <ArrowRight size={15} /></Link></div>
        </div>
        <div className="asset-finance-flexible-image">
          <Image src="https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1200&q=85" alt="Asset finance documents and calculator" width={1200} height={900} sizes="(max-width: 900px) 100vw, 50vw" />
        </div>
      </div>
    </section>
    <section className="growth-section asset-finance-intro-section">
      <div className="container">
        <div className="growth-head asset-finance-intro-head">
          <span className="chip chip-gold">Flexible Asset Finance</span>
          <h2>Our Suite of Services for Asset Finance Brokers</h2>
          <p className="asset-finance-intro-description">Our specialists manage the operational tasks behind every file, enabling your business to process higher deal volumes efficiently.</p>
        </div>
        <div className="growth-grid">
          {serviceGroups.map(({ icon, title, items }) => (
            <article className="growth-card" key={title}>
              <div className="growth-card-header">
                <div className="growth-card-icon" aria-hidden="true">
                  {icon}
                </div>
                <h3>{title}</h3>
              </div>
              <ul className="growth-list growth-list--lucide">{items.map(item => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}</ul>
            </article>
          ))}
        </div>
      </div>
    </section>
    <section className="growth-section alt">
      <div className="container growth-value-layout">
        <div className="growth-copy">
          <span className="chip chip-teal">HOW WE ADD VALUE</span>
          <h2>More Time. Better Network. More Business</h2>
          <div className="growth-grid">{valueItems.map(([title, text]) => <article className="growth-card" key={title}><div className="growth-card-header"><div className="growth-card-icon"><CircleCheckBig size={22} aria-hidden="true" /></div><h3>{title}</h3></div><p>{text}</p></article>)}</div>
        </div>
      </div>
    </section>
    <section className="asset-finance-unique-cta">
      <div className="container asset-finance-unique-cta-inner">
        <Image className="asset-finance-unique-cta-image" src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=2200&q=85" alt="Finance professionals collaborating" fill sizes="100vw" />
        <div className="asset-finance-unique-cta-content">
          <h2>Want to Get More Asset Finance Clients Without the Guesswork?</h2>
          <p>Proowrx combines asset finance expertise with performance marketing to attract high-value clients through a predictable, always-on lead pipeline.</p>
          <Link href="/digital-marketing" className="asset-finance-unique-cta-link">Explore Marketing Support <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
    <section className="growth-section alt asset-finance-support-section">
      <div className="container">
        <div className="growth-head"><span className="chip chip-teal">Asset Finance Brokers</span><h2>Whom We Support</h2></div>
        <div className="growth-grid four">
          <article className="growth-card"><div className="growth-card-header"><div className="growth-card-icon"><BriefcaseBusiness size={22} aria-hidden="true" /></div><h3>Independent Brokers</h3></div><p>Expand operational capacity without adding local overheads.</p></article>
          <article className="growth-card"><div className="growth-card-header"><div className="growth-card-icon"><Network size={22} aria-hidden="true" /></div><h3>Aggregator-Based Brokers</h3></div><p>Ensure complete compliance with aggregator standards and portal requirements.</p></article>
          <article className="growth-card"><div className="growth-card-header"><div className="growth-card-icon"><Building2 size={22} aria-hidden="true" /></div><h3>Commercial Finance Specialists</h3></div><p>Streamline complex commercial loans, chattel mortgages, and finance leases.</p></article>
          <article className="growth-card"><div className="growth-card-header"><div className="growth-card-icon"><Cog size={22} aria-hidden="true" /></div><h3>Equipment Finance Specialists</h3></div><p>Accelerate turnarounds for machinery, vehicle fleets, and specialized commercial assets.</p></article>
        </div>
      </div>
    </section>
    <ServiceFaq variant="assetFinance" title="Asset Finance Brokers Ask. We Answer." intro="" />
    <CtaBanner />
  </main>;
}

export function generateMetadata() {
  return pageMetadata('/asset-finance', metadata); }
export const dynamic = 'force-dynamic';

export default function PageWithInsights() {
  return <>
  <AssetFinancePage />
  <PageInsights path="/asset-finance" />
  </>;
}
