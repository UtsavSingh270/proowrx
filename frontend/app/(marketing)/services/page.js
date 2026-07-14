import ServicesClient from './ServicesClient';

export const metadata = {
  title: 'Our Services',
  description: 'Expert back-office outsourcing for Australian mortgage brokers and accountants — mortgage processing, accounting, virtual assistants, and pay-per-application support.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Outsourcing, Anytime of the Day | Proowrx Services',
    description: 'Explore mortgage processing, accounting, virtual assistant, and pay-per-application services built for Australian financial professionals.',
    url: '/services',
  },
};

export default function Page() {
  return <ServicesClient />;
}
