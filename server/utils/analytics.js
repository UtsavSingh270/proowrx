const DAY = 86400000;
function dateInZone(value, timeZone) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(value).map(part => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}
function validDay(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value || '') && !Number.isNaN(Date.parse(value)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
}
function addDays(value, days) { return new Date(Date.parse(`${value}T00:00:00Z`) + days * DAY).toISOString().slice(0, 10); }
function dayStart(value, timeZone) {
  const wanted = Date.parse(`${value}T00:00:00Z`);
  let instant = wanted;
  const format = new Intl.DateTimeFormat('en-GB', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
  for (let i = 0; i < 3; i++) {
    const p = Object.fromEntries(format.formatToParts(new Date(instant)).map(part => [part.type, part.value]));
    const local = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
    instant += wanted - local;
  }
  return new Date(instant);
}
function analyticsRange(query, now = new Date()) {
  const timeZone = String(query.timezone || 'Australia/Sydney');
  let today;
  try { today = dateInZone(now, timeZone); } catch { throw new Error('Invalid reporting timezone'); }
  const range = query.range || '30d';
  let start, end = today;
  if (range === 'today') start = today;
  else if (range === 'yesterday') start = end = addDays(today, -1);
  else if (range === 'month') start = `${today.slice(0, 7)}-01`;
  else if (['7d', '30d', '90d'].includes(range)) start = addDays(today, 1 - parseInt(range, 10));
  else if (range === 'custom') { start = query.start; end = query.end; }
  else throw new Error('Invalid date range');
  if (!validDay(start) || !validDay(end) || start > end || end > today) throw new Error('Choose valid start and end dates, ending no later than today');
  if ((Date.parse(end) - Date.parse(start)) / DAY >= 395) throw new Error('Choose a range of up to 395 days');
  return { range, start, end, timeZone, from: dayStart(start, timeZone), until: dayStart(addDays(end, 1), timeZone) };
}
function trafficSource(referrer = '', campaign = {}, siteHost = 'proowrx.com') {
  let host = '';
  try { host = new URL(referrer.includes('://') ? referrer : `https://${referrer}`).hostname.replace(/^www\./, ''); } catch {}
  const source = String(campaign.source || '').trim();
  const medium = String(campaign.medium || '').toLowerCase();
  let channel;
  if (/cpc|ppc|paid|display/.test(medium)) channel = 'Paid';
  else if (/email/.test(medium)) channel = 'Email';
  else if (/social/.test(medium) || /(^|\.)(facebook|instagram|linkedin|tiktok|twitter|x|youtube)\.com$|(^|\.)t\.co$/.test(host)) channel = 'Social';
  else if (medium === 'organic' || /(^|\.)(google\.[a-z.]+|bing\.com|yahoo\.com|duckduckgo\.com)$/.test(host)) channel = 'Organic search';
  else if (source) channel = 'Campaign';
  else if (!host || host === siteHost.replace(/^www\./, '')) channel = 'Direct';
  else channel = 'Referral';
  return { channel, source: source || (channel === 'Direct' ? 'Direct / unknown' : host), medium: medium || (channel === 'Direct' ? 'none' : channel.toLowerCase()), campaign: campaign.name || '' };
}
function sourceRows(groups, siteHost) {
  const merged = new Map();
  for (const group of groups) {
    const source = trafficSource(group._id.referrer, { source: group._id.source, medium: group._id.medium, name: group._id.campaign }, siteHost);
    const key = JSON.stringify(source);
    if (!merged.has(key)) merged.set(key, { ...source, views: 0, sessionSet: new Set(), visitorSet: new Set() });
    const row = merged.get(key); row.views += group.views;
    (group.sessions || []).forEach(value => row.sessionSet.add(value));
    (group.visitors || []).forEach(value => row.visitorSet.add(value));
  }
  return [...merged.values()].map(({ sessionSet, visitorSet, ...row }) => ({ ...row, sessions: sessionSet.size, visitors: visitorSet.size })).sort((a, b) => b.sessions - a.sessions);
}
module.exports = { analyticsRange, addDays, dateInZone, trafficSource, sourceRows };
