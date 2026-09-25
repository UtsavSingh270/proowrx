'use client';
import { useEffect, useMemo, useState } from 'react';
import { analytics } from '@/services/api';
import staticPages from '@/data/pages.json';
import './AnalyticsPanel.css';

const ranges = [['today', 'Today'], ['yesterday', 'Yesterday'], ['7d', 'Last 7 days'], ['month', 'This month'], ['30d', 'Last 30 days'], ['90d', 'Last 90 days'], ['custom', 'Custom dates']];
const number = value => new Intl.NumberFormat('en-AU').format(value || 0);
const INITIAL = { range: '7d', timezone: 'Australia/Sydney', path: '', start: '', end: '' };

function SeoReport({ report }) {
  if (!report) return <p className="analytics-no-data">Choose one page to inspect its SEO settings alongside its traffic.</p>;
  if (report.unavailable) return <p className="analytics-no-data">No editable SEO record was found for this URL.</p>;
  const checks = [
    ['Title', report.title ? `${report.title.length} characters` : 'Missing'],
    ['Description', report.description ? `${report.description.length} characters` : 'Missing'],
    ['Search indexing', report.indexable ? 'Allowed' : 'Noindex enabled'],
    ['Follow links', report.follow ? 'Allowed' : 'Nofollow enabled'],
  ];
  return <><div className="analytics-seo-checks">{checks.map(([label, value]) => <div key={label}><small>{label}</small><strong>{value}</strong></div>)}</div><dl className="analytics-seo-details">
    <dt>Page title {report.usesDefaultTitle ? '(default)' : '(custom)'}</dt><dd>{report.title || 'Not set'}</dd>
    <dt>Description {report.usesDefaultDescription ? '(default)' : '(custom)'}</dt><dd>{report.description || 'Not set'}</dd>
    <dt>Canonical</dt><dd>{report.canonical}</dd>
    <dt>Primary keywords</dt><dd>{report.seo.primaryKeywords || 'Not set'}</dd><dt>Secondary keywords</dt><dd>{report.seo.secondaryKeywords || 'Not set'}</dd>
    <dt>Social sharing title</dt><dd>{report.seo.ogTitle || report.title}</dd>
    <dt>Social image override</dt><dd>{report.seo.ogImage ? <a href={report.seo.ogImage} target="_blank" rel="noreferrer">View image</a> : 'Uses the page / cover default'}</dd>
  </dl><p className="dash-field-help">These are the current page settings. Search rankings, Google impressions, clicks and indexing status are not measured by this website tracker.</p></>;
}

export default function AnalyticsPanel() {
  const [draft, setDraft] = useState(INITIAL);
  const [filters, setFilters] = useState(INITIAL);
  const [revision, setRevision] = useState(0);
  const [data, setData] = useState(null);
  const [pages, setPages] = useState(staticPages);
  const [pageSearch, setPageSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pageError, setPageError] = useState('');
  const [hovered, setHovered] = useState(null);
  useEffect(() => {
    let active = true;
    analytics.getPages().then(result => { if (active) setPages(result); }).catch(() => { if (active) setPageError('Content-page choices could not load. Static pages are still available.'); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    let active = true;
    const query = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
    analytics.getSummary(query).then(result => { if (active) { setData(result); setError(''); } }).catch(err => { if (active) { setError(err.message); setData(null); } }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [filters, revision]);
  function apply(event) { event.preventDefault(); setLoading(true); setHovered(null); setFilters({ ...draft }); }
  function selectPage(path) { const next = { ...filters, path }; setDraft(next); setFilters(next); setLoading(true); }
  const chart = useMemo(() => {
    const points = data?.daily || [];
    const max = Math.max(1, ...points.map(point => point.views));
    return points.map((point, index) => ({ ...point, x: points.length === 1 ? 50 : index / (points.length - 1) * 100, y: 90 - point.views / max * 75 }));
  }, [data]);
  const line = chart.map(point => `${point.x},${point.y}`).join(' ');
  const filteredPages = pages.filter(page => page.path === draft.path || `${page.label} ${page.path}`.toLowerCase().includes(pageSearch.toLowerCase()));
  const totalSessions = data?.overview?.sessions || 0;
  return <section className="analytics-panel">
    <header className="analytics-header"><div><span className="analytics-eyebrow">Traffic & page SEO</span><h1>Website Analytics</h1><p>Explore consented visits, acquisition sources and individual pages.</p></div><button className="dash-btn dash-btn-ghost" disabled={loading} onClick={() => { setLoading(true); setRevision(value => value + 1); }}>Refresh</button></header>
    <form className="analytics-filter-form" onSubmit={apply}>
      <label>Period<select className="dash-form-select" value={draft.range} onChange={event => setDraft(current => ({ ...current, range: event.target.value }))}>{ranges.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
      <label>Reporting timezone<select className="dash-form-select" value={draft.timezone} onChange={event => setDraft(current => ({ ...current, timezone: event.target.value }))}>{['Australia/Sydney', 'Australia/Brisbane', 'Australia/Perth', 'UTC'].map(zone => <option key={zone}>{zone}</option>)}</select></label>
      {draft.range === 'custom' && <><label>From<input className="dash-form-input" type="date" required value={draft.start} onChange={event => setDraft(current => ({ ...current, start: event.target.value }))} /></label><label>Through (inclusive)<input className="dash-form-input" type="date" required min={draft.start} value={draft.end} onChange={event => setDraft(current => ({ ...current, end: event.target.value }))} /></label></>}
      <label>Find a page<input className="dash-form-input" type="search" placeholder="Search title or URL…" value={pageSearch} onChange={event => setPageSearch(event.target.value)} /></label>
      <label>Page<select className="dash-form-select" value={draft.path} onChange={event => setDraft(current => ({ ...current, path: event.target.value }))}><option value="">All pages</option>{filteredPages.map(page => <option key={page.path} value={page.path}>{page.label} — {page.path}</option>)}</select></label>
      <button className="dash-btn dash-btn-primary" disabled={loading}>Apply filters</button>
    </form>
    {pageError && <p role="status">{pageError}</p>}{error && <p role="alert" className="analytics-error">{error}</p>}
    {loading ? <p className="dash-empty" role="status">Loading analytics…</p> : data && <>
      <p className="analytics-period">{data.period.start} – {data.period.end} · {data.period.timezone} · {data.path || 'All pages'}</p>
      <div className="analytics-metrics">{[['Page views', data.overview.pageViews], ['Unique visitors', data.overview.uniqueVisitors], ['Sessions', totalSessions], ['Pages per session', data.overview.pagesPerSession]].map(([label, value]) => <article className="analytics-metric" key={label}><div><span>{label}</span><strong>{number(value)}</strong><small>Selected period and page</small></div></article>)}</div>
      {!data.overview.pageViews && <p className="analytics-empty">No consented visits match these filters. SEO settings remain available below.</p>}
      <div className="analytics-grid">
        <article className="analytics-card analytics-traffic"><div className="analytics-card-head"><h2>Daily page views</h2></div><div className="analytics-chart-wrap"><div className="analytics-chart-plot" onMouseLeave={() => setHovered(null)}><svg className="analytics-line-chart" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Daily views; use the points to inspect each date">{[20,40,60,80].map(y => <line key={y} x1="0" x2="100" y1={y} y2={y} className="analytics-gridline" />)}{line && <polyline points={line} className="analytics-line" />}</svg><div className="analytics-chart-hover-layer">{chart.map((point, index) => <button type="button" className="analytics-chart-point" style={{ left: `${point.x}%`, top: `${point.y}%` }} key={point.date} aria-label={`${point.date}: ${point.views} views, ${point.visitors} visitors`} onMouseEnter={() => setHovered(index)} onFocus={() => setHovered(index)} onBlur={() => setHovered(null)}><i />{hovered === index && <span className="analytics-chart-tooltip"><strong>{point.views} views</strong><small>{point.visitors} visitors</small><em>{point.date}</em></span>}</button>)}</div></div><div className="analytics-axis"><span>{chart[0]?.date}</span><span>{chart.at(-1)?.date}</span></div></div></article>
        <article className="analytics-card"><h2>Devices & browsers</h2><div className="analytics-referrer-list">{data.devices.map(item => <div key={item.label}><span>{item.label}</span><strong>{number(item.value)} views</strong></div>)}</div><hr /><div className="analytics-referrer-list">{data.browsers.map(item => <div key={item.label}><span>{item.label}</span><strong>{number(item.value)} views</strong></div>)}</div></article>
      </div>
      <article className="analytics-card analytics-wide-card"><h2>Acquisition sources</h2><p>Session entry source, campaign and channel. Older visits may have incomplete attribution.</p><div className="dash-table-wrap"><table className="dash-table"><thead><tr><th>Channel</th><th>Source</th><th>Medium / campaign</th><th>Sessions</th><th>Visitors</th><th>Views</th></tr></thead><tbody>{data.sources.map((row, index) => <tr key={index}><td>{row.channel}</td><td>{row.source}</td><td>{row.medium}{row.campaign && <small className="dash-table-time-note">{row.campaign}</small>}</td><td>{number(row.sessions)}</td><td>{number(row.visitors)}</td><td>{number(row.views)}</td></tr>)}</tbody></table>{!data.sources.length && <p>No sources recorded for this selection.</p>}</div></article>
      <article className="analytics-card analytics-wide-card"><h2>Page performance</h2><p>Select a URL to inspect its traffic and SEO separately.</p><div className="analytics-table"><div className="analytics-table-row heading"><span>Page</span><span>Visitors</span><span>Views</span></div>{data.pages.map(page => <div className="analytics-table-row" key={page.path}><button type="button" className="analytics-page-link" onClick={() => selectPage(page.path)}>{page.path}</button><span>{number(page.visitors)}</span><strong>{number(page.views)}</strong></div>)}</div></article>
      <article className="analytics-card analytics-wide-card"><h2>Page SEO settings</h2><SeoReport report={data.pageSeo} /></article>
    </>}
  </section>;
}
