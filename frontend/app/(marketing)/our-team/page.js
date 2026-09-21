import OurTeamClient from './OurTeamClient';
import { serverTeamMembers, serverWorkLife } from '@/lib/serverApi';

export const metadata = {
  title: 'Our Team',
  description: 'Meet the leadership team behind Proowrx — experienced professionals dedicated to helping Australian mortgage brokers and accountants grow smarter.',
  alternates: { canonical: '/our-team' },
  openGraph: {
    title: 'The People Behind Proowrx | Our Team',
    description: 'A powerhouse leadership team striving to make Proowrx the first-choice outsourcing partner for Australian financial professionals.',
    url: '/our-team',
  },
};

export const revalidate = 3600;

export default async function Page() {
  const [members, cultureItems] = await Promise.all([
    serverTeamMembers.getAll().catch(() => []),
    serverWorkLife.getAll().catch(() => []),
  ]);
  return <OurTeamClient initialMembers={members || []} initialCultureItems={cultureItems || []} />;
}
