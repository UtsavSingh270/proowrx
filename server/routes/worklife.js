const express = require('express');
const WorkLifeItem = require('../models/WorkLifeItem');
const { requireAdmin } = require('../middleware/auth');
const { logAudit } = require('../utils/auditLog');
const { deleteCloudinaryValue, deleteReplacedCloudinaryValue } = require('../utils/cloudinary');

const router = express.Router();

function normalizeAssetField(value) {
  if (value && typeof value === 'object' && typeof value.public_id === 'string' && typeof value.secure_url === 'string') {
    return value;
  }
  return String(value || '').trim();
}

function normalizeWorkLifeInput(body) {
  return {
    type:    body.type === 'video' ? 'video' : 'image',
    title:   String(body.title || '').trim(),
    caption: String(body.caption || '').trim(),
    url:     normalizeAssetField(body.url),
    posterUrl: normalizeAssetField(body.posterUrl),
    active:  body.active !== false,
    order:   Number(body.order) || 0,
  };
}

router.get('/', async (req, res) => {
  try {
    const items = await WorkLifeItem.find({ active: true })
      .sort({ order: 1, createdAt: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/admin/all', requireAdmin, async (req, res) => {
  try {
    const items = await WorkLifeItem.find()
      .sort({ order: 1, createdAt: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/admin/:id', requireAdmin, async (req, res) => {
  try {
    const item = await WorkLifeItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    const data = normalizeWorkLifeInput(req.body);
    const item = await WorkLifeItem.create(data);
    await logAudit(req.adminUsername, req.adminId, 'worklife', 'create', item._id, item.title, data);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const oldItem = await WorkLifeItem.findById(req.params.id).select('url posterUrl');
    if (!oldItem) return res.status(404).json({ error: 'Item not found' });
    const data = normalizeWorkLifeInput(req.body);
    const item = await WorkLifeItem.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });

    await deleteReplacedCloudinaryValue(oldItem.url, item.url, 'worklife media');
    await deleteReplacedCloudinaryValue(oldItem.posterUrl, item.posterUrl, 'worklife poster');

    await logAudit(req.adminUsername, req.adminId, 'worklife', 'update', item._id, item.title, { old: oldItem.toObject(), new: data });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const item = await WorkLifeItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    await WorkLifeItem.findByIdAndDelete(req.params.id);
    await deleteCloudinaryValue(item.url).catch(err => console.warn('Failed to delete worklife media', err.message));
    await deleteCloudinaryValue(item.posterUrl).catch(err => console.warn('Failed to delete worklife poster', err.message));
    await logAudit(req.adminUsername, req.adminId, 'worklife', 'delete', item._id, item.title, item.toObject());
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
