import Link from 'next/link';
import { serverCaseStudies } from '@/lib/serverApi';
import CaseStudyCards from './CaseStudyCards';
import './PageInsights.css';

export default async function PageCaseStudies({ path }) {
  const items = await serverCaseStudies.getForPage(path);
  if (!items.length) return null;

  return (
    <section className="page-insights" aria-labelledby="page-cases-title">
      <div className="container">
        <div className="page-insights-heading">
          <div>
            <span className="pill">Client stories</span>
            <h2 id="page-cases-title">Our work in practice</h2>
            <p>Explore the projects behind the results.</p>
          </div>
          <Link href="/case-study">All case studies →</Link>
        </div>
        <CaseStudyCards items={items} />
      </div>
    </section>
  );
}
