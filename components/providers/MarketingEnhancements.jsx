'use client';

import dynamic from 'next/dynamic';

const ContactPopup = dynamic(() => import('@/components/layout/ContactPopup'), { ssr: false });
const Chatbot = dynamic(() => import('@/components/feedback/Chatbot'), { ssr: false });
const AnalyticsTracker = dynamic(() => import('@/features/analytics/AnalyticsTracker'), { ssr: false });

export default function MarketingEnhancements() {
  return (
    <>
      <AnalyticsTracker />
      <ContactPopup />
      <Chatbot />
    </>
  );
}
