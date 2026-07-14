import VirtualAssistantClient from './VirtualAssistantClient';

export const metadata = {
  title: 'Virtual Assistant Services',
  description: 'A dedicated Proowrx Virtual Assistant works as a seamless extension of your brokerage — handling admin, CRM management, follow-ups, and paperwork so you can focus on clients.',
  alternates: { canonical: '/virtual-assistant' },
  openGraph: {
    title: 'Your Dedicated Team Member | Proowrx Virtual Assistant',
    description: 'Dedicated remote staff for admin, CRM management, and client follow-ups — fully integrated into your Australian brokerage.',
    url: '/virtual-assistant',
  },
};

export default function Page() {
  return <VirtualAssistantClient />;
}
