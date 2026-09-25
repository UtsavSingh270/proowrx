from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
def edit(path, old, new, count=-1):
 p=root/path;s=p.read_text(encoding='utf-8');assert old in s,(path,old[:70]);p.write_text(s.replace(old,new,count),encoding='utf-8')

edit('server/api.js', "app.use('/api/seo', require('./routes/seo'));", "app.use('/api/seo', require('./routes/seo'));\napp.use('/api/case-studies', require('./routes/caseStudies'));")
edit('server/models/AuditLog.js', "'worklife', 'seo'", "'worklife', 'seo', 'case-studies', 'analytics'")
edit('server/models/Contact.js', "  read:", "  sourcePage: { type: String, default: '' },\n  sourceTitle: { type: String, default: '' },\n  resourceId: { type: mongoose.Schema.Types.ObjectId, default: null },\n  read:")
edit('server/models/Resource.js', "  active:", "  seo: { type: require('./SeoFields'), default: () => ({}) },\n  active:")
edit('server/models/Resource.js', '}, {', '}, {', 1) if False else None
edit('server/routes/contact.js', 'message, source } = req.body', 'message, source, sourcePage, sourceTitle } = req.body')
edit('server/routes/contact.js', "source: source || 'contact_page' });", "source: source || 'contact_page', sourcePage: typeof sourcePage === 'string' && /^\\/(?!\\/)/.test(sourcePage) ? sourcePage.split(/[?#]/)[0].slice(0, 500) : '', sourceTitle: String(sourceTitle || '').slice(0, 200) });")
edit('services/api.js', "return apiClient.post('/contact', data);", "return apiClient.post('/contact', { ...data, sourcePage: typeof window !== 'undefined' ? window.location.pathname : '', sourceTitle: typeof document !== 'undefined' ? document.title : '' });")
edit('services/api.js', "  requestOtp(data) {\n    return apiClient.post('/resources/request-otp', data);\n  },\n  verifyOtp(data) {\n    return apiClient.post('/resources/verify-otp', data);\n  },", "  requestDownload(data) { return apiClient.post('/resources/request-download', data); },")

edit('features/dashboard/components/PagePicker.jsx', 'value = [], onChange })', "value = [], onChange, contentLabel = 'insight' })")
edit('features/dashboard/components/PagePicker.jsx', 'Show this insight on', 'Show this {contentLabel} on')
edit('features/dashboard/components/PagePicker.jsx', 'Only published insights appear.', 'Only published content appears.')
edit('features/dashboard/components/SeoFields.jsx', "'use client';", "'use client';\nimport ImageUpload from './ImageUpload';")
edit('features/dashboard/components/SeoFields.jsx', "path = '/' })", "path = '/', onUploadBusyChange })")
edit('features/dashboard/components/SeoFields.jsx', "    ['ogImage', 'Social sharing image URL', 'https://… or /image.jpg'],\n", '')
edit('features/dashboard/components/SeoFields.jsx', '    <label className="dash-seo-toggle">', "    <ImageUpload label=\"Social sharing image\" value={seo.ogImage} onChange={value => set('ogImage', value)} onBusyChange={onUploadBusyChange} />\n    <label className=\"dash-seo-toggle\">", 1)
edit('features/dashboard/components/SeoPanel.jsx', "  const [saving, setSaving]", "  const [uploading, setUploading] = useState(false);\n  const [saving, setSaving]")
edit('features/dashboard/components/SeoPanel.jsx', '<SeoFields value={seo}', '<SeoFields onUploadBusyChange={setUploading} value={seo}')
edit('features/dashboard/components/SeoPanel.jsx', 'disabled={saving', 'disabled={saving || uploading')

p='app/dashboard/DashboardClient.jsx'
edit(p,"import './Dashboard.css';", "import './Dashboard.css';\nimport FileUploadInput from '@/components/shared/FileUploadInput';\nimport ImageUpload from '@/features/dashboard/components/ImageUpload';\nimport { uploadImageValue } from '@/lib/media';\nconst CaseStudiesPanel = dynamic(() => import('@/features/dashboard/components/CaseStudiesPanel'));")
# Blog and team images are uploaded before writing their record; existing URLs stay compatible.
edit(p, "      if (post?._id) await adminPosts.update", "      data.image = await uploadImageValue(form.image);\n      if (post?._id) await adminPosts.update")
edit(p, "      if (member?._id) await teamMembers.update", "      data.image = await uploadImageValue(form.image);\n      if (member?._id) await teamMembers.update")
for label,newlabel in [('Cover Image URL','Cover image'),('Image URL','Member / author photo')]:
 old=f'''          <div className="dash-form-group">
            <label className="dash-form-label">{label}</label>
            <input className="dash-form-input" type="url" value={{form.image}} onChange={{e => set('image', e.target.value)}} placeholder="https://..." />
          </div>'''
 edit(p,old,f'''          <FileUploadInput label="{newlabel}" value={{form.image}} onChange={{value => set('image', value)}} accept="image/jpeg,image/png,image/webp,image/gif" allowUrl={{false}} />''')
start=(root/p).read_text(encoding='utf-8');a=start.index('function PostModal');b=start.index('function JobModal');chunk=start[a:b]
chunk=chunk.replace("  const [saving, setSaving]", "  const [uploading, setUploading] = useState(false);\n  const [saving, setSaving]").replace('disabled={saving}', 'disabled={saving || uploading}').replace('<SeoFields value=', '<SeoFields onUploadBusyChange={setUploading} value=')
(root/p).write_text(start[:a]+chunk+start[b:],encoding='utf-8')
# Rich text still supports existing remote images; new images come from local files.
edit(p,'  const [imgUrl, setImgUrl]', '  const [imageBusy, setImageBusy] = useState(false);\n  const [imgUrl, setImgUrl]')
s=(root/p).read_text(encoding='utf-8');a=s.index('            <input\n              ref={imgInputRef}');b=s.index('            <button type="button" className="dash-btn dash-btn-primary dash-btn-sm" onClick={insertImg}>',a)
s=s[:a]+'            <ImageUpload label="Insert image from computer" value={imgUrl} onChange={setImgUrl} onBusyChange={setImageBusy} />\n'+s[b:]
s=s.replace('onClick={insertImg}>','onClick={insertImg} disabled={imageBusy || !imgUrl}>').replace('Paste an image URL — it will be inserted at your cursor position','Upload an image, then insert it at your cursor position')
s=s.replace('const url = imgUrl.trim();', 'const url = imgUrl.trim();').replace('${url}" alt=', '${url.replaceAll(\'"\', \'&quot;\')}" alt=')
(root/p).write_text(s,encoding='utf-8')
# Instant local search and a status filter for blogs.
edit(p, 'function BlogPanel() {', "function BlogPanel() {\n  const [query, setQuery] = useState('');\n  const [statusFilter, setStatusFilter] = useState('');")
edit(p, '  async function changeStatus(post, status) {', "  const filteredPosts = posts.filter(post => (!statusFilter || post.status === statusFilter) && [post.title, post.author, post.category, ...(post.tags || [])].join(' ').toLowerCase().includes(query.trim().toLowerCase()));\n\n  async function changeStatus(post, status) {")
edit(p, '      <div className="dash-subsection dash-author-source-note">', '''      <div className="dash-content-filters"><input type="search" aria-label="Search blogs" className="dash-form-input" placeholder="Search blog title, author, category or tags…" value={query} onChange={event => setQuery(event.target.value)} /><select aria-label="Blog status" className="dash-form-select" value={statusFilter} onChange={event => setStatusFilter(event.target.value)}><option value="">All statuses</option>{['published', 'draft', 'scheduled', 'paused'].map(status => <option key={status}>{status}</option>)}</select><span>{filteredPosts.length} results</span></div>
      <div className="dash-subsection dash-author-source-note">''')
edit(p, ') : posts.length === 0 ? (', ') : filteredPosts.length === 0 ? (')
edit(p, 'No posts yet. Create your first post!', 'No matching blogs. Try another search or create a post.')
edit(p, '{posts.map(p => (', '{filteredPosts.map(p => (')
edit(p, 'Blogs &amp; Insights', 'Blogs')
edit(p, "          {tab === 'blog' && <BlogPanel />}", "          {tab === 'blog' && <BlogPanel />}\n          {tab === 'case-studies' && <CaseStudiesPanel />}")
edit(p, "          <button className={`dash-nav-btn${tab === 'seo'", "          <button className={`dash-nav-btn${tab === 'case-studies' ? ' active' : ''}`} onClick={() => selectTab('case-studies')}><Briefcase size={18} /><span>Case Studies</span></button>\n          <button className={`dash-nav-btn${tab === 'seo'")
edit(p, "{tab === 'seo' ? 'Page SEO'", "{tab === 'case-studies' ? 'Case Studies' : tab === 'seo' ? 'Page SEO'")
edit(p, "'Blog & Insight Management'", "'Blog Management'")
edit(p, '<span>Resources</span>', '<span>Downloadables</span>')
edit(p, "tab === 'resources' ? 'Resources'", "tab === 'resources' ? 'Downloadables'")
# Enquiry attribution and search.
edit(p, 'function EnquiriesPanel() {', "function EnquiriesPanel() {\n  const [query, setQuery] = useState('');")
edit(p, '<th>Form</th><th>Details</th>', '<th>Source</th><th>Details</th>')
edit(p, '<tbody>{entries.map(entry => (', "<tbody>{entries.filter(entry => [entry.name, entry.email, entry.source, entry.sourcePage, entry.sourceTitle].join(' ').toLowerCase().includes(query.toLowerCase())).map(entry => (")
edit(p, "<td>{String(entry.source || 'contact_page').replaceAll('_', ' ')}</td>", "<td><strong>{String(entry.source || 'contact_page').replaceAll('_', ' ')}</strong><br />{entry.sourceTitle && <span>{entry.sourceTitle}<br /></span>}{entry.sourcePage ? <a href={entry.sourcePage} target=\"_blank\" rel=\"noreferrer\">{entry.sourcePage}</a> : <small>Page not recorded for this older enquiry</small>}</td>")
edit(p, '<span className="dash-section-title">Website Form Enquiries</span>', '<span className="dash-section-title">Website Form Enquiries</span>\n        <input className="dash-form-input" type="search" aria-label="Search enquiries" placeholder="Search contact, source or page…" value={query} onChange={event => setQuery(event.target.value)} />')
