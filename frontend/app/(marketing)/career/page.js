import CareerClient from './CareerClient';
import { serverJobs } from '../../../lib/serverApi';

export const metadata = {
  title: 'Careers',
  description: 'Join a growing KPO team redefining back-office support for Australian mortgage brokers and accountants. Current openings in Jaipur, India — apply today.',
  alternates: { canonical: '/career' },
  openGraph: {
    title: 'Build Your Career with Purpose | Proowrx Careers',
    description: 'We hire for attitude and train for skill. Explore current openings at Proowrx.',
    url: '/career',
  },
};

export const revalidate = 3600;

export default async function Page() {
  const jobs = await serverJobs.getActive().catch(() => []);

  const jobPostingsJsonLd = (jobs || []).map(job => ({
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description || job.title,
    datePosted: job.createdAt,
    employmentType: (job.type || 'FULL_TIME').toUpperCase().replace(/[-\s]/g, '_'),
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Proowrx',
      sameAs: 'https://proowrx.com',
    },
    jobLocation: {
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressLocality: job.location || 'Jaipur', addressCountry: 'IN' },
    },
  }));

  return (
    <>
      {jobPostingsJsonLd.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      <CareerClient initialJobs={jobs || []} />
    </>
  );
}
