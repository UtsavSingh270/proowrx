const express  = require('express');
const mongoose = require('mongoose');
const slugify  = require('slugify');
const Post     = require('../models/Post');
const Like     = require('../models/Like');
const Author   = require('../models/Author');
const { requireAdmin } = require('../middleware/auth');
const { logAudit } = require('../utils/auditLog');

const router = express.Router();

function publicPostFilter() {
  return {
    $or: [
      { status: 'published' },
      { status: 'scheduled', scheduledAt: { $lte: new Date() } },
    ],
  };
}

function normalizePostInput(body) {
  const data = { ...body };
  if (!data.scheduledAt) data.scheduledAt = null;
  if (data.status === 'scheduled' && !data.scheduledAt) {
    throw new Error('Scheduled posts require a publish date and time.');
  }
  if (!data.authorId) data.authorId = null;
  return data;
}

// Generate a unique slug from a title, excluding a given post id (for updates)
async function generateUniqueSlug(title, excludeId) {
  const base = slugify(title, { lower: true, strict: true }) || 'post';
  let slug = base;
  let n = 2;
  while (await Post.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

// Find a post by slug first (public URLs), falling back to Mongo _id (legacy/shared links)
async function findPostByIdOrSlug(idOrSlug) {
  const bySlug = await Post.findOne({ slug: idOrSlug });
  if (bySlug) return bySlug;
  if (mongoose.Types.ObjectId.isValid(idOrSlug)) return Post.findById(idOrSlug);
  return null;
}

/* ── Public routes ──────────────────────────────────────────── */

// GET /api/posts  — published posts (newest first)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find(publicPostFilter())
      .sort({ scheduledAt: -1, createdAt: -1 })
      .select('-htmlContent');   // listing page doesn't need full content
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/posts/:id  — single post by slug or Mongo id (any status OK for preview, views++, likes count)
router.get('/:id', async (req, res) => {
  try {
    const post = await findPostByIdOrSlug(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.status !== 'published' && !(post.status === 'scheduled' && post.scheduledAt && post.scheduledAt <= new Date())) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Increment view count (one per session tracked by client — server just counts)
    const trackView = req.query.view === '1';
    if (trackView) {
      await Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } });
      post.views += 1;
    }

    // Attach liked status for this device
    const deviceId = req.headers['x-device-id'];
    let userLiked = false;
    if (deviceId) {
      const rec = await Like.findOne({ postId: post._id, deviceId });
      userLiked = !!rec;
    }

    res.json({ ...post.toObject(), userLiked });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/posts/:id/like  — toggle like (device-based), :id may be slug or Mongo id
router.post('/:id/like', async (req, res) => {
  try {
    const { deviceId } = req.body;
    if (!deviceId) return res.status(400).json({ error: 'deviceId required' });

    const post = await findPostByIdOrSlug(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const existing = await Like.findOne({ postId: post._id, deviceId });
    let liked;
    if (existing) {
      await Like.deleteOne({ _id: existing._id });
      await Post.findByIdAndUpdate(post._id, { $inc: { likes: -1 } });
      liked = false;
    } else {
      await Like.create({ postId: post._id, deviceId });
      await Post.findByIdAndUpdate(post._id, { $inc: { likes: 1 } });
      liked = true;
    }

    const updated = await Post.findById(post._id).select('likes');
    res.json({ liked, likes: updated.likes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Admin routes ───────────────────────────────────────────── */

// GET /api/posts/admin/authors
router.get('/admin/authors', requireAdmin, async (req, res) => {
  try {
    const authors = await Author.find().sort({ name: 1 });
    res.json(authors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/posts/admin/authors
router.post('/admin/authors', requireAdmin, async (req, res) => {
  try {
    const author = await Author.create(req.body);
    
    // Log the audit event
    await logAudit(
      req.adminUsername,
      req.adminId,
      'authors',
      'create',
      author._id,
      author.name,
      req.body
    );
    
    res.status(201).json(author);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/posts/admin/authors/:id
router.put('/admin/authors/:id', requireAdmin, async (req, res) => {
  try {
    const oldAuthor = await Author.findById(req.params.id);
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!author) return res.status(404).json({ error: 'Author not found' });
    
    // Log the audit event
    await logAudit(
      req.adminUsername,
      req.adminId,
      'authors',
      'update',
      author._id,
      author.name,
      { old: oldAuthor?.toObject(), new: req.body }
    );
    
    res.json(author);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/posts/admin/authors/:id
router.delete('/admin/authors/:id', requireAdmin, async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    await Author.findByIdAndDelete(req.params.id);
    
    // Log the audit event
    if (author) {
      await logAudit(
        req.adminUsername,
        req.adminId,
        'authors',
        'delete',
        req.params.id,
        author.name,
        author.toObject()
      );
    }
    
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/posts/admin/all  - all posts regardless of status
router.get('/admin/all', requireAdmin, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).select('-htmlContent');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/posts/admin/:id  — full post for editing
router.get('/admin/:id', requireAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/posts  — create new post
router.post('/', requireAdmin, async (req, res) => {
  try {
    const data = normalizePostInput(req.body);
    data.slug = await generateUniqueSlug(data.title);
    const post = new Post(data);
    await post.save();
    
    // Log the audit event
    await logAudit(
      req.adminUsername,
      req.adminId,
      'blogs',
      'create',
      post._id,
      post.title,
      data
    );
    
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/posts/:id  — update post (slug is immutable once set, so shared links keep working)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const data = normalizePostInput(req.body);
    const existing = await Post.findById(req.params.id).select('slug');
    if (!existing) return res.status(404).json({ error: 'Post not found' });
    if (!existing.slug) data.slug = await generateUniqueSlug(data.title, existing._id);
    else delete data.slug;

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    // Log the audit event
    await logAudit(
      req.adminUsername,
      req.adminId,
      'blogs',
      'update',
      post._id,
      post.title,
      { old: existing.toObject(), new: data }
    );
    
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/posts/:id/status  — change status only
router.patch('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const oldPost = await Post.findById(req.params.id);
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    // Log the audit event
    await logAudit(
      req.adminUsername,
      req.adminId,
      'blogs',
      'update',
      post._id,
      post.title,
      { statusChanged: { from: oldPost?.status, to: status } }
    );
    
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/posts/:id
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    await Post.findByIdAndDelete(req.params.id);
    await Like.deleteMany({ postId: req.params.id });
    
    // Log the audit event
    if (post) {
      await logAudit(
        req.adminUsername,
        req.adminId,
        'blogs',
        'delete',
        req.params.id,
        post.title,
        post.toObject()
      );
    }
    
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
