import Link from 'next/link';
import { ArrowUpRight, Download, FileChartColumn, Newspaper, ShieldCheck } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import CtaBanner from '@/components/shared/CtaBanner';
import './Resources.css';

const sections = [
  { href: '/data-security', title: 'Data Security', description: 'Data Security & Privacy at Proowrx', icon: ShieldCheck, detail: 'Learn how we protect your information and keep your operations secure.' },
  { href: '/case-study', title: 'Case Studies', description: 'Read case studies and success stories', icon: FileChartColumn, detail: 'Explore real client challenges, our approach, and the results delivered.' },
  { href: '/blog', title: 'Blogs', description: 'Read the latest news and insights', icon: Newspaper, detail: 'Find practical ideas on mortgage outsourcing, accounting, and business growth.' },
  { href: '/downloadable-resources', title: 'Downloadables', description: 'Download e-guides and resources', icon: Download, detail: 'Browse guides, checklists, and tools to support your next step.' },
];

export function generateMetadata() {
  return pageMetadata('/resources', {
    title: 'Resources',
    description: 'Explore Proowrx data security, client case studies, blogs, and downloadable guides in one place.',
    alternates: { canonical: '/resources' },
  });
}

export default function ResourcesPage() {
  return <main className="resources-hub">
    <div className="container resources-hub-content">
      <header className="resources-hub-heading">
        <span className="chip chip-gold">Resources</span>
        <h1>Knowledge for your next step.</h1>
        <p>Explore how we work, learn from client stories, and find practical resources for your business.</p>
      </header>
      <nav className="resources-hub-grid" aria-label="Explore our resources">
        {sections.map(({ href, title, description, detail, icon: Icon }) => <Link className="resources-hub-card" href={href} key={href}>
          <div className="resources-hub-card-heading">
            <span className="resources-hub-icon"><Icon size={28} strokeWidth={1.8} aria-hidden="true" /></span>
            <h2>{title}</h2>
            <ArrowUpRight className="resources-hub-arrow" size={21} aria-hidden="true" />
          </div>
          <h3>{description}</h3>
          <p>{detail}</p>
        </Link>)}
      </nav>
    </div>
    <CtaBanner />
  </main>;
}
