import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import CtaBanner from '@/components/shared/CtaBanner';
import '../GrowthPages.css';

const metadata = {
  title: 'Outsourcing Pricing & Service Models',
  description: 'Compare dedicated, part-time and full-time outsourcing service models for Australian mortgage, accounting and finance businesses. Build a flexible Proowrx team around your workflow.',
  keywords: ['outsourcing pricing Australia','dedicated offshore staff','part time virtual assistant pricing','full time outsourcing team','mortgage processing pricing'],
  alternates: { canonical: '/pricing' },
  openGraph: { title: 'Dedicated, Part-Time & Full-Time Service Models | Proowrx', description: 'Choose a flexible outsourcing model designed around your workload, systems and growth plans.', url: '/pricing' },
};

const models = [
  { label:'Flexible coverage', title:'Part-Time Resource', time:'4 hours per day', text:'Ideal for predictable administration, follow-ups and processing support without a full-time commitment.', items:['Dedicated trained resource','Defined daily working window','Direct workflow integration','Easy upgrade as volumes grow'] },
  { label:'Most popular', title:'Full-Time Resource', time:'8 hours per day', text:'A dedicated professional who works as an embedded extension of your Australian team.', items:['Exclusive resource allocation','Daily reporting and oversight','Process documentation','Backup and quality support'], featured:true },
  { label:'Built for scale', title:'Dedicated Team', time:'Custom team capacity', text:'A managed team for businesses with multiple workflows, higher volumes or specialist requirements.', items:['Multiple complementary roles','Team lead and quality checks','Custom service-level agreements','Scalable capacity planning'] },
];
const faqs=[['Do you publish fixed prices?','Pricing depends on role complexity, experience, hours, systems and expected volumes. We provide a tailored proposal after a short discovery call.'],['Can I move between service models?','Yes. You can begin part-time and move to full-time or a dedicated team as workload and confidence grow.'],['What is included in the service fee?','Recruitment, onboarding support, operational management, secure infrastructure and ongoing quality oversight are built into your proposal.']];

export default function PricingPage(){return <main className="growth-page">
  <section className="growth-hero"><div className="container"><span className="growth-eyebrow">Pricing & Service Models</span><h1>Flexible support built around your workload</h1><p>Choose part-time, full-time or a dedicated team. Every Proowrx engagement is shaped around your processes, software, service standards and growth targets.</p>
  {/* <div className="growth-actions"><a className="btn btn-gold" href="https://calendly.com/proowrx/30min" target="_blank" rel="noreferrer">Request Pricing <ArrowRight size={15}/></a><Link className="btn btn-ghost" href="/services">Explore Services</Link></div> */}
  </div></section>
  <section className="growth-section"><div className="container"><div className="growth-head"><span className="chip chip-gold">Choose Your Model</span><h2>Start at the right capacity</h2><p>Each model provides trained remote support with clear communication, secure systems and the flexibility to evolve.</p></div><div className="growth-grid">{models.map(m=><article className={`growth-card${m.featured?' featured':''}`} key={m.title}><span className="growth-model-label">{m.label}</span><h3>{m.title}</h3><div className="growth-model-time">{m.time}</div><p>{m.text}</p><ul className="growth-list">{m.items.map(i=><li key={i}>{i}</li>)}</ul></article>)}</div></div></section>
  <section className="growth-section alt"><div className="container growth-split"><div className="growth-copy"><span className="chip chip-teal">Transparent Scoping</span><h2>Pricing matched to the work—not a generic package</h2><p>We assess task complexity, turnaround expectations, software access, reporting needs and monthly volume before recommending a model. This avoids paying for capacity you do not need and gives your team a clear path to scale.</p></div><div className="growth-metrics"><div className="growth-metric"><strong>4 hrs</strong><span>Part-time daily coverage</span></div><div className="growth-metric"><strong>8 hrs</strong><span>Full-time daily coverage</span></div><div className="growth-metric"><strong>48 hrs</strong><span>Typical onboarding readiness</span></div><div className="growth-metric"><strong>Custom</strong><span>Dedicated team design</span></div></div></div></section>
  <section className="growth-section"><div className="container"><div className="growth-head"><h2>Pricing questions</h2></div><div className="growth-faq">{faqs.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></div></section><CtaBanner/>
</main>}

export function generateMetadata() { return pageMetadata('/pricing', metadata); }
export const dynamic = 'force-dynamic';
