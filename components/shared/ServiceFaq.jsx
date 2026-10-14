import { Plus } from 'lucide-react';
import './ServiceFaq.css';

const FAQ_SETS = {
  services: [
    { question: 'Which Proowrx service is right for my business?', answer: 'We review your current workload, systems and bottlenecks before recommending mortgage, accounting, asset finance, digital marketing or dedicated assistant support.' },
    { question: 'Can we combine more than one service?', answer: 'Yes. Services can be combined when your workflow needs support across multiple functions, with clear ownership and reporting for each workstream.' },
    { question: 'Will your team follow our existing process?', answer: 'Yes. We document your preferred software, checklists, approval points and communication standards during onboarding.' },
    { question: 'Can the support scale as our business grows?', answer: 'The scope and resource model can be adjusted as volumes, task complexity and operating requirements change.' },
  ],
  mortgage: [
    { question: 'Which parts of a mortgage application can Proowrx support?', answer: 'Support can cover CRM entry, document checks, compliance preparation, lender submission, conditions, valuations and post-lodgement follow-up according to your workflow.' },
    { question: 'Do brokers retain control of client advice?', answer: 'Yes. Your brokerage retains the client relationship and all advice responsibilities while Proowrx supports agreed administrative and processing tasks.' },
    { question: 'Can you work with our aggregator CRM?', answer: 'We onboard resources around the systems and process used by your brokerage, subject to the access and controls you approve.' },
    { question: 'Is support available for changing application volumes?', answer: 'Yes. Pay-per-application and dedicated resource options accommodate different workflow and volume requirements.' },
  ],
  accounting: [
    { question: 'What accounting tasks can we outsource to Proowrx?', answer: 'You can outsource bookkeeping, payroll processing, annual tax return preparation, tax planning support, SMSF accounting, audit support, BAS and IAS support, superannuation and STP-related tasks, and cash flow forecasting support. We’ll talk through your requirements and confirm the scope before work begins.' },
    { question: 'Can your team use the accounting software we already have?', answer: 'Yes, our team can work with platforms such as Xero, MYOB, QuickBooks, HandiSoft, Class Super, BGL Simple Fund, FuturePlanner and APS, subject to the agreed scope, access and task requirements. ' },
    { question: 'Do we need to outsource all our accounting work?', answer: 'Not at all. You can start with specific recurring tasks, such as bookkeeping or file preparation, and expand the scope once the arrangement is working well for your practice.' },
    { question: 'Can we get extra support during tax season?', answer: 'We can discuss extra capacity around tax season and other busy periods. Timing, available resources and scope should be agreed in advance so the arrangement lines up with your deadlines.' },
    { question: 'How is our client’s information handled?', answer: 'Information handling, user access and security procedures are discussed during onboarding. We work within the agreed controls and access permissions for the services provided. Your firm should make sure the arrangement meets its own confidentiality, privacy and professional obligations.' },
    { question: 'How do you ensure data security?', answer: 'We are ISO 27001:2022 certified. We protect data using multi-factor authentication, biometric office access, secured email access, secured wireless network through firewall, and zero local data storage.' },
    { question: 'How do you maintain consistency across our client files?', answer: 'We follow the working instructions, templates, documentation standards and handover procedures agreed with your firm. Clear task ownership and issue escalation keep your team across what’s been completed and what still needs attention.' },
  ],
  bookkeeping: [
    { question: 'Which bookkeeping tasks can I outsource to Proowrx?', answer: 'You can outsource back-office tasks like bank & credit card reconciliations, accounts payable/receivable management, general ledger entries, payroll processing, and year-end ledger balancing directly inside your existing accounting software.' },
    { question: 'Can we combine more than one service?', answer: 'Yes, you can easily combine multiple services. We customise our packages to match your firm’s exact requirements, seamlessly blending reconciliations, ledger maintenance, and accounts management.' },
    { question: 'Will your team follow our existing process?', answer: 'Yes, our team integrates directly into your established workflows. We adapt to your standard operating procedures, communication tools, and preferred timelines to ensure a completely seamless partnership.' },
    { question: 'Can the support scale as our business grows?', answer: 'Yes, our support scales effortlessly alongside your practice. You can easily adjust your dedicated bookkeeping hours or add or remove services based on your seasonal capacity.' },
  ],
  assetFinance: [
    { question: 'What asset finance applications can you support?', answer: 'Support can be tailored for vehicle, equipment, machinery and business-use asset applications across document collection, entry and lender follow-up.' },
    { question: 'Can Proowrx track lender conditions?', answer: 'Yes. Agreed workflows can include outstanding-condition tracking, document requests, milestone updates and escalation to the broker.' },
    { question: 'Will clients still communicate with our brokerage?', answer: 'Yes. Your team controls the client relationship and decides which routine administrative communications are delegated.' },
    { question: 'How are application updates reported?', answer: 'Progress can be recorded in your CRM and communicated through the reporting rhythm agreed during onboarding.' },
  ],
  digitalMarketing: [
    { question: 'Can you work within our existing brand guidelines?', answer: 'Yes. Content and creative tasks follow your approved messaging, brand assets, compliance process and publishing permissions.' },
    { question: 'Which marketing activities can be supported?', answer: 'Support can include content, SEO assistance, social scheduling, email campaigns, creative coordination and performance reporting.' },
    { question: 'Who approves content before publication?', answer: 'Your nominated team members retain approval control, with review and publishing stages documented in the workflow.' },
    { question: 'Can support focus on selected channels only?', answer: 'Yes. The scope can focus on the channels and activities most relevant to your current marketing plan.' },
  ],
  virtualAssistant: [
    { question: 'Will we receive a dedicated virtual assistant?', answer: 'Dedicated plans allocate a resource who learns your systems, recurring tasks and communication preferences.' },
    { question: 'What hours can a virtual assistant work?', answer: 'Part-time and full-time arrangements are available, with working hours agreed around the role and required coverage.' },
    { question: 'Can we decide which tasks the assistant handles?', answer: 'Yes. The role is built from an agreed task list covering areas such as CRM updates, documents, email, scheduling and follow-ups.' },
    { question: 'How is the virtual assistant onboarded?', answer: 'Onboarding covers system access, process documentation, task training, quality expectations and reporting routines.' },
  ],
  payPerApplication: [
    { question: 'Do we pay when there are no applications?', answer: 'No monthly resource commitment is required under the pay-per-application model; charges relate to the agreed files and service level.' },
    { question: 'What is the difference between Standard and Comprehensive?', answer: 'Standard focuses on preparation and lodgement, while Comprehensive adds broader coordination and post-lodgement follow-up tasks.' },
    { question: 'Can you follow our brokerage-specific checklist?', answer: 'Yes. Your required documents, CRM stages, compliance checks and handover points are confirmed before processing begins.' },
    { question: 'Can we move to a dedicated resource later?', answer: 'Yes. If volume becomes consistent, the service model can be reviewed and moved to dedicated support.' },
  ],
  about: [
    { question: 'Where is Proowrx based?', answer: 'Proowrx is an Australian-owned business headquartered in Sydney, NSW, Australia. Our highly trained offshore teams operate from secured and strictly monitored delivery centres to support businesses.' },
    { question: 'What service models does Proowrx offer?', answer: 'Proowrx offers highly flexible options without lock-in contracts. You can hire a dedicated full-time resource or choose scalable support during seasonal business peaks.' },
    { question: 'Which industries does Proowrx support?', answer: 'We specialise in supporting Australian mortgage brokers, asset finance brokers, accounting practices, and financial businesses with dedicated back-office and digital marketing operations.' },
    { question: 'How does Proowrx ensure data security?', answer: 'We are ISO 27001:2022 certified. We protect data using multi-factor authentication, biometric office access, a secure wireless network, and zero local data storage.' },
    { question: 'Is Proowrx compliant with the Modern Slavery Act?', answer: 'Yes, we strictly adhere to the Modern Slavery Act. Our teams follow a clear code of ethics, ensuring fair, safe, and ethical working conditions.' },
    { question: 'Is Proowrx compliant with the Australian Privacy Principles?', answer: 'Yes, we strictly follow the Australian Privacy Principles. Our staff sign NDAs, and we handle client information securely within clients’ approved cloud-based systems only.' },
  ],
};

export default function ServiceFaq({
  title = 'Frequently asked questions',
  intro = 'Helpful answers about working with Proowrx.',
  variant = 'services',
  items,
}) {
  const questions = items || FAQ_SETS[variant] || FAQ_SETS.services;

  return (
    <section className="service-faq-section">
      <div className="container service-faq-layout">
        <div className="service-faq-heading">
          <span className="chip chip-gold section-eyebrow">Common Questions</span>
          <h2 className="section-title">{title}</h2>
          <p>{intro}</p>
        </div>
        <div className="service-faq-list">
          {questions.map(({ question, answer }) => (
            <details key={question}>
              <summary>
                {question}
                <span className="service-faq-toggle-icon" aria-hidden="true"><Plus size={18} /></span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
