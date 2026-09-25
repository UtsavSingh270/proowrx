import { pageMetadata } from '@/lib/seo';
import { serverCaseStudies } from '@/lib/serverApi';
import CaseStudyCards from '@/components/shared/CaseStudyCards';
import CtaBanner from '@/components/shared/CtaBanner';
import '../GrowthPages.css';

export const dynamic = 'force-dynamic';
export function generateMetadata() { return pageMetadata('/case-study', { title: 'Client Case Studies', description: 'Explore the challenges, solutions and outcomes behind Proowrx client projects.', alternates: { canonical: '/case-study' } }); }
export default async function CaseStudiesPage() {
  const items = await serverCaseStudies.getAll();
  return <main className="growth-page"><section className="growth-hero"><div className="container"><span className="growth-eyebrow">Case Studies</span><h1>See the work. Understand the impact.</h1><p>Explore the challenges, approaches and outcomes behind our client projects.</p></div></section><section className="growth-section"><div className="container">{items.length ? <CaseStudyCards items={items} /> : <p>New client stories will be published here soon.</p>}</div></section><CtaBanner /></main>;
}
