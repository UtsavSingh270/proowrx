import AboutClient from './AboutClient';
import { serverTeamMembers } from '../../../lib/serverApi';

export const metadata = {
  title: 'About Us',
  description: 'Proowrx is an Australian-owned KPO operating from Jaipur, India, built for mortgage brokers and accountants who want to grow without hiring more staff. Meet our team and our mission.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: "Don't Be Same, Be Better | About Proowrx",
    description: 'An Australian-owned KPO operating from India, specialising in mortgage processing and accounting back-office support since 2021.',
    url: '/about',
  },
};

export const revalidate = 3600;

export default async function Page() {
  const members = await serverTeamMembers.getAll().catch(() => []);
  return <AboutClient initialMembers={members || []} />;
}
