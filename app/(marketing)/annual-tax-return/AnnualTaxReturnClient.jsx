'use client';

import {
  BadgeDollarSign,
  Building2,
  CalendarCheck,
  Calculator,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  FileText,
  ListChecks,
  ShieldCheck,
  TrendingUp,
  Users,
} from 'lucide-react';
import TaxSupportPage from '@/components/shared/TaxSupportPage';
import '../auditsupport/auditsupport.css';

const content = {
  heroHeading: 'Annual Tax Return Preparation Services for Accounting Firms',
  heroSubtext: 'Clear tax return backlogs and manage busy tax periods with outsourced preparation support. From individual and business tax returns to supporting schedules and workpapers, Proowrx helps keep your files organised and ready for review.',
  stats: [
    { value: '48hr', label: 'Turnaround' },
    { value: 'Expert', label: 'Tax Preparation Team' },
    { value: 'Peak Season', label: 'Capacity' },
  ],
  heroImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1800&q=85',
  heroImageAlt: 'Tax return preparation documents',
  introHeading: 'Manage Tax Season Without Overloading Your Team',
  introText: 'Preparing annual tax returns involves more than completing forms. Accounting firms need reconciled figures, organised workpapers and supporting schedules before a return is ready for review. Proowrx provides back-office tax preparation support to help your team manage this work alongside its regular client responsibilities.',
  introPoints: [
    'Manage individual and business tax returns with organised preparation support.',
    'Keep tax workpapers and supporting documents ready for review.',
    'Handle year-end reconciliations and adjustments more efficiently.',
    'Manage busy tax periods with additional preparation support.',
  ],
  introImage: 'https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=800&q=85',
  introImageAlt: 'Tax workpapers and supporting documents',
  servicesHeading: 'Annual Tax Preparation Services for Accounting Firms',
  servicesSubtext: 'Proowrx supports accounting firms with annual tax return preparation, workpapers, reconciliations and supporting schedules, helping reduce administrative workloads and improve efficiency.',
  services: [
    { Icon: FileText, title: 'Individual Tax Return Preparation', body: 'We prepare individual tax return workpapers covering salary and wage income, rental property schedules, work-related deductions, capital gains events, and ATO prefill reconciliation.' },
    { Icon: Building2, title: 'Company Tax Return Preparation', body: 'We compile company tax return workpapers, reconcile trial balance figures and organise balance sheet schedules to support the preparation and review of company tax returns.' },
    { Icon: Users, title: 'Trust and Partnership Tax Returns', body: 'We assist with income distribution schedules, beneficiary allocations and supporting calculations based on the relevant trust or partnership structure and available records.' },
    { Icon: ListChecks, title: 'Tax Workpapers and Trial Balance Reconciliation', body: 'We collate supporting documents, check trial balance figures and organise tax workpapers to make client files easier for accounting teams to review.' },
    { Icon: CalendarCheck, title: 'Year-End Tax Reconciliations and Adjustments', body: 'We help reconcile year-end figures, record relevant journal adjustments and check dividend details to align accounting records with tax return preparation requirements.' },
    { Icon: Calculator, title: 'Capital Gains Tax Calculations', body: 'We calculate draft capital gains amounts, compile CGT discount schedules and assist with relevant small business CGT concession calculations using available disposal records.' },
    { Icon: BadgeDollarSign, title: 'Fringe Benefits Tax (FBT) Preparation', body: 'We organise employee benefit records, calculate taxable values using applicable methods and compile draft FBT return information for review ahead of the 31 March FBT year-end.' },
    { Icon: ClipboardCheck, title: 'ATO Prefill Reconciliation and Supporting Schedules', body: 'We check available ATO prefill information against client records and compile relevant supporting schedules to help account for income, deductions and other details required for tax return preparation.' },
  ],
  benefitsHeading: 'Benefits of Outsourcing Annual Tax Return Preparation Services',
  benefitsSubtext: 'Get additional preparation support without expanding your permanent team for seasonal workloads.',
  benefits: [
    { title: 'More Time for Client Work', text: 'Routine tax preparation tasks take time away from client responsibilities. Outsourcing these tasks gives your team more room to manage client needs and daily operations.' },
    { title: 'Support from a Tax-Focused Team', text: 'Keep tax preparation work organised with support for reconciliations, calculations and workpapers, giving your accountants a clearer starting point for reviewing client returns.' },
    { title: 'Flexible Support During Tax Season', text: 'Handle increased workloads during busy tax periods with additional preparation support, without maintaining the same staffing levels year-round.' },
    { title: 'More Time for Your Accounting Team', text: 'Reduce your team\'s routine tax preparation workload, giving them more time to focus on detailed reviews, client advisory and other important practice responsibilities.' },
  ],
  whyHeading: 'Why Choose Proowrx Annual Tax Return Preparation Services',
  whyItems: [
    { Icon: ShieldCheck, title: 'Secure Data Management', body: 'We handle client tax records, financial documents and supporting workpapers with care and confidentiality throughout the tax preparation process.' },
    { Icon: Clock3, title: 'Improved Turnaround Efficiency', body: 'Our team assists with tax workpapers, reconciliations and draft schedules, helping your accountants manage review deadlines and process client files efficiently during peak periods.' },
    { Icon: FileCheck2, title: 'Australian Compliance Standards', body: 'We follow relevant Australian tax requirements and ATO guidelines when preparing tax workpapers and supporting schedules, helping your team review returns with the necessary records and calculations.' },
    { Icon: TrendingUp, title: 'Flexible Overhead Control', body: 'We provide additional tax preparation support during peak periods, helping your practice manage changing workloads without the ongoing expense of recruiting a larger permanent team.' },
  ],
  faqHeading: 'Frequently Asked Questions',
  faqs: [
    { question: 'Which tax return preparation tasks can I outsource to Proowrx?', answer: 'You can outsource individual, company, trust and partnership tax return preparation, along with tax workpapers, reconciliations, CGT calculations and supporting schedules.' },
    { question: 'Can I combine tax preparation with other accounting services?', answer: 'Yes, you can combine tax return preparation with services such as bookkeeping, reconciliations and year-end support based on your firm\'s requirements.' },
    { question: 'Will your team follow our existing tax preparation process?', answer: 'Yes, our team works with your existing workflows, software and templates to prepare files in line with your practice\'s requirements.' },
    { question: 'Can I get additional support during tax season?', answer: 'Yes, you can arrange additional preparation support during busy periods to help manage higher workloads and client deadlines without expanding your permanent team.' },
  ],
};

export default function AnnualTaxReturnClient() {
  return <TaxSupportPage content={content} />;
}
