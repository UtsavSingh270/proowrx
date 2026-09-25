'use client';

import { usePathname } from 'next/navigation';
import CtaBanner from './CtaBanner';

const PAGES_WITH_OWN_CTA = new Set([
  '/',
  '/about',
  '/asset-finance',
  '/career',
  '/case-study',
  '/data-security',
  '/digital-marketing',
  '/faq',
  '/our-team',
  '/pricing',
  '/resources',
  '/testimonials',
]);

export default function MarketingCta() {
  const pathname = usePathname();
  const pageHasOwnCta = PAGES_WITH_OWN_CTA.has(pathname) || pathname.startsWith('/blog');

  return pageHasOwnCta ? null : <CtaBanner />;
}
