'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import './InfoPages.css';

const pages = {
  '/privacy-policy': {
    title: 'Privacy Policy',
    intro: 'This Privacy Policy explains how Proowrx handles personal information shared with us through our website, enquiries, meetings, and downloadable resources.',
    sections: [
      ['Information We Collect', 'We may collect your name, email address, phone number, company details, enquiry content, and information required to provide services or respond to requests.'],
      ['How We Use Information', 'We use information to respond to enquiries, provide requested resources, manage meetings, improve our services, and communicate with you about relevant Proowrx offerings.'],
      ['Data Protection', 'We take reasonable steps to protect personal information from misuse, unauthorised access, loss, and disclosure.'],
      ['Contact', 'For privacy questions, contact support@proowrx.com.'],
    ],
  },
  '/terms-of-use': {
    title: 'Terms of Use',
    intro: 'These Terms of Use govern access to and use of the Proowrx website and resources.',
    sections: [
      ['Website Use', 'You agree to use this website lawfully and not interfere with its operation, security, or availability.'],
      ['Content', 'Website content is provided for general information only and may be updated without notice.'],
      ['Resource Downloads', 'Downloaded guides are provided for informational purposes and should not be redistributed without permission.'],
      ['Limitation', 'Proowrx is not liable for loss arising from reliance on general website content.'],
    ],
  },
  '/disclaimer': {
    title: 'Disclaimer',
    intro: 'The information on this website is general in nature and is not professional, legal, financial, tax, or compliance advice.',
    sections: [
      ['General Information', 'Content is provided to help visitors understand outsourcing topics and Proowrx services. It should not replace independent professional advice.'],
      ['No Guarantee', 'While we aim to keep information accurate and useful, we do not guarantee completeness, suitability, or availability.'],
      ['External Links', 'External websites may be provided for convenience. Proowrx is not responsible for their content or practices.'],
      ['Service Discussions', 'Specific service arrangements should be confirmed directly with Proowrx in writing.'],
    ],
  },
};

export default function LegalPage() {
  const pathname = usePathname();
  const page = pages[pathname] || pages['/privacy-policy'];

  return (
    <div>
      <section className="page-hero info-legal-hero">
        <div className="container">
          <span className="chip chip-gold" style={{ marginBottom: 16 }}>Legal</span>
          <h1>{page.title}</h1>
          <p>{page.intro}</p>
        </div>
      </section>

      <section className="section">
        <div className="container info-narrow legal-content">
          {page.sections.map(([heading, body]) => (
            <section key={heading}>
              <h2>{heading}</h2>
              <p>{body}</p>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
