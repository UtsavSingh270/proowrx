import ContactClient from './ContactClient';

export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Proowrx — offices in Jaipur, India and Sydney, Australia. Send a message, book a 30-minute discovery call, or schedule a meeting directly with our leadership team.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: "Let's Start a Conversation | Contact Proowrx",
    description: 'Reach our Jaipur and Sydney offices, or book a meeting directly with our team.',
    url: '/contact',
  },
};

export default function Page() {
  return <ContactClient />;
}
