import PageInsights from '@/components/shared/PageInsights';
import { pageMetadata } from '@/lib/seo';
import {
  ArrowRight,
  ChartNoAxesCombined,
  Check,
  Mail,
  Palette,
  PenLine,
  SearchCheck,
  Smartphone,
} from 'lucide-react';
import CtaBanner from '@/components/shared/CtaBanner';
import ServiceFaq from '@/components/shared/ServiceFaq';
import '../GrowthPages.css';

const metadata ={title:'Digital Marketing Support Services',description:'Outsourced digital marketing support for Australian mortgage brokers, accountants and finance businesses—content, social media, SEO, email campaigns and reporting.',keywords:['digital marketing outsourcing Australia','mortgage broker marketing support','accounting firm digital marketing','SEO content support','social media virtual assistant'],alternates:{canonical:'/digital-marketing'},openGraph:{title:'Digital Marketing Support for Finance Businesses | Proowrx',description:'Consistent, practical marketing execution for mortgage, accounting and finance brands.',url:'/digital-marketing'}};
const capabilities=[
  [<PenLine key="content" size={23} aria-hidden="true" />,'Content Production','Website copy, educational articles, newsletters and campaign content aligned with your brand.'],
  [<Smartphone key="social" size={23} aria-hidden="true" />,'Social Media Support','Content calendars, post preparation, scheduling and community-response workflows.'],
  [<SearchCheck key="seo" size={23} aria-hidden="true" />,'SEO Assistance','Keyword research, on-page optimisation, content briefs and performance-led improvements.'],
  [<Mail key="email" size={23} aria-hidden="true" />,'Email Campaigns','Newsletter production, audience segmentation and automated nurture-sequence support.'],
  [<Palette key="creative" size={23} aria-hidden="true" />,'Creative Coordination','Branded graphics, campaign assets and consistent visual content production.'],
  [<ChartNoAxesCombined key="reporting" size={23} aria-hidden="true" />,'Reporting & Insights','Clear monthly reporting across traffic, engagement, leads and content performance.'],
];
function DigitalMarketingPage(){return <main className="growth-page"><section className="growth-hero"><div className="container">
    <span className="growth-eyebrow">Digital Marketing Services</span>
    <h1>Consistent marketing without expanding your local team</h1>
    <p>Build a dependable marketing rhythm with trained remote support for content, social media, SEO, email campaigns and reporting—tailored to finance-sector businesses.</p>
    {/* <div className="growth-actions">
        <a className="btn btn-gold" href="https://calendly.com/proowrx/30min" target="_blank" rel="noreferrer">Book a Meeting <ArrowRight size={15}/></a></div> */}
        </div></section><section className="growth-section"><div className="container"><div className="growth-head"><span className="chip chip-gold">Marketing Execution</span><h2>The support needed to stay visible</h2><p>Turn your strategy into repeatable weekly action while your advisers and client-facing team stay focused on customers.</p></div><div className="growth-grid">{capabilities.map(([icon,title,text])=><article className="growth-card" key={title}><div className="growth-card-icon" aria-hidden="true">{icon}</div><h3>{title}</h3><p>{text}</p></article>)}</div></div></section><section className="growth-section alt"><div className="container growth-split"><div className="growth-copy"><span className="chip chip-teal">Your Brand, Your Process</span><h2>A remote marketing extension—not a disconnected supplier</h2><p>We work from your approved messaging, compliance process, brand guidelines and campaign plan. Tasks can be delivered through a dedicated part-time resource, a full-time marketing assistant or a broader specialist team.</p><ul className="growth-list growth-list--lucide"><li><Check size={16} aria-hidden="true" />Mortgage broker and accounting industry context</li><li><Check size={16} aria-hidden="true" />Documented approval and publishing workflows</li><li><Check size={16} aria-hidden="true" />Consistent brand and compliance checks</li><li><Check size={16} aria-hidden="true" />Flexible capacity as campaigns expand</li></ul></div><div className="growth-metrics"><div className="growth-metric"><strong>SEO</strong><span>Search-led content support</span></div><div className="growth-metric"><strong>Social</strong><span>Consistent channel activity</span></div><div className="growth-metric"><strong>Email</strong><span>Client nurture campaigns</span></div><div className="growth-metric"><strong>Reports</strong><span>Actionable performance insights</span></div></div></div></section><ServiceFaq variant="digitalMarketing" title="Digital marketing support questions" intro="What finance businesses commonly ask before outsourcing marketing execution."/><CtaBanner/></main>}

export function generateMetadata() { return pageMetadata('/digital-marketing', metadata); }
export const dynamic = 'force-dynamic';

export default function PageWithInsights() { return <><DigitalMarketingPage /><PageInsights path="/digital-marketing" /></>; }
