import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import CtaBanner from '@/components/shared/CtaBanner';
import '../GrowthPages.css';

export const metadata = {
  title: 'Outsourcing Case Studies',
  description: 'Explore practical case studies showing how Proowrx supports mortgage, accounting, asset finance and digital marketing teams with dependable back-office capacity.',
  keywords: [
    'outsourcing case studies Australia',
    'mortgage processing case study',
    'accounting outsourcing case study',
    'asset finance processing support',
    'digital marketing outsourcing',
  ],
  alternates: { canonical: '/case-study' },
  openGraph: {
    title: 'Client Case Studies | Proowrx',
    description: 'See how structured remote support helps finance businesses improve capacity, consistency and turnaround.',
    url: '/case-study',
  },
};

const caseStudies = [
  {
    category: 'Mortgage',
    title: 'Creating dependable processing capacity for a growing brokerage',
    challenge: 'The broker team needed more time for client conversations while application administration and lender follow-ups continued to increase.',
    approach: 'A documented processing workflow was established around the brokerage’s CRM, compliance checklist and lender submission process.',
    outcome: 'The local team gained consistent back-office support and clearer visibility across files while retaining ownership of client advice and relationships.',
  },
  {
    category: 'Accounting',
    title: 'Building a repeatable workflow around recurring accounting tasks',
    challenge: 'Routine bookkeeping and preparation work was reducing the time available for review, advisory services and client communication.',
    approach: 'Recurring tasks were mapped into clear workpapers, review stages and handover points aligned with the firm’s existing accounting software.',
    outcome: 'The firm created a more predictable delivery rhythm and gave senior team members more space to focus on review and higher-value work.',
  },
  {
    category: 'Asset Finance',
    title: 'Keeping applications moving through document and lender follow-up',
    challenge: 'Frequent document requests and progress checks were creating administrative bottlenecks across active asset finance applications.',
    approach: 'Proowrx support was organised around document collection, CRM updates, lender conditions and milestone reporting.',
    outcome: 'Brokers received clearer file updates and additional capacity to focus on customers, referral partners and new applications.',
  },
  {
    category: 'Digital Marketing',
    title: 'Turning an approved strategy into consistent weekly execution',
    challenge: 'Marketing activity was irregular because client-facing employees had limited time to prepare content, campaigns and performance reports.',
    approach: 'A repeatable content calendar, approval process and reporting workflow was created around the business’s brand and compliance requirements.',
    outcome: 'The business established a steadier marketing rhythm without diverting advisers from customer-facing responsibilities.',
  },
];

const principles = [
  'Workflows shaped around the client’s current systems',
  'Clear task ownership and documented handover points',
  'Controlled access to information and software',
  'Regular progress reporting and quality review',
];

export default function CaseStudyPage() {
  return (
    <main className="growth-page">
      <section className="growth-hero">
        <div className="container">
          <span className="growth-eyebrow">Case Studies</span>
          <h1>How structured support works in practice</h1>
          <p>
            Explore practical examples of how finance businesses use Proowrx to add capacity,
            strengthen workflows and keep local teams focused on clients.
          </p>
          {/* <div className="growth-actions">
            <a className="btn btn-gold" href="https://calendly.com/proowrx/30min" target="_blank" rel="noreferrer">
              Discuss Your Workflow <ArrowRight size={15} />
            </a>
            <Link className="btn btn-ghost" href="/services">Explore Services</Link>
          </div> */}
        </div>
      </section>

      <section className="growth-section">
        <div className="container">
          <div className="growth-head">
            <span className="chip chip-gold">Operational Examples</span>
            <h2>Support designed around real workflow challenges</h2>
            <p>Each engagement begins with the process, systems and outcomes that matter to the client.</p>
          </div>
          <div className="growth-grid">
            {caseStudies.map(item => (
              <article className="growth-card" key={item.title}>
                <span className="growth-model-label">{item.category}</span>
                <h3>{item.title}</h3>
                <p><strong>Challenge:</strong> {item.challenge}</p>
                <p><strong>Approach:</strong> {item.approach}</p>
                <p><strong>Outcome:</strong> {item.outcome}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="growth-section alt">
        <div className="container growth-split">
          <div className="growth-copy">
            <span className="chip chip-teal">A Practical Partnership</span>
            <h2>The same foundations support every engagement</h2>
            <p>
              The exact tasks vary, but successful outsourcing depends on clear workflows,
              secure access, accountable communication and ongoing quality oversight.
            </p>
          </div>
          <ul className="growth-list">
            {principles.map(principle => (
              <li key={principle}>{principle}</li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBanner />
    </main>
  );
}
