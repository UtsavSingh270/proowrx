import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SiteEffects from '@/components/providers/SiteEffects';
import MarketingEnhancements from '@/components/providers/MarketingEnhancements';
import MarketingCta from '@/components/shared/MarketingCta';
import './marketing-theme.css';

export default function MarketingLayout({ children }) {
  return (
    <div className="marketing-site">
      <SiteEffects />
      <MarketingEnhancements />
      <Navbar />
      {children}
      <MarketingCta />
      <Footer />
    </div>
  );
}
