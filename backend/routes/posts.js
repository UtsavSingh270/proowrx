const express  = require('express');
const mongoose = require('mongoose');
const slugify  = require('slugify');
const Post     = require('../models/Post');
const Like     = require('../models/Like');
const BlogComment = require('../models/BlogComment');
const Author   = require('../models/Author');
const TeamMember = require('../models/TeamMember');
const { requireAdmin } = require('../middleware/auth');
const { logAudit } = require('../utils/auditLog');
const { isExcludedRequest } = require('../utils/excludedIps');

const router = express.Router();

function publicPostFilter() {
  return {
    $or: [
      { status: 'published' },
      { status: 'scheduled', scheduledAt: { $lte: new Date() } },
    ],
  };
}

async function normalizePostInput(body) {
  const data = { ...body };
  if (Array.isArray(data.faqs) && data.faqs.length > 5) {
    throw new Error('A blog post can contain a maximum of 5 FAQs.');
  }
  if (!data.scheduledAt) data.scheduledAt = null;
  if (data.status === 'scheduled' && !data.scheduledAt) {
    throw new Error('Scheduled posts require a publish date and time.');
  }
  if (!data.authorId) data.authorId = null;
  if (data.authorSource === 'team' && data.authorId) {
    const member = await TeamMember.findById(data.authorId);
    if (!member) throw new Error('Selected team member no longer exists.');
    data.author = member.name;
    data.authorProfile = {
      name: member.name,
      email: member.email || '',
      title: member.position || '',
      image: member.image || '',
      bio: member.summary || member.description || '',
    };
  }
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

// GET /api/posts/author/:authorId — public author profile with paginated posts
router.get('/author/:authorId', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.authorId)) {
      return res.status(404).json({ error: 'Author not found' });
    }

    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(12, Math.max(1, Number.parseInt(req.query.limit, 10) || 6));
    const skip = (page - 1) * limit;
    const authorId = new mongoose.Types.ObjectId(req.params.authorId);
    const filter = { ...publicPostFilter(), authorId };

    const [author, posts, total] = await Promise.all([
      TeamMember.findById(authorId),
      Post.find(filter)
        .sort({ scheduledAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-htmlContent'),
      Post.countDocuments(filter),
    ]);

    if (!author) return res.status(404).json({ error: 'Author not found' });

    res.json({
      author,
      posts,
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + posts.length < total,
      },
    });
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
    const excluded = await isExcludedRequest(req);
    const trackView = req.query.view === '1' && !excluded;
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

    res.json({ ...post.toObject(), userLiked, analyticsExcluded: excluded });
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

    if (await isExcludedRequest(req)) {
      const existing = await Like.findOne({ postId: post._id, deviceId });
      return res.json({ ignored: true, liked: !!existing, likes: post.likes });
    }

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

router.get('/:id/comments', async (req, res) => {
  try {
    const post = await findPostByIdOrSlug(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const comments = await BlogComment.find({ postId: post._id })
      .sort({ createdAt: -1 })
      .limit(100)
      .select('name comment createdAt');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/comments', async (req, res) => {
  try {
    const post = await findPostByIdOrSlug(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (await isExcludedRequest(req)) {
      return res.status(202).json({ ignored: true, message: 'Engagement from this IP address is excluded.' });
    }
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const comment = String(req.body.comment || '').trim();
    if (!name || !email || !comment) return res.status(400).json({ error: 'Name, email and comment are required.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Enter a valid email address.' });
    const created = await BlogComment.create({ postId: post._id, name, email, comment });
    res.status(201).json({ _id: created._id, name: created.name, comment: created.comment, createdAt: created.createdAt });
  } catch (err) {
    res.status(400).json({ error: err.message });
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
    const data = await normalizePostInput(req.body);
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
    const data = await normalizePostInput(req.body);
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

// PATCH /api/posts/:id/featured — toggle homepage/blog hero eligibility
router.patch('/:id/featured', requireAdmin, async (req, res) => {
  try {
    const featured = req.body.featured === true;
    const post = await Post.findByIdAndUpdate(req.params.id, { featured, updatedAt: new Date() }, { new: true });
    if (!post) return res.status(404).json({ error: 'Post not found' });

    await logAudit(req.adminUsername, req.adminId, 'blogs', 'update', post._id, post.title, { featured });
    return res.json(post);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// DELETE /api/posts/:id
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    await Post.findByIdAndDelete(req.params.id);
    await Like.deleteMany({ postId: req.params.id });
    await BlogComment.deleteMany({ postId: req.params.id });
    
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
