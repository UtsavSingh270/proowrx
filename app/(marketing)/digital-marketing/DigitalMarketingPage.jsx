'use client';
import Link from 'next/link';
import { ArrowRight, BarChart3, Brush, Code2, Mail, Megaphone, PenLine, SearchCheck, ShieldCheck, Sparkles, Target, Users, Video, Wrench } from 'lucide-react';
import CtaBanner from '@/components/shared/CtaBanner';
import ServiceFaq from '@/components/shared/ServiceFaq';
import './DigitalMarketing.css';
import ServiceBenefits from '@/components/shared/ServiceBenefits';

const groups = [
  ['Demand & Lead Generation', 'Attract the right audience, generate qualified enquiries and create more opportunities for your business.', Target, [['Paid Advertising','Reach potential customers through targeted advertising campaigns designed around your audience, business objectives and budget.','paid-advertising',Megaphone],['SEO Services','Improve your website\'s search visibility, attract relevant organic traffic and help potential customers find your business online.','seo',SearchCheck],['Email Marketing','Stay connected with your audience through targeted email campaigns that nurture prospects, build relationships, and encourage action.','email-marketing',Mail],['Conversion Rate Optimization','Identify what\'s stopping visitors from taking action and improve your website or landing page experience to generate more enquiries and conversions.','conversion-rate-optimization',BarChart3]]],
  ['Social & Growth', 'Build a consistent social presence, strengthen audience engagement and establish trust across digital platforms.', Users, [['Social Media Marketing','Build a consistent social media presence through strategic content, social channel management, and audience engagement.','social-media-marketing',Users],['Online Reputation Management','Monitor your online reputation, manage customer feedback, increase positive sentiment, and strengthen the trust potential customers place in your business.','online-reputation-management',ShieldCheck]]],
  ['Content Services', 'Communicate your expertise, share valuable insights and create content that connects with your target audience.', PenLine, [['Content Writing Services','Get tailored content as per your brand values and target audience for your website, blogs, social media, and other marketing channels.','content-writing-services',PenLine],['Content Marketing Services','Plan, create, and distribute relevant content that attracts your target audience and keeps your brand connected with them.','content-marketing-services',Sparkles]]],
  ['Website Development & Support', 'Keep your website functional, user-friendly and up to date as your business grows.', Code2, [['Website Development','Build responsive, user-friendly websites designed around your business requirements and brand positioning.','website-development',Code2],['Website Maintenance & Management','Keep your website updated, secure and running smoothly with ongoing maintenance and technical support.','website-maintenance-management',Wrench]]],
  ['Digital Events', 'Promote your webinars and podcasts to reach relevant audiences, increase registrations and build engagement.', Video, [['Podcast Marketing','Build awareness around your podcast through pre & post event promotion, audience outreach, and consistent funnel building.','podcast-marketing',Video],['Webinar Marketing','Promote your webinars through targeted campaigns that increase visibility, attract relevant registrations, and encourage attendance.','webinar-marketing',Megaphone]]],
  ['Creative Design', 'Maintain a consistent brand identity with professional graphics and engaging visual content.', Brush, [['Graphic Designing','Create professional, on-brand graphics for social media, digital campaigns, presentations, and other sales & marketing materials.','graphics-designing',Brush],['Video Editing Services','Turn raw footage into polished, engaging videos for social media, promotional campaigns, and digital platforms.','video-editing-services',Video]]],
];

export default function DigitalMarketingPage() {
  return <main className="growth-page digital-marketing-page">
    <section className="growth-hero">
      <div className="container">
        <span className="growth-eyebrow">Digital Marketing Services</span>
        <h1>Your Business Needs Marketing Support That Grows It Smartly. We Provide It.</h1>
        <p>Build a stronger online presence, reach the right audience, and turn marketing efforts into business growth. Proowrx provides end-to-end digital marketing support to help your business stay visible, attract potential customers, and grow consistently.</p>
        <Link className="btn btn-gold" href="/contact">Get Started Now <ArrowRight size={15}/></Link>
      </div>
    </section>

    <section className="growth-section">
      <div className="container">
        <div className="growth-head">
          <span className="chip chip-gold">Everything You Need to Grow Online</span>
          <h2>Digital Marketing Support Your Business Has Been Missing </h2>
          <p>Build your business&apos;s brand authority with the smart execution support you need, without the overhead of managing a large in-house marketing team.</p>
        </div>
      <div className="growth-grid">{groups.map(([title,intro,GroupIcon,items])=><article className="growth-card" key={title}>
        <div className="growth-card-header">
          <div className="growth-card-icon">
            <GroupIcon size={22}/>
          </div>
          <h3>{title}</h3>
        </div>
        <p>{intro}</p>
        {/* <Link className="growth-inline-link" href={`/digital-marketing/${items[0][2]}`}>Explore services <ArrowRight size={14}/></Link> */}
      </article>)}</div>
      </div>
    </section>

    <section className="growth-section alt">
      <div className="container"><div className="growth-head">
        <span className="chip chip-teal">Our Suite of Services</span>
        <h2>Digital Marketing Services for Every Stage of Growth</h2>
        <p>Whether you want to generate more enquiries, strengthen your social & online presence, or improve how your brand communicates, we have a full suite of services for your business growth.</p>
      </div>
      {groups.map(([title,intro,,items])=>
      <div className="growth-service-group" key={title}>
        <div className="growth-service-group-head">
          <h3>{title}</h3>
          <p>{intro}</p>
        </div>
      <div className="growth-grid">{items.map(([name,text,slug,Icon])=>
        <Link className="growth-card" href={`/digital-marketing/${slug}`} key={slug}>
          <div className="growth-card-header">
            <div className="growth-card-icon">
              <Icon size={22}/>
            </div>
            <h3>{name}</h3>
          </div>
          <p>{text}</p>
          {/* <span className="growth-inline-link">View service <ArrowRight size={14}/>
          </span> */}
        </Link>)}
      </div>
      </div>)}
      </div>
    </section>

    <section className="growth-section">
      <div className="container growth-split">
        <div className="growth-copy">
          <span className="chip chip-gold">One Team. Multiple Capabilities.</span>
          <h2>One Marketing Partner. Endless Growth Opportunities. </h2>
          <p>Managing different marketing activities across multiple vendors can slow things down and make it difficult to maintain consistency. Proowrx brings strategy, creative development, execution and ongoing optimization together under one team. Whether you need support with a single service or a complete digital marketing function, we build an approach around your business requirements.</p>
          <ul className="growth-list growth-list--lucide">
            <li><ShieldCheck size={16}/>Industry-focused understanding</li>
            <li><ShieldCheck size={16}/>Clear communication and approvals</li>
            <li><ShieldCheck size={16}/>Flexible outsourcing model</li>
            <li><ShieldCheck size={16}/>Coordinated execution across channels</li>
          </ul>
        </div>
      </div>
    </section>
    <ServiceFaq variant="digitalMarketing" title="Common Questions About Our Marketing Service" intro="Understand how our digital marketing services work, what you can outsource, and how we fit into your existing business operations."/>
    <CtaBanner/>
  </main>
}
