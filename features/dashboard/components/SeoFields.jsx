'use client';
import ImageUpload from './ImageUpload';

export const EMPTY_SEO = { title: '', description: '', primaryKeywords: '', secondaryKeywords: '', canonical: '', ogTitle: '', ogDescription: '', ogImage: '', noindex: false, nofollow: false };

export default function SeoFields({ value = {}, onChange, fallbackTitle = '', fallbackDescription = '', path = '/', onUploadBusyChange }) {
  const seo = { ...EMPTY_SEO, ...value };
  const set = (key, next) => onChange({ ...seo, [key]: next });
  const fields = [
    ['title', 'SEO title', 'Use the page title by default'],
    ['description', 'Meta description', 'Summarise the page for search results'],
    ['primaryKeywords', 'Primary keywords', 'Separate keywords with commas'],
    ['secondaryKeywords', 'Secondary keywords', 'Related terms, separated by commas'],
    ['canonical', 'Canonical URL', path],
    ['ogTitle', 'Social sharing title', 'Defaults to the SEO title'],
    ['ogDescription', 'Social sharing description', 'Defaults to the meta description'],
  ];
  return <fieldset className="dash-seo-fields">
    <legend>Search engine & social settings</legend>
    <p className="dash-field-help">Leave fields blank to use the page defaults. Keywords help plan content; they do not guarantee search rankings.</p>
    <div className="dash-form-row">
      {fields.map(([key, label, placeholder]) => <label className="dash-form-group" key={key}>
        <span className="dash-form-label">{label}</span>
        {key.toLowerCase().includes('description') ? <textarea className="dash-form-textarea" rows={3} value={seo[key]} placeholder={placeholder} onChange={event => set(key, event.target.value)} maxLength={1000} /> : <input className="dash-form-input" value={seo[key]} placeholder={placeholder} onChange={event => set(key, event.target.value)} maxLength={key === 'title' ? 200 : 2000} />}
        {key === 'title' && <small>{seo.title.length} characters · aim for about 50–60</small>}
        {key === 'description' && <small>{seo.description.length} characters · aim for about 140–160</small>}
      </label>)}
    </div>
    <ImageUpload label="Social sharing image" value={seo.ogImage} onChange={value => set('ogImage', value)} onBusyChange={onUploadBusyChange} />
    <label className="dash-seo-toggle"><input type="checkbox" checked={seo.noindex} onChange={event => set('noindex', event.target.checked)} /> Hide this page from search engines (noindex)</label>
    <label className="dash-seo-toggle"><input type="checkbox" checked={seo.nofollow} onChange={event => set('nofollow', event.target.checked)} /> Ask search engines not to follow links (nofollow)</label>
    <div className="dash-search-preview">
      <small>Search preview · actual search results may differ</small>
      <div>{seo.canonical || path}</div>
      <strong>{seo.title || fallbackTitle || 'Page title'}</strong>
      <p>{seo.description || fallbackDescription || 'The default page description will be used.'}</p>
    </div>
  </fieldset>;
}
