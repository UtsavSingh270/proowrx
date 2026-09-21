'use client';

import { useEffect, useMemo, useState } from 'react';
import { Activity, BarChart3, BookOpen, Eye, Heart, MonitorSmartphone, RefreshCw, Users } from 'lucide-react';
import { analytics } from '@/services/api';
import './AnalyticsPanel.css';

const ranges = [['7d', '7 days'], ['30d', '30 days'], ['90d', '90 days']];

function number(value) {
  return new Intl.NumberFormat('en-AU').format(value || 0);
}

function Metric({ icon, label, value, note, live }) {
  return (
    <article className="analytics-metric">
      <div className="analytics-metric-icon">{icon}</div>
      <div><span>{label}</span><strong>{value}</strong><small>{live && <i />} {note}</small></div>
    </article>
  );
}

function EmptyState() {
  return <div className="analytics-empty"><BarChart3 size={28} /><strong>Analytics is ready</strong><span>Accepted visitor activity will appear here.</span></div>;
}

export default function AnalyticsPanel() {
  const [range, setRange] = useState('30d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  async function load() {
    setLoading(true);
    setError('');
    try { setData(await analytics.getSummary(range)); }
    catch (requestError) { setError(requestError.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [range]); // eslint-disable-line react-hooks/exhaustive-deps

  const chart = useMemo(() => {
    const points = data?.daily || [];
    const max = Math.max(1, ...points.map(point => point.views));
    return points.map((point, index) => ({ ...point, x: points.length === 1 ? 50 : (index / (points.length - 1)) * 100, y: 92 - (point.views / max) * 78 }));
  }, [data]);

  const line = chart.map(point => `${point.x},${point.y}`).join(' ');
  const totalDevices = data?.devices?.reduce((sum, item) => sum + item.value, 0) || 1;
  const palette = ['#f0a500', '#4676ed', '#6f56d9', '#23a67a'];
  let degree = 0;
  const deviceGradient = data?.devices?.map((item, index) => {
    const start = degree;
    degree += item.value / totalDevices * 360;
    return `${palette[index % palette.length]} ${start}deg ${degree}deg`;
  }).join(', ') || '#e8edf5 0deg 360deg';

  return (
    <section className="analytics-panel">
      <header className="analytics-header">
        <div><span className="analytics-eyebrow">Privacy-first insights</span><h1>Website Analytics</h1><p>Fast, first-party reporting from visitors who accepted analytics cookies.</p></div>
        <div className="analytics-controls">
          <div className="analytics-range">{ranges.map(([value, label]) => <button key={value} className={range === value ? 'active' : ''} onClick={() => setRange(value)}>{label}</button>)}</div>
          <button className="analytics-refresh" onClick={load} disabled={loading} aria-label="Refresh analytics"><RefreshCw size={16} className={loading ? 'spin' : ''} /></button>
        </div>
      </header>

      {error && <div className="analytics-error">{error}</div>}
      <div className="analytics-metrics">
        <Metric icon={<Eye size={20} />} label="Page views" value={number(data?.overview?.pageViews)} note={`Last ${range.replace('d', ' days')}`} />
        <Metric icon={<Users size={20} />} label="Unique visitors" value={number(data?.overview?.uniqueVisitors)} note="Consented visitors" />
        <Metric icon={<Activity size={20} />} label="Live now" value={number(data?.overview?.liveUsers)} note="Last 5 minutes" live />
        <Metric icon={<MonitorSmartphone size={20} />} label="Pages / session" value={data?.overview?.pagesPerSession || '0'} note={`${number(data?.overview?.sessions)} sessions`} />
      </div>

      <section className="analytics-blog-section">
        <div className="analytics-blog-heading">
          <div><span className="analytics-eyebrow">Content performance</span><h2>Blog Analytics</h2><p>Post engagement totals and consented blog traffic for the selected period.</p></div>
        </div>
        <div className="analytics-blog-metrics">
          <Metric icon={<Eye size={20} />} label="Blog views" value={number(data?.blog?.overview?.views)} note="All-time post views" />
          <Metric icon={<Heart size={20} />} label="Total likes" value={number(data?.blog?.overview?.likes)} note={`${data?.blog?.overview?.engagementRate || 0}% like rate`} />
          <Metric icon={<BookOpen size={20} />} label="Published posts" value={number(data?.blog?.overview?.publishedPosts)} note={`${number(data?.blog?.overview?.totalPosts)} total posts`} />
          <Metric icon={<Users size={20} />} label="Blog visitors" value={number(data?.blog?.overview?.periodVisitors)} note={`${number(data?.blog?.overview?.periodPageViews)} views in ${range}`} />
        </div>
        <div className="analytics-blog-grid">
          <article className="analytics-card analytics-blog-posts">
            <div className="analytics-card-head"><div><h2>Top-performing posts</h2><p>Ranked by recorded post views</p></div></div>
            {data?.blog?.topPosts?.length ? <div className="analytics-blog-table">
              <div className="analytics-blog-row heading"><span>Post</span><span>Status</span><span>Views</span><span>Likes</span></div>
              {data.blog.topPosts.map((post, index) => <div className="analytics-blog-row" key={post.slug || post.title}>
                <span><i>{String(index + 1).padStart(2, '0')}</i><span><strong>{post.title}</strong><small>{post.category || 'General'}</small></span></span>
                <span className={`analytics-post-status ${post.status}`}>{post.status}</span>
                <strong>{number(post.views)}</strong><strong>{number(post.likes)}</strong>
              </div>)}
            </div> : <p className="analytics-no-data">No blog posts available yet.</p>}
          </article>
          <article className="analytics-card analytics-blog-categories">
            <div className="analytics-card-head"><div><h2>Category performance</h2><p>Views across content topics</p></div></div>
            <div className="analytics-bars">{data?.blog?.categories?.map(item => { const max = data.blog.categories[0]?.views || 1; return <div key={item.label}><span title={item.label}>{item.label}</span><div><i style={{ width: `${item.views / max * 100}%` }} /></div><strong>{number(item.views)}</strong></div>; })}</div>
          </article>
        </div>
      </section>

      {!loading && !data?.overview?.pageViews ? <EmptyState /> : (
        <div className="analytics-grid">
          <article className="analytics-card analytics-traffic">
            <div className="analytics-card-head"><div><h2>Traffic overview</h2><p>Page views across the selected period</p></div><span>{number(data?.overview?.pageViews)} total</span></div>
            <div className="analytics-chart-wrap">
              <div className="analytics-chart-plot" onMouseLeave={() => setHoveredPoint(null)}>
                <svg className="analytics-line-chart" viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Daily page views chart">
                  <defs><linearGradient id="analytics-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f0a500" stopOpacity=".3"/><stop offset="1" stopColor="#f0a500" stopOpacity="0"/></linearGradient></defs>
                  {[20,40,60,80].map(y => <line key={y} x1="0" x2="100" y1={y} y2={y} className="analytics-gridline" />)}
                  {line && <><polygon points={`0,100 ${line} 100,100`} fill="url(#analytics-fill)"/><polyline points={line} className="analytics-line"/></>}
                </svg>
                <div className="analytics-chart-hover-layer">
                  {chart.map((point, index) => <button
                    key={point.date}
                    type="button"
                    className={`analytics-chart-point${hoveredPoint === index ? ' active' : ''}`}
                    style={{ left: `${point.x}%`, top: `${point.y}%` }}
                    onMouseEnter={() => setHoveredPoint(index)}
                    onFocus={() => setHoveredPoint(index)}
                    onBlur={() => setHoveredPoint(null)}
                    aria-label={`${point.date}: ${point.views} views and ${point.visitors} visitors`}
                  >
                    <i />
                    {hoveredPoint === index && <span className="analytics-chart-tooltip"><strong>{number(point.views)} views</strong><small>{number(point.visitors)} visitors</small><em>{point.date}</em></span>}
                  </button>)}
                </div>
              </div>
              <div className="analytics-axis"><span>{chart[0]?.date || ''}</span><span>{chart.at(-1)?.date || ''}</span></div>
            </div>
          </article>

          <article className="analytics-card analytics-devices">
            <div className="analytics-card-head"><div><h2>Devices</h2><p>Visitor screen category</p></div></div>
            <div className="analytics-donut" style={{ background: `conic-gradient(${deviceGradient})` }}><div><strong>{number(data?.overview?.uniqueVisitors)}</strong><span>visitors</span></div></div>
            <div className="analytics-legend">{data?.devices?.map((item, index) => <div key={item.label}><i style={{ background: palette[index % palette.length] }} /><span>{item.label}</span><strong>{Math.round(item.value / totalDevices * 100)}%</strong></div>)}</div>
          </article>

          <article className="analytics-card analytics-pages">
            <div className="analytics-card-head"><div><h2>Top pages</h2><p>Most visited website destinations</p></div></div>
            <div className="analytics-table"><div className="analytics-table-row heading"><span>Page</span><span>Visitors</span><span>Views</span></div>{data?.pages?.map(page => <div className="analytics-table-row" key={page.path}><span title={page.path}>{page.path}</span><span>{number(page.visitors)}</span><strong>{number(page.views)}</strong></div>)}</div>
          </article>

          <article className="analytics-card analytics-sources">
            <div className="analytics-card-head"><div><h2>Browsers</h2><p>Technology used by visitors</p></div></div>
            <div className="analytics-bars">{data?.browsers?.map(item => { const max = data.browsers[0]?.value || 1; return <div key={item.label}><span>{item.label}</span><div><i style={{ width: `${item.value / max * 100}%` }} /></div><strong>{number(item.value)}</strong></div>; })}</div>
          </article>

          <article className="analytics-card analytics-referrers">
            <div className="analytics-card-head"><div><h2>Referral sources</h2><p>Where visitors arrived from</p></div></div>
            {data?.referrers?.length ? <div className="analytics-referrer-list">{data.referrers.map(item => <div key={item.label}><span title={item.label}>{item.label}</span><strong>{number(item.value)}</strong></div>)}</div> : <p className="analytics-no-data">No external referrals in this period.</p>}
          </article>
        </div>
      )}
    </section>
  );
}
