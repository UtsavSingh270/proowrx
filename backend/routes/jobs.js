const express = require('express');
const Job     = require('../models/Job');
const { requireAdmin } = require('../middleware/auth');
const { logAudit } = require('../utils/auditLog');

const router = express.Router();

/* ── Public ─────────────────────────────────────────────────── */

// GET /api/jobs  — active jobs only
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'active' }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Admin ──────────────────────────────────────────────────── */

// GET /api/jobs/admin/all  — all jobs
router.get('/admin/all', requireAdmin, async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/jobs
router.post('/', requireAdmin, async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    
    // Log the audit event
    await logAudit(
      req.adminUsername,
      req.adminId,
      'jobs',
      'create',
      job._id,
      job.title,
      req.body
    );
    
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/jobs/:id
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const oldJob = await Job.findById(req.params.id);
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    
    // Log the audit event
    await logAudit(
      req.adminUsername,
      req.adminId,
      'jobs',
      'update',
      job._id,
      job.title,
      { old: oldJob?.toObject(), new: req.body }
    );
    
    res.json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/jobs/:id/status
router.patch('/:id/status', requireAdmin, async (req, res) => {
  try {
    const oldJob = await Job.findById(req.params.id);
    const job = await Job.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    
    // Log the audit event
    await logAudit(
      req.adminUsername,
      req.adminId,
      'jobs',
      'update',
      job._id,
      job.title,
      { statusChanged: { from: oldJob?.status, to: req.body.status } }
    );
    
    res.json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/jobs/:id
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    await Job.findByIdAndDelete(req.params.id);
    
    // Log the audit event
    if (job) {
      await logAudit(
        req.adminUsername,
        req.adminId,
        'jobs',
        'delete',
        req.params.id,
        job.title,
        job.toObject()
      );
    }
    
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
