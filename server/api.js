const express     = require('express');
const helmet      = require('helmet');
const rateLimit   = require('express-rate-limit');
const connectDB   = require('./config/db');

const authRoutes    = require('./routes/auth');
const postRoutes    = require('./routes/posts');
const jobRoutes     = require('./routes/jobs');
const contactRoutes = require('./routes/contact');
const newsletterRoutes = require('./routes/newsletter');
const meetingRoutes = require('./routes/meetings');
const teamMemberRoutes = require('./routes/teamMembers');
const resourceRoutes = require('./routes/resources');
const worklifeRoutes = require('./routes/worklife');
const auditLogRoutes = require('./routes/auditLogs');
const uploadRoutes  = require('./routes/uploads');
const analyticsRoutes = require('./routes/analytics');

/* ── App ────────────────────────────────────── */
const app = express();
if (process.env.TRUST_PROXY === '1') app.set('trust proxy', 1);
else app.set('trust proxy', 'loopback');

/* ── Security / middleware ───────────────────── */
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginEmbedderPolicy: false,
}));



app.disable('x-powered-by');
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

/* ── Rate limiting ───────────────────────────── */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 min
  max: 200,
  message: { error: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts, please try again in 15 minutes.' },
});

app.use('/api', globalLimiter);
app.use('/api/auth/login', authLimiter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api', async (req, res, next) => {
  try { await connectDB(); next(); }
  catch (error) { console.error('Database unavailable:', error.message); res.status(503).json({ error: 'Database unavailable' }); }
});
app.use('/api/seo', require('./routes/seo'));
app.use('/api/case-studies', require('./routes/caseStudies'));

/* ── Routes ──────────────────────────────────── */
app.use('/api/auth',     authRoutes);
app.use('/api/posts',    postRoutes);
app.use('/api/jobs',     jobRoutes);
app.use('/api/contact',  contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/team-members', teamMemberRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/worklife', worklifeRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/upload',   uploadRoutes);
app.use('/api/analytics', analyticsRoutes);

/* ── 404 ──────────────────────────────────────── */
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

/* ── Error handler ───────────────────────────── */
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  const message = status >= 500 && process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : (err.message || 'Internal server error');
  res.status(status).json({ error: message });
});

module.exports = app;
