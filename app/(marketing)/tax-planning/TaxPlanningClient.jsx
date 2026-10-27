'use client';

import {
  BadgeDollarSign,
  Calculator,
  Clock3,
  FileCheck2,
  FileText,
  Receipt,
  SearchCheck,
  ShieldCheck,
  Target,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import TaxSupportPage from '@/components/shared/TaxSupportPage';
import '../auditsupport/auditsupport.css';

const content = {
  heroHeading: 'Tax Planning Support for Accounting Firms',
  heroSubtext: 'Meet surging tax planning demand without adding local staff or working overtime. Proowrx helps you deliver accurate, reconciled ledgers, multi-scenario tax position models, and complete client workpapers comfortably before year-end.',
  stats: [
    { value: '48hr', label: 'Turnaround' },
    { value: 'Experienced', label: 'Tax Specialists' },
    { value: '100%', label: 'Proactive Planning' },
  ],
  heroImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1800&q=85',
  heroImageAlt: 'Tax planning documents and financial calculations',
  introHeading: 'Year-End Tax Backlogs Overloading Your Team',
  introText: 'Managing demanding tax planning workloads requires reliable backend support, so we handle detailed financial reconciliations and scenario modelling directly, enabling your practice to deliver exceptional advice without staff burnout.',
  introPoints: [
    'Delivers accurate multi-scenario tax models for your advisory meetings.',
    'Cleans and reconciles client ledgers before year-end reviews begin.',
    'Eliminates stressful administrative delays with prompt workpaper preparation.',
    'Protects internal staff time and keeps workflows moving forward.',
  ],
  introImage: 'https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=800&q=85',
  introImageAlt: 'Tax planning workpapers and reconciled ledgers',
  servicesHeading: 'What Our Tax Planning Support Includes',
  servicesSubtext: 'From year-end strategies to multi-scenario modelling, we manage the complete backend tax preparation workflow for your accounting firm.',
  services: [
    { Icon: Target, title: 'Individual & Business Tax Planning', body: 'Creating structured strategies to minimise tax liabilities for both personal and corporate clients ahead of deadlines.' },
    { Icon: FileCheck2, title: 'Tax Return Preparation', body: 'We prepare accurate, fully ATO-compliant returns directly from thoroughly reconciled client financial data every single time.' },
    { Icon: ShieldCheck, title: 'Tax Compliance & Lodgement', body: 'Our team provides end-to-end support to ensure you meet all ATO filing obligations on time.' },
    { Icon: Receipt, title: 'GST & BAS Support', body: 'We provide complete assistance with complex GST calculations, meticulous BAS preparation, and timely lodgements.' },
    { Icon: Calculator, title: 'Capital Gains Tax (CGT) Planning', body: 'We analyse complex CGT scenarios and correctly apply available small business concessions where eligible.' },
    { Icon: BadgeDollarSign, title: 'Fringe Benefits Tax (FBT)', body: 'We handle comprehensive FBT calculations, employer reporting requirements and ongoing compliance support with total accuracy.' },
    { Icon: Wallet, title: 'PAYG & Tax Instalment Planning', body: 'We manage PAYG withholding and periodic tax instalment obligations with absolute precision throughout the financial year.' },
    { Icon: SearchCheck, title: 'Tax Deduction Reviews', body: 'We identify maximised and legitimate deductions to significantly improve overall financial outcomes for your business clients.' },
  ],
  benefitsHeading: 'Benefits of Outsourcing Tax Planning Services',
  benefitsSubtext: 'Protect your margins, stay aligned with ATO regulations, and give your clients proactive strategies to minimise tax liabilities before year-end.',
  benefits: [
    { title: 'Tax Liability Reduction', text: 'Specialists pinpoint every eligible industry deduction, tax offset, and favourable corporate rate to reduce your clients\' tax liabilities.' },
    { title: 'Enhanced Cash Flow Management', text: 'Proactive forecasting lets you time income recognition, schedule pre-June 30 expenses, and spread out tax payments predictably to protect client working capital.' },
    { title: 'Risk & Compliance Mitigation', text: 'Professional guidance ensures accurate reporting, proper execution of year-end trust resolutions, and alignment with changing ATO regulations to prevent audits or penalties.' },
    { title: 'Capital Gains Tax (CGT) Relief', text: 'Specialised support services help time asset sales strategically and apply available small business CGT concessions or rollover reliefs effectively.' },
  ],
  whyHeading: 'Why Choose Proowrx for Outsourced Tax Planning Support?',
  whyItems: [
    { Icon: FileText, title: 'Australian Compliance Standards', body: 'Our dedicated team is thoroughly trained in Australian tax legislation, complex ATO tax-planning frameworks, and strict trust distribution requirements to protect your practice from risk.' },
    { Icon: Clock3, title: 'Turnaround Advantage', body: 'Rapid file processing ensures your advisors receive completed, error-free tax planning packs in time to meet with clients well before the June 30 deadline.' },
    { Icon: TrendingUp, title: 'Scalable Resource Model', body: 'Easily scale your outsourced tax preparation capacity up or down during heavy April, May, and June workloads without incurring year-round domestic payroll costs.' },
    { Icon: ShieldCheck, title: 'Secure Data Management', body: 'Our team works securely inside your preferred software ecosystem, including Xero Tax, HandiSoft, MYOB AE/AO, and APS, under strict confidentiality and data protection protocols.' },
  ],
  faqHeading: 'Frequently Asked Questions',
  faqs: [
    { question: 'What tax planning tasks can Australian accounting firms outsource to Proowrx?', answer: 'Australian accounting firms can outsource ledger reconciliations, profit projections, Division 7A calculations, trust distribution workpapers, superannuation tracking, and multi-scenario tax modelling through our professional outsourcing service.' },
    { question: 'How can Proowrx reduce my tax planning workload?', answer: 'By taking over time-consuming data collection, interim reconciliations, and scenario calculations, our outsourced accounting service lets your accountants step away from spreadsheet build-outs and focus on strategic client meetings and tax advice.' },
    { question: 'How early should accounting firms start outsourcing year-end tax planning files?', answer: 'Starting file outsourcing early in the third quarter keeps your team organised, prevents late-season bottlenecks, and gives you ample time to review complex client strategies.' },
    { question: 'Are Proowrx tax planning specialists trained in current Australian legislation?', answer: 'Yes, our dedicated team undergoes continuous training on changing ATO guidelines, complex corporate tax updates, and state regulations to ensure complete accuracy across all your outsourced client files.' },
  ],
};

export default function TaxPlanningClient() {
  return <TaxSupportPage content={content} />;
}
