import PageInsights from '@/components/shared/PageInsights';
import { pageMetadata } from '@/lib/seo';
import ServicesClient from './ServicesClient';

const metadata = {
  title: 'Our Services',
  description: 'Expert back-office outsourcing for Australian mortgage brokers and accountants — mortgage processing, accounting, virtual assistants, and pay-per-application support.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Outsourcing, Anytime of the Day | Proowrx Services',
    description: 'Explore mortgage processing, accounting, virtual assistant, and pay-per-application services built for Australian financial professionals.',
    url: '/services',
  },
};

function Page() {
  return <ServicesClient />;
}

export function generateMetadata() { return pageMetadata('/services', metadata); }
export const dynamic = 'force-dynamic';

export default function PageWithInsights() { return <><Page /><PageInsights path="/services" /></>; }
