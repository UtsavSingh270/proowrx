'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  X, ChevronLeft, ChevronRight, Calendar as CalendarIcon,
  Clock, ArrowLeft, ArrowRight, CheckCircle,
} from 'lucide-react';
import { meetings } from '../services/api';
import './BookMeetingModal.css';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function pad(n) { return String(n).padStart(2, '0'); }
function toDateStr(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }

/* Current wall-clock date/time in Sydney, independent of the visitor's local timezone */
function getSydneyNow() {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Australia/Sydney',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(new Date()).map(p => [p.type, p.value]));
  return {
    year: Number(parts.year),
    month: Number(parts.month) - 1,
    day: Number(parts.day),
    minutes: (Number(parts.hour) % 24) * 60 + Number(parts.minute),
  };
}

/* Mon–Fri 9:00 AM – 5:30 PM · Sat 9:00 AM – 12:30 PM · 30-min slots · closed Sunday */
function slotsForDate(d) {
  const day = d.getDay();
  if (day === 0) return [];
  const start = 9 * 60;
  const end = day === 6 ? 12 * 60 + 30 : 17 * 60 + 30;
  const out = [];
  for (let t = start; t + 30 <= end; t += 30) out.push(`${pad(Math.floor(t / 60))}:${pad(t % 60)}`);
  return out;
}

function fmtTime(t) {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${pad(m)} ${period}`;
}

export default function BookMeetingModal({ person, onClose }) {
  const modalRef = useRef(null);
  const touchYRef = useRef(null);
  const sydneyNow = useMemo(() => getSydneyNow(), []);
  const today = useMemo(() => new Date(sydneyNow.year, sydneyNow.month, sydneyNow.day), [sydneyNow]);
  const maxDate = useMemo(() => { const d = new Date(today); d.setDate(d.getDate() + 60); return d; }, [today]);

  const [viewDate, setViewDate]         = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookedTimes, setBookedTimes]   = useState([]);
  const [step, setStep]                 = useState('schedule'); // schedule | details | success
  const [form, setForm]                 = useState({ name: '', email: '', phone: '', reason: '' });
  const [submitting, setSubmitting]     = useState(false);
  const [error, setError]               = useState('');

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [onClose]);

  useEffect(() => {
    if (!selectedDate) return;
    meetings.getBooked(person.name, toDateStr(selectedDate)).then(setBookedTimes).catch(() => setBookedTimes([]));
  }, [selectedDate, person.name]);

  const firstWeekday  = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  const daysInMonth   = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewDate.getFullYear(), viewDate.getMonth(), d));

  function isDisabled(d) {
    if (!d) return true;
    if (d < today) return true;
    if (d > maxDate) return true;
    if (d.getDay() === 0) return true;
    return false;
  }

  function pickDate(d) {
    if (isDisabled(d)) return;
    setSelectedDate(d);
    setSelectedTime(null);
  }

  function changeMonth(delta) {
    const next = new Date(viewDate.getFullYear(), viewDate.getMonth() + delta, 1);
    const floor = new Date(today.getFullYear(), today.getMonth(), 1);
    if (next < floor) return;
    setViewDate(next);
  }

  const isToday = selectedDate && toDateStr(selectedDate) === toDateStr(today);
  const slots = selectedDate
    ? slotsForDate(selectedDate).filter(t => {
        if (!isToday) return true;
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m > sydneyNow.minutes;
      })
    : [];

  async function submitBooking(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await meetings.book({
        person: person.name,
        personEmail: person.email,
        date: toDateStr(selectedDate),
        time: selectedTime,
        timezone: 'Australia/Sydney',
        ...form,
      });
      setStep('success');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try another time.');
    } finally {
      setSubmitting(false);
    }
  }

  function getScrollableTarget(target) {
    const node = target.closest?.('.bm-slots-grid') || modalRef.current;
    if (!node) return null;
    return node.scrollHeight > node.clientHeight ? node : modalRef.current;
  }

  function scrollInsideModal(deltaY, target) {
    const node = getScrollableTarget(target);
    if (!node) return;
    node.scrollTop += deltaY;
  }

  function handleWheel(e) {
    e.preventDefault();
    e.stopPropagation();
    scrollInsideModal(e.deltaY, e.target);
  }

  function handleTouchStart(e) {
    touchYRef.current = e.touches[0]?.clientY ?? null;
  }

  function handleTouchMove(e) {
    if (touchYRef.current === null) return;
    const nextY = e.touches[0]?.clientY ?? touchYRef.current;
    const deltaY = touchYRef.current - nextY;
    touchYRef.current = nextY;
    e.preventDefault();
    e.stopPropagation();
    scrollInsideModal(deltaY, e.target);
  }

  return (
    <div className="bm-overlay" onClick={onClose}>
      <div
        ref={modalRef}
        className="bm-modal"
        onClick={e => e.stopPropagation()}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <button className="bm-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className="bm-header">
          <img src={person.img} alt={person.name} className="bm-header-avatar" />
          <div>
            <span className="bm-header-eyebrow">Book a Meeting with</span>
            <h3>{person.name}</h3>
          </div>
        </div>

        {step === 'schedule' && (
          <>
            <div className="bm-body">
              <div className="bm-calendar">
                <div className="bm-cal-nav">
                  <button type="button" onClick={() => changeMonth(-1)} aria-label="Previous month"><ChevronLeft size={18} /></button>
                  <span>{MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
                  <button type="button" onClick={() => changeMonth(1)} aria-label="Next month"><ChevronRight size={18} /></button>
                </div>
                <div className="bm-cal-weekdays">
                  {WEEKDAYS.map(w => <span key={w}>{w}</span>)}
                </div>
                <div className="bm-cal-grid">
                  {cells.map((d, i) => (
                    <button
                      key={i}
                      type="button"
                      disabled={isDisabled(d)}
                      className={`bm-cal-cell${d && selectedDate && toDateStr(d) === toDateStr(selectedDate) ? ' selected' : ''}`}
                      onClick={() => pickDate(d)}
                    >
                      {d ? d.getDate() : ''}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bm-slots">
                <div className="bm-slots-header">
                  <Clock size={14} /> Available Times <span className="bm-tz-note">(Australian Eastern Time)</span>
                </div>
                {!selectedDate ? (
                  <div className="bm-slots-empty">Select a date to see available times.</div>
                ) : slots.length === 0 ? (
                  <div className="bm-slots-empty">
                    {isToday ? 'No more times available today — please pick another date.' : 'Closed on Sundays — please pick another date.'}
                  </div>
                ) : (
                  <div className="bm-slots-grid">
                    {slots.map(t => {
                      const taken = bookedTimes.includes(t);
                      return (
                        <button
                          key={t}
                          type="button"
                          disabled={taken}
                          aria-pressed={selectedTime === t}
                          className={`bm-slot${selectedTime === t ? ' selected' : ''}${taken ? ' taken' : ''}`}
                          onClick={() => setSelectedTime(t)}
                        >
                          {fmtTime(t)}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="bm-footer">
              <button
                type="button"
                className="btn btn-gold"
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep('details')}
              >
                Next <ArrowRight size={14} />
              </button>
            </div>
          </>
        )}

        {step === 'details' && (
          <form className="bm-body bm-details-form" onSubmit={submitBooking}>
            <div className="bm-summary">
              <CalendarIcon size={15} />
              <span>
                {selectedDate.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })} · {fmtTime(selectedTime)} AEDT
              </span>
            </div>
            <div className="bm-form-group">
              <label>Your Name *</label>
              <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="John Smith" />
            </div>
            <div className="bm-form-group">
              <label>Email Address *</label>
              <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="john@example.com" />
            </div>
            <div className="bm-form-group">
              <label>Phone Number</label>
              <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+61 4xx xxx xxx" />
            </div>
            <div className="bm-form-group">
              <label>Reason for Meeting *</label>
              <textarea required rows={3} value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))} placeholder="What would you like to discuss?" />
            </div>
            {error && <div className="bm-error">{error}</div>}
            <div className="bm-actions">
              <button type="button" className="btn btn-outline-gold" onClick={() => setStep('schedule')}>
                <ArrowLeft size={14} /> Back
              </button>
              <button type="submit" className="btn btn-gold" disabled={submitting}>
                {submitting ? 'Booking…' : <>Confirm Booking <ArrowRight size={14} /></>}
              </button>
            </div>
          </form>
        )}

        {step === 'success' && (
          <div className="bm-body bm-success">
            <div className="bm-success-icon"><CheckCircle size={40} /></div>
            <h4>Meeting Booked!</h4>
            <p>
              Your meeting with {person.name} is confirmed for{' '}
              {selectedDate.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })} at {fmtTime(selectedTime)} (AEDT).
              A confirmation has been sent to your email.
            </p>
            <button className="btn btn-gold" onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

BookMeetingModal.propTypes = {
  person: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string,
    img: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};
