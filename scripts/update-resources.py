from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
p=root/'server/routes/resources.js'
s=p.read_text(encoding='utf-8')
s=s.replace("const crypto = require('crypto');\n",'').replace("const nodemailer = require('nodemailer');\n",'')
a=s.index('const otpRequests');b=s.index('function normalizeAssetField',a)
s=s[:a]+"const Contact = require('../models/Contact');\nconst { normalizeSeo } = require('../utils/seo');\nconst { downloadDetails, createDownloadToken, verifyDownloadToken } = require('../utils/downloads');\n\n"+s[b:]
a=s.index('function cleanupExpired');b=s.index("router.get('/',",a);s=s[:a]+s[b:]
s=s.replace("    active: body.active !== false,", "    active: body.active !== false,\n    ...('seo' in body ? { seo: normalizeSeo(body.seo) } : {}),")
s=s.replace("String(body.filename || 'resource.pdf')", "String(body.filename || 'download')")
s=s.replace("    data.slug = await generateUniqueSlug(data.title);", "    if (!data.desc) return res.status(400).json({ error: 'Description is required' });\n    data.slug = await generateUniqueSlug(data.title);")
s=s.replace("    if (!data.slug) {\n      data.slug = existing.slug || await generateUniqueSlug(data.title, existing._id);\n    }", "    if (!data.title || !data.desc || !data.pdfUrl) return res.status(400).json({ error: 'Title, description and file are required' });\n    data.slug = existing.slug || await generateUniqueSlug(data.title, existing._id);")
a=s.index("router.post('/request-otp'")
s=s[:a]+'''router.post('/request-download', async (req, res) => {
  try {
    const details = downloadDetails(req.body);
    const resource = await Resource.findOne({ slug: String(req.body.resourceSlug || ''), active: true });
    if (!resource || !resource.pdfUrl) return res.status(404).json({ error: 'Downloadable not found' });
    // A token is only returned after the enquiry has been durably saved.
    const token = createDownloadToken(resource._id);
    const sourcePage = typeof req.body.sourcePage === 'string' && /^\\/(?!\\/)/.test(req.body.sourcePage) ? req.body.sourcePage.split(/[?#]/)[0].slice(0, 500) : `/resources/${resource.slug}`;
    await Contact.create({ ...details, source: 'downloadable', sourcePage, sourceTitle: resource.title, resourceId: resource._id, interest: resource.title, message: `Download requested: ${resource.title}` });
    res.status(201).json({ downloadUrl: `/api/resources/download/${token}` });
  } catch (error) { res.status(400).json({ error: error.message }); }
});

router.get('/download/:token', async (req, res) => {
  let resourceId;
  try { resourceId = verifyDownloadToken(req.params.token); }
  catch { return res.status(403).json({ error: 'Download link expired. Please enter your details again.' }); }
  try {
    const resource = await Resource.findOne({ _id: resourceId, active: true });
    if (!resource?.pdfUrl) return res.status(404).json({ error: 'File not available' });
    const url = typeof resource.pdfUrl === 'object' ? resource.pdfUrl.secure_url : resource.pdfUrl;
    if (/^https?:\\/\\//i.test(url)) return res.redirect(url);
    if (/^\\/?uploads\\//.test(url)) {
      const base = path.resolve(process.cwd(), 'server/uploads');
      const target = path.resolve(base, url.replace(/^\\/?uploads\\//, ''));
      if (!target.startsWith(base + path.sep) || !fs.existsSync(target)) return res.status(404).json({ error: 'File not found' });
      return res.download(target, resource.filename || path.basename(target));
    }
    return res.status(404).json({ error: 'File not available' });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;
'''
p.write_text(s,encoding='utf-8')

p=root/'features/dashboard/components/ResourcePanel.jsx';s=p.read_text(encoding='utf-8')
s=s.replace("import FileUploadInput", "import SeoFields from './SeoFields';\nimport FileUploadInput")
s=s.replace("  active: true,", "  active: true,\n  seo: {},\n  filename: '',")
s=s.replace("  const [saving, setSaving]", "  const [uploading, setUploading] = useState(false);\n  const [saving, setSaving]")
s=s.replace("      active: resource.active !== false,", "      active: resource.active !== false,\n      filename: resource.filename || '',\n      seo: resource.seo || {},")
s=s.replace("    if (!form.pdfUrl", "    if (!form.desc.trim()) { setError('A description is required.'); return; }\n    if (!form.pdfUrl",1)
s=s.replace('A PDF file or URL is required.', 'A downloadable file is required.')
s=s.replace("        payload.pdfUrl = result.asset || result;", "        payload.pdfUrl = result.asset || result;\n        payload.filename = form.pdfUrl.name;")
s=s.replace('Resources</span>', 'Downloadables</span>').replace('New Resource','New Downloadable').replace('Edit Resource','Edit Downloadable').replace('Save Resource','Save Downloadable').replace('Upload a PDF and create a resource item.', 'Upload a file and create a downloadable.')
s=s.replace('              <th>Topic</th>','').replace('                <td>{resource.topic}</td>','')
s=re.sub(r'                <div className="dash-form-group">\s*<label className="dash-form-label">Topic</label>.*?</div>', '', s, flags=re.S)
s=s.replace('placeholder="Upload image or paste URL"','placeholder="Choose image from computer"').replace('allowUrl={true}','allowUrl={false}')
s=s.replace('label="PDF File"', 'label="Downloadable file *"').replace('accept="application/pdf,.pdf"','accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.zip"').replace('placeholder="Upload a PDF file"','placeholder="Choose file from computer"').replace('Upload the resource PDF. This file is required.', 'PDF, Word, Excel, CSV, PowerPoint or ZIP. Maximum 50 MB.')
s=s.replace('              {error &&', '              <SeoFields value={form.seo} onChange={value => setField(\'seo\', value)} onUploadBusyChange={setUploading} fallbackTitle={form.title} fallbackDescription={form.desc} path="/resources/your-download" />\n\n              {error &&')
s=s.replace('disabled={saving}', 'disabled={saving || uploading}')
p.write_text(s,encoding='utf-8')
