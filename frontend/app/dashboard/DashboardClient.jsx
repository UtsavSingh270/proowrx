'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FileText, Briefcase, LogOut, Plus, Edit2, Trash2, Eye,
  EyeOff, Save, Image as ImageIcon,
  Users, Shield, Activity, Inbox, CalendarDays, Maximize2, Minimize2,
} from 'lucide-react';
import { auth, adminPosts, adminJobs, teamMembers, contact, meetings } from '../../services/api';
import AdminUsersPanel from '../../components/AdminUsersPanel';
import AuditLogsPanel from '../../components/AuditLogsPanel';
import ResourcePanel from '../../components/ResourcePanel';
import WorkLifePanel from '../../components/WorkLifePanel';
import './Dashboard.css';

/* ─────────────────────── helpers ───────────────────────── */
const CATEGORY_OPTIONS = [
  { label: 'Mortgage',     color: 'var(--gold)',    glow: 'var(--gold-pale)' },
  { label: 'Accounting',   color: 'var(--sky)',     glow: 'var(--sky-glow)' },
  { label: 'Data Security',color: 'var(--emerald)', glow: 'var(--emerald-glow)' },
  { label: 'General',      color: 'var(--violet)',  glow: 'var(--violet-glow)' },
];

function catMeta(label) {
  return CATEGORY_OPTIONS.find(c => c.label === label) || CATEGORY_OPTIONS[3];
}

function StatusBadge({ status }) {
  return (
    <span className={`dash-badge dash-badge-${status}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

/* ─────────────────────── Tag input ─────────────────────── */
function TagsInput({ value, onChange }) {
  const [input, setInput] = useState('');

  function add(e) {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      const tag = input.trim().replace(/,$/, '');
      if (tag && !value.includes(tag)) onChange([...value, tag]);
      setInput('');
    }
  }

  function remove(t) { onChange(value.filter(x => x !== t)); }

  return (
    <div className="dash-tags-input-wrap" onClick={() => document.getElementById('tag-input').focus()}>
      {value.map(t => (
        <span key={t} className="dash-tag-pill">
          {t}
          <button type="button" onClick={() => remove(t)}>×</button>
        </span>
      ))}
      <input
        id="tag-input"
        className="dash-tags-text-input"
        placeholder="Add tag, press Enter"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={add}
      />
    </div>
  );
}

/* ── auto read-time helper ───────────────── */
function calcReadTime(html) {
  if (!html) return '1 min read';
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = text.split(' ').filter(Boolean).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min read`;
}

/* ─────────────────────── Rich editor ───────────────────── */
function RichEditor({ value, onChange }) {
  const editorRef  = useRef(null);
  const imgInputRef = useRef(null);
  const savedRange  = useRef(null);
  const [showImgPanel, setShowImgPanel] = useState(false);
  const [imgUrl, setImgUrl]             = useState('');
  const [fullView, setFullView]         = useState(false);

  // initialise editor content once on mount only
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value || '';
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* save cursor every time user moves it inside the editor */
  function saveSelection() {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  }

  /* restore cursor to saved position */
  function restoreSelection() {
    if (!savedRange.current) return;
    editorRef.current.focus();
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(savedRange.current);
  }

  function exec(cmd, val = null) {
    editorRef.current.focus();
    document.execCommand(cmd, false, val);
    sync();
  }

  function sync() {
    onChange(editorRef.current.innerHTML);
  }

  /* open the image URL panel — save cursor first */
  function openImgPanel() {
    saveSelection();
    setShowImgPanel(true);
    setImgUrl('');
    setTimeout(() => imgInputRef.current?.focus(), 40);
  }

  /* insert image at saved cursor position */
  function insertImg() {
    const url = imgUrl.trim();
    if (!url) return;
    restoreSelection();
    document.execCommand(
      'insertHTML', false,
      `<p></p><img src="${url}" alt="" class="editor-inserted-img" style="width:100%;height:auto;display:block;border-radius:10px;margin:20px 0;" /><p><br></p>`
    );
    setShowImgPanel(false);
    setImgUrl('');
    sync();
  }

  function cancelImg() {
    setShowImgPanel(false);
    setImgUrl('');
    restoreSelection();
  }

  return (
    <div className={`dash-editor-wrap${fullView ? ' dash-editor-full' : ''}`}>
      <div className="dash-editor-toolbar">
        <button type="button" className="dash-tool-btn" title="Bold"      onClick={() => exec('bold')}><b>B</b></button>
        <button type="button" className="dash-tool-btn" title="Italic"    onClick={() => exec('italic')}><i>I</i></button>
        <button type="button" className="dash-tool-btn" title="Underline" onClick={() => exec('underline')}><u>U</u></button>
        <span className="dash-tool-btn sep" />
        <button type="button" className="dash-tool-btn" style={{ fontSize: '0.80rem' }} title="Heading 2"  onClick={() => exec('formatBlock', 'H2')}>H2</button>
        <button type="button" className="dash-tool-btn" style={{ fontSize: '0.76rem' }} title="Heading 3"  onClick={() => exec('formatBlock', 'H3')}>H3</button>
        <button type="button" className="dash-tool-btn" style={{ fontSize: '0.76rem' }} title="Paragraph" onClick={() => exec('formatBlock', 'P')}>¶</button>
        <span className="dash-tool-btn sep" />
        <button type="button" className="dash-tool-btn" title="Bullet list"   onClick={() => exec('insertUnorderedList')}>• —</button>
        <button type="button" className="dash-tool-btn" title="Ordered list"  onClick={() => exec('insertOrderedList')}>1.</button>
        <span className="dash-tool-btn sep" />
        <button type="button" className="dash-tool-btn" title="Link"   style={{ fontSize: '0.78rem' }} onClick={() => { const u = prompt('URL:'); if (u) exec('createLink', u); }}>🔗</button>
        <button type="button" className="dash-tool-btn" title="Clear format" style={{ fontSize: '0.76rem' }} onClick={() => exec('removeFormat')}>Tx</button>
        <span className="dash-tool-btn sep" />
        {/* Image button — always in toolbar, opens inline panel */}
        <button
          type="button"
          className={`dash-tool-btn dash-tool-img-btn${showImgPanel ? ' active' : ''}`}
          title="Insert image"
          onClick={openImgPanel}
        >
          <ImageIcon size={14} />
          <span style={{ fontSize: '0.76rem', marginLeft: 4 }}>Image</span>
        </button>
        <button
          type="button"
          className="dash-btn dash-btn-ghost dash-btn-sm dash-editor-full-btn"
          onClick={() => setFullView(current => !current)}
        >
          {fullView ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          {fullView ? 'Close Full View' : 'View in Full'}
        </button>
      </div>

      {/* Inline image URL panel — appears between toolbar and editor */}
      {showImgPanel && (
        <div className="dash-img-panel">
          <div className="dash-img-panel-hint">
            Paste an image URL — it will be inserted at your cursor position
          </div>
          <div className="dash-img-panel-row">
            <input
              ref={imgInputRef}
              className="dash-img-panel-input"
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={imgUrl}
              onChange={e => setImgUrl(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') { e.preventDefault(); insertImg(); }
                if (e.key === 'Escape') cancelImg();
              }}
            />
            <button type="button" className="dash-btn dash-btn-primary dash-btn-sm" onClick={insertImg}>
              Insert
            </button>
            <button type="button" className="dash-btn dash-btn-ghost dash-btn-sm" onClick={cancelImg}>
              Cancel
            </button>
          </div>
          {imgUrl && (
            <div className="dash-img-preview">
              <img src={imgUrl} alt="preview" onError={e => e.target.style.display = 'none'} />
            </div>
          )}
        </div>
      )}

      <div
        ref={editorRef}
        className="dash-editor-area"
        contentEditable
        suppressContentEditableWarning
        onInput={sync}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
      />
      <p className="dash-editor-hint">
        Click inside the content area, place your cursor where you want an image, then click the Image button in the toolbar.
      </p>
    </div>
  );
}

/* ─────────────────────── Post modal ─────────────────────── */
function PostModal({ post, authors, onAuthorCreated, onClose, onSave }) {
  const isNew = !post;
  const [form, setForm] = useState({
    title:       post?.title    || '',
    excerpt:     post?.excerpt  || '',
    image:       post?.image    || '',
    category:    post?.category || 'Mortgage',
    author:      post?.author   || '',
    authorId:    post?.authorId || '',
    authorProfile: post?.authorProfile || null,
    date:        post?.date     || new Date().toLocaleDateString('en-AU', { day:'numeric', month:'long', year:'numeric' }),
    scheduledAt: post?.scheduledAt ? new Date(post.scheduledAt).toISOString().slice(0, 16) : '',
    tags:        post?.tags     || [],
    faqs:        post?.faqs     || [],
    featured:    post?.featured || false,
    status:      post?.status   || 'draft',
    htmlContent: post?.htmlContent || '',
  });
  const [authorForm, setAuthorForm] = useState({ name: '', email: '', title: '', image: '', bio: '' });
  const [showAuthorForm, setShowAuthorForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  /* live auto-calculated read time — never stored in form state */
  const autoReadTime = calcReadTime(form.htmlContent);

  const MAX_FAQS = 5;
  function addFaq() {
    if (form.faqs.length >= MAX_FAQS) return;
    setForm(p => ({ ...p, faqs: [...p.faqs, { question: '', answer: '' }] }));
  }
  function updateFaq(index, key, value) {
    setForm(p => ({ ...p, faqs: p.faqs.map((f, i) => (i === index ? { ...f, [key]: value } : f)) }));
  }
  function removeFaq(index) {
    setForm(p => ({ ...p, faqs: p.faqs.filter((_, i) => i !== index) }));
  }

  function selectAuthor(id) {
    const author = authors.find(a => a._id === id);
    setForm(p => ({
      ...p,
      authorId: id,
      author: author?.name || '',
      authorProfile: author ? {
        name: author.name,
        email: author.email || '',
        title: author.title || '',
        image: author.image || '',
        bio: author.bio || '',
      } : null,
    }));
  }

  async function createAuthor() {
    if (!authorForm.name.trim()) return alert('Author name is required.');
    try {
      const author = await adminPosts.createAuthor(authorForm);
      await onAuthorCreated();
      setAuthorForm({ name: '', email: '', title: '', image: '', bio: '' });
      setShowAuthorForm(false);
      setForm(p => ({
        ...p,
        authorId: author._id,
        author: author.name,
        authorProfile: {
          name: author.name,
          email: author.email || '',
          title: author.title || '',
          image: author.image || '',
          bio: author.bio || '',
        },
      }));
    } catch (err) {
      alert(err.message || 'Failed to create author.');
    }
  }

  async function handleSave(status) {
    if (!form.title.trim()) return alert('Title is required.');
    if (status === 'scheduled' && !form.scheduledAt) return alert('Choose a schedule date and time.');
    const cm = catMeta(form.category);
    const data = {
      ...form,
      readTime: calcReadTime(form.htmlContent),   // auto-calculated
      status,
      scheduledAt: status === 'scheduled' ? new Date(form.scheduledAt).toISOString() : null,
      categoryColor: cm.color,
      categoryGlow:  cm.glow,
      faqs: form.faqs.filter(f => f.question.trim() || f.answer.trim()),
    };
    setSaving(true);
    try {
      if (post?._id) await adminPosts.update(post._id, data);
      else           await adminPosts.create(data);
      onSave();
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to save post.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="dash-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="dash-modal">
        <div className="dash-modal-header">
          <span className="dash-modal-title">{isNew ? 'New Blog Post' : 'Edit Post'}</span>
          <button className="dash-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="dash-modal-body">
          <div className="dash-form-row">
            <div className="dash-form-group" style={{ gridColumn: '1/-1' }}>
              <label className="dash-form-label">Title *</label>
              <input className="dash-form-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Post title" />
            </div>
          </div>

          <div className="dash-form-row">
            <div className="dash-form-group">
              <label className="dash-form-label">Category</label>
              <select className="dash-form-select" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORY_OPTIONS.map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
              </select>
            </div>
            <div className="dash-form-group">
              <label className="dash-form-label">Author</label>
              <div className="dash-author-picker">
                <select className="dash-form-select" value={form.authorId || ''} onChange={e => selectAuthor(e.target.value)}>
                  <option value="">Select author</option>
                  {authors.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                </select>
                <button type="button" className="dash-btn dash-btn-ghost dash-btn-sm" onClick={() => setShowAuthorForm(v => !v)}>
                  <Plus size={13} /> Author
                </button>
              </div>
            </div>
          </div>

          {showAuthorForm && (
            <div className="dash-inline-panel">
              <div className="dash-form-row">
                <div className="dash-form-group">
                  <label className="dash-form-label">Author Name *</label>
                  <input className="dash-form-input" value={authorForm.name} onChange={e => setAuthorForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="dash-form-group">
                  <label className="dash-form-label">Author Email</label>
                  <input className="dash-form-input" type="email" value={authorForm.email} onChange={e => setAuthorForm(p => ({ ...p, email: e.target.value }))} />
                </div>
              </div>
              <div className="dash-form-row">
                <div className="dash-form-group">
                  <label className="dash-form-label">Title / Role</label>
                  <input className="dash-form-input" value={authorForm.title} onChange={e => setAuthorForm(p => ({ ...p, title: e.target.value }))} />
                </div>
                <div className="dash-form-group">
                  <label className="dash-form-label">Profile Image URL</label>
                  <input className="dash-form-input" type="url" value={authorForm.image} onChange={e => setAuthorForm(p => ({ ...p, image: e.target.value }))} />
                </div>
              </div>
              <div className="dash-form-group">
                <label className="dash-form-label">Bio</label>
                <textarea className="dash-form-textarea" rows={2} value={authorForm.bio} onChange={e => setAuthorForm(p => ({ ...p, bio: e.target.value }))} />
              </div>
              <button type="button" className="dash-btn dash-btn-primary dash-btn-sm" onClick={createAuthor}>Save Author</button>
            </div>
          )}

          <div className="dash-form-row">
            <div className="dash-form-group">
              <label className="dash-form-label">Date</label>
              <input className="dash-form-input" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
            <div className="dash-form-group">
              <label className="dash-form-label">Schedule Publish</label>
              <input className="dash-form-input" type="datetime-local" value={form.scheduledAt} onChange={e => set('scheduledAt', e.target.value)} />
            </div>
          </div>

          <div className="dash-form-row">
            <div className="dash-form-group">
              <label className="dash-form-label">Read Time</label>
              <div className="dash-readtime-preview">
                {autoReadTime}
                <span style={{ fontSize: '0.72rem', color: '#9aa5be', marginLeft: 8, fontWeight: 400 }}>auto — updates as you write</span>
              </div>
            </div>
          </div>

          <div className="dash-form-group">
            <label className="dash-form-label">Cover Image URL</label>
            <input className="dash-form-input" type="url" value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." />
          </div>

          <div className="dash-form-group">
            <label className="dash-form-label">Excerpt / Summary</label>
            <textarea className="dash-form-textarea" value={form.excerpt} onChange={e => set('excerpt', e.target.value)} placeholder="Short description shown on blog listing page" rows={3} />
          </div>

          <div className="dash-form-group">
            <label className="dash-form-label">Tags</label>
            <TagsInput value={form.tags} onChange={v => set('tags', v)} />
          </div>

          <div className="dash-form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <input type="checkbox" id="featured-cb" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
            <label htmlFor="featured-cb" style={{ fontSize: '0.86rem', fontWeight: 600, color: '#374a6e', cursor: 'pointer' }}>
              Mark as Featured Post
            </label>
          </div>

          <div className="dash-form-group">
            <label className="dash-form-label">Content</label>
            <RichEditor value={form.htmlContent} onChange={v => set('htmlContent', v)} />
          </div>

          <div className="dash-form-group">
            <label className="dash-form-label">
              FAQs
              <span style={{ fontSize: '0.72rem', color: '#9aa5be', marginLeft: 8, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                {form.faqs.length} / {MAX_FAQS}
              </span>
            </label>
            {form.faqs.map((faq, i) => (
              <div key={i} className="dash-inline-panel" style={{ marginBottom: 12 }}>
                <div className="dash-form-row" style={{ alignItems: 'flex-start' }}>
                  <div className="dash-form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="dash-form-label">Question {i + 1}</label>
                    <input
                      className="dash-form-input"
                      value={faq.question}
                      onChange={e => updateFaq(i, 'question', e.target.value)}
                      placeholder="e.g. How long does processing take?"
                    />
                  </div>
                </div>
                <div className="dash-form-group">
                  <label className="dash-form-label">Answer</label>
                  <textarea
                    className="dash-form-textarea"
                    rows={2}
                    value={faq.answer}
                    onChange={e => updateFaq(i, 'answer', e.target.value)}
                    placeholder="Answer shown to readers"
                  />
                </div>
                <button
                  type="button"
                  className="dash-btn dash-btn-danger dash-btn-sm"
                  onClick={() => removeFaq(i)}
                >
                  <Trash2 size={13} /> Remove FAQ
                </button>
              </div>
            ))}
            <button
              type="button"
              className="dash-btn dash-btn-ghost dash-btn-sm"
              onClick={addFaq}
              disabled={form.faqs.length >= MAX_FAQS}
            >
              <Plus size={13} /> Add FAQ
            </button>
          </div>
        </div>

        <div className="dash-modal-footer">
          <button className="dash-btn dash-btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <div className="dash-modal-footer-right">
            <button className="dash-btn dash-btn-ghost" onClick={() => handleSave('draft')} disabled={saving}>
              <Save size={14} /> Save Draft
            </button>
            <button className="dash-btn dash-btn-ghost" onClick={() => handleSave('scheduled')} disabled={saving}>
              Schedule
            </button>
            <button className="dash-btn dash-btn-primary" onClick={() => handleSave('published')} disabled={saving}>
              {saving ? 'Saving…' : 'Publish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Job modal ──────────────────────── */
function JobModal({ job, onClose, onSave }) {
  const [form, setForm] = useState({
    title: job?.title || '',
    description: job?.description || '',
    department: job?.department || '',
    location: job?.location || 'Jaipur, India',
    type: job?.type || 'Full-time',
    experience: job?.experience || '',
    applyLink: job?.applyLink || '',
    tags: job?.tags || [],
    status: job?.status || 'active',
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  async function handleSave() {
    if (!form.title.trim()) return alert('Job title is required.');
    if (!form.applyLink.trim()) return alert('Apply link is required.');
    setSaving(true);
    try {
      if (job?._id) await adminJobs.update(job._id, form);
      else          await adminJobs.create(form);
      onSave();
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to save job.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="dash-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="dash-modal">
        <div className="dash-modal-header">
          <span className="dash-modal-title">{job ? 'Edit Job' : 'New Job Posting'}</span>
          <button className="dash-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="dash-modal-body">
          <div className="dash-job-form">
            <div className="dash-form-group">
              <label className="dash-form-label">Job Title *</label>
              <input className="dash-form-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Mortgage Loan Processor" />
            </div>

            <div className="dash-form-row">
              <div className="dash-form-group">
                <label className="dash-form-label">Department</label>
                <input className="dash-form-input" value={form.department} onChange={e => set('department', e.target.value)} placeholder="e.g. Mortgage Operations" />
              </div>
              <div className="dash-form-group">
                <label className="dash-form-label">Location</label>
                <input className="dash-form-input" value={form.location} onChange={e => set('location', e.target.value)} />
              </div>
            </div>

            <div className="dash-form-row">
              <div className="dash-form-group">
                <label className="dash-form-label">Job Type</label>
                <select className="dash-form-select" value={form.type} onChange={e => set('type', e.target.value)}>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </div>
              <div className="dash-form-group">
                <label className="dash-form-label">Required Experience</label>
                <input className="dash-form-input" value={form.experience} onChange={e => set('experience', e.target.value)} placeholder="e.g. 1–3 years" />
              </div>
            </div>

            <div className="dash-form-group">
              <label className="dash-form-label">Description *</label>
              <textarea className="dash-form-textarea" rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Role description, responsibilities, what you're looking for…" />
            </div>

            <div className="dash-form-group">
              <label className="dash-form-label">Skill Tags</label>
              <TagsInput value={form.tags} onChange={v => set('tags', v)} />
            </div>

            <div className="dash-form-group">
              <label className="dash-form-label">Apply Link URL *</label>
              <input className="dash-form-input" type="url" value={form.applyLink} onChange={e => set('applyLink', e.target.value)} placeholder="https://..." />
            </div>

            <div className="dash-form-group">
              <label className="dash-form-label">Status</label>
              <select className="dash-form-select" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="dash-modal-footer">
          <button className="dash-btn dash-btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="dash-btn dash-btn-primary" onClick={handleSave} disabled={saving}>
            <Save size={14} /> {saving ? 'Saving…' : 'Save Job'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Blog panel ─────────────────────── */
function BlogPanel() {
  const [posts, setPosts] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'new' | post-object

  const reloadAuthors = useCallback(async () => {
    try { setAuthors(await adminPosts.getAuthors()); }
    catch { setAuthors([]); }
  }, []);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [nextPosts, nextAuthors] = await Promise.all([
        adminPosts.getAll(),
        adminPosts.getAuthors(),
      ]);
      setPosts(nextPosts);
      setAuthors(nextAuthors);
    }
    catch { setPosts([]); }
    finally { setLoading(false); }
  }, []);
  // Intentional: fetch data on mount (client-only admin panel, no SSR data).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { reload(); }, [reload]);

  async function changeStatus(post, status) {
    await adminPosts.setStatus(post._id, status);
    reload();
  }

  async function remove(id) {
    if (!window.confirm('Delete this post permanently?')) return;
    await adminPosts.remove(id);
    reload();
  }

  async function removeAuthor(id) {
    if (!window.confirm('Delete this author profile? Existing posts will keep the saved author name.')) return;
    await adminPosts.removeAuthor(id);
    reloadAuthors();
  }

  async function openEdit(p) {
    const full = await adminPosts.getOne(p._id);
    setModal(full);
  }

  return (
    <div>
      <div className="dash-section-header">
        <span className="dash-section-title">Blog Posts</span>
        <button className="dash-btn dash-btn-primary" onClick={() => setModal('new')}>
          <Plus size={15} /> New Post
        </button>
      </div>

      <div className="dash-subsection">
        <div className="dash-subsection-title">Author Profiles</div>
        {authors.length === 0 ? (
          <div className="dash-muted">No authors yet. Create one inside the New Post editor.</div>
        ) : (
          <div className="dash-author-list">
            {authors.map(author => (
              <div key={author._id} className="dash-author-card">
                {author.image && <img src={author.image} alt={author.name} />}
                <div>
                  <strong>{author.name}</strong>
                  <span>{author.title || author.email || 'Author'}</span>
                </div>
                <button className="dash-btn dash-btn-danger dash-btn-sm" onClick={() => removeAuthor(author._id)} title="Delete author">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="dash-table-wrap">
        {loading ? (
          <div className="dash-empty">Loading…</div>
        ) : posts.length === 0 ? (
          <div className="dash-empty">No posts yet. Create your first post!</div>
        ) : (
          <table className="dash-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p._id}>
                  <td className="dash-table-title" title={p.title}>{p.title}</td>
                  <td>{p.category}</td>
                  <td>{p.author || '—'}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{p.date}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td>
                    <div className="dash-table-actions">
                      <button className="dash-btn dash-btn-ghost dash-btn-sm" onClick={() => openEdit(p)} title="Edit">
                        <Edit2 size={13} />
                      </button>
                      {p.status === 'published' ? (
                        <button className="dash-btn dash-btn-ghost dash-btn-sm" onClick={() => changeStatus(p, 'paused')} title="Pause">
                          <EyeOff size={13} />
                        </button>
                      ) : (
                        <button className="dash-btn dash-btn-ghost dash-btn-sm" onClick={() => changeStatus(p, 'published')} title="Publish">
                          <Eye size={13} />
                        </button>
                      )}
                      {p.status !== 'published' && p.status !== 'paused' && (
                        <button className="dash-btn dash-btn-ghost dash-btn-sm" onClick={() => changeStatus(p, 'draft')} title="Save as Draft">
                          <Save size={13} />
                        </button>
                      )}
                      <button className="dash-btn dash-btn-danger dash-btn-sm" onClick={() => remove(p._id)} title="Delete">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <PostModal
          post={modal === 'new' ? null : modal}
          authors={authors}
          onAuthorCreated={reloadAuthors}
          onClose={() => setModal(null)}
          onSave={reload}
        />
      )}
    </div>
  );
}

/* ─────────────────────── Jobs panel ─────────────────────── */
function JobsPanel() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try { setJobs(await adminJobs.getAll()); }
    catch { setJobs([]); }
    finally { setLoading(false); }
  }, []);
  // Intentional: fetch data on mount (client-only admin panel, no SSR data).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { reload(); }, [reload]);

  async function toggleStatus(job) {
    await adminJobs.setStatus(job._id, job.status === 'active' ? 'inactive' : 'active');
    reload();
  }

  async function remove(id) {
    if (!window.confirm('Delete this job posting?')) return;
    await adminJobs.remove(id);
    reload();
  }

  return (
    <div>
      <div className="dash-section-header">
        <span className="dash-section-title">Job Postings</span>
        <button className="dash-btn dash-btn-primary" onClick={() => setModal('new')}>
          <Plus size={15} /> New Job
        </button>
      </div>

      {loading ? (
        <div className="dash-empty" style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e9f0' }}>
          Loading…
        </div>
      ) : jobs.length === 0 ? (
        <div className="dash-empty" style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e9f0' }}>
          No job postings yet.
        </div>
      ) : (
        <div className="dash-job-cards">
          {jobs.map(job => (
            <div key={job._id} className="dash-job-card">
              <div className="dash-job-card-header">
                <div>
                  <div className="dash-job-title">{job.title}</div>
                  <div style={{ fontSize: '0.78rem', color: '#9aa5be', marginTop: 3 }}>
                    {job.department} · {job.location} · {job.type}
                    {job.experience && ` · ${job.experience}`}
                  </div>
                </div>
                <StatusBadge status={job.status} />
              </div>
              <p className="dash-job-desc">{job.description}</p>
              {job.tags?.length > 0 && (
                <div className="dash-job-meta">
                  {job.tags.map(t => <span key={t} className="dash-job-tag">{t}</span>)}
                </div>
              )}
              <div className="dash-job-footer">
                <a
                  href={job.applyLink}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '0.78rem', color: '#f0a500', fontWeight: 600 }}
                >
                  Apply Link ↗
                </a>
                <div className="dash-job-footer-actions">
                  <button className="dash-btn dash-btn-ghost dash-btn-sm" onClick={() => setModal(job)}><Edit2 size={13} /></button>
                  <button className="dash-btn dash-btn-ghost dash-btn-sm" onClick={() => toggleStatus(job)}>
                    {job.status === 'active' ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                  <button className="dash-btn dash-btn-danger dash-btn-sm" onClick={() => remove(job._id)}><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <JobModal
          job={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSave={reload}
        />
      )}
    </div>
  );
}

/* ─────────────────────── Login screen ───────────────────── */
function TeamMemberModal({ member, onClose, onSave }) {
  const [form, setForm] = useState({
    name: member?.name || '',
    position: member?.position || '',
    image: member?.image || '',
    category: member?.category || 'core',
    summary: member?.summary || '',
    socialMedia: member?.socialMedia || {
      twitter: '',
      linkedin: '',
      facebook: '',
      instagram: '',
      github: '',
    },
    email: member?.email || '',
    bookable: member?.bookable || false,
    order: member?.order || 0,
  });
  const [saving, setSaving] = useState(false);
  const isFeatured = form.category === 'featured';
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setSocial = (platform, url) => setForm(p => ({ ...p, socialMedia: { ...p.socialMedia, [platform]: url } }));

  async function handleSave() {
    if (!form.name.trim()) return alert('Name is required.');
    if (!form.position.trim()) return alert('Position is required.');
    const data = {
      ...form,
      socialMedia: isFeatured ? form.socialMedia : {},
      bookable: isFeatured ? form.bookable : false,
    };
    setSaving(true);
    try {
      if (member?._id) await teamMembers.update(member._id, data);
      else             await teamMembers.create(data);
      onSave();
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to save team member.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="dash-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="dash-modal">
        <div className="dash-modal-header">
          <span className="dash-modal-title">{member ? 'Edit Team Member' : 'New Team Member'}</span>
          <button className="dash-modal-close" onClick={onClose}>x</button>
        </div>

        <div className="dash-modal-body">
          <div className="dash-form-row">
            <div className="dash-form-group">
              <label className="dash-form-label">Name *</label>
              <input className="dash-form-input" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="dash-form-group">
              <label className="dash-form-label">Position *</label>
              <input className="dash-form-input" value={form.position} onChange={e => set('position', e.target.value)} />
            </div>
          </div>

          <div className="dash-form-row">
            <div className="dash-form-group">
              <label className="dash-form-label">Category</label>
              <select className="dash-form-select" value={form.category} onChange={e => set('category', e.target.value)}>
                <option value="featured">Featured</option>
                <option value="core">Core</option>
              </select>
            </div>
            <div className="dash-form-group">
              <label className="dash-form-label">Display Order</label>
              <input className="dash-form-input" type="number" value={form.order} onChange={e => set('order', Number(e.target.value))} />
            </div>
          </div>

          <div className="dash-form-group">
            <label className="dash-form-label">Image URL</label>
            <input className="dash-form-input" type="url" value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." />
          </div>

          <div className="dash-form-group">
            <label className="dash-form-label">Summary / Short Bio</label>
            <textarea className="dash-form-textarea" rows={2} value={form.summary} onChange={e => set('summary', e.target.value)} placeholder="Brief overview shown on team pages" />
          </div>

          {isFeatured && (
            <>
              <div className="dash-subsection" style={{ marginTop: 16, marginBottom: 16 }}>
                <div className="dash-subsection-title">Social Media Links</div>
                <div className="dash-form-group">
                  <label className="dash-form-label">Twitter</label>
                  <input className="dash-form-input" type="url" value={form.socialMedia.twitter} onChange={e => setSocial('twitter', e.target.value)} placeholder="https://twitter.com/..." />
                </div>
                <div className="dash-form-group">
                  <label className="dash-form-label">LinkedIn</label>
                  <input className="dash-form-input" type="url" value={form.socialMedia.linkedin} onChange={e => setSocial('linkedin', e.target.value)} placeholder="https://linkedin.com/..." />
                </div>
                <div className="dash-form-group">
                  <label className="dash-form-label">Facebook</label>
                  <input className="dash-form-input" type="url" value={form.socialMedia.facebook} onChange={e => setSocial('facebook', e.target.value)} placeholder="https://facebook.com/..." />
                </div>
                <div className="dash-form-group">
                  <label className="dash-form-label">Instagram</label>
                  <input className="dash-form-input" type="url" value={form.socialMedia.instagram} onChange={e => setSocial('instagram', e.target.value)} placeholder="https://instagram.com/..." />
                </div>
                <div className="dash-form-group">
                  <label className="dash-form-label">GitHub</label>
                  <input className="dash-form-input" type="url" value={form.socialMedia.github} onChange={e => setSocial('github', e.target.value)} placeholder="https://github.com/..." />
                </div>
              </div>

              <div className="dash-form-row">
                <div className="dash-form-group">
                  <label className="dash-form-label">Email for Booking</label>
                  <input className="dash-form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
                </div>
                <div className="dash-form-group" style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 24 }}>
                  <input id="team-bookable" type="checkbox" checked={form.bookable} onChange={e => set('bookable', e.target.checked)} />
                  <label htmlFor="team-bookable" style={{ fontSize: '0.86rem', fontWeight: 600, color: '#374a6e', cursor: 'pointer' }}>
                    Allow meeting booking
                  </label>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="dash-modal-footer">
          <button className="dash-btn dash-btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="dash-btn dash-btn-primary" onClick={handleSave} disabled={saving}>
            <Save size={14} /> {saving ? 'Saving.' : 'Save Member'}
          </button>
        </div>
      </div>
    </div>
  );
}

function TeamPanel() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try { setMembers(await teamMembers.getAdminAll()); }
    catch { setMembers([]); }
    finally { setLoading(false); }
  }, []);
  // Intentional: fetch data on mount (client-only admin panel, no SSR data).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { reload(); }, [reload]);

  async function remove(id) {
    if (!window.confirm('Delete this team member?')) return;
    await teamMembers.remove(id);
    reload();
  }

  return (
    <div>
      <div className="dash-section-header">
        <span className="dash-section-title">Team Members</span>
        <button className="dash-btn dash-btn-primary" onClick={() => setModal('new')}>
          <Plus size={15} /> New Member
        </button>
      </div>

      {loading ? (
        <div className="dash-empty" style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e9f0' }}>Loading.</div>
      ) : members.length === 0 ? (
        <div className="dash-empty" style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e9f0' }}>No team members yet.</div>
      ) : (
        <div className="dash-team-grid">
          {members.map(member => (
            <div key={member._id} className="dash-team-card">
              {member.image && <img src={member.image} alt={member.name} />}
              <div className="dash-team-card-body">
                <div className="dash-team-card-head">
                  <div>
                    <strong>{member.name}</strong>
                    <span>{member.position}</span>
                  </div>
                  <StatusBadge status={member.category} />
                </div>
                {member.summary && <p>{member.summary}</p>}
                {member.category === 'featured' && member.tags?.length > 0 && (
                  <div className="dash-job-meta">
                    {member.tags.map(t => <span key={t} className="dash-job-tag">{t}</span>)}
                  </div>
                )}
                <div className="dash-job-footer-actions">
                  <button className="dash-btn dash-btn-ghost dash-btn-sm" onClick={() => setModal(member)}><Edit2 size={13} /></button>
                  <button className="dash-btn dash-btn-danger dash-btn-sm" onClick={() => remove(member._id)}><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <TeamMemberModal
          member={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSave={reload}
        />
      )}
    </div>
  );
}

function EnquiriesPanel() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try { setEntries(await contact.getAll()); }
    catch { setEntries([]); }
    finally { setLoading(false); }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { reload(); }, [reload]);

  async function markRead(entry) {
    if (entry.read) return;
    await contact.markRead(entry._id);
    reload();
  }

  async function remove(id) {
    if (!window.confirm('Delete this enquiry permanently?')) return;
    await contact.remove(id);
    reload();
  }

  return (
    <div>
      <div className="dash-section-header">
        <span className="dash-section-title">Website Form Enquiries</span>
      </div>
      <div className="dash-table-wrap">
        {loading ? <div className="dash-empty">Loading...</div> : entries.length === 0 ? (
          <div className="dash-empty">No form enquiries yet.</div>
        ) : (
          <table className="dash-table dash-data-table">
            <thead><tr><th>Contact</th><th>Form</th><th>Details</th><th>Message</th><th>Received</th><th>Actions</th></tr></thead>
            <tbody>{entries.map(entry => (
              <tr key={entry._id} className={entry.read ? '' : 'dash-unread-row'}>
                <td><strong>{entry.name}</strong><br /><a href={`mailto:${entry.email}`}>{entry.email}</a></td>
                <td>{String(entry.source || 'contact_page').replaceAll('_', ' ')}</td>
                <td>{entry.phone || '—'}<br />{entry.company || entry.interest || '—'}</td>
                <td className="dash-data-message">{entry.message || entry.interest || '—'}</td>
                <td>{new Date(entry.createdAt).toLocaleString()}</td>
                <td><div className="dash-table-actions">
                  {!entry.read && <button className="dash-btn dash-btn-ghost dash-btn-sm" onClick={() => markRead(entry)}>Mark Read</button>}
                  <button className="dash-btn dash-btn-danger dash-btn-sm" onClick={() => remove(entry._id)} title="Delete"><Trash2 size={13} /></button>
                </div></td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function MeetingsPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try { setItems(await meetings.getAll()); }
    catch { setItems([]); }
    finally { setLoading(false); }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { reload(); }, [reload]);

  async function changeStatus(id, status) {
    await meetings.setStatus(id, status);
    reload();
  }

  async function remove(id) {
    if (!window.confirm('Delete this meeting permanently?')) return;
    await meetings.remove(id);
    reload();
  }

  return (
    <div>
      <div className="dash-section-header"><span className="dash-section-title">Scheduled Meetings</span></div>
      <div className="dash-table-wrap">
        {loading ? <div className="dash-empty">Loading...</div> : items.length === 0 ? (
          <div className="dash-empty">No meetings scheduled yet.</div>
        ) : (
          <table className="dash-table dash-data-table">
            <thead><tr><th>Date & Time</th><th>Meeting With</th><th>Booked By</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{items.map(item => (
              <tr key={item._id}>
                <td><strong>{item.date}</strong><br />{item.time} · {item.timezone}</td>
                <td>{item.person}<br />{item.personEmail || '—'}</td>
                <td>{item.name}<br /><a href={`mailto:${item.email}`}>{item.email}</a><br />{item.phone || '—'}</td>
                <td className="dash-data-message">{item.reason || '—'}</td>
                <td><StatusBadge status={item.status} /></td>
                <td><div className="dash-table-actions">
                  <select className="dash-form-select dash-status-select" value={item.status} onChange={event => changeStatus(item._id, event.target.value)}>
                    <option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option>
                  </select>
                  <button className="dash-btn dash-btn-danger dash-btn-sm" onClick={() => remove(item._id)} title="Delete"><Trash2 size={13} /></button>
                </div></td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function LoginScreen({ onAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      if (!username.trim() || !password.trim()) {
        setErr('Username and password are required.');
        setBusy(false);
        return;
      }
      const loggedInUser = await auth.login(username, password);
      onAuth(loggedInUser);
    } catch (error) {
      setErr(error.message || 'Invalid credentials. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="dash-login">
      <div className="dash-login-card">
        <div className="dash-login-logo">Proowrx</div>
        <div className="dash-login-sub">Admin Dashboard · Secure Login</div>
        <form onSubmit={submit}>
          <label className="dash-login-label">Username</label>
          <input
            className="dash-login-input"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Enter username"
            autoFocus
          />
          <label className="dash-login-label" style={{ marginTop: 16 }}>Password</label>
          <input
            className="dash-login-input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          {err && <div className="dash-login-err">{err}</div>}
          <button type="submit" className="dash-login-btn" style={{ marginTop: err ? 16 : 0 }} disabled={busy}>
            {busy ? 'Signing In…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────── Dashboard shell ────────────────── */
export default function Dashboard() {
  // Start false on both server and client to avoid a hydration mismatch —
  // sessionStorage isn't available during server rendering of this client
  // component, so the real auth state is only known after mount.
  const [authed, setAuthed] = useState(false);
  const [tab, setTab]       = useState('blog');
  const [user, setUser]     = useState(null);

  // Intentional: resolves the real (client-only) auth state after mount —
  // see the hydration-mismatch note above.
  useEffect(() => {
    if (!auth.isLoggedIn()) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAuthed(true);
    auth.verify().then(verifyResult => {
      if (verifyResult?.valid) {
        setUser(verifyResult.user);
      } else {
        auth.logout();
        setAuthed(false);
      }
    });
  }, []);

  function logout() {
    auth.logout();
    setAuthed(false);
    setUser(null);
  }

  if (!authed) {
    return <LoginScreen onAuth={loggedInUser => { setUser(loggedInUser); setAuthed(true); }} />;
  }

  return (
    <div className="dash-shell">
      {/* Sidebar */}
      <nav className="dash-sidebar">
        <div className="dash-sidebar-logo">
          Proowrx <span>Admin Dashboard</span>
        </div>
        <div className="dash-nav">
          <button
            className={`dash-nav-btn${tab === 'blog' ? ' active' : ''}`}
            onClick={() => setTab('blog')}
          >
            <FileText size={18} /> <span>Blog Posts</span>
          </button>
          <button
            className={`dash-nav-btn${tab === 'jobs' ? ' active' : ''}`}
            onClick={() => setTab('jobs')}
          >
            <Briefcase size={18} /> <span>Job Postings</span>
          </button>
          <button
            className={`dash-nav-btn${tab === 'team' ? ' active' : ''}`}
            onClick={() => setTab('team')}
          >
            <Users size={18} /> <span>Team Members</span>
          </button>
          <button
            className={`dash-nav-btn${tab === 'resources' ? ' active' : ''}`}
            onClick={() => setTab('resources')}
          >
            <FileText size={18} /> <span>Resources</span>
          </button>
          <button
            className={`dash-nav-btn${tab === 'worklife' ? ' active' : ''}`}
            onClick={() => setTab('worklife')}
          >
            <ImageIcon size={18} /> <span>WorkLife Media</span>
          </button>
          <button className={`dash-nav-btn${tab === 'enquiries' ? ' active' : ''}`} onClick={() => setTab('enquiries')}>
            <Inbox size={18} /> <span>Form Enquiries</span>
          </button>
          <button className={`dash-nav-btn${tab === 'meetings' ? ' active' : ''}`} onClick={() => setTab('meetings')}>
            <CalendarDays size={18} /> <span>Meetings</span>
          </button>
          
          {user?.isSuperAdmin && (
            <>
              <div style={{ borderTop: '1px solid #e5e9f0', margin: '16px 0' }} />
              <button
                className={`dash-nav-btn${tab === 'admins' ? ' active' : ''}`}
                onClick={() => setTab('admins')}
              >
                <Shield size={18} /> <span>Admin Users</span>
              </button>
              <button
                className={`dash-nav-btn${tab === 'audit' ? ' active' : ''}`}
                onClick={() => setTab('audit')}
              >
                <Activity size={18} /> <span>Audit Logs</span>
              </button>
            </>
          )}
        </div>
        <div className="dash-sidebar-footer">
          <button className="dash-nav-btn" onClick={logout}>
            <LogOut size={18} /> <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Main */}
      <div className="dash-main">
        <div className="dash-topbar">
          <span className="dash-topbar-title">
            {tab === 'blog' ? 'Blog Management' : tab === 'jobs' ? 'Job Postings' : tab === 'team' ? 'Team Members' : tab === 'resources' ? 'Resources' : tab === 'worklife' ? 'WorkLife Media' : tab === 'enquiries' ? 'Form Enquiries' : tab === 'meetings' ? 'Scheduled Meetings' : tab === 'admins' ? 'Admin Users' : 'Audit Logs'}
          </span>
          <div className="dash-topbar-user">
            <span>Admin{user?.isSuperAdmin ? ' (Super)' : ''}</span>
            <button
              onClick={logout}
              style={{ background: 'none', border: '1px solid #e5e9f0', borderRadius: 8, padding: '5px 12px', fontSize: '0.80rem', cursor: 'pointer', color: '#6b7a99', fontFamily: 'inherit' }}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="dash-content">
          {tab === 'blog' && <BlogPanel />}
          {tab === 'jobs' && <JobsPanel />}
          {tab === 'team' && <TeamPanel />}
          {tab === 'resources' && <ResourcePanel />}
          {tab === 'worklife' && <WorkLifePanel />}
          {tab === 'enquiries' && <EnquiriesPanel />}
          {tab === 'meetings' && <MeetingsPanel />}
          {tab === 'admins' && (
            user?.isSuperAdmin ? <AdminUsersPanel /> : <div className="dash-empty">Super Admin access only</div>
          )}
          {tab === 'audit' && (
            user?.isSuperAdmin ? <AuditLogsPanel /> : <div className="dash-empty">Super Admin access only</div>
          )}
        </div>
      </div>
    </div>
  );
}
