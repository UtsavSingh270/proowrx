const router = require('express').Router();
const PageSeo = require('../models/PageSeo');
const pages = require('../../data/pages.json');
const { requireAdmin } = require('../middleware/auth');
const { normalizeSeo } = require('../utils/seo');
const { logAudit } = require('../utils/auditLog');

router.use(requireAdmin);
router.get('/', async (req, res) => {
  try { res.json(await PageSeo.find()); }
  catch (error) { res.status(500).json({ error: error.message }); }
});
router.put('/', async (req, res) => {
  if (!req.admin.isSuperAdmin && req.adminPermissions !== 'view-write') return res.status(403).json({ error: 'Write access required' });
  try {
    const { path, seo } = req.body;
    if (!pages.some(page => page.path === path)) return res.status(400).json({ error: 'Unknown static page' });
    const entry = await PageSeo.findOneAndUpdate({ path }, { seo: normalizeSeo(seo) }, { new: true, upsert: true, runValidators: true });
    await logAudit(req.adminUsername, req.adminId, 'seo', 'update', entry._id, path, entry.seo);
    res.json(entry);
  } catch (error) { res.status(400).json({ error: error.message }); }
});
module.exports = router;
