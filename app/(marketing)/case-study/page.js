import { pageMetadata } from '@/lib/seo';
import { serverCaseStudies } from '@/lib/serverApi';
import CaseStudyCards from '@/components/shared/CaseStudyCards';
import CtaBanner from '@/components/shared/CtaBanner';
import '../GrowthPages.css';

export const dynamic = 'force-dynamic';
export function generateMetadata() { return pageMetadata('/case-study', { title: 'Client Case Studies', description: 'Explore the challenges, solutions and outcomes behind Proowrx client projects.', alternates: { canonical: '/case-study' } }); }
export default async function CaseStudiesPage() {
  const items = await serverCaseStudies.getAll();
  return <main className="growth-page"><section className="growth-hero"><div className="container"><span className="growth-eyebrow">Case Studies</span><h1>Real Client Case Studies in Business Growth and Freedom</h1><p>Explore how industry-leading financial services leverage Proowrx&amp;s outsourcing services to eliminate operational bottlenecks, scale loan volumes, and achieve ultimate work-life balance. </p></div></section><section className="growth-section"><div className="container">{items.length ? <CaseStudyCards items={items} /> : <p>New client stories will be published here soon.</p>}</div></section><CtaBanner /></main>;
}
