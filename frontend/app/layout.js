import { Inter, Noto_Sans } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import ThemeProvider from '../components/ThemeProvider';
import '../styles/globals.css';
import '../styles/dark-mode.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-noto-sans',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://proowrx.com';
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: '%s | Proowrx',
    default: 'Proowrx | Knowledge Process Outsourcing for Mortgage Brokers & Accountants',
  },
  description: 'Proowrx is an Australian-owned KPO providing expert back-office support — mortgage processing, accounting, and virtual assistant services — for Australian mortgage brokers and accounting firms.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    siteName: 'Proowrx',
    type: 'website',
    locale: 'en_AU',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Proowrx',
  url: SITE_URL,
  logo: 'https://proowrx.com/wp-content/uploads/2022/05/Proowrx_Final_Logo-removebg-previewnew-1.png',
  sameAs: [
    'https://www.facebook.com/proowrx/',
    'https://www.instagram.com/proowrx/',
    'https://twitter.com/proowrx/',
    'https://www.linkedin.com/company/proowrx/about/',
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+61-2-8834-1222',
      contactType: 'customer service',
      areaServed: 'AU',
      email: 'support@proowrx.com',
    },
    {
      '@type': 'ContactPoint',
      telephone: '+91-96104-11400',
      contactType: 'customer service',
      areaServed: 'IN',
      email: 'support@proowrx.com',
    },
  ],
  address: [
    {
      '@type': 'PostalAddress',
      streetAddress: 'Suite 215, East Wing, 33 Lexington Drive, Bella Vista',
      addressLocality: 'Sydney',
      addressRegion: 'NSW',
      postalCode: '2153',
      addressCountry: 'AU',
    },
    {
      '@type': 'PostalAddress',
      streetAddress: '1st Floor, Patrika Building, 5 E, Jhalana Institutional Area, JLN Marg',
      addressLocality: 'Jaipur',
      postalCode: '302004',
      addressCountry: 'IN',
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSans.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      </body>
    </html>
  );
}
