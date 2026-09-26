const express = require('express');
const TeamMember = require('../models/TeamMember');
const { requireAdmin } = require('../middleware/auth');
const { logAudit } = require('../utils/auditLog');
const Post = require('../models/Post');
const { deleteCloudinaryValue, deleteReplacedCloudinaryValue } = require('../utils/cloudinary');

const router = express.Router();

// GET /api/team-members - public featured members for the Our Team page
router.get('/', async (req, res) => {
  try {
    const members = await TeamMember.find({ category: 'featured' }).sort({ order: 1, createdAt: 1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/team-members/admin/all
router.get('/admin/all', requireAdmin, async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ category: -1, order: 1, createdAt: 1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    const member = await TeamMember.create(req.body);
    
    // Log the audit event
    await logAudit(
      req.adminUsername,
      req.adminId,
      'members',
      'create',
      member._id,
      member.name,
      req.body
    );
    
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const oldMember = await TeamMember.findById(req.params.id);
    const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    
    if (!member) return res.status(404).json({ error: 'Team member not found' });
    await Post.updateMany(
      { authorSource: 'team', authorId: member._id },
      { $set: {
        author: member.name,
        'authorProfile.name': member.name,
        'authorProfile.email': member.email || '',
        'authorProfile.title': member.position || '',
        'authorProfile.image': member.image || '',
        'authorProfile.bio': member.summary || member.fullSummary || member.description || '',
      } }
    );
    await deleteReplacedCloudinaryValue(oldMember?.image, member.image, 'team member image');
    
    // Log the audit event
    await logAudit(
      req.adminUsername,
      req.adminId,
      'members',
      'update',
      member._id,
      member.name,
      { old: oldMember?.toObject(), new: req.body }
    );
    
    res.json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    await TeamMember.findByIdAndDelete(req.params.id);
    if (member && !await Post.exists({ 'authorProfile.image': member.image })) {
      await deleteCloudinaryValue(member.image).catch(err => console.warn('Failed to delete team member image', err.message));
    }
    
    // Log the audit event
    if (member) {
      await logAudit(
        req.adminUsername,
        req.adminId,
        'members',
        'delete',
        req.params.id,
        member.name,
        member.toObject()
      );
    }
    
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
