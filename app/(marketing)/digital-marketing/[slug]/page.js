import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import CtaBanner from '@/components/shared/CtaBanner';
import { pageMetadata } from '@/lib/seo';
import '../../GrowthPages.css';
import '../DigitalMarketing.css';

const services = {
  'paid-advertising': ['Paid Advertising', 'Reach the right audience at the right time with targeted campaigns designed to generate traffic, enquiries, and qualified leads.'],
  seo: ['SEO Services', 'Improve search visibility and attract customers actively looking for your products or services with practical, result-focused SEO.'],
  'email-marketing': ['Email Marketing', 'Stay connected with prospects and customers through targeted campaigns that nurture relationships and drive action.'],
  'conversion-rate-optimization': ['Conversion Rate Optimization', 'Turn more website visitors into enquiries by identifying conversion opportunities across key digital touchpoints.'],
  'social-media-marketing': ['Social Media Marketing', 'Build an active, engaging social presence through consistent content, strategic planning, and audience engagement.'],
  'online-reputation-management': ['Online Reputation Management', 'Maintain a credible, positive, and consistent presence across the digital platforms your audience trusts.'],
  'content-writing-services': ['Content Writing Services', 'Create clear, engaging, audience-focused content for websites, blogs, social media, emails, and marketing materials.'],
  'content-marketing-services': ['Content Marketing Services', 'Put content to work with planning and distribution designed to attract your audience and build authority.'],
  'website-development': ['Website Development', 'Create professional, responsive, user-friendly websites designed around your brand and customer journey.'],
  'website-maintenance-management': ['Website Maintenance & Management', 'Keep your website updated, secure, functional, and performing with ongoing technical support.'],
  'podcast-marketing': ['Podcast Marketing', 'Build awareness and audience engagement around your podcast with strategic promotion and content support.'],
  'webinar-marketing': ['Webinar Marketing', 'Attract the right audience with promotional campaigns designed to increase registrations and engagement.'],
  'graphics-designing': ['Graphics Designing', 'Create professional, on-brand graphics for social media, campaigns, websites, presentations, and marketing materials.'],
  'video-editing-services': ['Video Editing Services', 'Transform raw footage and ideas into polished videos for campaigns, webinars, podcasts, and digital channels.'],
};

export async function generateStaticParams() { return Object.keys(services).map(slug => ({ slug })); }
export async function generateMetadata({ params }) { const { slug } = await params; const item = services[slug]; return pageMetadata(`/digital-marketing/${slug}`, { title: `${item?.[0] || 'Digital Marketing'} | Proowrx`, description: item?.[1] || 'Digital marketing support from Proowrx.', alternates: { canonical: `/digital-marketing/${slug}` } }); }

export default async function DigitalMarketingService({ params }) { const { slug } = await params; const item = services[slug]; if (!item) return null; return <main className="growth-page digital-marketing-page"><section className="growth-hero"><div className="container"><Link className="growth-back-link" href="/digital-marketing"><ArrowLeft size={15}/> Digital Marketing Services</Link><span className="growth-eyebrow">Digital Marketing Service</span><h1>{item[0]}</h1><p>{item[1]}</p><Link className="btn btn-gold" href="/contact">Get Started <ArrowRight size={15}/></Link></div></section><section className="growth-section"><div className="container growth-split"><div className="growth-copy"><span className="chip chip-gold">How We Help</span><h2>Practical support built around your goals</h2><p>Proowrx combines experienced people, clear workflows, and reliable delivery so your marketing keeps moving without adding unnecessary overhead.</p><ul className="growth-list growth-list--lucide"><li><CheckCircle2 size={16}/>Industry-aware execution</li><li><CheckCircle2 size={16}/>Clear review and approval workflows</li><li><CheckCircle2 size={16}/>Flexible support that scales with demand</li><li><CheckCircle2 size={16}/>One coordinated team when you need more</li></ul></div><div className="growth-metrics"><div className="growth-metric"><strong>Plan</strong><span>Align activity to outcomes</span></div><div className="growth-metric"><strong>Create</strong><span>Produce clear, useful assets</span></div><div className="growth-metric"><strong>Launch</strong><span>Publish consistently</span></div><div className="growth-metric"><strong>Improve</strong><span>Learn from performance</span></div></div></div></section><CtaBanner/></main>; }
