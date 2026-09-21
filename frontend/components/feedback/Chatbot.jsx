'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle, X, Bot, Users, CalendarDays, Send,
  Phone, Mail, Clock, ChevronRight, CheckCircle, ExternalLink,
  Calculator, RefreshCw,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import './Chatbot.css';
import { matchKB, FALLBACK, renderAIText } from '@/data/chatbotKB';
import { contact } from '@/services/api';

// ════════════════════════════════════════════════════════════
//  CALCULATOR FUNCTIONS
// ════════════════════════════════════════════════════════════
function calcRepayment(p, annualR, years) {
  const r = annualR / 100 / 12;
  const n = years * 12;
  if (r === 0) {
    const m = p / n;
    return { monthly: m, totalInterest: 0, totalRepayment: p };
  }
  const m = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return { monthly: m, totalInterest: m * n - p, totalRepayment: m * n };
}

function calcBorrowing(annualIncome, monthlyExpenses, annualR, years) {
  const r = annualR / 100 / 12;
  const n = years * 12;
  const surplus = (annualIncome / 12) * 0.8 - monthlyExpenses;
  if (surplus <= 0) return { maxLoan: 0 };
  if (r === 0) return { maxLoan: surplus * n };
  const maxLoan = surplus * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
  return { maxLoan };
}

function calcStampDuty(v, state, firstHome) {
  let duty = 0;
  if (state === 'NSW') {
    if (v <= 14000) duty = v * 0.0125;
    else if (v <= 32000) duty = 175 + (v - 14000) * 0.015;
    else if (v <= 85000) duty = 445 + (v - 32000) * 0.0175;
    else if (v <= 319000) duty = 1372 + (v - 85000) * 0.035;
    else if (v <= 1064000) duty = 9562 + (v - 319000) * 0.045;
    else if (v <= 3101000) duty = 43087 + (v - 1064000) * 0.055;
    else duty = 155125 + (v - 3101000) * 0.07;
    if (firstHome && v <= 800000) duty = 0;
    else if (firstHome && v <= 1000000) duty *= (v - 800000) / 200000;
  } else if (state === 'VIC') {
    if (v <= 25000) duty = v * 0.014;
    else if (v <= 130000) duty = 350 + (v - 25000) * 0.024;
    else if (v <= 440000) duty = 2870 + (v - 130000) * 0.06;
    else if (v <= 550000) duty = 21470 + (v - 440000) * 0.06;
    else duty = v * 0.055;
    if (firstHome && v <= 600000) duty = 0;
    else if (firstHome && v <= 750000) duty *= (v - 600000) / 150000;
  } else if (state === 'QLD') {
    if (v <= 5000) duty = 0;
    else if (v <= 75000) duty = (v - 5000) * 0.015;
    else if (v <= 540000) duty = 1050 + (v - 75000) * 0.035;
    else if (v <= 1000000) duty = 17325 + (v - 540000) * 0.045;
    else duty = 38025 + (v - 1000000) * 0.0575;
    if (firstHome && v <= 500000) duty = 0;
    else if (firstHome && v <= 550000) duty *= (v - 500000) / 50000;
  } else if (state === 'WA') {
    if (v <= 120000) duty = v * 0.019;
    else if (v <= 150000) duty = 2280 + (v - 120000) * 0.028;
    else if (v <= 360000) duty = 3120 + (v - 150000) * 0.038;
    else if (v <= 725000) duty = 11100 + (v - 360000) * 0.045;
    else duty = 27525 + (v - 725000) * 0.051;
    if (firstHome && v <= 430000) duty = 0;
    else if (firstHome && v <= 530000) duty *= (v - 430000) / 100000;
  } else if (state === 'SA') {
    if (v <= 12000) duty = v * 0.01;
    else if (v <= 30000) duty = 120 + (v - 12000) * 0.02;
    else if (v <= 50000) duty = 480 + (v - 30000) * 0.03;
    else if (v <= 100000) duty = 1080 + (v - 50000) * 0.035;
    else if (v <= 200000) duty = 2830 + (v - 100000) * 0.04;
    else if (v <= 250000) duty = 6830 + (v - 200000) * 0.045;
    else if (v <= 300000) duty = 9080 + (v - 250000) * 0.05;
    else duty = 11580 + (v - 300000) * 0.055;
  } else if (state === 'TAS') {
    if (v <= 3000) duty = 50;
    else if (v <= 25000) duty = 50 + (v - 3000) * 0.0175;
    else if (v <= 75000) duty = 435 + (v - 25000) * 0.025;
    else if (v <= 200000) duty = 1685 + (v - 75000) * 0.035;
    else if (v <= 375000) duty = 6060 + (v - 200000) * 0.04;
    else if (v <= 725000) duty = 13060 + (v - 375000) * 0.0425;
    else duty = 27935 + (v - 725000) * 0.045;
  } else if (state === 'ACT') {
    if (v <= 200000) duty = v * 0.006;
    else if (v <= 300000) duty = 1200 + (v - 200000) * 0.0223;
    else if (v <= 500000) duty = 3430 + (v - 300000) * 0.0349;
    else if (v <= 750000) duty = 10410 + (v - 500000) * 0.0388;
    else if (v <= 1000000) duty = 20110 + (v - 750000) * 0.044;
    else if (v <= 1455000) duty = 31110 + (v - 1000000) * 0.0547;
    else duty = 56001 + (v - 1455000) * 0.045;
    if (firstHome) duty *= 0; // ACT has first home buyer duty concession
  } else if (state === 'NT') {
    // Approximate NT transfer duty
    if (v <= 525000) {
      const b = [
        [3000, 0, 0], [25000, 3000, 0.02], [50000, 25000, 0.02],
        [100000, 50000, 0.03], [200000, 100000, 0.035],
        [300000, 200000, 0.04], [525000, 300000, 0.045],
      ];
      for (const [top, from, r] of b) {
        if (v <= top) { duty += (v - from) * r; break; }
        duty += (top - from) * r;
      }
    } else {
      duty = 20075 + (v - 525000) * 0.055;
    }
  }
  return Math.round(Math.max(0, duty));
}

function calcExtra(p, annualR, years, extra) {
  const r = annualR / 100 / 12;
  const n = years * 12;
  if (r === 0 || extra <= 0) return { monthsSaved: 0, interestSaved: 0 };
  const stdPayment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const newPayment = stdPayment + extra;
  let balance = p;
  let months = 0;
  let totalInterestExtra = 0;
  while (balance > 0.01 && months < n * 2) {
    const interest = balance * r;
    totalInterestExtra += interest;
    balance -= Math.min(newPayment - interest, balance);
    months++;
  }
  const stdInterest = stdPayment * n - p;
  return {
    monthsSaved: n - months,
    interestSaved: stdInterest - totalInterestExtra,
    newPayment: stdPayment + extra,
  };
}

// ════════════════════════════════════════════════════════════
//  FORMATTERS
// ════════════════════════════════════════════════════════════
const fmtAUD = v => '$' + Math.round(v).toLocaleString('en-AU');
const fmtYrs = m => {
  const y = Math.floor(m / 12);
  const mo = m % 12;
  if (y === 0) return `${mo} month${mo !== 1 ? 's' : ''}`;
  if (mo === 0) return `${y} year${y !== 1 ? 's' : ''}`;
  return `${y}yr ${mo}mo`;
};

// ════════════════════════════════════════════════════════════
//  HOME VIEW
// ════════════════════════════════════════════════════════════
function HomeView({ setView }) {
  const options = [
    {
      id: 'expert',
      icon: '👤',
      title: 'Ask an Expert',
      desc: 'Chat live with our team',
      color: '#f0a500',
    },
    {
      id: 'calculator',
      icon: '🧮',
      title: 'Mortgage Calculators',
      desc: 'Repayment, stamp duty & more',
      color: '#d99a00',
    },
    {
      id: 'ai',
      icon: '🤖',
      title: 'Ask AI',
      desc: 'Instant answers about Proowrx',
      color: '#c08200',
    },
    {
      id: 'schedule',
      icon: '📅',
      title: 'Schedule a Call',
      desc: 'Book a free 30-min discovery call',
      color: '#10b981',
    },
  ];

  return (
    <div className="cb-home">
      <div className="cb-home-greeting">
        <span className="cb-home-eyebrow"><span /> Available now</span>
        <p className="cb-home-wave">👋</p>
        <h3>How can we help?</h3>
        <p>Choose an option or ask our assistant anything about Proowrx.</p>
      </div>
      <div className="cb-home-options">
        {options.map(o => (
          <button key={o.id} className="cb-option-card" onClick={() => setView(o.id)}>
            <span className="cb-option-icon" style={{ background: `${o.color}20`, color: o.color }}>
              {o.icon}
            </span>
            <div className="cb-option-text">
              <span className="cb-option-title">{o.title}</span>
              <span className="cb-option-desc">{o.desc}</span>
            </div>
            <ChevronRight size={16} className="cb-option-arrow" />
          </button>
        ))}
      </div>
      <p className="cb-home-footer">Proowrx · support@proowrx.com</p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  EXPERT VIEW
// ════════════════════════════════════════════════════════════
function ExpertView() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const change = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      await contact.submit({ ...form, source: 'chatbot' });
      setSent(true);
    } catch {
      setError('Could not send your message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (sent) return (
    <div className="cb-expert-success">
      <div className="cb-success-icon"><CheckCircle size={36} color="#10b981" /></div>
      <h4>Message Sent!</h4>
      <p>Thanks, {form.name.split(' ')[0]}! One of our experts will reach out within a few hours.</p>
      <div className="cb-contact-alts">
        <a href="tel:+61288341222" className="cb-contact-alt"><Phone size={14} /> 02 8834 1222</a>
        <a href="mailto:support@proowrx.com" className="cb-contact-alt"><Mail size={14} /> support@proowrx.com</a>
      </div>
    </div>
  );

  return (
    <div className="cb-expert">
      <div className="cb-view-heading">
        <span className="cb-view-icon">👤</span>
        <div>
          <h4>Ask an Expert</h4>
          <p>Leave your details and we&apos;ll be in touch within a few hours.</p>
        </div>
      </div>

      <form className="cb-form" onSubmit={submit}>
        <input name="name" placeholder="Your name *" value={form.name} onChange={change} required />
        <input name="email" type="email" placeholder="Email address *" value={form.email} onChange={change} required />
        <input name="phone" type="tel" placeholder="Phone number" value={form.phone} onChange={change} />
        <textarea name="message" placeholder="How can we help you? *" rows={3} value={form.message} onChange={change} required />
        {error && <p role="alert">{error}</p>}
        <button type="submit" className="cb-submit-btn" disabled={sending}>
          {sending ? <><RefreshCw size={14} className="cb-spin" /> Sending…</> : <><Send size={14} /> Send Message</>}
        </button>
      </form>

      <div className="cb-expert-divider"><span>or reach us directly</span></div>
      <div className="cb-contact-alts">
        <a href="tel:+61288341222" className="cb-contact-alt"><Phone size={14} /> 02 8834 1222 (AU)</a>
        <a href="tel:+919610411400" className="cb-contact-alt"><Phone size={14} /> +91 96104 11400 (IN)</a>
        <a href="mailto:support@proowrx.com" className="cb-contact-alt"><Mail size={14} /> support@proowrx.com</a>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  CALCULATOR VIEW
// ════════════════════════════════════════════════════════════
const CALC_TABS = [
  { id: 'repayment', label: 'Repayment', emoji: '💰' },
  { id: 'borrowing', label: 'Borrowing', emoji: '🏦' },
  { id: 'stamp', label: 'Stamp Duty', emoji: '📄' },
  { id: 'extra', label: 'Extra Pay', emoji: '⚡' },
];

function CalcInput({ label, value, onChange, prefix, suffix, min, max, step, type = 'number' }) {
  return (
    <div className="cb-calc-field">
      <label>{label}</label>
      <div className="cb-calc-input-wrap">
        {prefix && <span className="cb-calc-prefix">{prefix}</span>}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          min={min}
          max={max}
          step={step || 'any'}
        />
        {suffix && <span className="cb-calc-suffix">{suffix}</span>}
      </div>
    </div>
  );
}

function ResultBox({ label, value, highlight }) {
  return (
    <div className={`cb-result-box${highlight ? ' cb-result-box--highlight' : ''}`}>
      <span className="cb-result-label">{label}</span>
      <span className="cb-result-value">{value}</span>
    </div>
  );
}

function RepaymentCalc() {
  const [loan, setLoan] = useState(500000);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(30);
  const r = calcRepayment(+loan, +rate, +term);
  return (
    <div className="cb-calc-body">
      <CalcInput label="Loan Amount" value={loan} onChange={setLoan} prefix="$" min={10000} max={5000000} step={5000} />
      <CalcInput label="Interest Rate (p.a.)" value={rate} onChange={setRate} suffix="%" min={0.1} max={20} step={0.05} />
      <CalcInput label="Loan Term" value={term} onChange={setTerm} suffix="yrs" min={1} max={30} step={1} />
      <div className="cb-results">
        <ResultBox label="Monthly Repayment" value={fmtAUD(r.monthly)} highlight />
        <ResultBox label="Total Interest" value={fmtAUD(r.totalInterest)} />
        <ResultBox label="Total Repayment" value={fmtAUD(r.totalRepayment)} />
      </div>
    </div>
  );
}

function BorrowingCalc() {
  const [income, setIncome] = useState(120000);
  const [expenses, setExpenses] = useState(3000);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(30);
  const r = calcBorrowing(+income, +expenses, +rate, +term);
  return (
    <div className="cb-calc-body">
      <CalcInput label="Annual Income (gross)" value={income} onChange={setIncome} prefix="$" min={20000} max={2000000} step={5000} />
      <CalcInput label="Monthly Living Expenses" value={expenses} onChange={setExpenses} prefix="$" min={0} max={30000} step={100} />
      <CalcInput label="Interest Rate (p.a.)" value={rate} onChange={setRate} suffix="%" min={0.1} max={20} step={0.05} />
      <CalcInput label="Loan Term" value={term} onChange={setTerm} suffix="yrs" min={1} max={30} step={1} />
      <div className="cb-results">
        <ResultBox label="Estimated Borrowing Power" value={r.maxLoan > 0 ? fmtAUD(r.maxLoan) : 'Insufficient surplus'} highlight />
        <p className="cb-calc-note">*Based on 80% income stress test. Actual approval depends on full lender assessment.</p>
      </div>
    </div>
  );
}

const STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];

function StampDutyCalc() {
  const [value, setValue] = useState(650000);
  const [state, setState] = useState('NSW');
  const [firstHome, setFirstHome] = useState(false);
  const duty = calcStampDuty(+value, state, firstHome);
  const total = +value + duty;
  return (
    <div className="cb-calc-body">
      <CalcInput label="Property Value" value={value} onChange={setValue} prefix="$" min={50000} max={10000000} step={5000} />
      <div className="cb-calc-field">
        <label>State / Territory</label>
        <select value={state} onChange={e => setState(e.target.value)} className="cb-calc-select">
          {STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <label className="cb-calc-checkbox">
        <input type="checkbox" checked={firstHome} onChange={e => setFirstHome(e.target.checked)} />
        First Home Buyer
      </label>
      <div className="cb-results">
        <ResultBox label="Estimated Stamp Duty" value={fmtAUD(duty)} highlight />
        <ResultBox label="Total Purchase Cost" value={fmtAUD(total)} />
        <p className="cb-calc-note">*Estimates only. Exact duty depends on individual circumstances. Consult your conveyancer.</p>
      </div>
    </div>
  );
}

function ExtraCalc() {
  const [loan, setLoan] = useState(500000);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(30);
  const [extra, setExtra] = useState(500);
  const r = calcExtra(+loan, +rate, +term, +extra);
  return (
    <div className="cb-calc-body">
      <CalcInput label="Remaining Loan" value={loan} onChange={setLoan} prefix="$" min={10000} max={5000000} step={5000} />
      <CalcInput label="Interest Rate (p.a.)" value={rate} onChange={setRate} suffix="%" min={0.1} max={20} step={0.05} />
      <CalcInput label="Remaining Term" value={term} onChange={setTerm} suffix="yrs" min={1} max={30} step={1} />
      <CalcInput label="Extra Monthly Payment" value={extra} onChange={setExtra} prefix="$" min={0} max={20000} step={50} />
      <div className="cb-results">
        <ResultBox label="Time Saved" value={r.monthsSaved > 0 ? fmtYrs(r.monthsSaved) : '0'} highlight />
        <ResultBox label="Interest Saved" value={r.interestSaved > 0 ? fmtAUD(r.interestSaved) : '$0'} highlight />
        <ResultBox label="New Monthly Payment" value={fmtAUD(r.newPayment || 0)} />
      </div>
    </div>
  );
}

function CalculatorView() {
  const [tab, setTab] = useState('repayment');
  return (
    <div className="cb-calculator">
      <div className="cb-view-heading">
        <span className="cb-view-icon">🧮</span>
        <div>
          <h4>Mortgage Calculators</h4>
          <p>Quick estimates to guide your planning</p>
        </div>
      </div>
      <div className="cb-calc-tabs">
        {CALC_TABS.map(t => (
          <button
            key={t.id}
            className={`cb-calc-tab${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span>{t.emoji}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>
      <div className="cb-calc-content">
        {tab === 'repayment' && <RepaymentCalc />}
        {tab === 'borrowing' && <BorrowingCalc />}
        {tab === 'stamp' && <StampDutyCalc />}
        {tab === 'extra' && <ExtraCalc />}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  AI CHAT VIEW
// ════════════════════════════════════════════════════════════
function AIView() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Hi! I'm the Proowrx AI. Ask me anything about our services, pricing, process, team, data security, or anything else about Proowrx. I'll do my best to help! 😊",
      buttons: ['What services do you offer?', 'How much does it cost?', 'How do I get started?'],
    },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const sendMessage = async (text) => {
    if (!text.trim() || thinking) return;
    const userMsg = { role: 'user', text: text.trim() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setThinking(true);
    await new Promise(r => setTimeout(r, 700 + Math.random() * 500));
    const match = matchKB(text);
    const reply = match || FALLBACK;
    setThinking(false);
    setMessages(m => [...m, { role: 'ai', text: reply.response, buttons: reply.buttons }]);
  };

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  return (
    <div className="cb-ai">
      <div className="cb-ai-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`cb-msg cb-msg--${msg.role}`}>
            {msg.role === 'ai' && <div className="cb-msg-avatar">🤖</div>}
            <div className="cb-msg-bubble">
              <div className="cb-msg-text">{msg.role === 'ai' ? renderAIText(msg.text) : msg.text}</div>
              {msg.buttons && msg.role === 'ai' && (
                <div className="cb-msg-buttons">
                  {msg.buttons.map((b, j) => (
                    <button key={j} className="cb-quick-reply" onClick={() => sendMessage(b)}>{b}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="cb-msg cb-msg--ai">
            <div className="cb-msg-avatar">🤖</div>
            <div className="cb-msg-bubble cb-typing">
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="cb-ai-input">
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type your question…"
          disabled={thinking}
          maxLength={300}
        />
        <button
          className="cb-ai-send"
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || thinking}
          aria-label="Send"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  SCHEDULE VIEW
// ════════════════════════════════════════════════════════════
function ScheduleView() {
  return (
    <div className="cb-schedule">
      <div className="cb-view-heading">
        <span className="cb-view-icon">📅</span>
        <div>
          <h4>Schedule a Discovery Call</h4>
          <p>Free 30-minute call with our team</p>
        </div>
      </div>
      <div className="cb-schedule-card">
        <div className="cb-schedule-details">
          <div className="cb-schedule-item"><Clock size={15} /> 30 minutes</div>
          <div className="cb-schedule-item"><Phone size={15} /> Phone or video</div>
          <div className="cb-schedule-item"><CheckCircle size={15} /> No obligation</div>
        </div>
        <p className="cb-schedule-desc">
          In 30 minutes, we&apos;ll understand your current workflow, identify where outsourcing can help most, and give you a clear picture of costs and timelines.
        </p>
        <a
          href="https://calendly.com/proowrx/30min"
          target="_blank"
          rel="noreferrer"
          className="cb-schedule-btn"
        >
          Book Now on Calendly <ExternalLink size={14} />
        </a>
      </div>
      <div className="cb-expert-divider"><span>or contact us directly</span></div>
      <div className="cb-contact-alts">
        <a href="tel:+61288341222" className="cb-contact-alt"><Phone size={14} /> 02 8834 1222 (AU)</a>
        <a href="tel:+919610411400" className="cb-contact-alt"><Phone size={14} /> +91 96104 11400 (IN)</a>
        <a href="mailto:support@proowrx.com" className="cb-contact-alt"><Mail size={14} /> support@proowrx.com</a>
      </div>
      <p className="cb-schedule-hours"><Clock size={12} /> Mon–Fri · 9AM–6PM (IST / AEDT)</p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  MAIN CHATBOT COMPONENT
// ════════════════════════════════════════════════════════════
export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('ai');
  const [pulse, setPulse] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setPulse(true), 3000);
    const t2 = setTimeout(() => setPulse(false), 6000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

  // Prevent the page from scrolling when the user scrolls inside the chatbot panel.
  // overscroll-behavior:contain (CSS) handles modern browsers; this covers older ones.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const stopScrollPropagation = (e) => {
      e.stopPropagation();
    };

    // { passive: false } lets stopPropagation work before browser-level scroll handling
    panel.addEventListener('wheel',     stopScrollPropagation, { passive: false });
    panel.addEventListener('touchmove', stopScrollPropagation, { passive: false });

    return () => {
      panel.removeEventListener('wheel',     stopScrollPropagation);
      panel.removeEventListener('touchmove', stopScrollPropagation);
    };
  }, []);

  const toggle = () => {
    setIsOpen(o => !o);
    if (!isOpen) setView('ai');
  };

  return (
    <>
      {/* ── Tooltip ── */}
      {!isOpen && pulse && (
        <div className="cb-tooltip">💬 How can we help?</div>
      )}

      {/* ── Panel ── */}
      <div ref={panelRef} className={`cb-panel${isOpen ? ' cb-panel--open' : ''}`} aria-hidden={!isOpen}>
        {/* Header */}
        <div className="cb-header">
          <div className="cb-header-left">
            <div className="cb-header-brand">
              <div className="cb-header-avatar"><Bot size={20} /></div>
              <div>
                <div className="cb-header-name">Proowrx Assistant</div>
                <div className="cb-header-status">
                  <span className="cb-status-dot" /> Online now
                </div>
              </div>
            </div>
          </div>
          <div className="cb-header-right">
            <button className="cb-icon-btn" onClick={toggle} aria-label="Close chat">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="cb-body">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={view}
              className="cb-view-stage"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {view === 'expert' && <ExpertView />}
              {view === 'calculator' && <CalculatorView />}
              {view === 'ai' && <AIView />}
              {view === 'schedule' && <ScheduleView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── FAB ── */}
      <button
        className={`cb-fab${isOpen ? ' cb-fab--open' : ''}${pulse && !isOpen ? ' cb-fab--pulse' : ''}`}
        onClick={toggle}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {!isOpen && <span className="cb-fab-ring" />}
        <span className="cb-fab-icon cb-fab-chat"><MessageCircle size={24} /></span>
        <span className="cb-fab-icon cb-fab-close"><X size={22} /></span>
      </button>
    </>
  );
}
