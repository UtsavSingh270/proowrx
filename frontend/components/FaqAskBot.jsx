'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, Bot, User } from 'lucide-react';
import { matchKB, FALLBACK, renderAIText } from '../data/chatbotKB';
import './FaqAskBot.css';

const STARTER_QUESTIONS = [
  'What services do you offer?',
  'How do I get started?',
  'How much does it cost?',
  'Is my data secure?',
];

export default function FaqAskBot() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Hi! Ask me anything about Proowrx's services, pricing, or how to get started — I'll do my best to answer right here.",
      buttons: STARTER_QUESTIONS,
    },
  ]);
  const [input, setInput] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  function ask(question) {
    const text = question.trim();
    if (!text) return;
    const reply = matchKB(text) || FALLBACK;
    setMessages(prev => [
      ...prev,
      { role: 'user', text },
      { role: 'ai', text: reply.response, buttons: reply.buttons },
    ]);
    setInput('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    ask(input);
  }

  const lastButtons = messages[messages.length - 1]?.buttons || [];

  return (
    <div className="faqbot-card">
      <div className="faqbot-header">
        <span className="faqbot-header-icon"><MessageCircle size={18} /></span>
        <div>
          <h3>Still Have Questions?</h3>
          <p>Ask our assistant — it can answer most common questions instantly.</p>
        </div>
      </div>

      <div className="faqbot-messages" ref={listRef}>
        {messages.map((m, i) => (
          <div key={i} className={`faqbot-msg faqbot-msg--${m.role}`}>
            <span className="faqbot-msg-icon">{m.role === 'ai' ? <Bot size={14} /> : <User size={14} />}</span>
            <div className="faqbot-msg-text">{m.role === 'ai' ? renderAIText(m.text) : m.text}</div>
          </div>
        ))}
      </div>

      {lastButtons.length > 0 && (
        <div className="faqbot-suggestions">
          {lastButtons.map(b => (
            <button key={b} type="button" className="faqbot-suggestion" onClick={() => ask(b)}>
              {b}
            </button>
          ))}
        </div>
      )}

      <form className="faqbot-input-row" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your question…"
          aria-label="Ask a question"
        />
        <button type="submit" className="faqbot-send" disabled={!input.trim()} aria-label="Send">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
