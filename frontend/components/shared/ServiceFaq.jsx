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
    { question: 'Which accounting tasks can be outsourced?', answer: 'Scope can include bookkeeping, payroll, workpaper preparation, tax-return preparation support, SMSF administration and management reporting.' },
    { question: 'Which accounting platforms can your team work with?', answer: 'Resources are assigned and trained around the software stack, workpapers and review process used by your firm.' },
    { question: 'How is completed work reviewed?', answer: 'The workflow includes documented preparation and review stages, clear handovers and issue tracking aligned with your firm’s quality process.' },
    { question: 'Can support increase during busy periods?', answer: 'Yes. Capacity can be planned around recurring deadlines, seasonal peaks and changes in client workload.' },
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
    { question: 'Is Proowrx Australian-owned?', answer: 'Yes. Proowrx is an Australian-owned knowledge process outsourcing provider supporting Australian finance and accounting businesses.' },
    { question: 'Where is the Proowrx delivery team based?', answer: 'Proowrx operates with an Australian presence and a delivery centre in Jaipur, India.' },
    { question: 'Which industries does Proowrx specialise in?', answer: 'Our core focus is mortgage, accounting, asset finance and related back-office and digital marketing support.' },
    { question: 'How does Proowrx build long-term partnerships?', answer: 'We focus on documented workflows, responsive communication, secure operations and ongoing quality oversight.' },
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
                <span aria-hidden="true">+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
