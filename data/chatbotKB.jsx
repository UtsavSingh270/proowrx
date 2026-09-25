import React from 'react';

// ════════════════════════════════════════════════════════════
//  AI KNOWLEDGE BASE — shared by the floating Chatbot and the
//  FAQ page's "Ask a Question" widget.
// ════════════════════════════════════════════════════════════
export const KB = [
  {
    keywords: ['hello', 'hi', 'hey', 'greet', 'start', 'help', 'who are you'],
    response: "Hi! I'm the Proowrx AI assistant. I can answer questions about our outsourcing services for Australian mortgage brokers and accounting firms. What would you like to know?",
    buttons: ['What services do you offer?', 'Where are you located?', 'How do I get started?'],
  },
  {
    keywords: ['service', 'offer', 'provide', 'do you do', 'specialise', 'specialize', 'what can', 'options'],
    response: "Proowrx provides outsourced back-office support for Australian financial services firms. Our core services are:\n\n**Mortgage Processing** — Loan processing, document verification, compliance checks, and settlement support.\n\n**Accounting Services** — Bookkeeping, BAS/IAS, tax returns, SMSF administration, and payroll.\n\n**Virtual Assistant** — Dedicated remote staff for admin and client management.\n\n**Pay Per Application** — Flexible model where you pay only per application processed.",
    buttons: ['Tell me about Mortgage Processing', 'Tell me about Accounting', 'What is Pay Per Application?'],
  },
  {
    keywords: ['mortgage', 'loan', 'broker', 'settlement', 'lender', 'home loan', 'property loan'],
    response: "Our Mortgage Processing service handles the entire back-office workflow for Australian mortgage brokers:\n\n• Loan application data entry & lodgement\n• Document collection & verification\n• Serviceability calculations\n• Compliance file preparation (NCCP)\n• Lender submissions & follow-up\n• Condition management\n• Settlement coordination\n• Post-settlement support\n\nOur team is trained on all major Australian lender requirements.",
    buttons: ['What are your turnaround times?', 'What software do you support?', 'How do I get started?'],
  },
  {
    keywords: ['accounting', 'bookkeeping', 'tax', 'bas', 'ias', 'xero', 'myob', 'quickbooks', 'accountant', 'lodgement', 'lodgment'],
    response: "Our Accounting Services support Australian firms with:\n\n• Bookkeeping & bank reconciliation (Xero, MYOB, QuickBooks)\n• BAS & IAS preparation\n• Individual & company tax return preparation\n• SMSF administration & audit prep\n• Financial statement preparation\n• Payroll processing (STP Phase 2)\n• Management reporting\n\nAll work is prepared by qualified accountants and reviewed before delivery.",
    buttons: ['Tell me about SMSF support', 'What software do you use?', 'How does quality control work?'],
  },
  {
    keywords: ['smsf', 'self managed super', 'superannuation', 'fund', 'sar', 'actuarial', 'class super', 'bgl'],
    response: "Proowrx provides comprehensive SMSF administration support:\n\n• Fund establishment & trust deed coordination\n• Annual financial statements\n• Member statements\n• Investment transaction reconciliation (ASX, managed funds, property)\n• SMSF tax return preparation (SAR)\n• Actuarial certificate coordination\n• Audit preparation — full documentation package\n\nWe support practices managing 30 to 800+ funds.",
    buttons: ['What SMSF software do you support?', 'How does pricing work?'],
  },
  {
    keywords: ['virtual assistant', 'va ', 'remote staff', 'dedicated staff', 'remote worker', 'full time'],
    response: "Our Virtual Assistant service provides dedicated remote staff members who work exclusively for your firm during your business hours.\n\nVAs can handle:\n• Client communications & scheduling\n• CRM management & data entry\n• Document preparation & filing\n• Email management\n• Research & reporting\n• Process documentation\n\nYour VA is fully integrated into your team — trained on your systems and processes.",
    buttons: ['What are your business hours?', 'How does pricing work?'],
  },
  {
    keywords: ['pay per application', 'ppa', 'per application', 'no commitment', 'flexible', 'trial', 'test'],
    response: "Pay Per Application is our most flexible engagement model — ideal for brokers who want to try outsourcing without a monthly commitment.\n\nHow it works:\n• Submit applications when you need them processed\n• Pay a fixed fee per application\n• No monthly retainer, no lock-in contract\n• Same quality as our full-service offering\n• Ideal for brokers writing 5–20 loans per month\n\nAs volume grows, we transition you to a more cost-effective monthly model.",
    buttons: ['What does it cost per application?', 'How do I get started?'],
  },
  {
    keywords: ['price', 'cost', 'charge', 'fee', 'rate', 'expensive', 'affordable', 'how much', 'pricing', 'quote', 'invoice'],
    response: "Proowrx pricing is tailored to your firm's volume and requirements:\n\n• **Pay Per Application** — fixed fee per loan processed (great for lower volume)\n• **Monthly retainer packages** — for firms with consistent workloads\n• **Dedicated VA** — monthly pricing for full-time equivalent staff\n\nAs a guide, our services typically cost **40–60% less** than equivalent in-house staff when you account for salary, super, leave, and overhead.\n\nContact us for a personalised quote.",
    buttons: ['Book a call to discuss pricing', 'What services do you offer?'],
  },
  {
    keywords: ['where', 'located', 'office', 'address', 'india', 'australia', 'jaipur', 'sydney', 'country', 'based'],
    response: "Proowrx has two offices:\n\n**🇮🇳 Jaipur, India**\n1st Floor, Patrika Building, 5E, Jhalana Institutional Area, JLN Marg, Jaipur – 302004\nPhone: +91 96104 11400\n\n**🇦🇺 Sydney, Australia**\nSuite 215, East Wing, 33 Lexington Drive, Bella Vista NSW – 2153\nPhone: 02 8834 1222\n\nEmail: support@proowrx.com",
    buttons: ['What are your business hours?', 'How do I contact you?'],
  },
  {
    keywords: ['contact', 'reach', 'email', 'phone', 'call', 'get in touch', 'speak', 'talk'],
    response: "You can reach Proowrx through:\n\n**Email:** support@proowrx.com\n\n**Australia:** 02 8834 1222\n**India:** +91 96104 11400\n\n**Business Hours:** Monday – Friday, 9:00 AM – 6:00 PM (IST / AEDT)\n\nOr book a free 30-minute discovery call — our team will walk you through how we can support your practice.",
    buttons: ['Book a discovery call', 'Send us a message'],
  },
  {
    keywords: ['hours', 'open', 'available', 'business hours', 'weekend', 'when', 'working hours'],
    response: "Our standard business hours are:\n\n**Monday – Friday: 9:00 AM – 6:00 PM (IST / AEDT)**\n\nWeekend support is available for urgent files — please contact us directly to arrange.\n\nOur India team supports Australian business hours, so there's excellent overlap for collaboration and real-time communication.",
    buttons: ['How do I contact you?', 'What are your turnaround times?'],
  },
  {
    keywords: ['security', 'secure', 'data', 'privacy', 'safe', 'confidential', 'protect', 'breach', 'iso', 'privacy act'],
    response: "Data security is foundational to everything we do at Proowrx:\n\n**Administrative:** Background-checked staff, role-based access, regular security training.\n\n**Physical:** Access-controlled facility, CCTV monitoring, no personal devices in work areas.\n\n**Technical:** End-to-end encryption, MFA on all systems, VPN-only remote access, penetration testing.\n\n**Operational:** Incident response plan, regular audits, contractual data protection agreements.\n\nWe comply with Australia's Privacy Act 1988 and Australian Privacy Principles (APPs).",
    buttons: ['Are you ISO certified?', 'How does data transfer work?'],
  },
  {
    keywords: ['iso', 'certified', 'certification', 'soc', 'compliance audit', 'accredited'],
    response: "Proowrx maintains rigorous security standards aligned with ISO 27001 principles. Our facility undergoes regular security audits and we carry professional indemnity insurance.\n\nWe sign contractual data protection agreements with every client and can provide our security documentation to satisfy your own compliance requirements.",
    buttons: ['Tell me more about data security', 'How do I get started?'],
  },
  {
    keywords: ['turnaround', 'fast', 'quick', 'how long', 'speed', 'delivery', 'deadline', 'sla', 'days', 'timeline'],
    response: "Our standard turnaround times:\n\n• **Loan applications (standard):** 24–48 business hours from document receipt\n• **BAS/IAS preparation:** 2–5 business days\n• **Tax return preparation:** 2–5 business days\n• **Bookkeeping:** Daily or weekly batches\n• **SMSF annual accounts:** 5–10 business days\n\nPriority processing is available for urgent files — please discuss specific requirements with our team.",
    buttons: ['What are your business hours?', 'How do I get started?'],
  },
  {
    keywords: ['start', 'begin', 'onboard', 'sign up', 'get started', 'how to', 'process', 'join', 'try', 'next step'],
    response: "Getting started with Proowrx is straightforward:\n\n1. **Book a discovery call** — 30 minutes to understand your needs\n2. **Proposal & agreement** — We prepare a tailored proposal\n3. **Onboarding** — System setup & team training (1–2 weeks)\n4. **Pilot batch** — Start with a small batch of real files\n5. **Scale** — Expand as your confidence grows\n\nMost clients are fully operational within **2–4 weeks** of signing.",
    buttons: ['Book a discovery call', 'How does pricing work?'],
  },
  {
    keywords: ['software', 'system', 'platform', 'technology', 'crm', 'apply online', 'mercury', 'simpology', 'salestrekker', 'loanworks'],
    response: "Our teams are trained on the major platforms used by Australian firms:\n\n**Mortgage:** ApplyOnline, Mercury, Simpology, Nexus, Salestrekker, Loanworks, MyCRM\n\n**Accounting:** Xero, MYOB AccountRight, QuickBooks, Reckon, Sage\n\n**SMSF:** BGL Simple Fund 360, Class Super, SuperMate\n\n**CRM:** Salesforce, HubSpot, Zoho\n\nIf you use a system not listed, our team adapts quickly.",
    buttons: ['Tell me about data security', 'How do I get started?'],
  },
  {
    keywords: ['team', 'staff', 'employee', 'people', 'qualified', 'experience', 'who', 'expert', 'background'],
    response: "The Proowrx team consists of:\n\n• Qualified accountants (CA/CPA equivalent)\n• Mortgage processing specialists trained in Australian lender requirements\n• Virtual assistants with financial services experience\n\nAll staff are based in our Jaipur, India office and undergo Australian financial services training before client assignment. Team leads provide quality control on every deliverable.",
    buttons: ['How does quality control work?', 'What are your turnaround times?'],
  },
  {
    keywords: ['quality', 'accuracy', 'review', 'check', 'control', 'error', 'mistake', 'standard', 'reliable'],
    response: "Quality control is built into every Proowrx workflow:\n\n• **Maker-checker process:** Every file is prepared and independently reviewed\n• **Documented SOPs:** Standardised procedures for every task type\n• **Regular calibration:** Team leads review sample outputs regularly\n• **Client feedback loops:** Regular check-ins to address issues early\n\nOur mortgage processing accuracy rate consistently exceeds **98%**.",
    buttons: ['What are your turnaround times?', 'How do I get started?'],
  },
  {
    keywords: ['why outsource', 'benefit', 'advantage', 'reason', 'should i', 'worth it', 'value', 'roi', 'return'],
    response: "The main benefits of outsourcing with Proowrx:\n\n💰 **Cost savings:** 40–60% lower cost than in-house staff\n⚡ **Speed:** Dedicated teams with fast turnaround\n📈 **Scalability:** Scale up or down as workload changes\n🎯 **Focus:** Senior staff focus on clients & advisory\n🔒 **Risk reduction:** No recruitment or turnover risk\n✅ **Compliance:** Work done by trained specialists\n\nMost clients see ROI within **60–90 days**.",
    buttons: ['How much does it cost?', 'How do I get started?'],
  },
  {
    keywords: ['compliance', 'nccp', 'responsible lending', 'asic', 'afsl', 'regulation', 'ato', 'legal'],
    response: "Proowrx is well-versed in Australian financial services compliance:\n\n• **Mortgage:** NCCP responsible lending obligations, lender-specific requirements\n• **Accounting:** ATO requirements, tax agent obligations, ASIC reporting\n• **SMSF:** SIS Act compliance, ATO SMSF regulations, audit requirements\n• **Privacy:** Australian Privacy Principles (APPs), Privacy Act 1988\n\nOur compliance knowledge is regularly updated as regulations change.",
    buttons: ['Tell me about data security', 'What services do you offer?'],
  },
  {
    keywords: ['payroll', 'stp', 'pay run', 'wages', 'employee pay', 'award', 'entitlement'],
    response: "Our payroll processing service handles the complexity of Australian payroll:\n\n• Single Touch Payroll (STP Phase 2) compliant reporting\n• Award and EBA interpretation\n• Leave management and accruals\n• Superannuation calculations and remittance\n• PAYG withholding\n• End-of-year payment summaries\n\nYour clients get accurate, on-time payroll — your team gets time back.",
    buttons: ['Tell me about Accounting services', 'What are your turnaround times?'],
  },
  {
    keywords: ['thank', 'thanks', 'great', 'awesome', 'perfect', 'helpful', 'excellent', 'good', 'appreciate'],
    response: "You're welcome! Is there anything else I can help you with? I'm happy to answer questions about our services, pricing, or how to get started.\n\nYou can also speak directly with our team by booking a 30-minute discovery call.",
    buttons: ['What services do you offer?', 'Book a discovery call', 'No, thanks!'],
  },
  {
    keywords: ['no', 'nothing', 'done', 'bye', 'goodbye', "that's all", 'all good', 'nevermind'],
    response: "Thanks for chatting! Feel free to come back anytime if you have more questions. You can also reach us at support@proowrx.com or call 02 8834 1222 (Australia).\n\nHave a great day! 👋",
    buttons: ['Start over'],
  },
];

export const FALLBACK = {
  response: "Thanks for your question! I may not have a specific answer for that yet. For detailed enquiries, I'd recommend:\n\n• **Email:** support@proowrx.com\n• **Call (AU):** 02 8834 1222\n• **Book a call:** Free 30-min discovery call\n\nOr try rephrasing your question — I may have the answer under different keywords!",
  buttons: ['What services do you offer?', 'How do I contact you?', 'Book a discovery call'],
};

export function matchKB(query) {
  const q = query.toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const entry of KB) {
    const score = entry.keywords.reduce((s, kw) => s + (q.includes(kw) ? kw.split(' ').length : 0), 0);
    if (score > bestScore) { bestScore = score; best = entry; }
  }
  return bestScore > 0 ? best : null;
}

// ════════════════════════════════════════════════════════════
//  RENDER AI MESSAGE TEXT (simple markdown)
// ════════════════════════════════════════════════════════════
export function renderAIText(text) {
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <br key={i} />;
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((p, j) => {
      if (p.startsWith('**') && p.endsWith('**'))
        return <strong key={j}>{p.slice(2, -2)}</strong>;
      if (p.startsWith('• ')) return <span key={j}>{p}</span>;
      return p;
    });
    return <span key={i} style={{ display: 'block', marginBottom: 2 }}>{parts}</span>;
  });
}
