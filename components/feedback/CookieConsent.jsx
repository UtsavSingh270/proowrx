'use client';

import { useSyncExternalStore, useState } from 'react';
import Link from 'next/link';
import { Settings2, ShieldCheck } from 'lucide-react';
import './CookieConsent.css';

const COOKIE_NAME = 'proowrx_cookie_consent';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180;
const subscribe = () => () => {};

function currentChoice() {
  if (typeof document === 'undefined') return '';
  return document.cookie.split('; ').find(row => row.startsWith(`${COOKIE_NAME}=`))?.split('=')[1] || '';
}

export default function CookieConsent() {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [dismissed, setDismissed] = useState(false);
  const open = hydrated && !dismissed && !currentChoice();
  const [details, setDetails] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  function writeCookie(name, value, maxAge) {
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${name}=${value}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
  }

  function choose(value) {
    writeCookie(COOKIE_NAME, value, COOKIE_MAX_AGE);
    if (value === 'declined') {
      writeCookie('proowrx_analytics_visitor', '', 0);
      sessionStorage.removeItem('proowrx_analytics_session');
    } else {
      window.dispatchEvent(new Event('proowrx:analytics-consent'));
    }
    window.dispatchEvent(new Event('proowrx:consent-choice'));
    setDismissed(true);
    setDetails(false);
  }

  if (!open) return null;

  return (
    <div className="cookie-consent" role="region" aria-labelledby="cookie-title">
      <div className="cookie-consent-copy">
        <span className="cookie-consent-kicker"><ShieldCheck size={14} /> Privacy preferences</span>
        <h2 id="cookie-title">We respect your privacy</h2>
        <p>We use essential cookies to keep this website working. With your permission, we also use first-party analytics cookies to understand website usage and improve your experience. We never sell your personal information.</p>
        {details && (
          <div className="cookie-consent-details">
            <div className="cookie-preference-row">
              <div><strong>Essential cookies</strong><span>Required for security and to remember your consent choice.</span></div>
              <span className="cookie-always-on">Always on</span>
            </div>
            <label className="cookie-preference-row" htmlFor="analytics-cookies">
              <div><strong>Analytics cookies</strong><span>Helps us measure anonymous visits, devices and website performance.</span></div>
              <input id="analytics-cookies" type="checkbox" checked={analyticsEnabled} onChange={event => setAnalyticsEnabled(event.target.checked)} />
              <span className="cookie-toggle" aria-hidden="true" />
            </label>
          </div>
        )}
        <Link href="/privacy-policy" className="cookie-consent-link">Privacy &amp; Cookie Policy</Link>
      </div>
      <div className="cookie-consent-actions">
        <button className="cookie-consent-settings" onClick={() => setDetails(value => !value)}><Settings2 size={16} /> {details ? 'Hide preferences' : 'Manage preferences'}</button>
        {details ? (
          <button className="cookie-consent-save" onClick={() => choose(analyticsEnabled ? 'accepted' : 'declined')}>Save preferences</button>
        ) : (
          <>
            <button className="cookie-consent-reject" onClick={() => choose('declined')}>Reject optional</button>
            <button className="cookie-consent-accept" onClick={() => choose('accepted')}>Accept all</button>
          </>
        )}
      </div>
    </div>
  );
}
