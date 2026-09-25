'use client';

import { useId, useRef, useState } from 'react';
import pages from '@/data/pages.json';

export default function PagePicker({ value = [], onChange, contentLabel = 'insight', includeHome = true }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const id = useId();
  const input = useRef(null);
  const destinations = pages.filter(page => page.insights && (includeHome || page.path !== '/'));
  const selected = value.filter(path => includeHome || path !== '/');
  const matches = destinations.filter(page => `${page.label} ${page.path} ${page.aliases || ''}`.toLowerCase().includes(query.toLowerCase()));
  const toggle = path => onChange(selected.includes(path) ? selected.filter(item => item !== path) : [...selected, path]);
  return <div className="dash-form-group dash-page-picker" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }} onKeyDown={event => { if (event.key === 'Escape') { input.current?.focus(); setOpen(false); } }}>
    <label className="dash-form-label" htmlFor={id}>Show this {contentLabel} on</label>
    <div className="dash-picker-search">
      <input ref={input} id={id} className="dash-form-input" type="search" role="combobox" aria-autocomplete="list" value={query} placeholder="Search home or service pages…" aria-expanded={open} aria-controls={`${id}-options`} onFocus={() => setOpen(true)} onChange={event => { setQuery(event.target.value); setOpen(true); }} onKeyDown={event => { if (event.key === 'ArrowDown') { event.preventDefault(); setOpen(true); } }} />
      <button type="button" className="dash-btn dash-btn-ghost" onClick={() => setOpen(!open)} aria-label="Toggle page choices" aria-expanded={open}>▾</button>
    </div>
    {open && <div id={`${id}-options`} className="dash-picker-options" role="group" aria-label="Insight destination pages">
      {matches.length ? matches.map(page => <label key={page.path} className="dash-picker-option">
        <input type="checkbox" checked={selected.includes(page.path)} onChange={() => toggle(page.path)} />
        <span>{page.label}<small>{page.path}{page.aliases ? ` · ${page.aliases}` : ''}</small></span>
      </label>) : <p>No matching service pages.</p>}
    </div>}
    <div className="dash-picker-chips">{selected.map(path => <button className="dash-picker-chip" key={path} type="button" onClick={() => toggle(path)} aria-label={`Remove ${destinations.find(page => page.path === path)?.label || path}`}>{destinations.find(page => page.path === path)?.label || path} ×</button>)}</div>
    <small className="dash-field-help">Select multiple pages. Only published content appears. Sub-services that share a page use their parent page.{!includeHome && ' Home automatically shows the three latest published blogs.'}</small>
  </div>;
}
