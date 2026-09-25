const router = require('express').Router();
const slugify = require('slugify');
const CaseStudy = require('../models/CaseStudy');
const { requireAdmin } = require('../middleware/auth');
const { normalizeCaseStudy } = require('../utils/caseStudies');
const { logAudit } = require('../utils/auditLog');

router.get('/', async (req, res) => {
  try { res.json(await CaseStudy.find({ status: 'published' }).sort({ createdAt: -1 })); }
  catch (error) { res.status(500).json({ error: error.message }); }
});
router.get('/admin/all', requireAdmin, async (req, res) => {
  try { res.json(await CaseStudy.find().sort({ createdAt: -1 })); }
  catch (error) { res.status(500).json({ error: error.message }); }
});
router.post('/', requireAdmin, async (req, res) => {
  try {
    const data = normalizeCaseStudy(req.body);
    const base = slugify(data.title, { lower: true, strict: true }) || 'case-study';
    let slug = base, count = 2;
    while (await CaseStudy.exists({ slug })) slug = `${base}-${count++}`;
    const entry = await CaseStudy.create({ ...data, slug });
    await logAudit(req.adminUsername, req.adminId, 'case-studies', 'create', entry._id, entry.title);
    res.status(201).json(entry);
  } catch (error) { res.status(400).json({ error: error.message }); }
});
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const entry = await CaseStudy.findByIdAndUpdate(req.params.id, { $set: normalizeCaseStudy(req.body) }, { new: true, runValidators: true });
    if (!entry) return res.status(404).json({ error: 'Case study not found' });
    await logAudit(req.adminUsername, req.adminId, 'case-studies', 'update', entry._id, entry.title);
    res.json(entry);
  } catch (error) { res.status(400).json({ error: error.message }); }
});
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const entry = await CaseStudy.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Case study not found' });
    await logAudit(req.adminUsername, req.adminId, 'case-studies', 'delete', entry._id, entry.title);
    res.json({ message: 'Deleted' });
  } catch (error) { res.status(400).json({ error: error.message }); }
});
module.exports = router;
