'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const CONSENT_COOKIE = 'proowrx_cookie_consent';
const VISITOR_COOKIE = 'proowrx_analytics_visitor';
const API_URL = '';

function readCookie(name) {
  return document.cookie.split('; ').find(row => row.startsWith(`${name}=`))?.split('=')[1] || '';
}

function randomId(prefix) {
  return `${prefix}-${crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
}

function visitorId() {
  let id = readCookie(VISITOR_COOKIE);
  if (!id) {
    id = randomId('visitor');
    document.cookie = `${VISITOR_COOKIE}=${encodeURIComponent(id)}; Max-Age=34128000; Path=/; SameSite=Lax; Secure`;
  }
  return decodeURIComponent(id);
}

function sessionId() {
  let id = sessionStorage.getItem('proowrx_analytics_session');
  const lastSeen = Number(sessionStorage.getItem('proowrx_analytics_last_seen') || 0);
  if (!id || Date.now() - lastSeen > 30 * 60 * 1000) {
    id = randomId('session');
    sessionStorage.setItem('proowrx_analytics_session', id);
    sessionStorage.removeItem('proowrx_analytics_acquisition');
  }
  sessionStorage.setItem('proowrx_analytics_last_seen', String(Date.now()));
  return id;
}

function browserName(agent) {
  if (agent.includes('Edg/')) return 'Edge';
  if (agent.includes('Firefox/')) return 'Firefox';
  if (agent.includes('Chrome/')) return 'Chrome';
  if (agent.includes('Safari/')) return 'Safari';
  return 'Other';
}

function operatingSystem(agent) {
  if (agent.includes('Windows')) return 'Windows';
  if (agent.includes('Android')) return 'Android';
  if (agent.includes('iPhone') || agent.includes('iPad')) return 'iOS';
  if (agent.includes('Mac OS')) return 'macOS';
  if (agent.includes('Linux')) return 'Linux';
  return 'Other';
}

function deviceType() {
  if (window.innerWidth < 768) return 'mobile';
  if (window.innerWidth < 1100) return 'tablet';
  return 'desktop';
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastPage = useRef('');

  useEffect(() => {
    let idleId;
    let timerId;

    const track = () => {
      if (readCookie(CONSENT_COOKIE) !== 'accepted') return;
      const page = pathname;
      if (lastPage.current === page) return;
      lastPage.current = page;
      const params = new URLSearchParams(window.location.search);
      const session = sessionId();
      let acquisition;
      try { acquisition = JSON.parse(sessionStorage.getItem('proowrx_analytics_acquisition')); } catch {}
      if (!acquisition) {
        let referrer = '';
        try { const url = new URL(document.referrer); if (url.origin !== window.location.origin) referrer = url.origin; } catch {}
        acquisition = { referrer, campaign: { source: params.get('utm_source') || '', medium: params.get('utm_medium') || '', name: params.get('utm_campaign') || '' } };
        sessionStorage.setItem('proowrx_analytics_acquisition', JSON.stringify(acquisition));
      }
      const payload = JSON.stringify({
        visitorId: visitorId(),
        sessionId: session,
        path: page,
        title: document.title,
        referrer: acquisition.referrer,
        device: deviceType(),
        browser: browserName(navigator.userAgent),
        operatingSystem: operatingSystem(navigator.userAgent),
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        campaign: acquisition.campaign,
      });

      fetch(`${API_URL}/api/analytics/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    };

    const schedule = () => {
      if ('requestIdleCallback' in window) idleId = window.requestIdleCallback(track, { timeout: 1500 });
      else timerId = window.setTimeout(track, 400);
    };

    schedule();
    window.addEventListener('proowrx:analytics-consent', schedule);
    return () => {
      window.removeEventListener('proowrx:analytics-consent', schedule);
      if (idleId) window.cancelIdleCallback(idleId);
      if (timerId) window.clearTimeout(timerId);
    };
  }, [pathname]);

  return null;
}
