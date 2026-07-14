import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ContactPopup from '../../components/ContactPopup';
import Chatbot from '../../components/Chatbot';
import SiteEffects from '../../components/SiteEffects';

export default function MarketingLayout({ children }) {
  return (
    <>
      <SiteEffects />
      <ContactPopup />
      <Chatbot />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
