import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ContactPopup from '@/components/layout/ContactPopup';
import Chatbot from '@/components/feedback/Chatbot';
import SiteEffects from '@/components/providers/SiteEffects';
import AnalyticsTracker from '@/features/analytics/AnalyticsTracker';
import CookieConsent from '@/components/feedback/CookieConsent';
import MarketingCta from '@/components/shared/MarketingCta';
import './marketing-theme.css';

export default function MarketingLayout({ children }) {
  return (
    <div className="marketing-site">
      <SiteEffects />
      <AnalyticsTracker />
      <CookieConsent />
      <ContactPopup />
      <Chatbot />
      <Navbar />
      {children}
      <MarketingCta />
      <Footer />
    </div>
  );
}
